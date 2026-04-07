# 🤝 self-improvement 与 AutoSkill 协同日志

**创建时间：** 2026-04-07  
**目的：** 记录两个系统之间的技能迁移和去重

---

## 2026-04-07

### 系统配置更新

**时间：** 13:58

**更新内容：**
- ✅ self-improvement SKILL.md 添加协同章节
- ✅ 创建协同指南文档
- ✅ 明确分工规则

**分工规则：**
- self-improvement：临时记录、错误日志、功能请求
- AutoSkill：长期技能、版本管理、自动检索

---

### 待观察

**时间：** 13:58 -  ongoing

**观察项：**
- ⏳ AutoSkill 技能提取效果
- ⏳ 是否出现重复记录
- ⏳ 协同流程是否顺畅
- ⏳ 技能质量如何

**下次审查：** 2026-04-08 12:00（每日复盘时）

---

## 📋 记录模板

### 技能迁移记录

```markdown
### 已合并到 AutoSkill
- <skill_name> → SkillBank/<skill_name>/SKILL.md (v0.1.0)
  - 来源：.learnings/LEARNINGS.md#<entry_id>
  - 删除：是/否
  - 原因：重复 3 次，已提取为技能
  - 时间：YYYY-MM-DD HH:mm
```

### 删除记录

```markdown
### 删除的 .learnings 记录
- <entry_id> → 已删除
  - 对应技能：SkillBank/<skill_name>/
  - 原因：已被 AutoSkill 提取
  - 时间：YYYY-MM-DD HH:mm
```

### 手动干预

```markdown
### 手动处理
- <skill_name>
  - 操作：创建/修改/删除
  - 原因：质量不高/不适用/需要优化
  - 时间：YYYY-MM-DD HH:mm
```

---

**最后更新：** 2026-04-07  
**维护者：** 小爪 🐾
