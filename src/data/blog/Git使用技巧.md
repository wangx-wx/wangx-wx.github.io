---
title: "Git 使用技巧与最佳实践"
pubDatetime: 2025-09-05T21:44:34+08:00
author: "wx"
description: "全面的 Git 使用指南，涵盖基础命令、分支管理、版本回滚等核心功能，以及实际开发中的最佳实践"
draft: false
tags:
  - "git"
  - "版本控制"
  - "开发工具"
  - "命令行"
---

## Table of contents

## 概述

`Git` 是一个强大的分布式版本控制系统，适用于代码管理和团队协作。虽然现代 IDE 工具都集成了常用的 Git 功能，但掌握命令行操作仍然是开发者必备技能。本文总结了日常开发中最常用的 Git 命令和最佳实践。

## Git 工作流程

Git 的工作流程围绕四个主要区域展开：

1. **工作区（Working Directory）** - 进行代码编辑的地方，可以添加新文件、修改现有文件或删除文件
2. **暂存区（Staging Area/Index）** - 临时存储区域，用于存放下次提交的快照。执行 `git add` 命令时，将工作区中的更改添加到暂存区
3. **本地仓库（Local Repository）** - 项目的历史记录，包含了所有已提交的更改。执行 `git commit` 命令时，Git 会将暂存区中的内容创建一个新的提交
4. **远程仓库（Remote Repository）** - 托管在互联网上或网络中的仓库，通常用于团队协作

## 基础配置

> **提示**：命令中加入 `--global` 就是全局操作，否则需要在对应项目目录下执行

### 配置用户信息

全局配置使用者信息，用于提交工作时，展示个人信息

```bash
# 全局配置使用者信息，用于提交工作时展示个人信息
git config --global user.name "ideal"
git config --global user.email "example@ideal.com"
```

### 初始化仓库

```bash
git init
```

### 克隆远程仓库

克隆分为两种方式：`HTTPS` 和 `SSH` 克隆，主要区别如下：

| 克隆方式 | 认证方式      | 适用场景                    | 优势                        | 劣势                     |
| -------- | ------------- | --------------------------- | --------------------------- | ------------------------ |
| HTTPS    | 用户名 + 密码 | 临时访问或不想配置 SSH 密钥 | 易用，无需额外配置 SSH 密钥 | 每次操作可能需要输入凭据 |
| SSH      | SSH 密钥认证  | 长期开发和高安全性需求      | 免密码推拉代码，安全性更高  | 需要配置 SSH 密钥        |

```bash
# 生成 SSH 密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# HTTPS 方式克隆
git clone https://github.com/wx-coding/git-test.git

# SSH 方式克隆
git clone git@github.com:wx-coding/git-test.git
```

## 日常操作

### 查看仓库状态

```shell
wx@wxdeMacBook-Pro git-test % git status

On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
    new file:   a.txt

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
    modified:   .gitignore
    modified:   a.txt
```

### 添加文件到暂存区

暂存区是一个临时的区域，用于保存你对文件的更改，可以将它理解为一个“准备提交”的区域

```bash
# 添加一个指定文件至暂存区
git add 文件名

# 添加所有修改文件至暂存区
git add .

# 取消文件加入暂存区
git restore --staged 文件名
```

### 提交更改

```bash
git commit -m "提交说明"
```

### 提交规范

提交说明应按照规范编写，常见规则如下：

| 类型       | 类别        | 说明                                                 |
| ---------- | ----------- | ---------------------------------------------------- |
| `feat`     | Production  | 新增功能                                             |
| `fix`      | Production  | Bug 修复                                             |
| `perf`     | Production  | 提高代码性能的变更                                   |
| `style`    | Development | 代码样式修改（缩进、空格、空行等）                   |
| `refactor` | Production  | 重构代码（修改结构、变量名、函数名但不修改功能逻辑） |
| `test`     | Development | 修改测试用例                                         |
| `ci`       | Development | 修改持续集成流程（Travis、Jenkins 等工作流配置）     |
| `docs`     | Development | 修改文档（README 文件、API 文档等）                  |
| `chore`    | Development | 非业务性代码修改（构建流程或工具配置等）             |
| `build`    | Development | 修改项目构建系统（依赖库、外部接口等）               |

**推荐格式**：`git commit -m "类型: 提交说明"`

