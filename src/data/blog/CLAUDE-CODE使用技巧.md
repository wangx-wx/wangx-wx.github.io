---
title: "CLAUDE使用技巧"
pubDatetime: 2025-09-27T09:52:39+08:00
author: "wx"
description: "在 AI 编程工具百花齐放的今天，Anthropic 推出的 Claude Code 正在成为开发者圈的新宠。"
draft: false
tags:
  - "ai"
  - "claude-code"
---

## Table of contents

在 AI 编程工具百花齐放的今天，**Anthropic** 推出的 **Claude Code** 正在成为开发者圈的新宠。  
它不仅仅是一个代码补全工具，更像是一个能理解你项目全局、直接在终端帮你“干活”的智能编程助手。

今天，我们就来聊聊：

1. Claude Code 有什么用？
2. 如何安装和使用？
3. 高效使用的技巧与最佳实践

---

## 一、Claude Code 是什么？

Claude Code 是 Anthropic 推出的 **终端级 AI 编程代理**，能够：

- 理解整个代码库（不仅仅是当前文件）
- 执行跨文件的重构、调试
- 帮你写 PR、运行测试、修复 bug
- 与 Git、CI/CD、数据库、API 等工具链深度协作
- 用自然语言交互，让 AI 成为你代码仓库的“伙伴”

与 GitHub Copilot、Codeium 这类 IDE 内补全工具不同，Claude Code 的定位更高——  
它不是给你几行代码提示，而是能**真正完成一个开发任务**，甚至包含执行命令、提交代码、推送 PR 等全过程。

---

## 二、安装Claude Code

### **安装 Node.js（版本 ≥ 18.0）**

#### Ubuntu / Debian

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo bash -
sudo apt-get install -y nodejs
node --version
```

#### macOS

```bash
# 安装 Xcode CLI 工具
sudo xcode-select --install

# 安装 Homebrew（如果已安装可跳过）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Node.js
brew install node
node --version
```

---

### **安装 Claude Code**

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

> 如果遇到 **npm 权限问题**，可以考虑加 `sudo` 或使用 `nvm` 管理 Node.js。

---

### **获取 Auth Token 并运行**

- **获取 API Token**
  - 登录 Anthropic 账号 → 进入 **API 令牌** 页面 → 点击 **添加令牌**
  - 令牌会以 **`sk-`** 开头

- **使用anyrouter的代理**
  - 免费的`claude-sonnet`代理：https://anyrouter.top/register?aff=vNlI
  - 现在注册可以获得100美元余额，使用上述链接可以额外获取50美元余额

- **在项目中运行**

```bash
cd your-project-folder

# 临时环境变量（仅当前会话有效）
export ANTHROPIC_AUTH_TOKEN=sk-你的token
export ANTHROPIC_BASE_URL=https://anyrouter.top

claude
```

- **首次运行交互**
  1. 选择你喜欢的主题 → 回车
  2. 确认安全须知 → 回车
  3. 使用默认 Terminal 配置 → 回车
  4. 信任当前工作目录 → 回车
  5. 开始 AI 协作 🚀

---

### **永久配置环境变量（推荐）**

将环境变量写入 Shell 配置文件：

```bash
# bash 用户
echo -e '\n export ANTHROPIC_AUTH_TOKEN=sk-你的token' >> ~/.bash_profile
echo -e '\n export ANTHROPIC_BASE_URL=https://anyrouter.top' >> ~/.bash_profile
echo -e '\n export ANTHROPIC_AUTH_TOKEN=sk-你的token' >> ~/.bashrc
echo -e '\n export ANTHROPIC_BASE_URL=https://anyrouter.top' >> ~/.bashrc

# zsh 用户（macOS 默认）
echo -e '\n export ANTHROPIC_AUTH_TOKEN=sk-你的token' >> ~/.zshrc
echo -e '\n export ANTHROPIC_BASE_URL=https://anyrouter.top' >> ~/.zshrc
```

重启终端后，直接执行：

```bash
cd your-project-folder
claude
```

### **⚠️ 注意事项**

1. **Token 安全**：不要在公开仓库中提交你的 `sk-` Token
2. **Node 版本管理**：建议用 `nvm` 管理 Node.js 版本，方便升级和切换
3. **网络连接**：Claude Code 需要稳定的外网环境，可能需要科学上网
4. **权限问题**：在企业网络环境下，可能需要额外配置代理或白名单

---

## 三、Claude Code 可以做什么？

Claude Code 作为一个功能强大的 AI 编程助手，在实际开发中的应用场景极其广泛：

### 1. 智能代码生成与补全

- **多语言支持**：直接用自然语言描述需求，Claude Code 支持 Python、JavaScript、TypeScript、Java、Go、Rust、C++ 等主流编程语言
- **项目上下文理解**：基于当前项目的架构和依赖关系生成符合项目风格的代码

```bash
# 用户输入
claude> 在 src/utils 目录下创建一个 dateHelper.js，包含日期格式化、解析和计算功能，使用项目中已有的 moment.js 库

