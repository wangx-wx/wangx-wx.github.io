+++
date = '2026-02-03T23:27:19+08:00'
draft = false
title = 'OpenSpec'
author = 'wx'
tags = ['Claude Code', 'OpenSpec']
+++
# OpenSpec

规范编程框架：https://github.com/Fission-AI/OpenSpec

## Quick Start  快速入门

全局安装 OpenSpec
```sh
npm install -g @fission-ai/openspec@latest

# 然后导航到您的项目目录并进行初始化：
cd your-project
openspec init

/opsx:new <what-you-want-to-build>
```

更新 OpenSpec

```sh
npm install -g @fission-ai/openspec@latest

# 刷新代理指令
## 在每个项目中运行此命令，以重新生成 AI 指导并确保最新的斜杠命令处于活动状态：
openspec update
```

## 使用流程

### 入门教程

#### 工作原理
OpenSpec 可以帮助你和你的 AI 编码助手在编写任何代码之前就确定要构建的内容。工作流程遵循一个简单的模式：

```txt
┌────────────────────┐
│ Start a Change     │  /opsx:new
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Create Artifacts   │  /opsx:ff or /opsx:continue
│ (proposal, specs,  │
│  design, tasks)    │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Implement Tasks    │  /opsx:apply
│ (AI writes code)   │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Archive & Merge    │  /opsx:archive
│ Specs              │
└────────────────────┘
```

#### OpenSpec 创建了什么
运行 openspec init 后，项目结构如下：
```txt
openspec/
├── specs/              # Source of truth (your system's behavior)
│   └── <domain>/
│       └── spec.md
├── changes/            # Proposed updates (one folder per change)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta specs (what's changing)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Project configuration (optional)
```

两个关键目录：
- specs/ - 真理之源。这些规范描述了您的系统当前的行为方式。按域组织（例如，specs/auth/ ，specs/payments/）。
- changes/ - 拟议修改。每个修改都会拥有自己的文件夹，其中包含所有相关文件。修改完成后，其规范将合并到主 specs/ 目录中。

#### Understanding Artifacts 
每个变更文件夹都包含指导工作的工件：

|Artifact|目的|
|--:|--:|
|proposal.md|“为什么”和“是什么”——概括了意图、范围和方法。|
|specs/|Delta 规格表显示了新增/修改/移除的要求|
|design.md|“如何做”——技术方法和架构决策|
|tasks.md|实施清单（含复选框）|

Artifacts 相互依赖

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            update as you learn
```

在实施过程中，随着你不断学习，可以随时回头改进之前的成果。

#### Delta 规格如何运作

增量规范是 OpenSpec 中的关键概念。它们显示了相对于当前规范发生了哪些变化。

##### 格式

Delta 规格书使用章节来指示变更类型：

```
# 用于认证的Delta 
## 增加的要求
### 要求：双重身份验证
系统在登录时必须要求用户提供第二道身份验证信息。
#### 情景：需输入一次性密码
- 假设用户已启用双重身份验证
- 当用户提交有效的登录信息时
- 随后会要求输入一次性密码进行验证
## 改动后的要求
### 要求：会话超时
系统应在用户无操作 30 分钟后自动终止会话。
（之前规定：60 分钟）
#### 情景描述：会话超时
- 假设已认证的会话状态存在
- 在 30 分钟内无任何操作发生
- 那么该会话将被终止。
## 已删除的要求
### 要求：记住我
（已弃用，建议使用双重身份验证）
```

##### 档案库里发生了什么

当您归档更改时：

1. **新增**要求将附加到主规范中
2. **修改后的**要求将取代现有版本
3. **已移除的**需求将从主规范中删除

更改文件夹移动到 `openspec/changes/archive/` 以便进行审核历史记录

#### 例如：你的第一次改变

##### 1. 开始改变

```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Ready to create: proposal
```

##### 2. 创建Artifacts

使用 `/opsx:ff` （快进）一次性创建所有规划工件：

```
You: /opsx:ff

