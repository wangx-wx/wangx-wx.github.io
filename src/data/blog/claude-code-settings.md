---
title: "同时开三个终端跑三个模型，Claude Code 也能做到"
pubDatetime: 2026-06-07T21:40:35+08:00
author: "wx"
description: "用不了官方 Anthropic，手上攒了 GLM、DeepSeek、mimo 一堆 key，想多开几个终端跑同一任务对比模型，却发现 Claude Code 配置是全局的——改一处全变，cc-switch 也救不了，它改的还是那份全局 settings.json。"
draft: false
tags:
  - AI
  - Claude-Code
---

![三个终端，三个模型，各跑各的](/images/posts/4d1ae67038b9/img_01_4a47a0db.png)

---

我用不了官方的 Anthropic，跟不少人一样靠中转和国内模型撑着——GLM、DeepSeek、小米 mimo，手上攒了一堆供应商的 key。

前几天想干件简单的事：开三个终端窗口，让这三个模型跑同一个任务，对比谁写得好。

结果发现做不到。Claude Code 的模型配置是全局的，我在一个地方改完，三个窗口齐刷刷全变成同一个模型。

![一处改完，三个窗口齐刷刷全变](/images/posts/4d1ae67038b9/img_02_fb5c81ed.png)

折腾到最后，我干脆把模型配置从 `~/.claude/settings.json` 里删了，改用环境变量管。几十行脚本，现在每个终端各跑各的，互不干扰。

这篇就讲这个脚本怎么一步步逼出来的——还有那条让我栽过一次的配置优先级。

## 先搞清楚：配模型有两个地方，谁说了算

Claude Code 设模型，常见就两个地方。

一是 shell 环境变量，在 `~/.zshrc` 里 export：

```bash
export ANTHROPIC_AUTH_TOKEN='你的key'
export ANTHROPIC_BASE_URL='https://你的中转地址/api'
export ANTHROPIC_MODEL='GLM-5.1'
```

二是 `~/.claude/settings.json` 的 `env` 块：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "你的key",
    "ANTHROPIC_BASE_URL": "https://你的中转地址/api",
    "ANTHROPIC_MODEL": "GLM-5.1"
  }
}
```

坑就在这：两个地方都写了同名变量时，**settings.json 的 `env` 会赢**。

我当时在 `.zshrc` 里改了半天 `ANTHROPIC_MODEL`，重开终端死活不生效，查到最后才发现是 settings.json 在背后压着。

这不是 bug，是优先级。官方文档对 `env` 字段的说法是它会被 "applied to every session"——Claude Code 每次启动都把 `env` 块里的变量灌进当前 session，自然就盖过了你从 shell 继承的同名值。

记住这条：**settings.json 的 `env` > shell 环境变量。** 后面整个方案都踩在它上面——想让 shell 说了算，第一步就得把 settings.json 里的模型配置清空。

## 第一版：写个脚本改 settings.json

切模型这事，社区有现成工具——cc-switch、claude-code-router 都行。但我翻了下原理，它们核心也是帮你改 `~/.claude/settings.json`。

原理这么简单，我就懒得多装个工具，自己写了几十行 shell + jq：菜单里选供应商，jq 把对应的 token / url / model 写进 settings.json。

```bash
jq --arg token "$token" --arg url "$url" --arg model "$model" \
   '.env.ANTHROPIC_AUTH_TOKEN = $token |
    .env.ANTHROPIC_BASE_URL   = $url   |
    .env.ANTHROPIC_MODEL      = $model' \
   "$SETTINGS_PATH" > "$tmp" && mv "$tmp" "$SETTINGS_PATH"
```

能用。但用着用着撞上两堵墙。

第一堵：不同供应商要配的字段不一样多。比如小米 mimo，光设一个 `ANTHROPIC_MODEL` 不够，得把 sonnet、opus、haiku 三档默认模型都指过去，不然 Claude Code 切到某一档时找不到模型：

```json
{
  "env": {
    "ANTHROPIC_MODEL": "mimo-v2.5-pro",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "mimo-v2.5-pro",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "mimo-v2.5-pro",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "mimo-v2.5-pro"
  }
}
```

脚本于是越写越长。这个还能忍。

第二堵忍不了，正好撞回开头那个需求：settings.json 是一份全局文件，改它等于动全局——所有终端，包括已经开着的，全跟着变。我那个「三个终端跑三个模型」的对比，这方案从根上做不到。

## 第二版：把配置挪进环境变量

撞墙之后我才想通一件事：

settings.json 是全局的，而 shell 环境变量天生就是**每个终端各一份**。我要的隔离，环境变量本来就自带。

思路于是反过来——把模型配置从 settings.json 里彻底删掉，改用环境变量管。

但有个前提，正是前面那条优先级：只要 settings.json 的 `env` 里还留着 `ANTHROPIC_MODEL` 这些键，它就会盖过我 shell 里的值。**所以第一步，是把 settings.json 里的模型配置清空。**

清空之后，整套配置变成两层：

**第一层，全局默认。** 在 `~/.zshrc` 里 export 一套日常默认（比如默认 GLM）。新开任何终端都自动继承——开箱即用，零操作。「配一次永久能用」的便利，我一点没丢。

**第二层，临时覆盖。** 只有某个终端想换模型对比时，才在那个终端跑一下 `ccs` 选别的供应商。它只作用于当前这个 shell；隔壁终端照旧是默认的 GLM，关掉这个终端，下次新开又回默认。

实现上有两个关键设计，是这脚本的精髓：

**一是为什么要用 `eval`。** 脚本跑在子进程里，子进程里 export 的变量影响不到启动它的父终端。所以 ccs 不自己 export，而是把 export 语句**打印出来**，再靠 `.zshrc` 里一个外壳函数让父终端去 eval 执行：

```bash
ccs() { eval "$(~/.claude/ccs.sh "$@")"; }
```

这样变量才真正落进你当前的终端。

**二是为什么切换前先 `unset`。** 每个供应商需要的变量集不一样——mimo 要设 sonnet/opus/haiku 三档，glm 不用。不先清场，上一个供应商残留的变量会污染下一个。所以脚本吐出新配置前，先把相关变量统一 unset：

```bash
unset ANTHROPIC_AUTH_TOKEN ANTHROPIC_BASE_URL ANTHROPIC_MODEL \
      ANTHROPIC_DEFAULT_HAIKU_MODEL ANTHROPIC_DEFAULT_SONNET_MODEL \
      ANTHROPIC_DEFAULT_OPUS_MODEL
