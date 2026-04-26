import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BLOG_DIR = "src/data/blog";

function pad2(value) {
  return String(value).padStart(2, "0");
}

function escapeDoubleQuotes(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function formatDateWithOffset(date) {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  const seconds = pad2(date.getSeconds());

  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const offsetHours = pad2(Math.floor(Math.abs(offsetMinutes) / 60));
  const offsetMins = pad2(Math.abs(offsetMinutes) % 60);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMins}`;
}

function toSlug(title) {
  return title
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  process.stderr.write('Usage: pnpm new:post "文章标题"\n');
  process.exit(1);
}

const slug = toSlug(title);
if (!slug) {
  process.stderr.write("Error: 标题无效，无法生成文件名。\n");
  process.exit(1);
}

const filePath = resolve(BLOG_DIR, `${slug}.md`);
if (existsSync(filePath)) {
  process.stderr.write(`Error: 文件已存在 -> ${filePath}\n`);
  process.exit(1);
}

const now = formatDateWithOffset(new Date());
const safeTitle = escapeDoubleQuotes(title);
const template = `---
title: "${safeTitle}"
pubDatetime: ${now}
author: "wx"
description: "一句话摘要"
draft: false
tags:
  - others
---

## 背景

## 正文

## 总结
`;

writeFileSync(filePath, template, "utf8");
process.stdout.write(`Created: ${filePath}\n`);
