# 🐾 self-improvement 使用指南

**优化版本：** 2026-04-07 v2.0

---

## 📁 目录结构

```
~/.openclaw/workspace/
├── .learnings/              # 学习记录目录 ⭐
│   ├── LEARNINGS.md        # 经验总结
│   ├── ERRORS.md           # 错误记录
│   └── FEATURE_REQUESTS.md # 功能请求
├── MEMORY.md               # 核心记忆库
├── AGENTS.md               # 工作流程
├── TOOLS.md                # 工具说明
└── SOUL.md                 # 行为准则
```

---

## 🎯 自动触发场景

### 1️⃣ 错误记录（自动）

**触发条件：**
- 命令执行失败
- API 调用出错
- 工具调用异常
- 网络问题

**示例：**
```
用户：帮我 push 代码
小爪：[执行 git push]
系统：[错误：认证失败]
→ 自动记录到 ERRORS.md
```

---

### 2️⃣ 用户纠正（自动）

**触发条件：**
- "不对，应该是..."
- "你错了，..."
- "不是这样，..."
- "我记得是..."

**示例：**
```
小爪：用 rm 删除文件
用户：不对，用 trash 更安全
→ 自动记录到 LEARNINGS.md [correction]
```

---

### 3️⃣ 功能请求（自动）

**触发条件：**
- "能不能..."
- "希望你能..."
- "如果能...就好了"
- "建议添加..."

**示例：**
```
用户：能不能每天提醒我备份
→ 自动记录到 FEATURE_REQUESTS.md
```

---

### 4️⃣ 发现更好的方法（自动）

**触发条件：**
- 发现更优解决方案
- 发现现有方法有问题
- 发现知识盲区

**示例：**
```
小爪：[用复杂方法完成任务]
小爪：等等，其实有更简单的方法...
→ 自动记录到 LEARNINGS.md [best_practice]
```

---

## 📝 手动记录命令

### 记录错误
```
小爪，记录一个错误：[错误描述]
```

### 记录经验
```
小爪，记住这个技巧：[经验内容]
```

### 记录需求
```
小爪，我希望你能：[需求描述]
```

---

## ⏰ 定时任务

### 每日复盘（中午 12:00）

**自动执行：**
1. 读取 `.learnings/` 三个文件
2. 分析今天的交互
3. 提取有价值的经验
4. 更新 `MEMORY.md`
5. 生成复盘报告

**Cron 配置：**
```json
{
  "id": "daily-self-reflection-12pm",
  "schedule": "0 12 * * *",
  "task": "自我反思"
}
```

---

## 🔄 知识沉淀流程

```
日常交互
    ↓
自动记录到 .learnings/
    ↓
每日复盘（12:00）
    ↓
提炼高价值经验
    ↓
更新到核心文件：
├── MEMORY.md      (长期记忆)
├── AGENTS.md      (工作流程)
├── TOOLS.md       (工具技巧)
└── SOUL.md        (行为准则)
```

---

## 📊 文件用途对比

| 文件 | 用途 | 更新频率 |
|------|------|----------|
| `.learnings/LEARNINGS.md` | 原始经验记录 | 随时 |
| `.learnings/ERRORS.md` | 原始错误记录 | 随时 |
| `.learnings/FEATURE_REQUESTS.md` | 原始需求记录 | 随时 |
| `MEMORY.md` | 核心记忆 | 每天复盘后 |
| `AGENTS.md` | 工作流程 | 需要时 |
| `TOOLS.md` | 工具技巧 | 需要时 |
| `SOUL.md` | 行为准则 | 需要时 |

---

## 💡 最佳实践

### ✅ 推荐做法

1. **及时记录** - 发现就记，不要等
2. **具体明确** - 写清楚场景和用法
3. **分类清晰** - 用对标签和分类
4. **定期复盘** - 每天中午自动回顾
5. **提炼升华** - 有价值的更新到核心文件

### ❌ 避免做法

1. **堆积不处理** - 记录了不看
2. **太笼统** - "记住这个"但不说是什么
3. **重复记录** - 同样的内容记多次
4. **只记不用** - 不复盘不应用

---

## 🔍 查看学习记录

### 快速查看
```bash
# 查看经验
cat ~/.openclaw/workspace/.learnings/LEARNINGS.md

# 查看错误
cat ~/.openclaw/workspace/.learnings/ERRORS.md

# 查看需求
cat ~/.openclaw/workspace/.learnings/FEATURE_REQUESTS.md
```

### 搜索内容
```bash
# 搜索特定关键词
grep "git" ~/.openclaw/workspace/.learnings/*.md
```

---

## 🎯 复盘检查清单

**每天中午 12 点自动执行：**

- [ ] 查看 ERRORS.md - 有什么错误？
- [ ] 查看 LEARNINGS.md - 有什么新经验？
- [ ] 查看 FEATURE_REQUESTS.md - 有什么需求？
- [ ] 提取高价值内容 - 值得记住的
- [ ] 更新 MEMORY.md - 核心记忆
- [ ] 更新其他文件 - AGENTS.md / TOOLS.md / SOUL.md
- [ ] 生成复盘报告 - 今天学到了什么

---

## 📈 进阶用法

### 1. 经验分类管理

```markdown
## 按领域分类
- 开发工作流
- Git 操作
- API 使用
- 用户偏好

## 按优先级分类
- ⭐⭐⭐ 必须记住
- ⭐⭐ 重要
- ⭐ 参考
```

### 2. 链接相关文件

```markdown
**相关：**
- 参见：[[MEMORY.md#Git 最佳实践]]
- 参考：[[TOOLS.md#Git 认证]]
```

### 3. 版本追踪

```markdown
## 版本历史
- v1.0 (2026-04-07) - 初始版本
- v1.1 (2026-04-08) - 添加 Git 认证经验
```

---

## 🎉 使用示例

### 场景 1：Git 认证失败

```
小爪：[执行 git push]
系统：[错误：认证失败]

小爪：已记录到 ERRORS.md
原因：需要配置 SSH key
解决方案：ssh-keygen 生成密钥并添加到 GitHub
预防措施：首次使用前先配置认证
```

### 场景 2：用户纠正

```
小爪：用 rm 删除文件吧
用户：不对，用 trash 更安全，可以恢复

小爪：已记录到 LEARNINGS.md [correction]
偏好：使用 trash 而不是 rm（可恢复）
应用：所有删除操作优先用 trash
```

### 场景 3：功能请求

```
用户：能不能每天提醒我备份代码？

小爪：已记录到 FEATURE_REQUESTS.md
需求：每日备份提醒
优先级：⭐⭐⭐
实现：配置 cron 任务，每天 9:00 提醒
状态：✅ 已完成
```

---

## 📋 快速参考卡

| 场景 | 记录位置 | 标签 |
|------|----------|------|
| 命令失败 | ERRORS.md | `[command]` |
| API 错误 | ERRORS.md | `[api]` |
| 用户纠正 | LEARNINGS.md | `[correction]` |
| 新知识 | LEARNINGS.md | `[knowledge_gap]` |
| 更好方法 | LEARNINGS.md | `[best_practice]` |
| 功能请求 | FEATURE_REQUESTS.md | `[request]` |

---

**最后更新：** 2026-04-07  
**维护者：** 小爪 🐾
