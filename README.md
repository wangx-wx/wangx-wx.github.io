# AstroPaper 📄

![AstroPaper](public/astropaper-og.jpg)
[![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/community/file/1356898632249991861)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub](https://img.shields.io/github/license/satnaing/astro-paper?color=%232F3741&style=for-the-badge)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white&style=for-the-badge)](https://conventionalcommits.org)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge)](http://commitizen.github.io/cz-cli/)

AstroPaper 是一个极简、响应式、无障碍且对 SEO 友好的 Astro 博客主题。该主题基于 [我的个人博客](https://satnaing.dev/blog) 设计与开发。

可以先阅读 [示例博客文章](https://astro-paper.pages.dev/posts/) ，或直接查看 [README 文档章节](#-文档) 了解更多。

## 🔥 特性

- [x] 类型安全的 Markdown 内容
- [x] 极快的性能
- [x] 无障碍支持（键盘/VoiceOver）
- [x] 响应式布局（移动端到桌面端）
- [x] SEO 友好
- [x] 明暗主题切换
- [x] 模糊搜索
- [x] 草稿文章与分页
- [x] 网站地图与 RSS
- [x] 遵循最佳实践
- [x] 高可定制性
- [x] 为博客文章动态生成 OG 图片 [#15](https://github.com/satnaing/astro-paper/pull/15)（[博客说明](https://astro-paper.pages.dev/posts/dynamic-og-image-generation-in-astropaper-blog-posts/)）

_说明：作者已在 Mac 上使用 **VoiceOver**、在 Android 上使用 **TalkBack** 对 AstroPaper 的可访问性进行测试。虽然无法覆盖所有读屏器，但相关无障碍增强在其他读屏器中通常也能正常工作。_

## ✅ Lighthouse 评分

<p align="center">
  <a href="https://pagespeed.web.dev/report?url=https%3A%2F%2Fastro-paper.pages.dev%2F&form_factor=desktop">
    <img width="710" alt="AstroPaper Lighthouse Score" src="AstroPaper-lighthouse-score.svg">
  </a>
</p>

## 🚀 项目结构

在 AstroPaper 中，主要目录结构如下：

```bash
/
├── public/
│   ├── pagefind/ # build 时自动生成
│   ├── favicon.svg
│   └── astropaper-og.jpg
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   ├── data/
│   │   └── blog/
│   │       └── some-blog-posts.md
│   ├── layouts/
│   ├── pages/
│   ├── scripts/
│   ├── styles/
│   ├── utils/
│   ├── config.ts
│   ├── constants.ts
│   ├── content.config.ts
│   ├── env.d.ts
│   └── remark-collapse.d.ts
└── astro.config.ts
```

Astro 会在 `src/pages/` 目录中查找 `.astro` 或 `.md` 文件，并按文件名自动映射路由。

静态资源（例如图片）可放在 `public/` 目录。

所有博客文章都存放在 `src/data/blog/` 目录。

## 📖 文档

文档提供两种形式：_markdown_ 与 _博客文章_。

- Configuration - [markdown](src/data/blog/how-to-configure-astropaper-theme.md) | [blog post](https://astro-paper.pages.dev/posts/how-to-configure-astropaper-theme/)
- Add Posts - [markdown](src/data/blog/adding-new-post.md) | [blog post](https://astro-paper.pages.dev/posts/adding-new-posts-in-astropaper-theme/)
- Customize Color Schemes - [markdown](src/data/blog/customizing-astropaper-theme-color-schemes.md) | [blog post](https://astro-paper.pages.dev/posts/customizing-astropaper-theme-color-schemes/)
- Predefined Color Schemes - [markdown](src/data/blog/predefined-color-schemes.md) | [blog post](https://astro-paper.pages.dev/posts/predefined-color-schemes/)

## 💻 技术栈

**主框架** - [Astro](https://astro.build/)  
**类型检查** - [TypeScript](https://www.typescriptlang.org/)  
**样式** - [TailwindCSS](https://tailwindcss.com/)  
**UI/UX** - [Figma 设计文件](https://www.figma.com/community/file/1356898632249991861)  
**静态搜索** - [FuseJS](https://pagefind.app/)  
**图标** - [Tablers](https://tabler-icons.io/)  
**代码格式化** - [Prettier](https://prettier.io/)  
**部署** - [Cloudflare Pages](https://pages.cloudflare.com/)  
**关于页插图** - [https://freesvgillustration.com](https://freesvgillustration.com/)  
**代码检查** - [ESLint](https://eslint.org)

## 👨🏻‍💻 本地运行

你可以在目标目录通过以下命令创建此项目：

```bash
# pnpm
pnpm create astro@latest --template satnaing/astro-paper

# npm
npm create astro@latest -- --template satnaing/astro-paper

# yarn
yarn create astro --template satnaing/astro-paper

# bun
bun create astro@latest -- --template satnaing/astro-paper
```

然后执行以下命令启动项目：

```bash
# 若上一步未安装依赖，请先安装
pnpm install

# 启动开发服务器
pnpm run dev
```

快速新建文章（Hugo 风格）：

```bash
pnpm new:post "Your Post Title"
```

如果你已安装 Docker，也可以用 Docker 在本地运行：

```bash
# 构建 Docker 镜像
docker build -t astropaper .

# 运行 Docker 容器
docker run -p 4321:80 astropaper
```

## Google Site Verification（可选）

你可以通过环境变量为 AstroPaper 添加 [Google Site Verification HTML 标签](https://support.google.com/webmasters/answer/9008080#meta_tag_verification&zippy=%2Chtml-tag)。这是可选步骤；若不配置下列环境变量，`<head>` 中不会输出 `google-site-verification` 标签。

```bash
# 在环境变量文件中（.env）
PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-site-verification-value
```

> 可参考 [这个讨论](https://github.com/satnaing/astro-paper/discussions/334#discussioncomment-10139247) 将 AstroPaper 添加到 Google Search Console。

## 🧞 命令

所有命令都在项目根目录执行。

> **说明：** 使用 `Docker` 相关命令前，请确保本机已安装 [Docker](https://docs.docker.com/engine/install/)。

| Command                              | Action                                                          |
| :----------------------------------- | :-------------------------------------------------------------- |
| `pnpm install`                       | 安装依赖                                                        |
| `pnpm run dev`                       | 启动本地开发服务（`localhost:4321`）                            |
| `pnpm run build`                     | 构建生产产物到 `./dist/`                                        |
| `pnpm run preview`                   | 本地预览构建结果                                                |
| `pnpm new:post "Your Post Title"`    | 在 `src/data/blog/` 中创建带 frontmatter 和章节骨架的新文章     |
| `pnpm run format:check`              | 使用 Prettier 检查格式                                          |
| `pnpm run format`                    | 使用 Prettier 自动格式化                                        |
| `pnpm run sync`                      | 生成 Astro 模块 TypeScript 类型定义                             |
| `pnpm run lint`                      | 使用 ESLint 做代码检查                                          |
| `docker compose up -d`               | 在 Docker 中运行 AstroPaper                                     |
| `docker compose run app npm install` | 在 Docker 容器中执行任意命令                                    |
| `docker build -t astropaper .`       | 构建 AstroPaper Docker 镜像                                     |
| `docker run -p 4321:80 astropaper`   | 运行 AstroPaper Docker 容器（访问地址 `http://localhost:4321`） |

> **注意：** Windows PowerShell 用户如果想在开发中运行诊断（`astro check --watch & astro dev`），可能需要安装 [concurrently](https://www.npmjs.com/package/concurrently)。详见 [issue](https://github.com/satnaing/astro-paper/issues/113)。

## ✨ 反馈与建议

如果你有建议或反馈，可以通过 [邮箱](mailto:contact@satnaing.dev) 联系作者。也欢迎直接提 issue 报告 bug 或提出新功能请求。

## 📜 许可证

基于 MIT License，Copyright © 2025

---

Made with 🤍 by [Sat Naing](https://satnaing.dev) 👨🏻‍💻 and [contributors](https://github.com/satnaing/astro-paper/graphs/contributors).
