#!/usr/bin/env python3
"""
导入外部 Markdown 文章到 Astro 博客（AstroPaper），并把文章里的图片一并本地化。

用法:
    python import_post.py <源文章绝对路径> <目标slug>

示例:
    python import_post.py /Users/me/notes/article.md claude-code-settings

做的事:
    1. 把源文章复制到 src/data/blog/<slug>.md（源文件保留不动）
    2. 处理文章里的图片:
        - 相对路径(相对源文章所在目录) -> 复制本地图片文件
        - 远程 URL(http/https)        -> 下载
       两类都落到 public/images/posts/<随机hash>/，引用统一替换为 /images/posts/<hash>/文件名
    3. 源文章缺 frontmatter 时生成占位:title 取正文首行 # 标题(并从正文移除),
       pubDatetime 取当天, description/tags 留空待填; 已有 frontmatter 则原样保留

本博客是 Astro 不是 Hugo:图片放 public/(等价旧 Hugo 的 static/)，文章放 src/data/blog/。
"""

import os
import re
import sys
import shutil
import hashlib
import urllib.request
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".ico"}

# Markdown 图片语法: ![alt](url)。url 不含右括号即可（带 "title" 的情况后面会清洗）。
IMG_PATTERN = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")

# 博客时区 Asia/Shanghai (+08:00)
CST = timezone(timedelta(hours=8))

CONTENT_TYPE_EXT = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    "image/bmp": ".bmp",
    "image/x-icon": ".ico",
}


def find_project_root() -> Path:
    """从脚本位置或当前目录向上找 Astro 项目根（含 astro.config.* 或 src/data/blog）。"""
    for start in (Path(__file__).resolve().parent, Path.cwd()):
        for p in (start, *start.parents):
            if (
                (p / "astro.config.ts").exists()
                or (p / "astro.config.mjs").exists()
                or (p / "astro.config.js").exists()
                or (p / "src" / "data" / "blog").is_dir()
            ):
                return p
    return Path.cwd()


def ext_from(url: str, content_type: str = "") -> str:
    """优先从 URL/路径后缀取扩展名，否则从 Content-Type 推断，兜底 .png。"""
    ext = os.path.splitext(url.split("?")[0])[1].lower()
    if ext in IMAGE_EXTS:
        return ext
    ct = (content_type or "").lower()
    for mime, e in CONTENT_TYPE_EXT.items():
        if mime in ct:
            return e
    return ".png"


def download(url: str, dest_no_ext: Path) -> Path:
    """下载远程图片，返回最终保存路径（扩展名据 URL/Content-Type 决定）。"""
    headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/537.36"}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        content_type = resp.headers.get("Content-Type", "")
        data = resp.read()
    final = dest_no_ext.with_suffix(ext_from(url, content_type))
    final.parent.mkdir(parents=True, exist_ok=True)
    final.write_bytes(data)
    return final


def copy_local(src: Path, dest_no_ext: Path) -> Path:
    """复制本地图片，保留原扩展名。"""
    ext = src.suffix.lower() if src.suffix.lower() in IMAGE_EXTS else (src.suffix.lower() or ".png")
    final = dest_no_ext.with_suffix(ext)
    final.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, final)
    return final


def clean_url(raw: str) -> str:
    """从 ![](...) 捕获里清洗出纯 URL/路径:去尖括号、去可能的 "title"。"""
    raw = raw.strip().strip("<>").strip()
    # 形如 `1.png "标题"` —— 取空白前的第一段
    if " " in raw and ('"' in raw or "'" in raw):
        raw = raw.split()[0]
    return raw


def build_frontmatter(title: str) -> str:
    """生成占位 frontmatter:title 已知，日期取当天，其余留空待填。"""
    now = datetime.now(CST).strftime("%Y-%m-%dT%H:%M:%S+08:00")
    title_esc = title.replace('"', '\\"')
    return (
        "---\n"
        f'title: "{title_esc}"\n'
        f"pubDatetime: {now}\n"
        'author: "wx"\n'
        'description: ""\n'
        "draft: false\n"
        "tags:\n"
        "  - others\n"
        "---\n\n"
    )


def extract_title_and_body(text: str, fallback: str) -> tuple[str, str]:
    """
    取正文首个 H1 作 title 并从正文移除，避免与 AstroPaper 渲染的标题重复。
    只认第一个“非空行”是否为 H1，从而避开代码块里的 `# 注释`。
    """
    lines = text.split("\n")
    first = next((i for i, ln in enumerate(lines) if ln.strip()), None)
    if first is not None:
        m = re.match(r"^[ \t]*#[ \t]+(.+?)[ \t]*$", lines[first])
        if m:
            title = m.group(1).strip()
            del lines[first]
            return title, "\n".join(lines).lstrip("\n")
    return fallback, text.lstrip("\n")


