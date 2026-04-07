# 🐾 AutoSkill4OpenClaw 集成报告

**集成时间：** 2026-04-07 13:50  
**集成模式：** Embedded (推荐)  
**状态：** ✅ 成功

---

## 📊 集成概览

### 安装信息

| 项目 | 路径/值 |
|------|---------|
| **AutoSkill 源码** | `/tmp/AutoSkill` |
| **插件安装目录** | `~/.openclaw/plugins/autoskill-openclaw-plugin` |
| **Adapter 目录** | `~/.openclaw/extensions/autoskill-openclaw-adapter` |
| **SkillBank** | `~/.openclaw/autoskill/SkillBank` |
| **会话归档** | `~/.openclaw/autoskill/embedded_sessions` |
| **技能镜像** | `~/.openclaw/workspace/skills` |

---

## 🔧 配置详情

### openclaw.json 配置

```json
{
  "plugins": {
    "entries": {
      "autoskill-openclaw-adapter": {
        "enabled": true,
        "config": {
          "runtimeMode": "embedded",
          "openclawSkillInstallMode": "openclaw_mirror",
          "skillScope": "all",
          "topK": 3,
          "minScore": 0.4,
          "embedded": {
            "skillBankDir": "~/.openclaw/autoskill/SkillBank",
            "openclawSkillsDir": "~/.openclaw/workspace/skills",
            "sessionArchiveDir": "~/.openclaw/autoskill/embedded_sessions",
            "sessionMaxTurns": 20
          }
        }
      }
    }
  }
}
```

---

## 🎯 工作模式

### Embedded 模式（已启用）

**特点：**
- ✅ 无需外部 sidecar 服务
- ✅ 直接复用 OpenClaw 运行时模型
- ✅ 在 adapter 内部处理 `agent_end`
- ✅ 自动归档会话到本地
- ✅ 自动提取和维护技能
- ✅ 技能镜像到 OpenClaw 本地 skills 目录

**工作流程：**
```
OpenClaw 运行
    ↓
agent_end (adapter 内部)
    ↓
AutoSkill SkillBank (提取/合并/维护)
    ↓
镜像技能到 ~/.openclaw/workspace/skills
    ↓
OpenClaw 本地技能加载和检索
```

---

## 📁 目录结构

```
~/.openclaw/
├── autoskill/
│   ├── SkillBank/              # AutoSkill 技能源
│   │   └── Users/
│   │       └── <user_id>/
│   │           └── skills/
│   │               └── <skill_name>/
│   │                   └── SKILL.md
│   └── embedded_sessions/      # 会话归档
│       └── <session_id>.json
├── plugins/
│   └── autoskill-openclaw-plugin/
│       ├── start.sh            # 启动脚本（sidecar 模式）
│       ├── stop.sh             # 停止脚本
│       ├── status.sh           # 状态检查
│       └── .env                # 环境变量
├── extensions/
│   └── autoskill-openclaw-adapter/
│       ├── index.js            # Adapter 主文件
│       ├── openclaw.plugin.json
│       └── openclaw_prompt_pack.txt  # 提示词包
└── workspace/skills/           # 技能镜像（OpenClaw 使用）
```

---

## 🔍 核心功能

### 1. 技能自动提取

**触发条件：**
- 会话结束（`agent_end`）
- 会话达到最大轮数（默认 20 轮）
- 会话 ID 变化

**提取内容：**
- 用户稳定偏好
- 重复约束条件
- 纠正模式
- 最佳实践

---

### 2. 技能版本管理

**格式：**
```markdown
# skill_name (v0.1.0)

**创建：** 2026-04-07
**更新：** 2026-04-07
**版本历史：**
- v0.1.0 - 初始版本
```

**更新机制：**
- 新约束 → 版本递增（v0.1.0 → v0.1.1）
- 相似技能 → 合并而非重复
- 冲突技能 → 保留高优先级

---

### 3. 技能检索注入

**配置：**
- `topK`: 3（每次检索 3 个最相关技能）
- `minScore`: 0.4（最低相似度阈值）
- `maxChars`: 1500（最大注入字符数）

**检索时机：** `before_prompt_build`

**注入方式：** `appendSystemContext`（追加到系统上下文）

---

### 4. 技能镜像

**源：** `~/.openclaw/autoskill/SkillBank`（真实来源）

**镜像：** `~/.openclaw/workspace/skills`（OpenClaw 使用）

**同步机制：**
- 技能创建/更新时自动镜像
- 保持标准 OpenClaw 技能格式
- 包含 `scripts/`, `references/`, `assets/` 等资源

---

## 🎯 与 self-improvement 对比

| 特性 | self-improvement | AutoSkill |
|------|------------------|-----------|
| **技能提取** | 手动记录 | ✅ 自动 |
| **版本管理** | 无 | ✅ v0.1.0 → v0.1.1 |
| **技能合并** | 手动 | ✅ 自动合并 |
| **检索注入** | 手动查找 | ✅ 自动检索 |
| **标准化格式** | ⚠️ 部分 | ✅ 完整 SKILL.md |
| **安装复杂度** | ⭐ 简单 | ⭐⭐⭐ 中等 |
| **维护成本** | ⭐ 低 | ⭐⭐ 中 |

---

## 💡 集成优势

### ✅ 已实现的

