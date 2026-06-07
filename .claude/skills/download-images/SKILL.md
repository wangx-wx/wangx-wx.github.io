---
name: download-images
description: |
  把外部目录里的 Markdown 文章导入到本博客(Astro/AstroPaper)，并把文章里的图片一并本地化——相对路径图片从源目录复制过来、远程 URL 图片下载下来，统一替换成博客的本地路径；源文章缺 frontmatter 时自动补占位，避免 Astro 构建报错。

  一定要在以下场景触发(即使用户没明说"用 skill")：
  - 用户给出一个外部 .md 的绝对路径，想把它"导入/搬到/更新进"博客
  - 用户说"把 xxx 文章收录进来""把这篇文章加到博客里"
  - 用户说"帮我把 xxx 文章的图片地址替换一下""下载/本地化 xxx 文章的图片""处理 xxx 文章的图片"
  - 用户提到文章图片是相对路径或外链，需要搬进博客统一管理

  关键词：导入文章、收录文章、文章搬运、更新到博客、图片本地化、相对路径图片、远程图片下载、URL替换、frontmatter 补全。
---

# 导入文章 + 图片本地化

## 这个 Skill 做什么

把一篇放在**其它目录**的 Markdown 文章收录进本博客，并把文章里引用的图片都搬到博客本地：

- **相对路径图片**(如 `![](1.png)`、`![](./assets/x.png)`、`![](../imgs/y.png)`)——相对源文章所在目录定位文件，**复制**进博客
- **远程图片**(如 `![](https://cdn.../a.png)`)——**下载**进博客
- 两类都落到 `public/images/posts/<随机hash>/`，文章里的引用统一替换成 `/images/posts/<hash>/文件名`
- 源文章**缺 frontmatter** 时自动补占位(Astro 要求 `title`/`pubDatetime`/`description`，否则构建报错)
- 文章写入 `src/data/blog/<slug>.md`，**源文件保留不动**

> ⚠️ 本博客是 **Astro(AstroPaper)，不是 Hugo**。文章放 `src/data/blog/`，图片放 `public/`(等价于旧 Hugo 的 `static/`)。别再往 `static/` 写，那目录 Astro 不读。

## 怎么用

需要两样东西：**源文章绝对路径** + **目标文件名 slug**(决定文章 URL，由用户指定)。

```bash
python .claude/skills/download-images/import_post.py <源文章绝对路径> <slug>
```

例：
```bash
python .claude/skills/download-images/import_post.py \
  /Users/wangx/workspace/aaa/github/blog-repository/2026-06/claude-code-settings/article.md \
  claude-code-settings
```

**拿不到 slug 时**：用户只给文章路径、没说文件名，就先问一句用什么 slug(英文短横线最利于 URL，例如 `claude-code-settings`)，再执行——不要自作主张定名。

## 执行后怎么报告

脚本会打印：每张图是复制还是下载、图片目录、文章落点、frontmatter 处理情况、各类计数。据此向用户说明，并**重点提醒这两件需要人工跟进的事**：

1. **若生成了占位 frontmatter**：`description` 和 `tags` 还是空的，需要补；`title` 取自正文首行标题、`pubDatetime` 是当天——让用户核对，尤其确认 `draft` 是否要设为 `true`。
2. **若有图片失败**(本地文件找不到、URL 下载失败)：如实说明是哪几张，这些引用**保留原样未替换**，需要用户检查源路径。

## 约定与边界(理解这些才能正确报告)

- **frontmatter**：源文章已带 `---` frontmatter 时**原样保留、绝不覆盖**；只有整篇缺失时才补占位。这是为了尊重用户已写好的元数据。
- **正文首行 H1 会被移除**：AstroPaper 的文章模板(`PostDetails.astro`)会把 frontmatter 的 `title` 渲染成页面大标题。所以补 frontmatter 时，脚本把正文第一行的 `# 标题` 提取为 title 并从正文删掉，否则页面会出现**两个标题**。(只认第一个非空行，避免误删代码块里的 `# 注释`。)
- **已是 `/images/...` 的引用**视为已本地化，跳过。
- **同一张图多次引用**只搬一次，复用同一个本地文件。
- **只搬指定的这篇 `.md` 和它引用的图**：源目录里的其它文件(草稿、脚本等)一律不动。
- **目标已存在同名文章**会被覆盖，脚本会在报告里标注，便于"更新文章"场景。

## 图片命名

`img_序号_hash8.扩展名`，例如 `img_01_5b086d21.png`。hash 由原始路径/URL 算出，保证唯一、可追溯。