**示例**：

- `git commit -m "feat: 完成用户登录功能"`
- `git commit -m "fix: 修复登录页面样式问题"`

> **注意**：具体提交规则请参照公司开发规范

### 撤销提交操作

**已提交但未推送，需要取消提交：**

1. `git reset --soft HEAD~1` - 软重置，只撤销最后一次提交并保留在暂存区
2. `git reset --mixed HEAD~1` - 混合重置，撤销最后一次提交并将暂存区的文件撤销至工作区
3. `git reset --hard HEAD~1` - 硬重置，撤销最后一次提交的所有内容，**慎用**

**已提交已推送，需要修改提交信息：**

```bash
# 修改最近一次提交信息
git commit --amend -m "..."

# 推送修改后的提交
# --force-with-lease：比 --force 更安全，只有本地分支与远程分支匹配时才会强制推送
git push origin main --force-with-lease
# --force：直接覆盖远程提交，不推荐用于多人协作的分支
```

### 查看提交历史

```bash
git log

# 简洁日志
git log --oneline --graph --decorate --all
```

### 远程操作

```bash
# 推送并设置推送到哪一个分支
git push -u origin <branch_name>

# 直接推送
git push

# 拉取远程某一分支
git pull origin branch_name
```

## 分支相关操作

Git 分支管理是版本控制系统中非常重要的一个方面，它允许开发者在不同的分支上独立工作

### 查看分支

```bash
# 查看本地分支，当前分支有星号（*）
git branch

# 查看所有分支，包括远程分支
git branch -a

# 查看远程分支所有信息
git fetch --all
```

### 创建分支

```bash
# 在当前提交的基础上创建一个新分支
git branch branch_name

# 创建并切换到新分支
git checkout -b branch_name

# 重命名分支
git branch -m new_branch_name

# 查看分支详细信息
git branch -vv
```

### 分支命名规范

在实际开发中，创建项目新分支一般在**代码托管平台上操作**。分支命名需要规范，实际应遵循公司规定：

| 分支类型   | 命名格式                 | 示例                             | 描述                     |
| ---------- | ------------------------ | -------------------------------- | ------------------------ |
| 主分支     | `main` / `master`        | `main`                           | 主分支，线上稳定版本     |
| 功能分支   | `feature/feature-name`   | `feature/user-authentication`    | 用于新功能开发           |
| 修复分支   | `bugfix/bug-name`        | `bugfix/login-error`             | 用于修复问题             |
| 发布分支   | `release/version-number` | `release/v1.2.0`                 | 用于版本发布             |
| 热修复分支 | `hotfix/hotfix-name`     | `hotfix/critical-security-patch` | 用于紧急修复生产环境问题 |
| 测试分支   | `test/test-name`         | `test/integration-tests`         | 用于专门的测试工作       |

### 切换分支

```bash
# 切换分支
git checkout branch_name
git switch branch_name

# 在本地创建分支并拉取远程分支
git checkout -b 本地分支名 origin/远程分支名
```

### 合并分支

```bash
# 切换到主分支，将 branch_name 合并至主分支
git merge branch_name
# 如有冲突，手动解决冲突
# 解决冲突后继续提交

# 使用 rebase 合并
git rebase branch_name
```

### Git Merge 与 Git Rebase 的区别

`git merge` 和 `git rebase` 都是 Git 中用于整合不同分支更改的命令，但它们的工作方式和产生的结果有所不同。

#### Git Merge

将两个分支的更改合并成一个新的`合并提交`（merge commit），并且保留两者的历史。

合并的结果是创建一个新的提交，该提交有`两个父提交`，即原本分支的最后一个提交和目标分支的最后一个提交。

#### Git Rebase

会将当前分支上的提交 “**移动**” 到目标分支的**最前面**，即将当前分支的每个提交“重放”在目标分支的最新提交上

会改变分支的历史记录，因此它看起来像是当前分支的所有提交是在目标分支的基础上做的

#### 主要区别

