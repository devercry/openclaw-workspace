# OpenClaw 配置备份

此目录包含 OpenClaw 的配置文件模板（已移除敏感信息）。

## 文件说明

| 文件 | 用途 | 目标位置 |
|------|------|----------|
| `openclaw.json` | OpenClaw 主配置 | `~/.openclaw/openclaw.json` |
| `gh-hosts.yml` | GitHub CLI 认证 | `~/.config/gh/hosts.yml` |

## 需要替换的占位符

- `YOUR_API_KEY_HERE` - TenBox API Key
- `YOUR_DASHSCOPE_API_KEY_HERE` - DashScope API Key
- `YOUR_TAVILY_API_KEY_HERE` - Tavily API Key
- `YOUR_MATON_API_KEY_HERE` - Maton API Key
- `YOUR_GATEWAY_TOKEN_HERE` - OpenClaw Gateway Token
- `YOUR_GITHUB_TOKEN_HERE` - GitHub Personal Access Token
- `YOUR_GITHUB_USERNAME` - GitHub 用户名

## 使用方法

1. 复制配置文件到对应位置
2. 替换所有占位符为实际值
3. 重启 OpenClaw
