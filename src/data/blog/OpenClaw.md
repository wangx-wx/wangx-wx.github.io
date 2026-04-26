---
title: "OpenClaw"
pubDatetime: 2026-03-01T19:52:21+08:00
author: "wx"
description: '一个多月前，一个名为"Clawbot"的开源AI工具横空出世，江湖人称小龙虾。'
draft: false
tags:
  - "others"
---

## Table of contents

# OpenClaw — 开源AI助手，用飞书就能远程操控

一个多月前，一个名为"Clawbot"的开源AI工具横空出世，江湖人称**小龙虾**。

<!-- 这是一张图片，ocr 内容为： -->

![](/images/posts/350dde76809e/img_01_308de099.png)

后来因为被Anthropic发了律师函，项目先改名为"Moltbot"，最终定名为**OpenClaw**——简洁好记，寓意不变。

官方仓库：[https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)

看看下面这条GitHub Star增长曲线，这增速已经无法用数学求导来解释了：

<!-- 这是一张图片，ocr 内容为： -->

![](/images/posts/350dde76809e/img_02_10732ba7.png)

---

# 一、安装与启动

整个安装过程只需三步：

```shell
# 1. 全局安装
npm install -g openclaw@latest

# 2. 初始化配置（需同意全部权限）
openclaw onboard --install-daemon

# 3. 启动网关服务
openclaw gateway --port 18789 --verbose
```

**安装过程截图：**

<!-- 这是一张图片，ocr 内容为： -->

![](/images/posts/350dde76809e/img_03_dc729fe9.png)

初始化时会弹出权限确认，属于"霸王条款"，必须全部同意才能使用：

<!-- 这是一张图片，ocr 内容为： -->

![](/images/posts/350dde76809e/img_04_82276f43.png)

启动成功后，就能看到OpenClaw（小龙虾）的聊天界面了：

<!-- 这是一张图片，ocr 内容为： -->

![](/images/posts/350dde76809e/img_05_411b14c4.png)

---

# 二、安装飞书插件

上面展示的是小龙虾的客户端界面。但如果能**在手机上随时随地控制这个AI助手**，体验就更好了。在国内，最方便的方式就是接入**飞书机器人**。

社区大佬开源了一个飞书连接插件：[https://github.com/m1heng/Clawdbot-feishu](https://github.com/m1heng/Clawdbot-feishu)

一开始按照官方文档手动安装，结果翻车了：

<!-- 这是一张图片，ocr 内容为： -->

![](/images/posts/350dde76809e/img_06_dc16b08f.png)

没关系，直接让OpenClaw自己来帮忙安装：

<!-- 这是一张图片，ocr 内容为： -->

![](/images/posts/350dde76809e/img_07_7e2a89e5.png)

果然，OpenClaw自己搞定了：

<!-- 这是一张图片，ocr 内容为： -->

![](/images/posts/350dde76809e/img_08_36634fb8.png)

接下来把飞书机器人的密钥发给OpenClaw，让它帮我完成配置：

<!-- 这是一张图片，ocr 内容为： -->

![](/images/posts/350dde76809e/img_09_a7497e1b.png)

配置完成：

<!-- 这是一张图片，ocr 内容为： -->

![](/images/posts/350dde76809e/img_10_0fbbe096.png)

---

# 三、配置飞书机器人

打开飞书开放平台控制台，创建一个聊天机器人应用：

[https://open.feishu.cn/app?lang=zh-CN](https://open.feishu.cn/app?lang=zh-CN)

<!-- 这是一张图片，ocr 内容为： -->

![](/images/posts/350dde76809e/img_11_9c1d195f.png)

## 设置机器人权限

<!-- 这是一张图片，ocr 内容为： -->

![](/images/posts/350dde76809e/img_12_4f85b4c8.png)

以下是**必须开启的基础权限**：

| 权限                               | 范围 | 说明                     |
| ---------------------------------- | ---- | ------------------------ |
| `im:message`                       | 消息 | 发送和接收消息           |
| `im:message.p2p_msg:readonly`      | 私聊 | 读取发给机器人的私聊消息 |
| `im:message.group_at_msg:readonly` | 群聊 | 接收群内 @机器人 的消息  |
| `im:message:send_as_bot`           | 发送 | 以机器人身份发送消息     |
| `im:resource`                      | 媒体 | 上传和下载图片/文件      |

> **提示：** 以上为基础必须权限。如果你需要文件处理、日历读取等高级功能，可能还需要额外的权限配置，具体请参考开源插件仓库的说明文档：[https://github.com/m1heng/Clawdbot-feishu](https://github.com/m1heng/Clawdbot-feishu)

## 设置事件与回调

OpenClaw插件配置完成后，还需要在飞书控制台配置事件订阅和回调地址。

**注意：事件订阅和回调都需要选择「长连接」模式，不要选择 Webhook 模式。**

<!-- 这是一张图片，ocr 内容为： -->

![](/images/posts/350dde76809e/img_13_be5e5b50.png)

---

# 四、连接成功

一切配置就绪后，飞书和OpenClaw就能正常通信了。以后在手机上发条飞书消息，就能远程操控你的AI助手：

<!-- 这是一张图片，ocr 内容为： -->

![](/images/posts/350dde76809e/img_14_23302693.jpeg)

<!-- 这是一张图片，ocr 内容为： -->

![](/images/posts/350dde76809e/img_15_8a5f6a3f.jpeg)

---

**总结：** OpenClaw + 飞书机器人的组合，让你可以随时随地通过手机与AI助手对话，无论是代码调试、文件处理还是日常问答，都能轻松搞定。感兴趣的朋友赶紧试试吧！
