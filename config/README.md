# OpenClaw 配置备份

## 需要配置的文件

| 文件 | 目标位置 | 说明 |
|------|----------|------|
| `openclaw.json` | `~/.openclaw/openclaw.json` | 主配置文件 |
| `gh-hosts.yml` | `~/.config/gh/hosts.yml` | GitHub CLI 认证 |

## 需要替换的占位符

- `YOUR_API_KEY_HERE` - TenBox API Key
- `YOUR_DASHSCOPE_API_KEY_HERE` - DashScope API Key (kimi-k2.5)
- `YOUR_TAVILY_API_KEY_HERE` - Tavily API Key
- `YOUR_MATON_API_KEY_HERE` - Maton API Key
- `YOUR_GATEWAY_TOKEN_HERE` - Gateway Token

## GitHub CLI 配置

```yaml
# ~/.config/gh/hosts.yml
github.com:
    oauth_token: YOUR_GITHUB_TOKEN
    user: YOUR_USERNAME
    git_protocol: https
```
