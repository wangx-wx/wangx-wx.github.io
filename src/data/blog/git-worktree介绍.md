---
title: "Git-worktree介绍"
pubDatetime: 2026-05-13T13:44:17+08:00
author: "wx"
description: "worktree —— 多分支并行开发实战"
draft: false
tags:
  - git
  - worktree
---

# 一个被严重低估的 Git 神器：worktree —— 多分支并行开发实战

> 写给所有被 "git stash" 折磨过的开发者

---

## 一、先聊聊那个让人崩溃的瞬间

来还原一个无比熟悉的场景：

你正在 `feature/login` 分支吭哧吭哧写了三个小时的代码，文件改了一半，控制台的 token 调试日志还没清理。突然，企业微信弹出：

> **测试 MM：** "线上 main 有个紧急 bug，麻烦立刻修一下。"

这时候你只有三个选择：

1. `git stash` 把活儿暂存起来 —— 等会儿回来 pop，遇到冲突血压升高
2. 随便提交一个 `WIP: 临时保存` —— 把脏代码混进 git 历史
3. 再 clone 一份仓库到别的目录 —— 浪费磁盘、配置环境、IDE 重新打开

**有没有第四种？**

有，而且是 Git 官方早在 2015 年（v2.5）就内置的功能：**`git worktree`**。可惜国内文章不多，很多人用了十年 git 都没听过。

---

## 二、git worktree 到底是个啥

一句话定义：

> **同一个 Git 仓库，可以同时拥有多个工作目录，每个目录检出不同的分支，互不干扰。**

形象一点的对比：

| 传统方式                          | worktree 方式                        |
| --------------------------------- | ------------------------------------ |
| 一个仓库目录 → 同时只能看一个分支 | 一个仓库 → 多个目录 → 同时看多个分支 |
| 切分支前必须处理脏数据            | 各分支在各自目录，互不影响           |
| 想看两个分支只能 clone 两份       | 共用一份 .git，省磁盘省流量          |

目录结构大概长这样：

```
projects/
├── test-git/                ← 主工作树（main 分支）
│   ├── .git/                ← 真实的 git 数据库
│   └── 业务文件...
├── test-git-hotfix/         ← worktree 1（hotfix 分支）
│   ├── .git                 ← 注意：这是一个文件，不是目录
│   └── 业务文件...
└── test-git-feature/        ← worktree 2（feature 分支）
    ├── .git
    └── 业务文件...
```

三个目录，**共享同一份 git 历史和对象**，只是工作区独立。

---

## 三、实战演示：用 `wangx-wx/test-git` 走一遍完整流程

下面所有命令都基于这个公开仓库，你可以一边读一边在自己电脑上跑：

```
https://github.com/wangx-wx/test-git.git
```

### 第一步：克隆仓库

```bash
git clone https://github.com/wangx-wx/test-git.git
cd test-git
```

### 第二步：看看现在的状态

```bash
# 当前在哪个分支
git branch

# 看所有远程分支
git branch -r

# 看所有 worktree（此刻只有主工作树）
git worktree list
```

输出大概是这样：

```
$ git worktree list
/Users/you/projects/test-git  3a8f9c2 [main]
```

只有一行，就是主工作树自己。

### 第三步：创建第一个 worktree —— 基于已存在的远程分支

假设我们要在不打断当前工作的前提下，去看一下 `dev` 分支的代码：

```bash
# 在 ../test-git-dev 目录创建工作树，并检出 dev 分支
git worktree add ../test-git-dev dev
```

执行后输出：

```
Preparing worktree (checking out 'dev')
HEAD is now at xxxxxx commit message
```

现在你的目录结构是：

```
projects/
├── test-git/            ← 还在 main，文件原封不动
└── test-git-dev/        ← 全新目录，里面是 dev 分支的代码
```

进去看一下：

```bash
cd ../test-git-dev
git branch          # 显示 * dev
ls                  # 看到的是 dev 分支的文件
```

**关键点：** 主目录 `test-git/` 里的脏代码完全不受影响。你可以随时 `cd` 回去继续之前的工作。

### 第四步：创建第二个 worktree —— 同时新建一个分支

紧急 bug 来了，需要基于 main 拉一个 hotfix 分支。一条命令搞定：

```bash
# 回到主目录
cd ../test-git

# -b 表示新建分支，名为 hotfix/login-crash
git worktree add -b hotfix/login-crash ../test-git-hotfix main
```

参数解读：

