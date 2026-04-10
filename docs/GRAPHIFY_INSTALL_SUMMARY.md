# ✅ Graphify 安装完成

**安装时间：** 2026-04-10 15:45  
**平台：** OpenClaw  
**位置：** `/home/tenbox/.openclaw/workspace/`

---

## 📦 安装内容

| 组件 | 位置 | 状态 |
|------|------|------|
| **Python 包** | `venv_graphify/` | ✅ 已安装 graphifyy |
| **技能文件** | `/home/tenbox/.claw/skills/graphify/SKILL.md` | ✅ 44KB |
| **AGENTS.md 配置** | `AGENTS.md` | ✅ 已添加 graphify 规则 |
| **使用文档** | `docs/GRAPHIFY_USAGE.md` | ✅ 已创建 |

---

## 🚀 使用方法

### 在 OpenClaw 中使用

**触发命令：** `/graphify`

```
/graphify .                           # 分析当前目录
/graphify /path/to/project            # 分析指定目录
/graphify . --mode deep               # 深度提取模式
/graphify . --update                  # 增量更新
/graphify query "认证模块如何工作"     # 查询知识图谱
```

### 输出文件

运行后生成 `graphify-out/` 目录：

```
graphify-out/
├── graph.html          # 交互式图谱（可点击、搜索、过滤）
├── GRAPH_REPORT.md     # 审计报告（关键节点、意外连接）
├── graph.json          # 持久化图谱（JSON 格式）
└── cache/              # SHA256 缓存
```

---

## 🎯 核心功能

### 1. 多模态输入
- ✅ 代码文件（20 种语言）
- ✅ 文档（Markdown、TXT）
- ✅ PDF 论文
- ✅ 图片（截图、白板照片、图表）

### 2. AST 解析支持的语言
Python、JavaScript、TypeScript、Go、Rust、Java、C、C++、Ruby、C#、Kotlin、Scala、PHP、Swift、Lua、Zig、PowerShell、Elixir、Objective-C、Julia

### 3. 图谱特性
- **社区检测** - Leiden 算法聚类
- **透明标注** - EXTRACTED / INFERRED / AMBIGUOUS
- **持久化** - 跨会话保留
- **增量更新** - 只处理变更文件

### 4. Token 效率
- **71.5x 更少的 token** - 相比直接读取原始文件

---

## 📋 AGENTS.md 配置

已添加到 `AGENTS.md`：

```markdown
## graphify

This project has a knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, 
  read graphify-out/GRAPH_REPORT.md for god nodes and 
  community structure
- If graphify-out/wiki/index.md exists, navigate it 
  instead of reading raw files
- After modifying code files, rebuild the graph
```

---

## 💡 典型应用场景

| 场景 | 用途 |
|------|------|
| **新代码库理解** | 快速找到核心架构和关键节点 |
| **架构决策追溯** | 找到设计背后的"为什么" |
| **文档 + 代码关联** | 将设计文档、截图、代码联系起来 |
| **团队协作** | 新成员快速上手项目 |
| **个人知识库** | Andrej Karpathy 的 /raw 文件夹工作流 |

---

## ⚠️ 注意事项

1. **首次运行较慢** - 需要分析所有文件并调用 LLM
2. **大项目建议增量** - 使用 `--update` 模式
3. **隐私文件排除** - 创建 `.graphifyignore` 文件

### 示例 .graphifyignore
```
# .graphifyignore
vendor/
node_modules/
dist/
*.generated.py
.env
*.log
```

---

## 🔧 虚拟环境

```bash
# 激活环境
cd /home/tenbox/.openclaw/workspace
source venv_graphify/bin/activate

# 验证安装
graphify --help

# 使用技能（在 OpenClaw 中）
/graphify .
```

---

## 📖 相关文档

- **使用指南：** `docs/GRAPHIFY_USAGE.md`
- **技能文件：** `/home/tenbox/.claw/skills/graphify/SKILL.md`
- **官方文档：** https://github.com/safishamsi/graphify

---

**下一步：** 在 OpenClaw 中输入 `/graphify .` 开始构建知识图谱！

**记录者：** 小爪 🐾
