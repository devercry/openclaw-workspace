# 飞书机器人设置指南

## 概述

飞书（Feishu/Lark）是字节跳动推出的企业协作平台，非常适合在中国使用。相比 QQ，飞书提供更完善的机器人 API 支持。

## 设置步骤

### 第一步：创建飞书应用

1. 访问 [飞书开放平台](https://open.feishu.cn/app)
2. 点击 **创建企业自建应用**
3. 填写应用名称（如 "AI 助手"）
4. 选择应用图标

### 第二步：获取凭证

在 **凭证与基础信息** 页面，复制：
- **App ID**（格式：`cli_xxx`）
- **App Secret**

### 第三步：配置权限

在 **权限管理** 中，点击 **批量开通权限**，添加以下权限：

```json
{
  "scopes": {
    "tenant": [
      "im:message",
      "im:message:readonly",
      "im:message:send_as_bot",
      "im:chat:readonly",
      "im:chat.members:bot_access"
    ]
  }
}
```

### 第四步：启用机器人能力

1. 进入 **应用能力** → **机器人**
2. 启用机器人能力
3. 设置机器人名称

### 第五步：配置事件订阅

1. 进入 **事件与回调**
2. 选择 **使用长连接接收事件**（WebSocket 模式）
3. 添加事件：`im.message.receive_v1`

⚠️ **注意**：确保 Gateway 正在运行，否则长连接设置无法保存。

### 第六步：发布应用

1. 进入 **版本管理与发布**
2. 创建版本并提交审核
3. 等待管理员批准

## 配置 OpenClaw

### 方法 1：使用向导

```bash
openclaw channels add
```

选择 **Feishu**，然后输入 App ID 和 App Secret。

### 方法 2：直接编辑配置

编辑 `~/.openclaw/openclaw.json`，添加：

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "domain": "feishu",
      "connectionMode": "websocket",
      "dmPolicy": "pairing",
      "accounts": {
        "main": {
          "appId": "cli_xxxxxxxxxxxx",
          "appSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
          "botName": "AI 助手"
        }
      }
    }
  }
}
```

## 启动 Gateway

```bash
# 检查状态
openclaw gateway status

# 启动 Gateway
openclaw gateway

# 查看日志
openclaw logs --follow
```

## 配对

首次在飞书中与机器人对话时，会收到一个配对码。在终端中批准：

```bash
openclaw pairing approve feishu <配对码>
```

## 常用命令

在飞书中发送以下命令：

- `/status` - 查看机器人状态
- `/reset` - 重置对话
- `/model` - 切换模型

## 故障排除

### 机器人不回复

1. 检查 Gateway 是否运行：`openclaw gateway status`
2. 查看日志：`openclaw logs --follow`
3. 确认应用已发布并获批准
4. 确认事件订阅包含 `im.message.receive_v1`

### 群聊中无响应

1. 确保机器人已加入群组
2. 确保 @ 提及了机器人（默认需要）
3. 检查 `groupPolicy` 设置

## 获取 ID

### 用户 ID (open_id)

格式：`ou_xxx`

方法：
1. 向机器人发送私信
2. 运行 `openclaw logs --follow`
3. 在日志中查找 `open_id`

### 群组 ID (chat_id)

格式：`oc_xxx`

方法：
1. 在群中 @ 提及机器人
2. 运行 `openclaw logs --follow`
3. 在日志中查找 `chat_id`

## 参考

- [飞书开放平台](https://open.feishu.cn/)
- [OpenClaw 飞书文档](https://docs.openclaw.ai/zh-CN/channels/feishu)