# Claude Code 响应
我将为你创建一个日期工具类，基于项目中现有的 moment.js 依赖。

[创建文件: src/utils/dateHelper.js]
const moment = require('moment');

/**
 * 日期工具类
 * 基于 moment.js 提供常用的日期操作功能
 */
class DateHelper {
  /**
   * 格式化日期
   * @param {Date|string} date - 待格式化的日期
   * @param {string} format - 格式化模板，默认 'YYYY-MM-DD'
   * @returns {string} 格式化后的日期字符串
   */
  static format(date, format = 'YYYY-MM-DD') {
    return moment(date).format(format);
  }

  // ... 更多方法
}

module.exports = DateHelper;

✅ 文件已创建
✅ 已添加对应的单元测试文件 src/utils/__tests__/dateHelper.test.js
✅ 已更新项目的导出索引 src/utils/index.js

需要我为这个工具类添加更多功能吗？
```

### 2. 全项目重构与维护

- **智能重构**：分析项目依赖关系，安全地重命名变量、函数、类，并同步更新所有引用
- **影响范围分析**：在执行重构前会分析影响范围并征求确认

```bash
# 用户输入
claude> 将 UserService 重命名为 AccountService，并更新项目中所有相关的导入和调用

# Claude Code 响应
我来分析 UserService 的使用情况并执行重构...

🔍 扫描项目中的 UserService 引用：
  - src/services/UserService.js (主文件)
  - src/controllers/AuthController.js:15 (import)
  - src/controllers/ProfileController.js:8 (import)
  - src/middleware/authMiddleware.js:23 (实例化)
  - tests/services/UserService.test.js (测试文件)

总计找到 5 个文件需要更新，是否继续？(y/N)

# 用户确认后
✅ 重命名 src/services/UserService.js → src/services/AccountService.js
✅ 更新 src/controllers/AuthController.js 中的导入声明
✅ 更新 src/controllers/ProfileController.js 中的导入声明
✅ 更新 src/middleware/authMiddleware.js 中的类引用
✅ 重命名测试文件并更新导入

重构完成！共修改 5 个文件，建议运行测试确保功能正常。
是否要我运行项目测试？
```

### 3. 结合 MCP 进行开发

```bash
# 添加 MCP
PS C:\Users\xxx\Desktop> claude mcp add --transport sse linear https://mcp.amap.com/sse?key=xxx

# 运行
PS C:\Users\xxx\Desktop> claude

> 负责为用户制定详细且可执行的广州五日旅行攻略，包括行程安排、美食推荐、交通 住宿建议、天气注意事项等。

  ## Skills
  1. 能基于时间、地点与预算制定完整的旅行计划。
  2. 熟悉广州景点、美食、交通和住宿资源。
  3. 能整合实时天气、门票及开放时间等信息。
  4. 提供高效的出行建议及日程优化方案。

  ## Goals
  为用户制定 2025 年 8 月 20 日至 8 月 25 日，从武汉出发至广州的五日旅行攻略 ，要求：
  - 出行方式：高铁，武汉站出发，广州南站到达，8 月 25 日下午 1 点返程。
  - 行程内容：参观广州知名景点 + 品尝特色美食。
  - 信息涵盖：每日行程安排、景点简介、门票价格、开放时间、交通方式、住宿建议 、当地天气提醒。
  - 提供当地特色餐厅与必吃美食推荐。
  - 结合天气状况给出着装与防雨防晒建议。

  ## Rules
  1. 行程安排需避免过度奔波，兼顾游玩体验与休息时间。
  2. 交通建议优先考虑高效与经济性。
  3. 美食推荐需贴近当地特色并考虑地理位置便利性。
  4. 天气信息需结合广州 8 月的气候特点给出实用建议。
  5. 输出结构清晰，分为「每日行程」「餐饮推荐」「交通与住宿」「天气提示」等模块。

  ## Workflows
  1. 确定旅行时间与出行方式。
  2. 搜集广州 8 月气候、节庆活动、热门景点及餐饮信息。
  3. 根据地理位置优化景点与餐厅的游玩顺序。
  4. 提供可执行的日程安排及注意事项。

  ## Init
  请根据以上要求生成一份广州五日旅行攻略，生成一个travel.html文件，在地图中展示路线

