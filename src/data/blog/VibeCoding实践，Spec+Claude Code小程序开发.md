---
title: "VibeCoding实践，Spec+Claude Code小程序开发"
pubDatetime: 2025-12-07T00:02:09+08:00
author: "wx"
description: "curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo bash -"
draft: false
tags:
  - "claude-code"
  - "vibe-coding"
---

## Table of contents

## 快速开始（安装Claude Code）

### <font style="color:rgb(28, 31, 35);">安装 Node.js（已安装可跳过）</font>

```bash
# Ubuntu / Debian 用户
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo bash -
sudo apt-get install -y nodejs
node --version

# macOS 用户
sudo xcode-select --install
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node
node --version
```

### 安装claude-code

[https://github.com/anthropics/claude-code](https://github.com/anthropics/claude-code)

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

### 推荐镜像站

在Vibe Coding时比较头疼的是模型，工具是有差距，模型的也是有差距的。使用国外的模型购买比较昂贵。这里推荐`AnyRouter`这个镜像站，可以免费使用Claude的模型，每日签到还送余额。使用下面的邀请码注册还能获得50$体验金。本人已经使用了半年之久了，偶尔会出现中断的情形，但是它是免费的。

[https://anyrouter.top/register?aff=vNlI](https://anyrouter.top/register?aff=vNlI)

![](/images/posts/8ce78e3e44bd/img_01_d3b8b05f.png)

## 规约编程

### 定义

<font style="color:rgb(59, 59, 59);">规约编程顾名思义以规范文档驱动的编程（Specification Driven Development, 简称 SDD ），一种以规范为核心的编程方法，旨在通过明确的需求和规则定义，提升软件开发的效率、质量和协作性。  
</font><font style="color:rgb(59, 59, 59);">在传统开发中，Spec 是"指导性文件"——写完就束之高阁，真正的工作还是靠人工编码，人工评审进行驱动优化。  
</font><font style="color:rgb(59, 59, 59);">但在 AI 编程时代，Spec 不仅仅是指导，而是变成了“可执行的源代码”，即直接让 AI 根据 Spec 生成完整的代码实现。</font>

<font style="color:rgb(59, 59, 59);">简单来说：在开始编码之前，先定义清晰的规范（Specification），将业务需求、接口定义、数据模型、业务规则等以结构化、可执行的方式编写，让文档即代码，代码即文档。</font>

### Spec-Kit

Spec-Kit这个开源项目是真的厉害，它设计了自闭环工作流：确保AI输出的一致性和结构化

[https://github.com/github/spec-kit](https://github.com/github/spec-kit)

项目介绍

```plain
spec-kit/
├─ src/                                   # 核心源代码目录
│  └─ specify_cli/
│     └─ __init__.py                      # Specify CLI 主要实现
│                                         # CLI 工具的完整实现，包含所有命令和 AI 代理集成
│
├─ templates/                             # 模板系统 – SDD 工作流的核心
│  ├─ commands/                           # AI 代理命令模板
│  │  ├─ specify.md                       # 定制创建命令 – 将路径语法转换为结构化规范
│  │  ├─ plan.md                          # 规划计划命令 – 从规范生成成本/实现计划
│  │  ├─ tasks.md                         # 任务分解命令 – 将计划分解为可执行任务
│  │  ├─ implement.md                     # 实现执行命令 – 执行任务到输出物
│  │  ├─ constitution.md                  # 项目原则命令 – 建立项目治理原则
│  │  ├─ clarify.md                       # 澄清命令 – 结构化问题解决和规范性增强
│  │  ├─ analyze.md                       # 分析命令 – 跨工作一致性和覆盖率分析
│  │  └─ checklist.md                     # 检查清单命令 – 生成质量检查清单
│  │
│  ├─ spec-template.md                    # 功能规范模板 – 定义用户故事和功能需求结构
│  ├─ plan-template.md                    # 实现计划模板 – 技术架构和实现细节结构
│  ├─ tasks-template.md                   # 任务模板 – 可执行任务列表结构
│  ├─ checklist-template.md               # 检查清单模板 – 质量验证清单结构
│  ├─ agent-file-template.md              # 代理文件模板 – AI 代理配置文件结构
│  └─ vscode-settings.json                # VS Code 设置模板 – 开发环境配置
│
├─ scripts/                               # 自动化脚本系统
│  ├─ bash/                               # POSIX Shell 脚本
│  │  ├─ common.sh                        # 公共函数库 – 包库路径、分支管理、功能目录查找
│  │  ├─ create-new-feature.sh            # 功能创建脚本 – 自动分支创建和目录结构设置
│  │  ├─ setup-plan.sh                    # 计划设置脚本 – 实现计划初始化
│  │  ├─ update-agent-context.sh          # 代理上下文更新 – 同步项目信息到 AI 代理
│  │  └─ check-prerequisites.sh           # 先决条件检查 – 验证工具和环境
│  │
│  └─ powershell/                         # PowerShell 脚本 (Windows 支持)
│     ├─ common.ps1                       # PowerShell 公共函数库
│     ├─ create-new-feature.ps1           # PowerShell 功能创建脚本
│     ├─ setup-plan.ps1                   # PowerShell 计划设置脚本
│     ├─ update-agent-context.ps1         # PowerShell 代理上下文更新
│     └─ check-prerequisites.ps1          # PowerShell 先决条件检查
│
├─ docs/                                  # 文档系统
│  ├─ index.md                            # 文档主页
│  ├─ installation.md                     # 安装指南
│  ├─ quickstart.md                       # 快速开始指南
│  ├─ local-development.md                # 本地开发指南
│  ├─ docfx.json                          # DocFX 文档生成配置
│  └─ toc.yml                             # 文档目录结构
│
├─ .github/                               # GitHub 工作流和配置
│  └─ workflows/                          # CI/CD 管道
│     ├─ release.yml                      # 发布工作流 – 自动化版本发布和包分发
│     ├─ docs.yml                         # 文档构建工作流
│     ├─ lint.yml                         # 代码质量检查工作流
│     └─ scripts/                         # 发布脚本
│        ├─ create-release-packages.sh    # 创建发布包 – 为每个 AI 代理生成模板包
│        ├─ create-github-release.sh      # GitHub 发布创建
│        ├─ generate-release-notes.sh     # 发布说明生成
│        ├─ get-next-version.sh           # 版本号管理
│        └─ update-version.sh             # 版本更新脚本
│
├─ .devcontainer/                        # 开发容器配置
│  ├─ devcontainer.json                  # 容器配置 — VS Code 扩展和环境设置
│  └─ post-create.sh                     # 容器后创建脚本 — AI 工具安装
│
├─ memory/                               # 项目记忆系统
│  └─ constitution.md                    # 项目宪法 — 核心原则和治理指导
│
├─ media/                                # 媒体资源
│  ├─ logo_large.webp                    # 项目标志（大）
│  ├─ logo_small.webp                    # 项目标志（小）
│  ├─ specify_cli.gif                    # CLI 演示动画
│  └─ bootstrap-claude-code.gif          # Claude Code 引导演示
│
├─ pyproject.toml                        # Python 项目配置 — 依赖管理和构建设置
├─ README.md                             # 项目主文档 — 完整的使用指南和方法论介绍
├─ spec-driven.md                        # SDD 方法论详细说明 — 理论基础和实践指导
├─ AGENTS.md                             # AI 代理集成指南 — 添加新代理完整流程
├─ CHANGELOG.md                          # 变更日志
├─ CONTRIBUTING.md                       # 贡献指南
├─ CODE_OF_CONDUCT.md                    # 行为准则
├─ SECURITY.md                           # 安全策略
├─ SUPPORT.md                            # 支持信息
└─ LICENSE                               # MIT 开源许可证

```

### 快速开始

这里是使用Claude Code 和 Spec-kit的基本使用方案，仅供参考

#### 安装Spec-kit

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

#### 项目初始化

```bash
specify init my-project --no-git
```

更多命令参考Github中的内容[https://github.com/github/spec-kit](https://github.com/github/spec-kit)

![](/images/posts/8ce78e3e44bd/img_02_51bfa1cf.png)

![](/images/posts/8ce78e3e44bd/img_03_9aad7d07.png)

![](/images/posts/8ce78e3e44bd/img_04_b3ce6d42.png)

生成了很多命令

![](/images/posts/8ce78e3e44bd/img_05_e393079e.png)

#### 使用技巧

```bash
# 1. 建立项目"宪法"
/speckit.constitution
## 作用：创建项目“宪法”，即前提原则，这些原则和指南会知道所有后续的开发工作。

# 2. 描述功能需求
/speckit.specify
## 作用：输出产品需求文档（PRD）.只描述“要什么”，不讨论“怎么实现”

# 3. 澄清需求细节（optional）
/speckit.clarify
## 作用：Spec-Kit 开始针对需求不明确的点，向我们提问.无需额外输入，直接执行即可

# 4. 确定技术方案和生成实施计划
/speckit.plan
## 作用：基于需求写技术方案和实施计划.无需额外输入，直接执行

# 5. 拆解执行任务 (非常实用)
/speckit.tasks
## 作用：拆解任务，分析 spec.md 和 plan.md、按阶段（Phase）拆解为多个子任务、每个任务包含明确的验收标准、估算完成时间.基于需求和技术方案，拆解出具体的任务无需额外输入，直接执行

# 6. 全面审核 (可选但推荐)
/ speckit.analyze
## 将所有文档全部审核一遍,检测 spec.md、plan.md 和 tasks.md 之间的不一致性、重复、歧义和欠指定项，将有问题的点全部找出来，生成报告并协助修复。

# 7. 开始编码
/speckit.implement
## 开始写需求代码
```

## 实践部分

这里选择使用vibe coding一个小程序，实现一些小功能，目前使用微信开发者平台和云函数完成的。

### Vibe Coding

#### 初始化项目

```bash
# 在github创建仓库...

# specify 初始化项目
/speckit.constitution 这是一个微信小程序项目，未来想在这个小程序中做一些小工具，小游戏，使用小程序架构

## 初始化claude.md
/init 这是一个微信小程序的代码仓库，现在是在做一些小工具，未来会接入AI问答，用户管理
```

#### 功能开发

##### 描述开发需求

```plain
帮助我完成文本工具中的一个藏头诗的功能。主要功能是帮助用户生成藏头诗。
名字叫藏头诗工具
页面主要元素：
1. 用户输入框1，输入用户需要藏的文本
2. 用户输入框2，表达需要藏头诗的什么感受、想法
3. 按钮提交
4. 返回结果（流式返回）
这里会调用外部api，使用云函数帮助解决
## API
文本生成型应用 API
文本生成应用无会话支持，适合用于翻译/文章写作/总结 AI 等等。
基础 URL

curl -X POST 'https://api.dify.ai/v1/completion-messages' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{
  "inputs": {"query": "你最牛"},
  "response_mode": "blocking"
}'

返回：

{
  "id": "0b089b9a-24d9-48cc-94f8-762677276261",
  "answer": "how are you?",
  "created_at": 1679586667
}

其中answer中的内容就是藏头诗返回的结果
在接口请求，是需要结合用户的输入进行拼接然后再去请求。
我要藏"用户输入框1"，是要表达"用户输入框2"的想法
用户输入框2不是必填项，需要动态拼接query的内容
```

##### 使用spec辅助开发

```plain
/speckit.specify is running… task\03-藏头诗.md
...
  下一步

  规格说明已准备就绪，你可以执行：
  - /speckit.clarify - 识别并澄清任何模糊之处
  - /speckit.plan - 开始实现计划设计
/speckit.clarify
...
You can reply with the option letter (e.g., "A"), accept the recommendation by saying "yes" or "recommended", or
  provide your own short answer.

A
... 开始问题澄清
/speckit.plan
...
/speckit.tasks
...
/speckit.implement
...
后面让AI调整了一下样式
```

![](/images/posts/8ce78e3e44bd/img_06_65f1e92d.png)

这里使用Spec-kit进行开发，文档规约比较充分

![](/images/posts/8ce78e3e44bd/img_07_f378f647.png)

但是模型的token消耗是巨大的，并且上下文会超长，模型上下文理解也会被减弱....

### 成果展示

![](/images/posts/8ce78e3e44bd/img_08_b4c577a9.png)

可以搜索小程序"指尖工具屋"，或者扫一扫下面的二维码，可以实际体验一下

![](/images/posts/8ce78e3e44bd/img_09_e2e5ec05.png)

最后，所有的开发使用的腾讯云免费提供的服务，使用**云函数**去解决调用其他能力，默认3秒就会超时...所以正式版小程序用不了..定义云函数的环境变量也无法使用

![](/images/posts/8ce78e3e44bd/img_10_f7ae0c0c.png)