```

一句话概括这版跟 cc-switch / CCR 的区别：**它们是改全局、所有终端跟着变；ccs 是全局给个兜底默认，按需在单个终端临时盖掉。**

![左：改全局，所有终端联动；右：用环境变量，各终端独立](/images/posts/4d1ae67038b9/img_03_10fb15c7.png)

## 30 秒看一眼

开两个终端。

终端 A 跑 `ccs` 切到 mimo，终端 B 保持默认（我这台默认走中转的 opus）。两边各跑一下 `ccs --show`：

左边是 `mimo-v2.5-pro`，右边是 `opus`，两套配置同时活着，互不干扰。

接下来让两个窗口跑同一个任务，就能直接对比了。

![左终端切到 mimo，右终端是默认的 opus，两套配置同时活着](/images/posts/4d1ae67038b9/img_04_e160d314.png)

## 我的评价：什么时候值得这么干

先说我为什么留着它：

- **零额外依赖。** 就是一个 shell 脚本，不装 GUI、不跑常驻服务。
- **终端级隔离。** 这是 cc-switch、CCR 给不了的——它们都在改那份全局配置。
- **完全可控。** 配置逻辑就在我自己那几十行里，加供应商、改字段，自己动手，不用猜工具的行为。

但它绝不是没缺点，几个得说清楚：

- **token 是明文写在脚本里的。** 所以这脚本只能自己用，别提交到公开仓库，也别随手发群里。
- **`eval "$(...)"` 这种写法，不熟 shell 的人会犯怵**——你是在执行一段脚本动态生成的命令，得看懂它在干嘛才敢用。
- **它只是「切配置」，没有 claude-code-router 那种请求级路由、负载均衡、按场景自动分发模型的能力。** 要那些，老实用 CCR。
- **我只在 macOS + zsh 上跑过。** 脚本里用了 zsh 的关联数组语法（`declare -A`、`${=conf}`），bash 用户得自己改。

适合谁：手上有多个国内模型 / 中转 key、要多窗口并行对比、又愿意自己掌控配置的人。

不适合谁：只用一个固定供应商的——settings.json 配一次就够，没必要折腾；想要图形界面、开箱即用的——直接装 cc-switch 更省心。

完整脚本贴在文末，复制下去把 `ENVS` 换成你自己的 key 就能用。

你现在怎么管 Claude Code 的多模型配置？还在用 cc-switch，还是也踩过全局配置的坑？评论区聊聊你的方案。

---

- 核心字数：约 1900 字（不含文末脚本）
- 这不是开源项目，是我自己日常在用的脚本，完整版见下方；公众号排版时这段较长，可折叠或放到「阅读原文」
- 想要 bash 版本、或想加更多供应商，在 `ENVS` 数组上改即可

**完整脚本 `~/.claude/ccs.sh`：**

```bash
#!/bin/zsh
# ===========================================
# Claude Code environment switcher
# 在 ~/.zshrc 中添加：
#   ccs() { eval "$(~/.claude/ccs.sh "$@")"; }
# 使用：ccs（交互菜单）/ ccs --show（查看当前）
# ===========================================

# ---------- 所有可能的环境变量，切换时统一 unset ----------
ALL_VARS=(
    ANTHROPIC_AUTH_TOKEN
    ANTHROPIC_BASE_URL
    ANTHROPIC_MODEL
    ANTHROPIC_DEFAULT_HAIKU_MODEL
    ANTHROPIC_DEFAULT_SONNET_MODEL
    ANTHROPIC_DEFAULT_OPUS_MODEL
    ANTHROPIC_REASONING_MODEL
)