```
git worktree add -b hotfix/login-crash  ../test-git-hotfix  main
                 │       │                     │              │
                 │       └── 新分支名          │              └── 起点（从哪儿拉）
                 └── "新建分支" 标志           └── worktree 路径
```

执行后：

```
projects/
├── test-git/            ← main 分支（脏代码还在）
├── test-git-dev/        ← dev 分支（看代码用）
└── test-git-hotfix/     ← hotfix/login-crash 分支（修 bug 用）
```

### 第五步：在 hotfix 目录里修 bug、提交、推送

```bash
cd ../test-git-hotfix

# 改文件...
git add .
git commit -m "fix: 修复登录崩溃问题"

# 推到远程
git push -u origin hotfix/login-crash
```

整个过程主目录的 `feature/login` 分支没动过一根毛。

### 第六步：查看所有 worktree

```bash
git worktree list
```

输出：

```
/Users/you/projects/test-git          3a8f9c2 [main]
/Users/you/projects/test-git-dev      b1c2d3e [dev]
/Users/you/projects/test-git-hotfix   f4e5d6c [hotfix/login-crash]
```

清清楚楚。

### 第七步：用完了，清理 worktree

bug 修完合并后，hotfix 这个 worktree 就不需要了：

```bash
# 在主目录里执行
cd ../test-git

# 删除 worktree（目录和工作区记录都会清理）
git worktree remove ../test-git-hotfix

# 如果分支也不要了，再删除分支
git branch -d hotfix/login-crash
```

如果 worktree 目录被你手动 `rm -rf` 删掉了，git 会留下失效引用，用这个清理：

```bash
git worktree prune
```

---

## 四、进阶必修课：本地分支 vs 远程分支

很多新人搞不清楚 `dev` 和 `origin/dev` 到底有啥区别，这里掰开揉碎讲。

### 4.1 三种"分支"的概念

| 分支类型         | 例子            | 在哪             | 谁动得了            |
| ---------------- | --------------- | ---------------- | ------------------- |
| **本地分支**     | `dev`           | 你的电脑         | 你                  |
| **远程跟踪分支** | `origin/dev`    | 你的电脑（缓存） | git fetch/pull 更新 |
| **远程分支**     | GitHub 上的 dev | 服务器           | 所有协作者          |

注意第二种：`origin/dev` **存在你本地**，但它是远程分支的"快照"。你不能直接 commit 到它上面，它只会被 `git fetch` 刷新。

可以用一张图理解：

```
[GitHub 服务器]
    dev 分支 ──┐
              │ git fetch / git pull
              ▼
[你的电脑 .git/]
    origin/dev (远程跟踪分支，只读快照)
              │ 关联
              ▼
    dev (本地分支，你在上面工作)
```

### 4.2 怎么查看

```bash
# 只看本地分支
git branch

# 只看远程跟踪分支
git branch -r

# 全部看
git branch -a

# 看每个本地分支跟踪的是哪个远程分支
git branch -vv
```

`git branch -vv` 的输出示例：

```
* main    3a8f9c2 [origin/main] feat: 初始化项目
  dev     b1c2d3e [origin/dev: ahead 2] feat: 新功能 A
  local-x f4e5d6c (无 [origin/xxx] = 没关联远程)
```

中括号里的就是它跟踪的远程分支。`ahead 2` 表示本地比远程多 2 个提交。

### 4.3 创建一个关联远程分支的本地分支 —— 四种方式

这是日常最常用的操作，按推荐顺序排：

#### 方式 1：远程已存在，直接 checkout（推荐）

如果远程已经有 `dev` 分支，最简单：

```bash
git fetch origin                # 先把远程信息拉到本地
git checkout dev                # git 会自动建立跟踪关系
```

Git 2.23+ 也可以用更现代的 `switch`：

```bash
git switch dev
```

这两条命令在检测到 `origin/dev` 存在时，会自动创建本地 `dev` 分支并设置跟踪。

#### 方式 2：显式指定跟踪关系

```bash
git checkout -b dev origin/dev
# 或
git switch -c dev --track origin/dev
```

适合本地分支名想和远程不一样的场景：

```bash
# 本地叫 dev-local，跟踪远程的 dev
git checkout -b dev-local origin/dev
```

#### 方式 3：先建本地分支，再关联远程

适合"我已经在本地建了分支，想推到远程并建立跟踪"：

```bash
git checkout -b my-feature                  # 先建本地分支
# 写代码、提交...
git push -u origin my-feature               # -u 等同于 --set-upstream
```

