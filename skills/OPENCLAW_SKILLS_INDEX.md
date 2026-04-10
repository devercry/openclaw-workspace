# OpenClaw 技能索引

**版本：** 2026-04-10  
**适用：** Claude Code / easier-claude-cli

---

## 📚 技能列表

### 🎨 媒体生成类

#### 1. ai-ppt-generator
- **功能：** 自动生成 PPT 演示文稿
- **位置：** `skills/ai-ppt-generator/`
- **脚本：** `scripts/generate_ppt.py`, `ppt_theme_list.py`
- **用法：**
  ```bash
  python3 scripts/generate-xdzn-ppt.py
  ```
- **依赖：** python-pptx

#### 2. google-gemini-media
- **功能：** Gemini 多模态能力（生图、Veo 视频、TTS）
- **触发：** 图片生成、视频生成、语音合成
- **相关命令：** `gemini__gemini_generate_image`

#### 3. edge-tts
- **功能：** 文本转语音（Microsoft Edge TTS）
- **支持：** 多语音、多语言、语速/音调调节
- **触发：** "tts", "语音", "朗读"

#### 4. tts-dingtalk
- **功能：** TTS + 发送到钉钉
- **触发：** 发送语音消息到钉钉

---

### 📰 内容处理类

#### 5. tech-news-digest (v3.15.0)
- **功能：** 技术新闻摘要生成
- **数据源：** RSS、Twitter/X KOLs、GitHub Releases、GitHub Trending、Reddit、Web Search
- **脚本：** `scripts/daily-news.sh`, `scripts/daily-news-full.sh`
- **输出：** Markdown、Discord、Email、PDF
- **触发：** "新闻", "摘要", "tech news"

#### 6. humanizer-zh
- **功能：** 去除 AI 写作痕迹，使文本更自然
- **检测模式：** 过度夸大、促销语言、AI 词汇、三段式结构等
- **触发：** "人性化", "去 AI 味", "改写"

#### 7. document-pro
- **功能：** 文档处理（PDF、DOCX、PPT 信息提取）
- **触发：** "分析文档", "提取内容", "总结报告"

---

### 🔍 搜索与工具类

#### 8. tavily-search
- **功能：** AI 优化 web 搜索
- **触发：** "搜索", "查找"

#### 9. github
- **功能：** GitHub CLI 集成（issues、PRs、CI runs）
- **命令：** `gh issue`, `gh pr`, `gh run`, `gh api`
- **触发：** "GitHub", "PR", "issue"

#### 10. api-gateway
- **功能：** 连接 100+ APIs（Google、Microsoft、Notion、Slack 等）
- **提供商：** Maton.ai
- **触发：** 第三方服务集成

---

### 💬 QQ Bot 相关

#### 11. qqbot
- **功能：** QQ 频道管理、消息收发
- **子技能：**
  - `qqbot-channel` - 频道/成员/帖子管理
  - `qqbot-media` - 富媒体收发（`<qqmedia>` 标签）
  - `qqbot-remind` - 定时提醒
- **配置：** `channels.qqbot` in openclaw.json
- **触发：** "QQ", "发送", "频道"

---

### 🧠 自我进化类

#### 12. self-improving-agent
- **功能：** 自动记录错误和经验
- **目录：** `.learnings/ERRORS.md`, `.learnings/LEARNINGS.md`
- **触发：** 命令失败、用户纠正、发现更好的方法
- **用法：**
  ```markdown
  ## 错误记录
  - 时间：YYYY-MM-DD HH:mm
  - 命令：xxx
  - 错误：xxx
  - 解决方案：xxx
  
  ## 经验记录
  - 场景：xxx
  - 最佳实践：xxx
  ```

#### 13. skillhub-preference
- **功能：** 技能发现/安装/更新
- **优先：** skillhub → clawhub fallback
- **触发：** "技能", "安装技能", "find-skill"

#### 14. skill-vetter
- **功能：** 技能安全审查
- **检查：** 权限范围、可疑模式、红旗标记
- **触发：** 安装新技能前

---

### 🔧 开发工具类

#### 15. claude-code-runner
- **功能：** 调用 Claude Code CLI
- **位置：** `skills/claude-code-runner/`
- **配置：** `~/.claude/settings.json`
- **用法：**
  ```bash
  openclaw claude-code run "<任务描述>"
  openclaw claude-code exec "<命令>"
  ```
- **环境变量：**
  ```bash
  CLAUDE_CODE_USE_OPENAI=1
  OPENAI_API_KEY=sk-xxx
  OPENAI_BASE_URL=https://coding.dashscope.aliyuncs.com/v1
  OPENAI_MODEL=qwen3.5-plus
  ```

#### 16. openai-whisper
- **功能：** 本地语音转文字
- **触发：** "转录", "语音识别"

#### 17. google-play
- **功能：** Google Play Developer API
- **触发：** Android 应用管理、订阅、内购

---

### 📋 系统工具类

#### 18. find-skills
- **功能：** 技能发现与安装
- **触发：** "找技能", "install skill"

---

## 🔗 技能协同工作流

### 示例 1：PPT 生成 + 发送到 QQ
```bash
# 1. 生成 PPT
python3 scripts/generate-xdzn-ppt.py

# 2. 发送到 QQ（使用 qqbot-media 技能）
# 在消息中使用：<qqmedia>/path/to/file.pptx</qqmedia>
```

### 示例 2：新闻摘要 + 自我记录
```bash
# 1. 运行新闻摘要
./scripts/daily-news-full.sh

# 2. 自动记录到 .learnings/LEARNINGS.md
# （self-improving-agent 自动处理）
```

### 示例 3：Claude Code 调用 OpenClaw 技能
```bash
# 在 Claude Code 中：
/claude-code run "用 python-pptx 生成公司介绍 PPT"

# 或使用环境变量
export OPENAI_API_KEY=sk-xxx
claude -p "生成 PPT..."
```

---

## 📁 重要文件位置

| 类型 | 路径 |
|------|------|
| 技能目录 | `/home/tenbox/.openclaw/workspace/skills/` |
| 学习记录 | `/home/tenbox/.openclaw/workspace/.learnings/` |
| 记忆文件 | `/home/tenbox/.openclaw/workspace/memory/` |
| 核心记忆 | `/home/tenbox/.openclaw/workspace/MEMORY.md` |
| 脚本工具 | `/home/tenbox/.openclaw/workspace/scripts/` |
| QQ Bot 配置 | `/home/tenbox/.openclaw/openclaw.json` |
| Claude Code 配置 | `~/.claude/settings.json` |

---

## 🚀 快速启动命令

### OpenClaw
```bash
openclaw status          # 检查状态
openclaw plugins list    # 列出插件
openclaw claude-code run "<任务>"  # 调用 Claude Code
```

### easier-claude-cli
```bash
cd /home/tenbox/.openclaw/workspace/easier-claude-cli
./start-aliyun.sh        # 阿里云模型启动
```

### 技能脚本
```bash
./scripts/daily-news.sh           # 新闻摘要（快速）
./scripts/daily-news-full.sh      # 新闻摘要（完整）
./scripts/generate-xdzn-ppt.py    # PPT 生成
```

---

## 📞 联系与资源

- **OpenClaw 文档：** `/home/tenbox/.openclaw/workspace/docs`
- **在线文档：** https://docs.openclaw.ai
- **技能市场：** https://clawhub.ai
- **社区：** https://discord.com/invite/clawd

---

**最后更新：** 2026-04-10  
**维护者：** 小爪 🐾