AI:  Creating artifacts for add-dark-mode...
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

##### 3. 创造出什么

**proposal.md** - 阐明意图：

```
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** - Delta 显示新需求：

```
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** - 实施清单：

```
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

##### 4. 实施

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

##### 5. 存档

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

#### 核实与审核

使用命令行界面 (CLI) 检查更改：

```
# List active changes
openspec list

# View change details
openspec show add-dark-mode

# Validate spec formatting
openspec validate add-dark-mode

# Interactive dashboard
openspec view
```

### Workflows

#### 哲学：行动，而非阶段

传统的工作流程会强制你经历几个阶段：计划、实施、完成。但实际工作并非如此简单。

OPSX 采取了不同的方法：

```
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

 **关键原则：**

**是行动，而非阶段** ——命令是你可以执行的操作，而不是你被困住的阶段。

**依赖关系是赋能工具** ——它们展示的是可能性，而不是下一步需要做什么。



#### 工作流模式

##### 快速开始

当你清楚自己想要构建什么，只需要执行时：

```
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

###### 示例

```
You: /opsx:new add-logout-button

AI:  Created openspec/changes/add-logout-button/
     Ready to create: proposal

You: /opsx:ff

AI:  Creating all planning artifacts...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Ready for implementation!

You: /opsx:apply

AI:  Working through tasks...
     ✓ Added logout button to header
     ✓ Implemented session clearing
     ✓ Added confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  ✓ Merged specs
     ✓ Archived change
```

**最适合：** 小型到中型功能、错误修复、简单更改。

##### Exploratory 

当需求不明确或需要先进行调查时：

```
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

###### 对话示例：

```
You: /opsx:explore

AI:  What would you like to explore?

You: I want to improve page load performance but I'm not sure
     where the bottlenecks are.

AI:  Let me help investigate...
     [Analyzes bundle sizes, identifies slow queries, reviews
     component render patterns]

     I found three main bottlenecks:
     1. Large unoptimized images
     2. Synchronous data fetching in ProductList
     3. Re-renders from context changes

     Which would you like to address first?

You: Let's tackle the data fetching issue.

You: /opsx:new optimize-product-list-fetching

AI:  Created change. Ready to create: proposal

You: /opsx:continue

AI:  Creating proposal based on our exploration...
     [Writes proposal incorporating investigation insights]

     Ready to create: specs, design
     Which would you like next?

You: /opsx:continue

AI:  Creating specs...
```

**最适合：** 性能优化、调试、架构决策、需求不明确。

##### 并行变更

同时处理多个更改：

```
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

###### **对话示例：**

```
You: I'm working on add-dark-mode but got pulled into a bug fix

You: /opsx:new fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Created planning artifacts

You: /opsx:apply

AI:  Working on fix-login-redirect...
     [Implements the fix]
     All tasks complete!

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect

You: Let's get back to dark mode

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode...
     Picking up at task 2.3: Update Header...
```

**最适合：** 并行工作流程、紧急中断、团队协作。

---

当您有多个已完成的更改时，请使用 `/opsx:bulk-archive` ：

```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (all tasks done)
     - fix-login-redirect (all tasks done)
     - update-footer (all tasks done)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will apply in chronological order.

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-redirect
     ✓ Archived update-footer
     Specs merged in order: add-dark-mode → update-footer
```

批量归档功能会检测多个更改何时涉及相同的规范，并通过检查实际实现的内容来解决冲突。



#### 完成变更

推荐的完成流程：

```
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

##### 核对：检查你的工作

`/opsx:verify` 从三个维度验证您的实现是否符合要求：

```
You: /opsx:verify

AI:  Verifying add-auth...

     COMPLETENESS
     ✓ All 12 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Session timeout after inactivity" not tested

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "event-driven" but implementation uses polling

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for session timeout scenario
     2. Consider refactoring to event-driven as designed, or update design.md
```

