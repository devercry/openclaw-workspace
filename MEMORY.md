# 🧠 MEMORY.md - 核心记忆库

**最后更新：** 2026-04-09 12:00  
**维护方式：** 每日 12:00 自动反思，提炼 daily notes 中的关键信息

---

## 📌 核心身份与偏好

### 身份
- **名字：** 小爪 🐾
- **定位：** AI 助手，住在代码里的数字小爪
- **风格：** 轻松随意，偶尔开玩笑，但该认真时绝不含糊

### 用户偏好
- 喜欢简洁的回答，避免冗长
- 在群聊中要 smart about when to contribute（质量 > 数量）
- 使用 reactions 进行轻量社交信号（Discord/Slack）

---

## 🛠️ 技术栈与配置

### OpenClaw 环境
- **主机：** tenbox-vm (Linux 6.12.73+deb13-amd64)
- **Node:** v22.22.2
- **工作区：** `/home/tenbox/.openclaw/workspace`
- **模型：** tenbox/default

### 重要项目
1. **OpenClaw Control Center** - UI 管理界面
   - 路径：`/home/tenbox/openclaw-control-center`
   - 最近修复：像素头像动画 DOM 异常（2026-04-07）

2. **OpenClaw-RL** - RL 训练集成
   - GitHub: https://github.com/Gen-Verse/OpenClaw-RL
   - 方案：使用官方扩展 rl-training-headers 注入训练头信息
   - 放弃本地 Python 依赖安装（Python 3.13 兼容性问题）

3. **技能系统**
   - 已集成 self-improvement 技能（自动记录错误和经验）
   - humanizer-zh 技能（去除 AI 写作痕迹）
   - AutoSkill4OpenClaw 协同方案
   - tech-news-digest 技能（v3.15.0，六源数据收集自动化）

4. **自动化工具**
   - 每日新闻摘要：`scripts/daily-news.sh`、`scripts/daily-news-full.sh`
   - 6DoF PPT 生成器：`scripts/generate-6dof-ppt*.py`（simple/tech 三个版本）
   - 每日自我反思：cron:daily-self-reflection-12pm（12:00 自动执行）

### 关键配置决策
- **备份策略：** 使用 git 定期备份 workspace
- **扩展方式：** 优先使用官方扩展而非复杂依赖安装
- **错误处理：** 前端动画错误静默捕获，避免影响主功能

---

## 📋 工作流程

### 每日反思（12:00）
1. 检查 .learnings/ERRORS.md 和 LEARNINGS.md
2. 回顾昨日 memory daily note
3. 提炼有价值经验到 MEMORY.md
4. 记录版本历史

### 心跳检查（2-4 次/天）
- 邮箱、日历、天气、通知
- 记录检查状态到 memory/heartbeat-state.json

### 记忆维护
- **daily notes:** `memory/YYYY-MM-DD.md` - 原始日志
- **core memory:** `MEMORY.md` - 提炼的长期记忆
- 定期回顾 daily files，更新 MEMORY.md

---

## 🚧 待办与注意事项

### 待验证
- UI 动画修复后，验证页面切换是否还有 DOM 错误
- OpenClaw-RL 扩展是否正确注入头信息

### 已知限制
- Python 3.13 与部分 ML 库不兼容（nvidia-modelopt, numpy<2.0）
- 无本地 NVIDIA GPU，依赖云端训练方案

---

## 📖 版本历史

| 版本 | 日期 | 变更摘要 |
|------|------|----------|
| 1.1 | 2026-04-09 | 新增 tech-news-digest 系统、6DoF PPT 生成脚本、完善工作流程 |
| 1.0 | 2026-04-08 | 初始创建，整合 3 月 -4 月关键记忆 |

---

**说明：** 此文件仅在主会话（与用户直接对话）时加载，群聊/共享上下文中不加载以保护隐私。
