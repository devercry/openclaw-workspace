# 🤖 OpenClaw ↔ Claude Code 任务下发指南

**最后更新：** 2026-04-10  
**Claude Code 版本：** 2.1.98

---

## ✅ 当前状态

| 组件 | 状态 | 位置 |
|------|------|------|
| Claude Code CLI | ✅ 已安装 | `/home/tenbox/.npm-global/bin/claude` |
| OpenClaw Bridge | ✅ 已配置 | `/home/tenbox/.openclaw/extensions/claude-code-bridge/` |
| Hooks 配置 | ✅ 已设置 | `~/.claude/settings.json` |
| 登录状态 | ⚠️ **需要登录** | - |

---

## 🔐 第一步：登录 Claude Code

```bash
# 运行登录命令
/home/tenbox/.npm-global/bin/claude login

# 或者
claude login
```

**登录流程：**
1. 终端会显示一个 URL
2. 在浏览器中打开该 URL
3. 用你的 Claude/Anthropic 账号登录
4. 复制授权码回终端

---

## 📤 任务下发方式

### 方式 1: OpenClaw 直接调用（推荐）

在 OpenClaw 中输入：

```
/openclaw claude-code run "<任务描述>"
```

**示例：**
```
/openclaw claude-code run "创建一个 Python 脚本，读取 CSV 并计算每列平均值"
```

---

### 方式 2: Claude Code 中使用 OpenClaw 技能

在 Claude Code 会话中：

```bash
claude -p "使用 OpenClaw 技能生成 PPT"
```

**配置说明：**
```json
// ~/.claude/settings.json
{
  "hooks": {
    "command": {
      "claude-code": "openclaw claude-code $@"
    }
  },
  "context": {
    "skills": "/home/tenbox/.openclaw/workspace/.claude/SKILLS_FOR_CLAUDE.md"
  }
}
```

---

### 方式 3: 直接命令行调用

```bash
# 单次任务
claude -p "<任务描述>"

# 指定最大轮数
claude -p "<任务描述>" --max-turns 10

# 交互式会话
claude
```

---

## 🎯 任务示例

### 示例 1: 创建 Python 脚本

```bash
claude -p "创建一个 Excel 处理脚本，功能：
1. 读取 Excel 文件
2. 用 AI 生成营销文案
3. 保存到新文件
使用阿里云 qwen3.5-plus 模型"
```

### 示例 2: 代码审查

```bash
claude -p "审查 /home/tenbox/.openclaw/workspace/scripts/excel_ai_processor.py
检查：
- 错误处理
- 代码规范
- 性能优化建议
输出 markdown 报告"
```

### 示例 3: 项目分析

```bash
claude -p "分析当前目录的项目结构
- 列出所有模块
- 绘制依赖关系
- 识别潜在问题
使用 graphify 工具辅助"
```

### 示例 4: 自动化任务

```bash
claude -p "编写一个 bash 脚本，每天 12:00 自动：
1. 备份 workspace 到 git
2. 运行自我反思
3. 发送日报到 QQ"
```

---

## 🔧 配置选项

### 模型配置

```json
// ~/.claude/settings.json
{
  "env": {
    "CLAUDE_CODE_USE_OPENAI": "1",
    "OPENAI_BASE_URL": "https://coding.dashscope.aliyuncs.com/v1",
    "OPENAI_MODEL": "qwen3.5-plus"
  }
}
```

**可用模型：**
| 模型 | 端点 | 用途 |
|------|------|------|
| `qwen3.5-plus` | 阿里云 | 代码生成、复杂任务 |
| `qwen3.5-flash` | 阿里云 | 快速响应 |
| `claude-sonnet-4` | Anthropic | 原生 Claude（需要 Anthropic API）|

---

### OpenClaw 模型切换

在 OpenClaw 中切换到 Claude Code 使用的模型：

```
/model tenbox/default  # 当前默认
```

如果要使用 Google AI Pro：

```
/model google/gemini-1.5-pro
```

---

## 📊 任务监控

### 查看运行中的任务

```bash
# 查看 Claude Code 会话
ls -la ~/.claude/sessions/

# 查看任务历史
cat ~/.claude/history.jsonl | tail -20
```

### OpenClaw 子代理

```bash
# 在 OpenClaw 中
/subagents list
```

---

## ⚠️ 注意事项

### 1. 登录要求
- Claude Code **必须登录** 才能运行
- 登录态保存在 `~/.claude.json`
- 如果失效，重新运行 `claude login`

### 2. 资源限制
- `--max-turns` 限制对话轮数（默认 10）
- 长任务建议分多次执行

### 3. 文件权限
- Claude Code 可以读写 workspace 文件
- 删除操作需要确认
- 建议使用 `trash` 而非 `rm`

### 4. API 费用
- 使用阿里云模型：按 token 计费
- 使用 Anthropic 模型：需要 Anthropic API Key
- 监控用量：`claude status`

---

## 🐛 故障排查

### 问题 1: "Not logged in"

```bash
# 解决：重新登录
claude login
```

### 问题 2: "command not found: claude"

```bash
# 解决：添加到 PATH
export PATH="/home/tenbox/.npm-global/bin:$PATH"
echo 'export PATH="/home/tenbox/.npm-global/bin:$PATH"' >> ~/.bashrc
```

### 问题 3: OpenClaw 调用失败

```bash
# 检查 Bridge 插件
ls -la /home/tenbox/.openclaw/extensions/claude-code-bridge/

# 重启 OpenClaw
openclaw gateway restart
```

### 问题 4: Hooks 不工作

```bash
# 验证配置
cat ~/.claude/settings.json

# 测试 hook
claude-code run "test"
```

---

## 📖 相关文档

- **Claude Code 官方文档：** https://docs.anthropic.com/claude-code
- **OpenClaw 技能文档：** `/home/tenbox/.openclaw/workspace/.claude/SKILLS_FOR_CLAUDE.md`
- **Bridge 插件代码：** `/home/tenbox/.openclaw/extensions/claude-code-bridge/index.js`

---

## 🚀 快速开始

```bash
# 1. 登录
claude login

# 2. 测试
claude -p "Hello, 创建一个简单的 Python Hello World 脚本"

# 3. 在 OpenClaw 中使用
/openclaw claude-code run "分析当前目录的文件结构"
```

---

**需要我帮你登录 Claude Code 吗？** 🐾