###### **验证检查内容：**

```text
You: /opsx:verify

AI:  Verifying add-auth...

     COMPLETENESS
     ✓ All 12 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Session timeout after inactivity" not tested

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "event-driven" but implementation uses polling

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for session timeout scenario
     2. Consider refactoring to event-driven as designed, or update design.md
```

如果规范未同步，归档程序会发出提示。它不会阻塞未完成的任务，但会发出警告。

#### 何时使用什么

##### `/opsx:ff` 与 `/opsx:continue`

| 情况                               | 使用           |
| ---------------------------------- | -------------- |
| 需求明确，准备开工                 | /opsx:ff       |
| 探索过程中，我想回顾每个步骤。     | /opsx:continue |
| 希望在制定规范之前对提案进行迭代。 | /opsx:continue |
| 时间紧迫，需要快速行动             | /opsx:ff       |
| 复杂多变，渴望掌控                 | /opsx:continue |

**经验法则：** 如果可以预先描述完整的范围，请使用 `/opsx:ff` 。如果是边做边确定，请使用 `/opsx:continue` 。

##### 何时更新，何时全新开始

一个常见的问题是：什么时候可以更新现有更改，什么时候应该开始新的更改？

**更新现有更改的情况如下：**

- 意图相同，执行更加精细。
- 范围缩小（先做 MVP，其他的稍后再说）
- 基于学习的修正（代码库与预期不符）
- 根据实施过程中发现的问题进行设计调整

**启动新变更的条件如下：**

- 意图发生了根本性改变
- 工作范围迅速扩展到完全不同的领域。
- 原始更改可以单独标记为“已完成”。

+ 打补丁只会让人更加困惑，而不是更加清晰。

```
                     ┌─────────────────────────────────────┐
                     │     Is this the same work?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Same intent?      >50% overlap?      Can original
          Same problem?     Same scope?        be "done" without
                 │                  │          these changes?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      YES               NO YES           NO  NO              YES
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

#### 最佳实践

##### 保持变革的重点

每次变更都应包含一个逻辑工作单元。例如，如果您要“添加功能 X 并重构 Y”，请考虑将其拆分为两个单独的变更。

**重要性：**

- 更容易复习和理解
- 更清晰的档案历史记录
- 可独立发货
- 如果需要，回滚操作会更简单

##### 使用 `/opsx:explore` 不明确的要求

在决定做出改变之前，先探索问题领域：

```
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle rate limiting for our API?

AI:  Let me investigate your current setup and options...
     [Researches codebase, considers patterns]

     I see three approaches we could take:
     1. Middleware-based (simple, per-endpoint)
     2. Redis-backed (scalable, shared state)
     3. Token bucket per user (fair, complex)

     Your current stack suggests #1 or #2. What's your scale?
```

探索可以帮助你在创造作品之前理清思路。

##### 归档前请核实

使用 `/opsx:verify` 检查实现是否与工件匹配：

```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

在关闭更改之前捕获不匹配项。

##### 清晰的名称

好的名称能让 `openspec list` 更有用：

