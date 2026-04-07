# 🐾 self-improvement 与 AutoSkill 协同指南

**版本：** 2026-04-07 v1.0  
**方案：** A - 明确分工

---

## 📊 分工原则

| 系统 | 负责范围 | 特点 | 存储位置 |
|------|----------|------|----------|
| **self-improvement** | 临时记录、错误日志、功能请求 | 快速、人工、未验证 | `.learnings/` |
| **AutoSkill** | 长期技能、版本管理、自动检索 | 自动、标准化、已验证 | `SkillBank/` + `workspace/skills/` |

---

## 🎯 详细分工

### self-improvement 负责

#### ✅ 完整保留

1. **ERRORS.md** - 所有错误日志
   - 命令执行失败
   - API 调用错误
   - 工具异常
   - 网络问题
   - 权限错误

2. **FEATURE_REQUESTS.md** - 所有功能请求
   - 用户新需求
   - 改进建议
   - 期望功能
   - 优先级评估

#### ⚠️ 精简记录

3. **LEARNINGS.md** - 仅未验证经验
   - 第一次遇到的纠正
   - 单次用户偏好
   - 临时性经验
   - **必须标注** `[tentative]` 标签

#### ❌ 不再负责

- 不再手动创建 SKILL.md
- 不再管理技能版本
- 不再检索注入（交给 AutoSkill）

---

### AutoSkill 负责

#### ✅ 全自动

1. **技能提取**
   - 识别重复≥3 次的偏好
   - 识别稳定工作模式
   - 识别用户约束条件

2. **版本管理**
   - v0.1.0 → v0.1.1 → v0.1.34
   - 自动合并相似技能
   - 避免重复创建

3. **检索注入**
   - before_prompt_build 自动检索
   - topK=3 最相关技能
   - 注入到系统上下文

4. **技能镜像**
   - SkillBank → workspace/skills/
   - 保持 OpenClaw 标准格式
   - 包含 scripts/、references/等资源

---

## 🔄 工作流程

```
用户表达偏好/纠正
        ↓
self-improvement 记录
.learnings/LEARNINGS.md [tentative]
计数：1/3
        ↓
用户再次表达（计数 2/3）
        ↓
用户第三次表达（计数 3/3）
        ↓
AutoSkill 识别为稳定模式
        ↓
生成 SKILL.md (v0.1.0)
位置：SkillBank/<skill_name>/
        ↓
镜像到 workspace/skills/
        ↓
删除 .learnings/对应记录
        ↓
记录到 COORDINATION.md
```

---

## 📝 记录规范

### self-improvement 记录模板

```markdown
### [correction] [tentative] 简短描述
**时间：** YYYY-MM-DD HH:mm
**计数：** 1/3
**状态：** ⏳ 待验证
**场景：** 什么情况下
**内容：** 具体经验/纠正
**应用：** 以后怎么用
**AutoSkill 提取后删除此条**
```

### 状态标签

| 标签 | 说明 |
|------|------|
| `[tentative]` | 未验证，单次经验 |
| `[verified]` | 已验证，重复 2 次 |
| `[ready]` | 待提取，重复 3 次+ |
| `[extracted]` | 已被 AutoSkill 提取 |

---

## 🔍 每日复盘流程

**时间：** 每天中午 12:00

### 步骤 1：查看 .learnings/

```bash
# 查看新记录
cat ~/.openclaw/workspace/.learnings/LEARNINGS.md | grep "2026-04-07"

# 查看待提取（计数≥3）
grep "计数：\[3-9\]/3" ~/.openclaw/workspace/.learnings/LEARNINGS.md
```

### 步骤 2：查看 SkillBank

```bash
# 查看新提取的技能
find ~/.openclaw/autoskill/SkillBank -name "SKILL.md" -mtime -1

# 查看技能详情
cat ~/.openclaw/autoskill/SkillBank/Users/<user>/<skill>/SKILL.md
```

### 步骤 3：审查和清理

```bash
# 查找可能的重复
grep -r "关键词" ~/.openclaw/workspace/.learnings/
grep -r "关键词" ~/.openclaw/autoskill/SkillBank/

# 发现重复后：
# 1. 保留 SkillBank 版本
# 2. 删除 .learnings/记录
# 3. 记录到 COORDINATION.md
```

### 步骤 4：记录协同日志

```bash
cat >> ~/.openclaw/workspace/.learnings/COORDINATION.md << 'EOF'

## 2026-04-07

### 已合并到 AutoSkill
- prefer_trash_over_rm → SkillBank/prefer_trash_over_rm/SKILL.md (v0.1.0)
  - deleted: .learnings/LEARNINGS.md#use-trash-not-rm
  - 原因：重复 3 次，已提取为技能

### 保留在 .learnings/
- git_auth_error_20260407 → ERRORS.md
  - 原因：一次性错误，非稳定模式
- feature_request_ssh_config → FEATURE_REQUESTS.md
  - 原因：功能请求，非技能
EOF
```

---

## ⚠️ 冲突处理

### 场景 1：发现重复记录

**检测：**
```bash
# 搜索相同主题
grep -r "trash" ~/.openclaw/workspace/.learnings/
grep -r "trash" ~/.openclaw/autoskill/SkillBank/
```