| 特点               | Merge                              | Rebase                                           |
| ------------------ | ---------------------------------- | ------------------------------------------------ |
| **历史记录**       | 保留两个分支的历史，生成合并提交   | 修改提交历史，将当前分支提交"重放"到目标分支前面 |
| **提交图**         | 生成合并提交，历史呈现分支结构     | 历史呈现线性结构，无合并提交                     |
| **操作结果**       | 生成新的合并提交，保留各分支历史   | 当前分支提交移到目标分支前面                     |
| **适用场景**       | 团队协作，需要保留所有分支提交记录 | 个人分支或希望清理提交历史                       |
| **对公共分支影响** | 不改变历史，适合团队合作           | 改变历史，不推荐在公共分支使用                   |

#### 使用场景

- **使用 merge**：当希望保留分支的历史，尤其是多人协作时，merge 是更好的选择
- **使用 rebase**：当需要让历史保持线性，或者在个人分支上工作时，rebase 会让提交历史更简洁

### 删除分支

```bash
# 删除本地分支
git branch -d branch_name

# 强制删除本地分支
git branch -D branch_name

# 删除远程分支
git push origin --delete branch_name
```

### 分支比较

```bash
# 查看两个分支之间的差异
git diff branch_name_a branch_name_b

# 查看分支日志差异
git log branch_name_a..branch_name_b
```

## 版本回滚

### 本地回滚（不影响历史）

如果只是想让本地代码回到某个版本，但不改变提交历史，可以使用 `git checkout` 或 `git reset --hard`。

### 临时回滚（不影响提交历史）

```bash
git checkout <目标版本号>
```

让工作目录切换到目标版本，但不会修改分支指向。适用于查看历史版本，但不修改当前分支状态。

### 回滚到指定版本并修改本地提交历史

```bash
# 本地回滚但保留代码
git reset --soft <目标版本号>
```

回滚到<目标版本号>，但 **保留代码和暂存区的内容**，仅撤销后续的提交记录。适用于想撤销提交但保留文件修改，可以重新提交

```bash
# 本地回滚并清除暂存区
git reset --mixed <目标版本号>
```

**撤销提交**，但代码仍然保留在工作区（未 add 但代码还在）。 **适用于**希望回滚提交，并重新`add`需要的文件

```bash
# 彻底回滚（删除提交）
git reset --hard <目标版本号>
```

完全回滚，让代码、暂存区、提交历史全部恢复到**<目标版本号>**，后续提交会被删除。**适用于**彻底恢复到某个版本，不想保留后续的更改

### 回滚远程仓库（谨慎操作）

```bash
# 先本地回滚
git reset --hard <目标版本号>

# 强制推送（会覆盖远程历史，可能导致团队成员的代码不同步，慎用！）
git push origin --force

# 推荐使用 --force-with-lease，以避免意外覆盖其他人的提交
git push origin --force-with-lease

# 不会删除历史，而是创建一个新的提交来撤销目标版本之后的更改
git revert <目标版本号>
```

## 实用技巧

### 统计提交信息

### 特定时间范围内的提交次数

```bash
git log --since="2025-01-01" --until="2025-03-01" --pretty=oneline | wc -l
```

**参数说明：**

- `--since="2025-01-01"`：指定开始时间
- `--until="2025-02-01"`：指定结束时间
- `--pretty=oneline`：将每个提交显示为一行
- `wc -l`：统计提交的行数（即提交的次数）

### 特定时间范围内的代码行数变化

```bash
git log --since="2025-01-01" --until="2025-03-01" --numstat
```

### 统计不同类别的提交次数

```bash
git log --since="2025-01-01" --until="2025-03-01" --pretty=format:"%s" | grep -E "^(feat|fix|docs|chore|style|refactor|test)" | sort | uniq -c
```

**参数说明：**

- `--pretty=format:"%s"`：只输出提交的标题（即提交信息）
- `grep -E "^(feat|fix|docs|chore|style|refactor|test)"`：通过正则表达式筛选出特定类别的提交
- `sort`：对提交类别进行排序
- `uniq -c`：统计每种类别出现的次数

### 按类别统计并按频率排序

```bash
git log --since="2025-01-01" --until="2025-03-01" --pretty=format:"%s" | \
  grep -Eo "^(feat|fix|docs|chore|style|refactor|test)" | \
  sort | \
  uniq -c | \
  sort -nr
```

**参数说明：**

- `grep -Eo "^(feat|fix|docs|chore|style|refactor|test)"`：只提取符合条件的类别标签
- `sort -nr`：按降序排序，最频繁的类别会排在前面

### 常用工作流技巧

在日常开发中，建议遵循以下流程：