```
Good:                          Avoid:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

####  命令快速参考

| 命令                 | 目的                               | 何时使用                   |
| -------------------- | ---------------------------------- | -------------------------- |
| `/opsx:explore`      | 仔细思考各种想法                   | 要求不明确，需调查         |
| `/opsx:new`          | 开始改变                           | 开始任何新的工作           |
| `/opsx:continue`     | 创建下一个artifact                 | 逐步创建artifact           |
| `/opsx:ff`           | 创建所有规划文档                   | 范围明确，准备开工         |
| `/opsx:apply`        | 执行任务                           | 准备编写代码               |
| `/opsx:verify`       | 验证实施                           | 归档前，找出不匹配项       |
| `/opsx:sync`         | 合并增量规格                       | 可选——根据需要添加存档提示 |
| `/opsx:archive`      | 完成更改                           | 所有工作已完成             |
| `/opsx:bulk-archive` | 归档多个更改                       | 并行工作，批量完成         |
| `/opsx:onboard`      | 引导式教程，带您了解完整的工作流程 | 适合新手                   |

### 命令介绍

这是 OpenSpec 斜杠命令的参考说明。这些命令会在您的 AI 编码助手的聊天界面（例如 Claude Code、Cursor、Windsurf）中调用。

#### `/opsx:explore`

在决定做出改变之前，要仔细思考想法，调查问题，并明确需求。

**Syntax：**

```
/opsx:explore [topic]
```

**参数**

| 参数    | 必需的 | 描述           |
| ------- | ------ | -------------- |
| `topic` | 不     | 探索或调查什么 |

 **它的功能：**

- 开启一场无需任何结构的探索性对话
- 调查代码库以回答问题
- 比较各种方案和方法
- 创建可视化图表以阐明思路
- 当洞察逐渐清晰时，可以过渡到 `/opsx:new`

**例子：**

```
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:new add-jwt-auth to begin.
```

**注意：**

+ 当需求不明确或需要调查时使用
+ 探索过程中不会产生任何artifacts
+ 便于在做决定前比较多种方法
+ 可以读取文件并搜索代码库

#### `/opsx:new`

开始新的变更。创建变更文件夹结构，并使用选定的架构搭建框架。

**Syntax：**

```
/opsx:new [change-name] [--schema <schema-name>]
```

**参数**

| 参数          | 必需的 | 描述                                                  |
| ------------- | ------ | ----------------------------------------------------- |
| `change-name` | 不     | 更改文件夹名称（如果未提供，则提示输入）              |
| `--schema`    | 不     | 要使用的工作流模式（默认：来自配置或 `spec-driven` ） |

**它的功能：**

+ 创建 `openspec/changes/<change-name>/` 目录
+ 在更改文件夹中创建 `.openspec.yaml` 元数据文件
+ 显示第一个可供创建的工件模板
+ 如果未提供名称和架构，则提示更改

**它所创造的：**

```
openspec/changes/<change-name>/
└── .openspec.yaml    # Change metadata (schema, created date)
```

**例子：**

```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**注意：**

- 使用描述性名称： `add-feature` 、 `fix-bug` 、 `refactor-module`
- 避免使用诸如 `update` 、 `changes` 、 `wip` 类的通用名称
- 可以在项目配置（ `openspec/config.yaml` ）中设置模式

#### `/opsx:continue`

创建依赖链中的下一个构件。每次创建一个构件，以实现增量式开发

**Syntax：**

```
/opsx:continue [change-name]
```

**参数**

| 参数          | 必需的 | 描述                                               |
| ------------- | ------ | -------------------------------------------------- |
| `change-name` | 不     | 要继续执行哪项更改（如果未提供，则根据上下文推断） |

**它的功能：**

+ 查询构件依赖关系图
+ 显示哪些工件已准备就绪，哪些工件已被阻塞
+ 创建第一个就绪工件
+ 读取依赖文件以获取上下文
+ 显示创建后可用的内容

**例子：**

```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**注意：**

- 当您需要在继续操作之前查看每个工件时，请使用此功能。
- 适用于需要控制的复杂变更。适用于复杂的变更。
- 多个工件可能同时准备就绪
- 您可以在继续操作之前编辑已创建的工件

#### `/opsx:ff`

快速完成artifacts 创建。一次性创建所有规划工件。

**Syntax：**

```
/opsx:ff [change-name]
```

**参数**

| 参数          | 必需的 | 描述                                       |
| ------------- | ------ | ------------------------------------------ |
| `change-name` | 不     | 快进的更改（如果未提供，则根据上下文推断） |

**它的功能：**

+ 按依赖顺序创建所有构件
+ 通过待办事项列表跟踪进度
+ 当所有 `apply-required` 工件都完成后停止
+ 在创建下一个构件之前，读取每个依赖项。

**例子：**

```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**注意：**