**处理：**
1. ✅ **保留** SkillBank 版本（更规范）
2. ✅ **删除** .learnings/对应记录
3. ✅ **记录** 到 COORDINATION.md

---

### 场景 2：AutoSkill 提取了不需要的技能

**处理：**
```bash
# 1. 查看技能
cat ~/.openclaw/autoskill/SkillBank/Users/<user>/<skill>/SKILL.md

# 2. 手动删除（如确实不需要）
rm -rf ~/.openclaw/autoskill/SkillBank/Users/<user>/<skill>/

# 3. 删除镜像
rm -rf ~/.openclaw/workspace/skills/<skill>/

# 4. 记录原因
cat >> ~/.openclaw/workspace/.learnings/COORDINATION.md << 'EOF'
### 删除的技能
- <skill_name>
  - 原因：质量不高/不适用
  - 时间：2026-04-07
EOF
```

---

### 场景 3：self-improvement 记录了重要技能

**处理：**
```bash
# 1. 评估是否重复≥3 次
# 2. 如是，手动创建 SKILL.md
mkdir -p ~/.openclaw/autoskill/SkillBank/Users/default/<skill_name>/
cat > ~/.openclaw/autoskill/SkillBank/Users/default/<skill_name>/SKILL.md << 'EOF'
# skill_name (v0.1.0)
**创建：** 2026-04-07
**来源：** self-improvement 手动迁移
**触发：** [...]
**约束：** [...]
EOF

# 3. 删除 .learnings/原记录
# 4. 记录到 COORDINATION.md
```

---

## 📊 检查命令

### 快速检查

```bash
# 查看 .learnings/记录数
wc -l ~/.openclaw/workspace/.learnings/*.md

# 查看 SkillBank 技能数
find ~/.openclaw/autoskill/SkillBank -name "SKILL.md" | wc -l

# 查看镜像技能数
find ~/.openclaw/workspace/skills -name "SKILL.md" | wc -l
```

### 详细检查

```bash
# 查看待提取（计数≥3）
grep -B5 "计数：3/3" ~/.openclaw/workspace/.learnings/LEARNINGS.md

# 查看新提取的技能（最近 1 天）
find ~/.openclaw/autoskill/SkillBank -name "SKILL.md" -mtime -1

# 查看协同日志
cat ~/.openclaw/workspace/.learnings/COORDINATION.md
```

### 重复检查

```bash
# 搜索可能的重复
for keyword in "trash" "rm" "git" "backup"; do
    echo "=== $keyword ==="
    echo ".learnings/:"
    grep -l "$keyword" ~/.openclaw/workspace/.learnings/*.md 2>/dev/null
    echo "SkillBank/:"
    grep -rl "$keyword" ~/.openclaw/autoskill/SkillBank/ 2>/dev/null
    echo ""
done
```

---

## 🎯 最佳实践

### ✅ 推荐做法

1. **及时标记** - 新经验立即标注 `[tentative]`
2. **计数准确** - 每次重复更新计数
3. **快速清理** - AutoSkill 提取后立即删除
4. **详细记录** - COORDINATION.md 写清楚原因
5. **定期审查** - 每天复盘时检查重复

### ❌ 避免做法

1. **堆积不处理** - 记录了不审查
2. **重复记录** - 相同内容两处都记
3. **不计数** - 不知道哪些该提取
4. **不删除** - AutoSkill 提取后还保留
5. **不记录** - 删除了但不记原因

---

## 📈 效果评估

### 预期效果

| 指标 | 优化前 | 优化后 |
|------|--------|--------|
| **重复记录** | ⚠️ 高 | ✅ 低 |
| **技能质量** | ⭐⭐ 人工 | ⭐⭐⭐⭐ 自动 + 人工 |
| **维护成本** | ⭐⭐⭐ 高 | ⭐⭐ 中 |
| **检索冲突** | ⚠️ 可能 | ✅ 避免 |
| **用户体验** | ⭐⭐⭐ 好 | ⭐⭐⭐⭐ 更好 |

### 评估周期

- **每日** - 复盘时检查重复
- **每周** - 审查技能质量
- **每月** - 评估协同效果

---

## 🔗 相关文档

- `skills/self-improving-agent/SKILL.md` - self-improvement 技能说明（已更新协同章节）
- `docs/AutoSkill 集成报告.md` - AutoSkill 完整集成报告
- `~/.openclaw/workspace/.learnings/COORDINATION.md` - 协同日志（新建）

---

## 📋 快速参考卡

| 场景 | 记录位置 | 标签 | 处理 |
|------|----------|------|------|
| 第一次纠正 | LEARNINGS.md | `[tentative]` | 记录，计数 1/3 |
| 第二次纠正 | LEARNINGS.md | `[verified]` | 更新，计数 2/3 |
| 第三次纠正 | LEARNINGS.md | `[ready]` | 标记，计数 3/3，待提取 |
| AutoSkill 提取后 | COORDINATION.md | `[extracted]` | 删除原记录，记日志 |
| 错误日志 | ERRORS.md | - | 完整保留 |
| 功能请求 | FEATURE_REQUESTS.md | - | 完整保留 |

---

**最后更新：** 2026-04-07  
**维护者：** 小爪 🐾  
**状态：** ✅ 已启用
