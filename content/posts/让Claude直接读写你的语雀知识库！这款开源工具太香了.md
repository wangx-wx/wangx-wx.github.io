+++
date = '2026-02-04T23:13:58+08:00'
draft = false
title = '让 Claude 直接读写你的语雀知识库！这款开源工具太香了'
author = 'wx'
tags = ['']
+++
# 🔥 让 Claude 直接读写你的语雀知识库！这款开源工具太香了

## AI时代的知识管理困境

你是否也曾遇到过这样的场景：

- 💻 写代码时，想查阅团队的技术文档，却要切出 IDE，打开浏览器，登录语雀，搜索关键词...
- 📝 让 AI 帮你整理文档，结果它完全不知道你知识库里有哪些内容
- 🔄 团队知识库沉淀了大量干货，却无法与 AI 工作流无缝集成

**如果 Claude 能直接访问你的语雀知识库，会是什么体验？**

今天给大家介绍一个开源项目 —— **yuque-mcp**，让你的 Claude Desktop 或 Claude Code CLI 与语雀知识库完美融合！

---

## 🎯 什么是 yuque-mcp？

**yuque-mcp** 是一个基于 **Model Context Protocol (MCP)** 标准开发的服务器，打通了 Claude Desktop 与语雀知识库之间的壁垒。

简单来说：**安装后，Claude 就能直接搜索、读取、创建、更新语雀文档了！**

---

## ✨ 核心功能一览

### 🔍 智能搜索 (search)
一句话找到你需要的文档：
> "帮我搜索关于 TypeScript 类型系统的语雀文档"

### 📁 目录浏览 (get_toc)
一键获取知识库完整结构：
> "查看我们团队知识库的目录结构"

### 📖 内容读取 (get_doc)
精准获取文档详细内容：
> "获取文档 123456 的完整内容"

### ✍️ 文档创建 (create_doc)
AI 直接帮你写文档并发布到语雀：
> "创建一篇部署指南，内容包括环境准备和部署步骤"

### 📝 文档更新 (update_doc)
直接修改已有文档，无需手动打开编辑器：
> "更新文档 123456，在末尾添加今天的工作总结"

---

## 💡 真实使用场景

### 场景一：代码开发时查阅文档
```
你：我想用 React 实现一个表单验证，但不确定团队的最佳实践

Claude：让我先搜索一下你们语雀知识库中的相关文档...

[已搜索到 3 篇相关文档]
根据你们团队的《React 表单开发规范》，推荐使用 react-hook-form...

你：太方便了！不用切出去查文档了！
```

### 场景二：AI 辅助文档编写
```
你：帮我把今天的会议记录整理成文档，发到语雀"项目纪要"分类下

Claude：好的，我先查看目录结构找到对应分类...

[已获取目录结构]
正在创建文档《2024-01-28 产品需求评审会》...

文档已创建完成！访问链接：https://www.yuque.com/...
```

### 场景三：迭代更新文档
```
你：把刚才讨论的方案更新到《技术方案文档》里

Claude：好的，我先获取文档当前内容...

[已获取文档内容]
正在更新文档，在"方案对比"章节添加新内容...

文档已更新完成！查看链接：https://www.yuque.com/...
```

### 场景四：知识库智能问答
```
你：我们之前是怎么解决跨域问题的？

Claude：让我搜索一下...

[找到文档《前端跨域问题解决方案》]
根据你们的技术文档，团队采用的是 Nginx 反向代理方案...
```

---

## 🛠️ 技术亮点

- **标准化协议**：基于 MCP 标准，与 Claude Desktop 原生集成
- **双模式支持**：同时支持 Claude Desktop 和 Claude Code CLI
- **TypeScript 打造**：类型安全，代码优雅
- **零依赖负担**：核心依赖仅 @modelcontextprotocol/sdk 和 zod
- **开箱即用**：简单配置即可使用

---

## 🚀 3分钟快速上手

### 1️⃣ 安装项目
```bash
git clone https://github.com/wangx-wx/yuque-mcp.git
cd yuque-mcp
npm install
npm run build
```

### 2️⃣ 获取语雀 Token

访问 [语雀 Token 管理页面](https://www.yuque.com/settings/tokens) 创建个人 Token，需要勾选 `read` 和 `write` 权限。

### 3️⃣ 配置方式（二选一）

#### 方式A：Claude Desktop 配置文件

编辑配置文件（Windows 为 `%APPDATA%\Claude\claude_desktop_config.json`，macOS 为 `~/Library/Application Support/Claude/claude_desktop_config.json`）：

```json
{
  "mcpServers": {
    "yuque": {
      "command": "node",
      "args": ["E:\\node\\yuque-mcp\\dist\\index.js"],
      "env": {
        "YUQUE_AUTH_TOKEN": "你的语雀Token",
        "YUQUE_BASE_URL": "https://www.yuque.com",
        "YUQUE_GROUP_LOGIN": "团队路径名（如 leyaoyao）",
        "YUQUE_BOOK_SLUG": "知识库路径（如 fe-docs）"
      }
    }
  }
}
```

> 💡 **如何获取参数？** 打开你的语雀知识库，URL 格式为 `https://www.yuque.com/{group_login}/{book_slug}`，从中提取即可。

#### 方式B：Claude Code CLI 配置（推荐）

如果你使用 **Claude Code** 命令行工具，可以通过 CLI 快速添加：

**macOS / Linux：**
```bash
claude mcp add yuque-mcp \
    --scope project \
    --transport stdio \
    -- node "/path/to/yuque-mcp/dist/index.js" \
    --env YUQUE_AUTH_TOKEN=your-auth-token-here \
    --env YUQUE_BASE_URL=https://www.yuque.com \
    --env YUQUE_GROUP_LOGIN=your-group-login \
    --env YUQUE_BOOK_SLUG=your-book-slug
```

**Windows (PowerShell)：**
```powershell
claude mcp add yuque-mcp `
    --scope project `
    --transport stdio `
    -- node "D:/yuque-mcp/dist/index.js" `
    --env YUQUE_AUTH_TOKEN=your-auth-token-here `
    --env YUQUE_BASE_URL=https://www.yuque.com `
    --env YUQUE_GROUP_LOGIN=your-group-login `
    --env YUQUE_BOOK_SLUG=your-book-slug
```

**CLI 配置优势：**
- 无需手动编辑 JSON 文件
- 支持项目级配置（`--scope project`），每个项目可独立配置
- 快速切换不同知识库环境

### 4️⃣ 重启并验证

- **Claude Desktop**：重启应用后即可使用
- **Claude Code**：直接输入 `claude` 进入对话，工具会自动加载

大功告成！现在就可以在对话中让 Claude 访问你的语雀知识库了！

---

## 🎁 项目地址

**GitHub：https://github.com/wangx-wx/yuque-mcp**

⭐ **如果这个项目对你有帮助，欢迎给个 Star！**

---

## 📌 写在最后

AI 的未来不是取代人类，而是成为我们最得力的助手。

当 Claude 能够直接访问你的团队知识库，它就不再是一个通用的 AI 助手，而是一个真正懂你、懂你业务的 **AI 团队伙伴**。

**yuque-mcp** 只是开始，期待 MCP 生态带来更多可能性！

---

> 💬 **你有什么期待的场景或想法？欢迎在评论区留言！**
