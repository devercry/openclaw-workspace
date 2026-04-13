# 🔑 Google AI Pro API Key 配置指南

## 1. 获取 API Key

### 方式 A: Google AI Studio（推荐）
1. 访问：https://aistudio.google.com/apikey
2. 用你的 **Google AI Pro 账号**登录
3. 点击 **"Create API Key"**
4. 选择项目（或创建新项目）
5. 复制 API Key（格式如：`AIzaSy...`）

### 方式 B: Google Cloud Console
1. 访问：https://console.cloud.google.com/apis/credentials
2. 创建或选择项目
3. 点击 **"Create Credentials"** → **"API Key"**
4. 复制 API Key

---

## 2. 配置到 OpenClaw

### 方法 1: 直接编辑配置文件

```bash
# 编辑 OpenClaw 配置
nano /home/tenbox/.openclaw/openclaw.json
```

找到 `YOUR_GEMINI_API_KEY_HERE`，替换为你的真实 API Key：

```json
"google": {
  "apiKey": "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
```

### 方法 2: 使用环境变量（推荐）

```bash
# 添加到 ~/.bashrc 或 ~/.profile
export GEMINI_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# 或者创建 .env 文件
echo "GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" >> /home/tenbox/.openclaw/.env
```

---

## 3. 重启 OpenClaw

```bash
# 重启 Gateway
openclaw gateway restart
```

---

## 4. 使用 Google AI Pro

### 在 OpenClaw 中使用

配置完成后，可以在 OpenClaw 中指定使用 Gemini 模型：

```
/model google/gemini-1.5-pro
```

或者在配置中设置默认模型：

```json
"agents": {
  "defaults": {
    "model": {
      "primary": "google/gemini-1.5-pro"
    }
  }
}
```

### 使用场景

| 任务 | 推荐模型 |
|------|----------|
| 复杂推理 | `gemini-1.5-pro` |
| 长文档分析（>100K tokens）| `gemini-1.5-pro` |
| 快速响应 | `gemini-1.5-flash` |
| 图片理解 | `gemini-1.5-pro` |
| 代码生成 | `gemini-1.5-pro` |

---

## 5. 测试配置

```bash
# 测试 API Key 是否有效
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

成功响应示例：
```json
{
  "candidates": [
    {
      "content": {
        "parts": [{"text": "Hello! How can I help you?"}]
      }
    }
  ]
}
```

---

## 6. 定价信息

**Google AI Pro API 定价**（截至 2026 年 4 月）：

| 模型 | 输入 | 输出 |
|------|------|------|
| Gemini 1.5 Pro | $1.25 / 1M tokens | $5.00 / 1M tokens |
| Gemini 1.5 Flash | $0.075 / 1M tokens | $0.30 / 1M tokens |

**注意：**
- Google AI Pro 订阅 **不包含** API 调用
- API 调用按用量单独计费
- 免费额度：每月 100 万 tokens（Gemini 1.5 Flash）

---

## 7. 常见问题

### Q: Google AI Pro 订阅和 API 是什么关系？
**A:** 
- **Google AI Pro 订阅** = 网页版 Gemini Advanced 无限制使用
- **API** = 编程调用，按用量付费
- 两者独立计费

### Q: 可以用订阅的额度抵扣 API 吗？
**A:** 不可以。订阅只用于网页版。

### Q: 推荐用哪个？
**A:**
- 日常对话/写作 → **网页版**（包含在订阅中）
- 自动化脚本/集成 → **API**（按用量付费）

---

## 8. 下一步

1. **获取 API Key** - 访问 https://aistudio.google.com/apikey
2. **替换配置** - 将 `YOUR_GEMINI_API_KEY_HERE` 替换为真实 Key
3. **重启 OpenClaw** - `openclaw gateway restart`
4. **测试使用** - `/model google/gemini-1.5-pro`

---

**需要我帮你做什么？** 🐾
