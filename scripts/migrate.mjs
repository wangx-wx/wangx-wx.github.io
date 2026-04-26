// 一次性迁移脚本:Hugo TOML front matter → AstroPaper YAML front matter
// 用法: node scripts/migrate.mjs
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR =
  "/Users/wangx/workspace/aaa/blog/wangx-wx.github.io/content/posts";
const OUT_DIR = join(__dirname, "..", "src", "data", "blog");

function parseToml(src) {
  const out = {};
  for (const raw of src.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/.exec(line);
    if (!m) continue;
    const key = m[1];
    const val = m[2].trim();
    if (
      (val.startsWith("'") && val.endsWith("'")) ||
      (val.startsWith('"') && val.endsWith('"'))
    ) {
      out[key] = val.slice(1, -1);
    } else if (val === "true" || val === "false") {
      out[key] = val === "true";
    } else if (val.startsWith("[") && val.endsWith("]")) {
      const inner = val.slice(1, -1).trim();
      out[key] = !inner
        ? []
        : inner.split(",").map(s => {
            const t = s.trim();
            if (
              (t.startsWith("'") && t.endsWith("'")) ||
              (t.startsWith('"') && t.endsWith('"'))
            )
              return t.slice(1, -1);
            return t;
          });
    } else {
      out[key] = val;
    }
  }
  return out;
}

function kebab(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanTags(tags) {
  if (!Array.isArray(tags)) return ["others"];
  const seen = new Set();
  const out = [];
  for (const t of tags) {
    const s = String(t).trim();
    if (!s) continue;
    const k = kebab(s);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(k);
  }
  return out.length ? out : ["others"];
}

function extractDescription(body, title) {
  const lines = body.split("\n");
  let paragraph = "";
  for (const line of lines) {
    const l = line.trim();
    if (!l) continue;
    if (
      l.startsWith("#") ||
      l.startsWith("!") ||
      l.startsWith("```") ||
      l.startsWith("<!--") ||
      l.startsWith("<")
    )
      continue;
    const cleaned = l
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/^[>\-*]\s*/, "")
      .trim();
    if (cleaned) {
      paragraph = cleaned;
      break;
    }
  }
  const desc = paragraph.slice(0, 80).trim();
  return desc || title;
}

function q(s) {
  return `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ")}"`;
}

function toYaml(data) {
  const tagLines = data.tags.map(t => `  - ${q(t)}`).join("\n");
  return `---
title: ${q(data.title)}
pubDatetime: ${data.pubDatetime}
author: ${q(data.author)}
description: ${q(data.description)}
draft: ${data.draft}
tags:
${tagLines}
---`;
}

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(SRC_DIR).filter(f => f.endsWith(".md"));
let ok = 0;
for (const file of files) {
  const raw = readFileSync(join(SRC_DIR, file), "utf8");
  const match = /^\+\+\+\s*\n([\s\S]*?)\n\+\+\+\s*\n?([\s\S]*)$/.exec(raw);
  if (!match) {
    process.stderr.write(`[skip] ${file}: no TOML front matter\n`);
    continue;
  }
  const fm = parseToml(match[1]);
  const body = match[2].replace(/^\n+/, "");
  const title = fm.title || file.replace(/\.md$/, "");
  const description = fm.description || extractDescription(body, title);
  const tags = cleanTags(fm.tags);
  const fmOut = {
    title,
    pubDatetime: fm.date,
    author: fm.author || "wx",
    description,
    draft: !!fm.draft,
    tags,
  };
  // 仅在正文含真二级标题时插入 TOC 触发行, 否则 remark-collapse 会把整篇折叠
  const hasH2 = /(^|\n)## [^T\n]/.test(body);
  const withToc = hasH2 ? `## Table of contents\n\n${body}` : body;
  writeFileSync(
    join(OUT_DIR, file),
    `${toYaml(fmOut)}\n\n${withToc}`,
    "utf8"
  );
  process.stdout.write(
    `[ok] ${file} | tags: [${tags.join(", ")}] | toc: ${hasH2 ? "yes" : "no"} | desc: "${description.slice(0, 40)}..."\n`
  );
  ok++;
}
process.stdout.write(`\nmigrated ${ok}/${files.length} files\n`);