- 当你对要构建的东西有清晰的构想时，可以使用此方法。
- 对于简单的更改，速度比 `/opsx:continue` 更快。
- 之后你仍然可以编辑文物。
- 适用于小型到中型功能

#### `/opsx:apply`

根据变更内容执行任务。逐项完成任务清单，编写代码并逐项勾选。

**Syntax：**

```
/opsx:apply [change-name]
```

**参数**

| 参数          | 必需的                                           | 描述 |
| ------------- | ------------------------------------------------ | ---- |
| `change-name` | 不要实施哪项更改（如果未提供，则根据上下文推断） |      |

**它的功能：**

+ 读取 `tasks.md` 并识别未完成的任务
+ 逐一完成任务
+ 根据需要编写代码、创建文件、运行测试。
+ 用复选框 `[x]` 标记任务已完成

**例子：**

```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**注意：**

- 如果被打断，可以从上次中断的地方继续。
- 通过指定更改名称来用于并行更改
- 任务完成状态在 `tasks.md` 复选框中进行跟踪

#### `/opsx:verify`

验证实现是否与变更文档相符。检查完整性、正确性和一致性。

**Syntax：**

```
/opsx:verify [change-name]
```

**参数**

| 参数          | 必需的 | 描述                                           |
| ------------- | ------ | ---------------------------------------------- |
| `change-name` | 不     | 要验证哪个更改（如果未提供，则根据上下文推断） |

**它的功能：**

+ 检查实施质量的三个维度
+ 搜索代码库以查找实现证据
+ 报告问题，并将其归类为“严重”、“警告”或“建议”。
+ 不会阻止存档，但会暴露问题。

**验证维度：**

| 方面       | 验证了什么                                     |
| ---------- | ---------------------------------------------- |
| **完整性** | 所有任务已完成，所有需求已实现，所有场景已覆盖 |
| **正确性** | 实现符合规范意图，并处理了各种特殊情况。       |
| **相干性** | 设计决策体现在代码中，模式保持一致             |

**例子：**

```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**注意：**

- 在归档前运行，以便及早发现不匹配项。
- 警告不会阻止归档，但会指出潜在问题。
- 适合在提交之前审查人工智能的工作成果。
- 可以揭示制品与实现之间的偏差

#### `/opsx:sync`

**可选命令。** 将变更中的增量规范合并到主规范中。归档程序会在需要时提示同步，因此通常无需手动运行此命令。

**Syntax：**

```
/opsx:sync [change-name]
```

**参数**

| 参数          | 必需的 | 描述                                         |
| ------------- | ------ | -------------------------------------------- |
| `change-name` | 不     | 要同步的更改（如果未提供，则根据上下文推断） |

**它的功能：**

+ 从更改文件夹读取增量规范
+ 解析新增/修改/删除/重命名部分
+ 将更改合并到主 `openspec/specs/` 目录中
+ 保留增量中未提及的现有内容
+ 不存档更改（保持有效）

**例子：**

```
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**何时需要手动操作：**

| 设想                                       | 是否同步 |
| ------------------------------------------ | -------- |
| 长期变更，希望在归档前将规范合并到主分支中 | Yes      |
| 多项并行变更需要更新基础规范               | Yes      |
| 想单独预览/查看合并结果                    | Yes      |
| 快速切换，直接进入存档                     | No       |

**注意：**

- 同步是智能的，而不是复制粘贴。
- 可以在现有需求中添加场景，而不会重复
- 同步后更改仍然有效（不会被存档）
- 大多数用户永远不需要直接调用此功能——如有需要，可进行存档提示

#### `/opsx:archive`

归档已完成的更改。最终确定更改并将其移动到归档文件夹。

**Syntax：**

```
/opsx:archive [change-name]
```

**参数**

| 参数          | 必需的 | 描述                                         |
| ------------- | ------ | -------------------------------------------- |
| `change-name` | 不     | 要存档的更改（如果未提供，则根据上下文推断） |

**它的功能：**

+ 检查工件完成状态
+ 检查任务完成情况（如果未完成则发出警告）
+ 如果尚未同步，则提供同步增量规格的功能
+ 将更改文件夹移动到 `openspec/changes/archive/YYYY-MM-DD-<name>/`
+ 保留所有用于审计跟踪的痕迹

**例子：**

```
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**注意：**