● 我将为您制定一份详细的广州五日旅行攻略。让我先收集相关信息，然后创建一个包 含路线图的可视化攻略。

  Update Todos
  ⎿  ☐ 获取8月20-25日广州天气预报
     ☐ 规划武汉到广州高铁行程
     ☐ 研究广州主要景点及门票信息
     ☐ 搜索广州特色美食和推荐餐厅
     ☐ 优化每日行程安排
     ☐ 创建travel.html可视化攻略文件

● 让我开始收集信息和制定攻略：

  Update Todos
  ⎿  ☐ 获取8月20-25日广州天气预报
     ☐ 规划武汉到广州高铁行程
     ☐ 研究广州主要景点及门票信息
     ☐ 搜索广州特色美食和推荐餐厅
     ☐ 优化每日行程安排
     ☐ 创建travel.html可视化攻略文件

  amap-sse - maps_weather (MCP)(city: "广州")
  ⎿  {
       "city": "广州市",
       "forecasts": [
     … +58 lines (ctrl+r to expand)

  Update Todos
  ⎿  ☒ 获取8月20-25日广州天气预报
     ☐ 规划武汉到广州高铁行程
     ☐ 研究广州主要景点及门票信息
     ☐ 搜索广州特色美食和推荐餐厅
     ☐ 优化每日行程安排
     ☐ 创建travel.html可视化攻略文件

● amap-sse - maps_geo (MCP)(address: "广州塔", city: "广州")
  ⎿  {
       "results": [
         {
     … +13 lines (ctrl+r to expand)

● amap-sse - maps_geo (MCP)(address: "陈家祠", city: "广州")
  ⎿  {
       "results": [
         {
     … +13 lines (ctrl+r to expand)

● amap-sse - maps_geo (MCP)(address: "沙面岛", city: "广州")
  ⎿  {
       "results": [
         {
     … +13 lines (ctrl+r to expand)

● amap-sse - maps_geo (MCP)(address: "珠江夜游", city: "广州")
  ⎿  {
       "results": [
         {
     … +13 lines (ctrl+r to expand)

  amap-sse - maps_geo (MCP)(address: "白云山", city: "广州")
  ⎿  {
       "results": [
         {
     … +37 lines (ctrl+r to expand)

● amap-sse - maps_text_search (MCP)(keywords: "广州塔", city: "广州")
  ⎿  {
       "suggestion": {
         "keywords": "",
     … +147 lines (ctrl+r to expand)

● amap-sse - maps_text_search (MCP)(keywords: "陈家祠", city: "广州")
  ⎿  {
       "suggestion": {
         "keywords": "",
     … +148 lines (ctrl+r to expand)

● amap-sse - maps_text_search (MCP)(keywords: "长隆欢乐世界", city: "广州")
  ⎿  {
       "suggestion": {
         "keywords": "",
     … +147 lines (ctrl+r to expand)

● amap-sse - maps_text_search (MCP)(keywords: "中山纪念堂", city: "广州")
  ⎿  {
       "suggestion": {
         "keywords": "",
     … +148 lines (ctrl+r to expand)

  amap-sse - maps_text_search (MCP)(keywords: "北京路步行街", city: "广州")
  ⎿  {
       "suggestion": {
         "keywords": "",
     … +147 lines (ctrl+r to expand)

● 现在我需要搜索更多广州美食的信息：

● amap-sse - maps_text_search (MCP)(keywords: "广州早茶", city: "广州")
  ⎿  {
       "suggestion": {
         "keywords": "",
     … +148 lines (ctrl+r to expand)

● amap-sse - maps_text_search (MCP)(keywords: "广州烧鹅", city: "广州")
  ⎿  {
       "suggestion": {
         "keywords": "",
     … +42 lines (ctrl+r to expand)

● amap-sse - maps_text_search (MCP)(keywords: "陶陶居", city: "广州")
  ⎿  {
       "suggestion": {
         "keywords": "",
     … +147 lines (ctrl+r to expand)

  amap-sse - maps_text_search (MCP)(keywords: "点都德", city: "广州")
  ⎿  {
       "suggestion": {
         "keywords": "",
     … +147 lines (ctrl+r to expand)

  Update Todos
  ⎿  ☒ 获取8月20-25日广州天气预报
     ☒ 规划武汉到广州高铁行程
     ☒ 研究广州主要景点及门票信息
     ☒ 搜索广州特色美食和推荐餐厅
     ☐ 优化每日行程安排
     ☐ 创建travel.html可视化攻略文件

● 现在我将创建详细的广州五日旅行攻略HTML文件，包含地图路线展示：

● Write(travel.html)
  ⎿  Wrote 1 lines to travel.html
     <!DOCTYPE html>
     <html lang="zh-CN">
     <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width,
     initial-scale=1.0">
         <title>广州五日深度游攻略</title>
         <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/
     6.0.0/css/all.min.css" rel="stylesheet">
● Update Todos
  ⎿  ☒ 获取8月20-25日广州天气预报
     ☒ 规划武汉到广州高铁行程
     ☒ 研究广州主要景点及门票信息
     ☒ 搜索广州特色美食和推荐餐厅
     ☒ 优化每日行程安排
     ☒ 创建travel.html可视化攻略文件

● 完成！我已经为您创建了一份详细的广州五日旅行攻略，包含以下特色：

  🎯 攻略亮点：
  - ✅
  完整路线地图：点击攻略中的「查看位置」按钮即可在高德地图中查看详细路线
  - ✅ 可视化日程：每天详细行程、时间、地点、费用一目了然
  - ✅ 天气适配：针对8月广州炎热多雨天气的具体建议
  - ✅ 美食全收录：陶陶居、点都德、莲香楼等地道美食推荐
  - ✅ 交通住宿：武汉-广州高铁、地铁线路、住宿区域详解
  - ✅ 预算透明：总费用3245-3945元的详细构成

  📱 使用方法：
  1. 直接打开：travel.html文件在手机或电脑上直接打开即可使用
  2. 交互体验：点击路线链接将跳转到高德地图查看详细导航
  3. 收藏保存：可收藏此HTML文件作为旅行随身携带的电子攻略

  🚄 往返安排：
  - 去程：8月20日武汉站高铁直达广州南站
  - 返程：8月25日下午13:00从广州南返程武汉

  所有信息已整合到交互式网页中，可直接使用！！
```

效果如下
https://coding-w.github.io/note/

---

## 四、Claude Code 使用技巧

### 1. 善用上下文

Claude Code 支持读取当前目录的全部代码，所以建议**在项目根目录启动**，这样它能更准确理解依赖关系。

### 2. 分步描述复杂任务

如果任务过大，建议分解成多个小步骤，让 Claude Code 逐步完成，减少错误率。

### 3. 结合 Git 分支保护

让 AI 提交代码前先切到新分支，避免直接污染主分支。

```bash
cc> 创建一个 feature/refactor-user-service 分支并在此修改
```

### 4. 配合终端命令

Claude Code 可以直接执行命令，例如运行测试、查看日志：

```bash
cc> 运行 mvn test 并分析失败原因
```

### 5. 使用 MCP（Model Context Protocol）

Claude Code 支持通过 MCP 连接外部服务，比如 Google Drive、Jira、Slack，这意味着你可以：

- 自动更新 Jira 任务状态
- 从 Google Docs 中读取设计文档
- 在 Slack 发消息通知团队

---

## 五、Claude Code 的优缺点

### 优点

- **全局理解**：跨文件、跨模块修改无压力
- **命令执行能力**：不仅能写，还能跑
- **多语言支持**：对后端、前端、脚本都适配
- **扩展性强**：MCP 能接入外部数据和服务

### 缺点

- **需要订阅**（Pro/Max 付费）
- **依赖云端**，无法完全本地化部署
- **仍需人工审查**，AI 代码并非总是最佳实践
- **资源消耗**，token消耗巨大

---

## 六、总结

Claude Code 是一种全新的 AI 编程范式——
它不只是**帮你写几行代码**，而是可以**帮你完成一个完整的开发任务**。
如果你习惯在终端工作，或者希望 AI 能接管更多繁琐步骤，Claude Code 值得一试。

> 用 AI 写代码不是目的，而是让你有更多时间去思考架构、优化设计、学习新技术。
> Claude Code，就是你在命令行里的“超级搭档”。

---

💬 **你用过 Claude Code 吗？你觉得它能取代 IDE 内的 AI 助手吗？欢迎留言交流！**