# ---------- 配置字段 → 环境变量名映射 ----------
declare -A KEY_TO_VAR
KEY_TO_VAR[token]=ANTHROPIC_AUTH_TOKEN
KEY_TO_VAR[url]=ANTHROPIC_BASE_URL
KEY_TO_VAR[model]=ANTHROPIC_MODEL
KEY_TO_VAR[haiku]=ANTHROPIC_DEFAULT_HAIKU_MODEL
KEY_TO_VAR[sonnet]=ANTHROPIC_DEFAULT_SONNET_MODEL
KEY_TO_VAR[opus]=ANTHROPIC_DEFAULT_OPUS_MODEL
KEY_TO_VAR[reasoning]=ANTHROPIC_REASONING_MODEL

# ---------- 供应商配置（按需填写 key=value，token 换成你自己的） ----------
declare -A ENVS
ENVS[glm]="name=Zhipu GLM   token=<你的GLM-KEY>   url=https://open.bigmodel.cn/api/anthropic   model=GLM-5.1"
ENVS[ds]="name=deepseek   token=<你的DEEPSEEK-KEY>   url=https://api.deepseek.com/anthropic   model=deepseek-v4-pro[1m] haiku=deepseek-v4-flash sonnet=deepseek-v4-pro[1m] opus=deepseek-v4-pro[1m]"
ENVS[mimo]="name=mimo   token=<你的MIMO-KEY>   url=https://token-plan-cn.xiaomimimo.com/anthropic   model=mimo-v2.5-pro haiku=mimo-v2.5-pro sonnet=mimo-v2.5-pro opus=mimo-v2.5-pro"

# ---------- 菜单顺序 ----------
MENU_KEYS=(glm ds mimo)

# ---------- 输出 export 语句（被父 shell eval 执行） ----------
emit_env() {
    local key="$1"
    local conf="${ENVS[$key]}"

    if [[ -z "$conf" ]]; then
        echo "echo '未知环境：$key'" >&2
        return 1
    fi

    local name=""

    # 先 unset 全部
    echo "unset ${ALL_VARS[*]}"

    # 解析 k=v 逐个 export
    for pair in ${=conf}; do
        local k="${pair%%=*}"
        local v="${pair#*=}"
        if [[ "$k" == "name" ]]; then
            name="$v"
        elif [[ -n "${KEY_TO_VAR[$k]}" ]]; then
            echo "export ${KEY_TO_VAR[$k]}='$v'"
        fi
    done

    # 提示信息走 stderr，不被 eval 捕获
    echo "" >&2
    echo "Switched to: [$key] - $name" >&2
    echo "" >&2
    # 打印生效的变量
    for pair in ${=conf}; do
        local k="${pair%%=*}"
        local v="${pair#*=}"
        [[ "$k" == "name" || "$k" == "token" ]] && continue
        [[ -n "${KEY_TO_VAR[$k]}" ]] && \
            printf "  %-12s = %s\n" "$k" "$v" >&2
    done
    echo "" >&2
}

# ---------- 查看当前环境变量 ----------
show_current() {
    echo "" >&2
    echo "Current env vars:" >&2
    for var in "${ALL_VARS[@]}"; do
        local val="${(P)var}"
        # token 只显示前6位
        if [[ "$var" == "ANTHROPIC_AUTH_TOKEN" && -n "$val" ]]; then
            val="${val:0:6}******"
        fi
        printf "  %-40s %s\n" "$var" "${val:-(not set)}" >&2
    done
    echo "" >&2
}

# ---------- 交互菜单 ----------
show_menu() {
    echo "" >&2
    echo "===========================================" >&2
    echo "     Claude Code Model Switcher" >&2
    echo "===========================================" >&2
    local i=1
    for k in "${MENU_KEYS[@]}"; do
        local conf="${ENVS[$k]}"
        local name=""
        for pair in ${=conf}; do
            [[ "${pair%%=*}" == "name" ]] && name="${pair#*=}" && break
        done
        printf "  [%d] %s\n" $i "$name" >&2
        (( i++ ))
    done
    echo "  [8] Show current" >&2
    echo "  [0] Exit" >&2
    echo "===========================================" >&2
}

# ---------- 入口 ----------
case "$1" in
    --show)
        show_current
        exit 0
        ;;
    "")
        show_menu
        printf "Select an option: " >&2
        read choice </dev/tty

        if [[ "$choice" == "0" ]]; then
            echo "" >&2; exit 0
        elif [[ "$choice" == "8" ]]; then
            show_current; exit 0
        elif [[ "$choice" =~ ^[1-9]$ ]] && (( choice <= ${#MENU_KEYS[@]} )); then
            emit_env "${MENU_KEYS[$choice]}"
        else
            echo "Invalid option." >&2
        fi
        ;;
    *)
        echo "用法：ccs [--show]" >&2
        exit 1
        ;;
esac
```

`.zshrc` 里再加一行，把它包成 `ccs` 命令：

```bash
ccs() { eval "$(~/.claude/ccs.sh "$@")"; }
```

之后 `ccs` 进菜单切换，`ccs --show` 看当前终端的配置。别忘了：用环境变量这套之前，先把 `~/.claude/settings.json` 里的模型配置删掉，不然它会盖过你。