1. **推送前先拉取**：`git push` 之前优先 `git pull`
2. **冲突处理**：当 `git pull` 发生冲突时，使用 `git stash` 保存当前工作，然后 `git pull`，最后 `git stash pop` 恢复工作
3. **解决冲突后提交**：解决冲突后再 `git push`

```bash
# 标准工作流程
git stash              # 保存当前工作
git pull              # 拉取最新代码
git stash pop         # 恢复保存的工作
# 解决冲突...
git add .
git commit -m "resolve conflicts"
git push
```

### Git Stash 详细用法

`git stash` 是临时保存当前工作的强大工具：

```bash
# 保存当前工作（包括暂存区和工作区）
git stash

# 保存工作并添加描述
git stash save "临时保存：修复登录bug"

# 查看所有 stash 列表
git stash list

# 应用最近的 stash（不删除）
git stash apply

# 应用并删除最近的 stash
git stash pop

# 应用指定的 stash
git stash apply stash@{1}

# 删除指定 stash
git stash drop stash@{0}

# 清空所有 stash
git stash clear
```

## 开发最佳实践

### 提交最佳实践

- **频繁提交**：小步快跑，每完成一个小功能就提交
- **清晰的提交信息**：遵循提交规范，让每个提交都有意义
- **原子提交**：每个提交只做一件事，便于回滚和追溯

```bash
# 好的提交示例
git commit -m "feat: 添加用户邮箱验证功能"
git commit -m "fix: 修复登录页面样式错乱问题"
git commit -m "docs: 更新API文档中的认证部分"

# 避免的提交示例
git commit -m "修改了一些东西"
git commit -m "bug fix"
git commit -m "代码更新"
```

### 分支管理最佳实践

```bash
# 开发新功能的完整流程
git checkout main                    # 切换到主分支
git pull origin main                 # 拉取最新代码
git checkout -b feature/user-profile # 创建功能分支
# ... 开发代码 ...
git add .
git commit -m "feat: 完成用户资料页面"
git push -u origin feature/user-profile
# 创建Pull Request进行代码审查
# 审查通过后合并到main分支
git checkout main
git pull origin main
git branch -d feature/user-profile   # 删除本地分支
```

### 常见问题解决方案

#### 忘记切换分支就开发了

```bash
# 方法一：使用 stash
git stash                           # 保存当前工作
git checkout -b correct-branch      # 创建正确的分支
git stash pop                       # 恢复工作

# 方法二：创建分支（如果还没有提交）
git checkout -b correct-branch      # 直接在当前状态创建新分支
```

#### 提交到了错误的分支

```bash
# 将最后一次提交移到正确的分支
git log --oneline -5                # 查看最近的提交
git reset HEAD~1                    # 撤销最后一次提交但保留更改
git stash                           # 保存更改
git checkout correct-branch         # 切换到正确分支
git stash pop                       # 恢复更改
git add .
git commit -m "移动到正确分支的提交"
```

#### 合并冲突解决

```bash
# 当出现合并冲突时
git status                          # 查看冲突文件
# 手动编辑冲突文件，解决 <<<<<<< ======= >>>>>>> 标记
git add .                           # 标记冲突已解决
git commit                          # 完成合并
```

### Git 配置优化

```bash
# 设置常用别名
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.log1 "log --oneline --graph --decorate --all"

# 设置默认编辑器
git config --global core.editor "code --wait"

# 设置默认分支名
git config --global init.defaultBranch main

# 启用颜色输出
git config --global color.ui auto

# 设置换行符处理（Windows用户）
git config --global core.autocrlf true
```

## 总结

Git 是一个功能强大的版本控制工具，掌握这些基础命令和最佳实践能够显著提高开发效率。重要的几点：

1. **理解 Git 的工作流程**：工作区 → 暂存区 → 本地仓库 → 远程仓库
2. **养成良好习惯**：频繁提交、清晰的提交信息、合理的分支管理
3. **善用 Git 工具**：`git stash`、`git log`、`git diff` 等工具能解决很多实际问题
4. **团队协作**：遵循团队的 Git 规范，使用 Pull Request 进行代码审查

随着实践的深入，你会发现 Git 远比想象中强大。本文会持续更新，记录更多实用的 Git 技巧和场景解决方案。如有不足，欢迎指正！