- 归档不会阻塞未完成的任务，但会发出警告
- Delta 规格可以在归档期间或归档之前进行同步
- 存档的更改将被保存以供历史记录
- 首先使用 `/opsx:verify` 来发现问题

#### `/opsx:bulk-archive`

一次性归档多个已完成的更改。处理更改之间的规范冲突

**Syntax：**

```
/opsx:bulk-archive [change-names...]
```

**参数**

| 参数          | 必需的 | 描述                                       |
| ------------- | ------ | ------------------------------------------ |
| `change-name` | 不     | 对存档的具体更改（如果未提供，则提示选择） |

**它的功能：**

+ 列出所有已完成的更改
+ 在归档之前验证每次更改
+ 检测变更中的规范冲突
+ 通过检查实际实现的内容来解决冲突
+ 按时间顺序排列的档案

**例子：**

```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**注意：**

- 适用于并行工作流程
- 冲突解决是主动的（检查代码库）
- 更改按创建顺序存档
- 覆盖规范内容前的提示

#### `/opsx:onboard`

引导您完成整个 OpenSpec 工作流程。使用您实际代码库的交互式教程。

**Syntax：**

```
/opsx:onboard
```

 **它的功能：**

+ 通过旁白完整讲解工作流程周期
+ 扫描您的代码库，寻找真正的改进机会
+ 通过实际成果创造真正的改变
+ 执行实际工作（小的、安全的改动）
+ 存档已完成的变更
+ 逐一解释每个步骤的发生过程

**阶段：**

1. 欢迎和代码库分析
2. 寻找改进机会
3. 创建更改
4. 撰写提案
5. 制定规范
6. 编写设计
7. 创建任务
8. 执行任务（ `/opsx:apply` ）
9. 验证实现
10. 存档更改
11. 总结和后续步骤

**例子：**

```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**注意：**

+ 最适合学习工作流程的新用户
+ 使用真实代码，而非示例代码。
+ 带来你可以保留或舍弃的真正改变。
+ 完成需要15-30分钟

## 为什么选择 OpenSpec

AI 编码助手功能强大，但如果需求仅存在于聊天记录中，则其表现难以预测。OpenSpec 添加了一个轻量级的规范层，让您在编写任何代码之前就对要构建的内容达成一致。

- **在构建之前达成一致** ——人类和人工智能在编写代码之前，先就规范达成一致。
- 保持条理清晰 ——每次变更都单独建一个文件夹，里面包含提案、规格、设计和任务。
- 工作方式灵活 ——随时更新任何工件，没有严格的阶段性限制。
- 使用你的工具 ——可通过斜杠命令与 20 多个 AI 助手配合使用

对比 Spec Kit （GitHub）——功能全面但体积庞大。它有严格的阶段门控、大量的 Markdown 代码以及 Python 配置。OpenSpec 更轻量级，允许你自由迭代。
与 Kiro （AWS）相比——功能强大，但你只能使用他们的 IDE，而且仅限于 Claude 模型。OpenSpec 可以与你已使用的工具兼容。
与没有规范的情况相比 ——没有规范的 AI 编码意味着模糊的提示和不可预测的结果。OpenSpec 无需繁琐的流程即可带来可预测性。