def main() -> None:
    if len(sys.argv) < 3:
        print("用法: python import_post.py <源文章绝对路径> <目标slug>")
        print("示例: python import_post.py /Users/me/notes/article.md claude-code-settings")
        sys.exit(1)

    src_md = Path(sys.argv[1]).expanduser().resolve()
    slug = sys.argv[2].strip()
    if slug.endswith(".md"):
        slug = slug[:-3]

    if not src_md.exists():
        print(f"错误: 源文章不存在 - {src_md}")
        sys.exit(1)
    if src_md.suffix.lower() != ".md":
        print(f"错误: 不是 Markdown 文件 - {src_md}")
        sys.exit(1)
    if not slug:
        print("错误: 需要提供目标 slug（决定文章 URL 与文件名）")
        sys.exit(1)

    root = find_project_root()
    blog_dir = root / "src" / "data" / "blog"
    if not blog_dir.is_dir():
        print(f"错误: 未找到 Astro 博客目录 {blog_dir}")
        sys.exit(1)

    article_dir = src_md.parent
    content = src_md.read_text(encoding="utf-8")

    folder = uuid.uuid4().hex[:12]
    img_dir = root / "public" / "images" / "posts" / folder

    matches = list(IMG_PATTERN.finditer(content))
    print(f"扫描到 {len(matches)} 处图片引用")

    cache: dict[str, str] = {}  # 源(url/路径) -> 替换后的站内路径，用于同图去重
    replacements: list[tuple[str, str]] = []
    stats = {"copied": 0, "downloaded": 0, "skipped": 0, "failed": 0}
    idx = 0

    for m in matches:
        alt = m.group(1)
        url = clean_url(m.group(2))
        original = m.group(0)

        # 跳过:data URI、已经本地化的站内路径
        if url.startswith("data:") or url.startswith("/images/"):
            stats["skipped"] += 1
            continue

        # 同一张图复用，不重复搬运
        if url in cache:
            replacements.append((original, f"![{alt}]({cache[url]})"))
            continue

        idx += 1
        h8 = hashlib.md5(url.encode("utf-8")).hexdigest()[:8]
        dest_no_ext = img_dir / f"img_{idx:02d}_{h8}"

        try:
            if url.startswith("http://") or url.startswith("https://"):
                final = download(url, dest_no_ext)
                stats["downloaded"] += 1
                print(f"  [{idx:02d}] 下载 {url[:60]} -> {final.name}")
            else:
                src_img = Path(url) if os.path.isabs(url) else (article_dir / url)
                src_img = src_img.resolve()
                if not src_img.is_file():
                    print(f"  [跳过] 本地图片找不到: {url}  (查找路径 {src_img})")
                    stats["failed"] += 1
                    idx -= 1
                    continue
                final = copy_local(src_img, dest_no_ext)
                stats["copied"] += 1
                print(f"  [{idx:02d}] 复制 {url} -> {final.name}")
        except Exception as e:  # noqa: BLE001 - 单张失败不应中断整篇导入
            print(f"  [失败] {url[:60]} ({e})")
            stats["failed"] += 1
            idx -= 1
            continue

        new_url = f"/images/posts/{folder}/{final.name}"
        cache[url] = new_url
        replacements.append((original, f"![{alt}]({new_url})"))

    # 应用图片路径替换
    new_content = content
    for old, new in replacements:
        new_content = new_content.replace(old, new)

    # 处理 frontmatter
    if new_content.lstrip().startswith("---"):
        final_text = new_content
        fm_note = "源文章已有 frontmatter，原样保留"
    else:
        title, body = extract_title_and_body(new_content, slug)
        final_text = build_frontmatter(title) + body
        fm_note = f'已生成占位 frontmatter (title="{title}")，description / tags 待填'

    dest_md = blog_dir / f"{slug}.md"
    existed = dest_md.exists()
    dest_md.write_text(final_text, encoding="utf-8")

    print("\n=== 导入完成 ===")
    print(f"文章: {src_md}")
    print(f"  -> {dest_md}" + ("  ⚠ 覆盖了已存在的同名文章" if existed else ""))
    if stats["copied"] + stats["downloaded"] > 0:
        print(f"图片目录: {img_dir}")
    print(
        f"图片: 复制 {stats['copied']} / 下载 {stats['downloaded']} / "
        f"跳过 {stats['skipped']} / 失败 {stats['failed']}"
    )
    print(f"Frontmatter: {fm_note}")
    print(f"源文件已保留: {src_md}")
    if stats["failed"] > 0:
        print("⚠ 有图片未能处理，相关引用保留原样，请检查上面日志")


if __name__ == "__main__":
    main()