`-u` 是关键，它会把远程分支注册为本地分支的 upstream，以后 `git pull` / `git push` 都不用再指定远程名。

#### 方式 4：已有的本地分支，想补关联

```bash
# 已经在 my-feature 分支
git branch --set-upstream-to=origin/my-feature
# 或简写
git branch -u origin/my-feature
```

### 4.4 验证跟踪关系

```bash
git branch -vv
```

看到本地分支后面有 `[origin/xxx]` 就说明关联成功。之后：

- `git pull` 等于 `git pull origin xxx`
- `git push` 等于 `git push origin xxx`
- `git status` 会告诉你 ahead/behind 多少 commit

---

## 五、worktree + 远程分支：组合技

把上面两个能力组合起来，能解锁更优雅的工作流。

### 场景：reviewer 要在不污染主分支的前提下，本地跑同事的 PR 分支

同事提了一个分支 `feature/payment-v2`，你要在本地跑起来看看。

**传统做法：** 当前分支 stash，checkout 过去，跑完再切回来 pop。

**worktree 做法：**

```bash
git fetch origin                                        # 拉最新远程信息

git worktree add ../test-git-review feature/payment-v2  # 一行搞定
cd ../test-git-review

# 这就是 feature/payment-v2 的工作区
npm install                                             # 装依赖、跑测试
npm run dev

# 看完直接删
cd -
git worktree remove ../test-git-review
```

主目录全程没受影响。

### 场景：同时跑两个分支做 A/B 对比

```bash
git worktree add ../test-git-v1 release/v1
git worktree add ../test-git-v2 release/v2
```

开两个终端，分别 `cd` 进去，启动各自的服务，可以并行对比行为差异。

---

## 六、命令速查表

| 任务                      | 命令                                             |
| ------------------------- | ------------------------------------------------ |
| 新增 worktree（已有分支） | `git worktree add <path> <branch>`               |
| 新增 worktree（新建分支） | `git worktree add -b <new-branch> <path> <起点>` |
| 列出所有 worktree         | `git worktree list`                              |
| 删除 worktree             | `git worktree remove <path>`                     |
| 清理失效引用              | `git worktree prune`                             |
| 查看本地分支              | `git branch`                                     |
| 查看远程分支              | `git branch -r`                                  |
| 查看跟踪关系              | `git branch -vv`                                 |
| 检出远程分支到本地        | `git checkout <branch>` 或 `git switch <branch>` |
| 推送并关联远程            | `git push -u origin <branch>`                    |
| 补关联远程                | `git branch -u origin/<branch>`                  |
| 拉取远程更新（不合并）    | `git fetch`                                      |
| 拉取并合并                | `git pull`                                       |

---

## 七、几个一定要知道的坑

### 1. 同一个分支不能被两个 worktree 同时检出

```bash
git worktree add ../test-git-2 main
# fatal: 'main' is already checked out at '/Users/you/projects/test-git'
```

这是 git 的保护机制。要看同一分支，可以基于它新建一个：

```bash
git worktree add -b temp-main ../test-git-2 main
```

### 2. 不要用 rm -rf 直接删 worktree 目录

会留下失效的 worktree 记录。正确做法：

```bash
git worktree remove <path>
```

万一已经手动删了，补救：

```bash
git worktree prune
```

### 3. 主工作树不能被删除

主工作树是 `.git` 目录所在的那个目录，其他 worktree 都依赖它。删它等于砸了根基。

### 4. IDE 缓存可能闹脾气

VS Code、IntelliJ 在第一次进入 worktree 目录时，会重新建索引，可能会卡几秒。属于正常现象。

### 5. worktree 不适合超大型仓库吗？

恰恰相反 —— 越大的仓库越适合。因为 worktree **不会重复存 .git 对象**，比 clone 两份省一大半磁盘。

---

## 八、写在最后

回到开头那个场景。学会 worktree 后，处理紧急 bug 的流程变成：

```bash
git worktree add -b hotfix/xxx ../repo-hotfix main
cd ../repo-hotfix
# 修 bug、提交、推送
cd -
# 主目录的脏代码还在原地等你
```

**三十秒搞定。**

git 早在十年前就给了我们这把好刀，只是太多人没翻到刀鞘那一页。希望这篇能让你以后少 stash 一点、少崩溃一点。

---

> **延伸阅读：** `git worktree --help` 才是最权威的文档，命令选项比本文涵盖的多得多。
>
> **示例仓库：** `https://github.com/wangx-wx/test-git.git`，可克隆下来自己跑一遍命令。