1. **自动技能提取** - 从交互中自动识别模式
2. **版本管理** - 技能迭代有迹可循
3. **技能合并** - 避免重复技能
4. **自动检索** - 类似任务自动注入相关技能
5. **标准化** - 统一的 SKILL.md 格式

### ⏳ 待测试的

1. **实际提取效果** - 需要真实交互数据
2. **技能质量** - 提取的技能是否实用
3. **性能影响** - 对 OpenClaw 运行速度的影响
4. **与 self-improvement 协同** - 两者是否冲突

---

## 🔧 环境变量

### 核心配置

```bash
# 运行时模式
AUTOSKILL_OPENCLAW_RUNTIME_MODE=embedded

# 技能安装模式
AUTOSKILL_OPENCLAW_SKILL_INSTALL_MODE=openclaw_mirror

# SkillBank 目录
AUTOSKILL_SKILLBANK_DIR=~/.openclaw/autoskill/SkillBank

# OpenClaw 技能目录
AUTOSKILL_OPENCLAW_SKILLS_DIR=~/.openclaw/workspace/skills

# 会话归档目录
AUTOSKILL_OPENCLAW_EMBEDDED_SESSION_DIR=~/.openclaw/autoskill/embedded_sessions

# 最大会话轮数（0=禁用限制）
AUTOSKILL_OPENCLAW_SESSION_MAX_TURNS=20
```

---

## 📋 验证步骤

### 1. 检查插件加载

```bash
openclaw plugins list | grep -i autoskill
```

**预期输出：**
```
│ AutoSkill │ autoskil │ openclaw │ loaded │ ... │
```

---

### 2. 检查目录创建

```bash
ls -la ~/.openclaw/autoskill/
```

**预期：**
- `SkillBank/` 目录存在
- `embedded_sessions/` 目录存在

---

### 3. 测试技能提取

**步骤：**
1. 进行多次对话
2. 重复表达相同偏好
3. 结束会话
4. 检查 SkillBank

```bash
find ~/.openclaw/autoskill/SkillBank -name "SKILL.md"
```

---

### 4. 检查技能镜像

```bash
find ~/.openclaw/workspace/skills -name "SKILL.md" | wc -l
```

---

## ⚠️ 注意事项

### 1. 会话归档

- 默认最多 20 轮自动归档
- 长会话会被分段处理
- 归档文件：`embedded_sessions/<session_id>.json`

---

### 2. 技能提取条件

**不会提取的情况：**
- 会话中无成功的主轮次（`turn_type=main`）
- 用户没有表达稳定偏好
- 只有一次性的请求

**会提取的情况：**
- 用户重复相同约束 ≥ 3 次
- 用户多次纠正同类问题
- 发现可复用的工作模式

---

### 3. 与 self-improvement 共存

**当前配置：**
- ✅ self-improvement：手动记录 + 每日复盘
- ✅ AutoSkill：自动提取 + 版本管理

**潜在冲突：**
- ⚠️ 两者都可能记录用户偏好
- ⚠️ 可能生成相似技能

**解决方案：**
- self-improvement 用于快速记录
- AutoSkill 用于长期技能沉淀
- 定期审查和合并

---

## 🎯 下一步计划

### 短期（1-2 天）

1. ✅ 验证插件正常加载
2. ✅ 测试会话归档功能
3. ⏳ 观察技能提取效果
4. ⏳ 检查技能镜像同步

---

### 中期（1 周）

1. ⏳ 收集提取的技能案例
2. ⏳ 评估技能质量
3. ⏳ 优化提取参数（topK, minScore）
4. ⏳ 编写使用指南

---

### 长期（1 个月）

1. ⏳ 建立技能审查流程
2. ⏳ 合并 self-improvement 和 AutoSkill 的经验
3. ⏳ 创建技能质量评估标准
4. ⏳ 优化技能检索策略

---

## 📊 当前状态总结

| 项目 | 状态 |
|------|------|
| **AutoSkill 安装** | ✅ 完成 |
| **插件加载** | ✅ 成功 |
| **目录创建** | ✅ 完成 |
| **配置写入** | ✅ 完成 |
| **Gateway 重启** | ✅ 完成 |
| **技能提取** | ⏳ 等待交互数据 |
| **技能镜像** | ⏳ 等待首次提取 |

---

## 💡 使用建议

### 日常使用

1. **正常使用 OpenClaw** - AutoSkill 会自动工作
2. **明确表达偏好** - "记住，我喜欢..."
3. **重复重要约束** - 多次强调会触发提取
4. **定期审查技能** - 查看 SkillBank 中的技能

---

### 技能管理

```bash
# 查看提取的技能
find ~/.openclaw/autoskill/SkillBank -name "SKILL.md"

# 查看镜像的技能
find ~/.openclaw/workspace/skills -name "SKILL.md"

# 查看会话归档
ls -la ~/.openclaw/autoskill/embedded_sessions/
```

---

## 🔗 参考资源

- **AutoSkill 论文：** https://arxiv.org/abs/2603.01145
- **GitHub 仓库：** https://github.com/ECNU-ICALK/AutoSkill
- **AutoSkill4OpenClaw 文档：** `/tmp/AutoSkill/AutoSkill4OpenClaw/README.md`

---

**集成完成时间：** 2026-04-07 13:50  
**维护者：** 小爪 🐾  
**状态：** ✅ 运行中
