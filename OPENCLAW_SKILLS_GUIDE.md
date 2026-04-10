# 🐾 OpenClaw 技能使用指南

**给 Claude Code 的快速参考**

---

## 📌 核心技能

### 1. PPT 生成技能

**位置：** `skills/ai-ppt-generator/`

**快速使用：**
```bash
cd /home/tenbox/.openclaw/workspace
python3 scripts/generate-xdzn-ppt.py
```

**参考脚本：** `scripts/generate-xdzn-ppt.py`（芯动智能科技 PPT 示例）

**创建新 PPT 的步骤：**
1. 复制参考脚本：`cp scripts/generate-xdzn-ppt.py scripts/generate-my-ppt.py`
2. 修改内容（公司名称、页面内容等）
3. 运行：`python3 scripts/generate-my-ppt.py`

---

### 2. QQ Bot 发送技能

**技能名：** `qqbot-media`

**发送文件格式：**
```
<qqmedia>/绝对路径/文件.pptx</qqmedia>
```

**发送消息到 QQ：**
- 目标格式：`qqbot:c2c:openid`
- 示例：`qqbot:c2c:3D7DB2E05FFF9FB7F1C59A8EF7110882`

**注意事项：**
- 文件大小上限 10MB
- 路径必须是绝对路径
- 需要 IP 白名单配置（服务器出口 IP: 172.104.164.40）

---

### 3. 技术新闻摘要

**技能名：** `tech-news-digest`

**运行方式：**
```bash
# 快速版（5 源）
./scripts/daily-news.sh

# 完整版（6 源 + Web Search）
./scripts/daily-news-full.sh
```

**输出位置：** `memory/daily-news-YYYY-MM-DD.md`

---

### 4. 自我进化系统

**技能名：** `self-improving-agent`

**记录错误：** `.learnings/ERRORS.md`
```markdown
## 错误记录
- 时间：2026-04-10 10:00
- 命令：xxx
- 错误：xxx
- 解决方案：xxx
```

**记录经验：** `.learnings/LEARNINGS.md`
```markdown
## 最佳实践
- 场景：xxx
- 方法：xxx
- 效果：xxx
```

---

## 🔧 工具脚本

| 脚本 | 用途 |
|------|------|
| `scripts/daily-news.sh` | 技术新闻摘要（快速） |
| `scripts/daily-news-full.sh` | 技术新闻摘要（完整） |
| `scripts/generate-xdzn-ppt.py` | PPT 生成示例 |
| `scripts/generate-6dof-ppt.py` | 6DoF PPT 生成 |

---

## 📁 重要目录

```
/home/tenbox/.openclaw/workspace/
├── skills/              # 技能目录
│   ├── ai-ppt-generator/
│   ├── qqbot/
│   ├── tech-news-digest/
│   └── ...
├── scripts/             # 工具脚本
├── memory/              # 每日记忆
├── .learnings/          # 错误和经验记录
├── MEMORY.md            # 核心记忆
└── SOUL.md              # 身份定义
```

---

## 🚀 OpenClaw CLI 命令

```bash
# 系统状态
openclaw status

# 插件列表
openclaw plugins list

# 调用 Claude Code
openclaw claude-code run "任务描述"

# Git 备份
cd /home/tenbox/.openclaw/workspace
git add -A && git commit -m "Backup $(date +%Y-%m-%d)" && git push
```

---

## 💡 典型工作流

### PPT 生成 + 发送 QQ
```bash
# 1. 生成 PPT
python3 scripts/generate-my-ppt.py

# 2. 发送 QQ（在消息中）
这是你要的 PPT：<qqmedia>/home/tenbox/.openclaw/workspace/my-ppt.pptx</qqmedia>
```

### 新闻摘要 + 记录
```bash
# 1. 运行摘要
./scripts/daily-news-full.sh

# 2. 自动记录到 memory/daily-news-YYYY-MM-DD.md
```

### 错误处理
```bash
# 遇到错误时
echo "## $(date): 错误描述" >> .learnings/ERRORS.md
```

---

## 📞 资源配置

- **完整技能索引：** `skills/OPENCLAW_SKILLS_INDEX.md`
- **OpenClaw 文档：** `docs/` 或 https://docs.openclaw.ai
- **技能市场：** https://clawhub.ai

---

**最后更新：** 2026-04-10  
**维护：** 小爪 🐾
