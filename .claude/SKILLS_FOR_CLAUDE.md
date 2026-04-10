# OpenClaw Skills for Claude Code

**这是 OpenClaw 的技能清单，供 Claude Code 参考使用。**

---

## 🎯 常用技能（推荐优先使用）

### 1. PPT 生成
**技能：** `ai-ppt-generator`  
**脚本：** `scripts/generate-xdzn-ppt.py`  
**用法：**
```bash
cd /home/tenbox/.openclaw/workspace
python3 scripts/generate-xdzn-ppt.py
```
**输出：** `/home/tenbox/.openclaw/workspace/芯动智能科技公司介绍.pptx`

### 2. QQ 发送文件
**技能：** `qqbot-media`  
**格式：** 在消息中使用 `<qqmedia>文件路径</qqmedia>` 标签  
**示例：**
```
这是文件：<qqmedia>/home/tenbox/Desktop/文件.pptx</qqmedia>
```

### 3. 技术新闻摘要
**技能：** `tech-news-digest`  
**脚本：** `scripts/daily-news-full.sh`  
**用法：**
```bash
cd /home/tenbox/.openclaw/workspace
./scripts/daily-news-full.sh
```

### 4. 文档处理
**技能：** `document-pro`  
**用途：** PDF/DOCX/PPT内容提取和分析

---

## 🛠️ 开发工具

### GitHub 操作
```bash
gh issue list          # 查看 issues
gh pr list             # 查看 PRs
gh run list            # 查看 CI runs
```

### 搜索
- Tavily API 用于 AI 优化搜索
- 普通 web 搜索用 `web_search` 工具

---

## 📁 重要路径

| 用途 | 路径 |
|------|------|
| 工作区 | `/home/tenbox/.openclaw/workspace` |
| 技能 | `/home/tenbox/.openclaw/workspace/skills/` |
| 脚本 | `/home/tenbox/.openclaw/workspace/scripts/` |
| 记忆 | `/home/tenbox/.openclaw/workspace/memory/` |
| 学习记录 | `/home/tenbox/.openclaw/workspace/.learnings/` |

---

## 🔧 OpenClaw 命令

```bash
openclaw status              # 系统状态
openclaw plugins list        # 插件列表
openclaw claude-code run "任务"  # 执行任务
```

---

## 💡 最佳实践

1. **PPT 生成** - 优先使用 `python-pptx` 脚本，快速可靠
2. **QQ 发送** - 使用 `<qqmedia>` 标签，文件必须是绝对路径
3. **错误记录** - 遇到错误时记录到 `.learnings/ERRORS.md`
4. **经验积累** - 发现好方法记录到 `.learnings/LEARNINGS.md`

---

**完整技能文档：** `/home/tenbox/.openclaw/workspace/skills/OPENCLAW_SKILLS_INDEX.md`
