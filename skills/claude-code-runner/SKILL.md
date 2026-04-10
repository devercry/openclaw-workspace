# claude-code-runner 技能

通过 OpenClaw 调用 Claude Code CLI 执行任务。

## 触发条件

当用户请求使用 Claude Code、claude-code、或让 Claude 执行编程任务时触发。

## 用法

### 基础用法
```bash
openclaw claude-code run "<任务描述>"
```

### 执行 Shell 命令
```bash
openclaw claude-code exec "<命令>"
```

## 配置

Claude Code 配置文件：`~/.claude/settings.json`

```json
{
  "hooks": {
    "command": {
      "claude-code": "openclaw claude-code $@"
    }
  },
  "env": {
    "CLAUDE_CODE_USE_OPENAI": "1",
    "OPENAI_BASE_URL": "https://coding.dashscope.aliyuncs.com/v1",
    "OPENAI_MODEL": "qwen3.5-plus"
  }
}
```

## 环境变量

- `OPENAI_API_KEY` - API Key（从 easier-claude-cli/start-aliyun.sh 获取）
- `OPENAI_BASE_URL` - 阿里云百炼 API 端点
- `OPENAI_MODEL` - 模型名称（qwen3.5-plus）

## 示例任务

- 生成 PPT：`openclaw claude-code run "用 python-pptx 生成公司介绍 PPT"`
- 编写代码：`openclaw claude-code run "创建一个 Python 脚本处理 CSV 文件"`
- 代码审查：`openclaw claude-code run "审查这个文件的安全问题"`

## 注意事项

1. 确保已安装 `@anthropic-ai/claude-code`
2. 配置好 API Key（阿里云或其他 OpenAI-compatible 服务）
3. 任务描述要清晰具体
