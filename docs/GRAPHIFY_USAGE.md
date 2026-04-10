# Graphify - 知识图谱构建工具

**安装时间：** 2026-04-10 15:42  
**位置：** `/home/tenbox/.claw/skills/graphify/SKILL.md`  
**虚拟环境：** `/home/tenbox/.openclaw/workspace/venv_graphify/`

---

## 📋 什么是 Graphify

Graphify 是一个 AI 编码助手技能，可以将任何文件夹（代码、文档、论文、图片）转换为**可查询的知识图谱**。

### 核心功能
- **多模态输入** - 代码、PDF、Markdown、截图、白板照片都能处理
- **20 种语言 AST 解析** - Python、JS、TS、Go、Rust、Java 等
- **知识图谱构建** - 提取概念、关系、设计决策
- **社区检测** - Leiden 算法聚类，无需嵌入
- **持久化缓存** - SHA256 缓存，只处理变更文件
- **透明标注** - EXTRACTED（提取）/ INFERRED（推断）/ AMBIGUOUS（待审查）

---

## 🚀 使用方法

### 基本用法
```bash
# 在 OpenClaw 中
/graphify .                    # 分析当前目录
/graphify /path/to/project     # 分析指定目录
```

### 高级选项
```bash
/graphify . --mode deep        # 深度提取模式
/graphify . --update           # 增量更新（只处理变更文件）
/graphify . --no-viz           # 跳过可视化
/graphify . --svg              # 导出 SVG 图谱
/graphify . --graphml          # 导出 GraphML（Gephi、yEd 可用）
/graphify . --neo4j            # 生成 Neo4j Cypher 脚本
/graphify . --watch            # 监视模式，自动重建
```

### 查询功能
```bash
/graphify query "认证模块如何工作"           # BFS 遍历查询
/graphify query "认证" --dfs                 # DFS 深度查询
/graphify query "认证" --budget 1500         # 限制 token 数
/graphify path "AuthModule" "Database"       # 查找两个概念间的最短路径
/graphify explain "SwinTransformer"          # 解释某个节点
```

---

## 📁 输出文件

运行后生成 `graphify-out/` 目录：

```
graphify-out/
├── graph.html          # 交互式图谱（可点击、搜索、过滤）
├── GRAPH_REPORT.md     # 审计报告（关键节点、意外连接、建议问题）
├── graph.json          # 持久化图谱（后续可直接查询）
├── graph.svg           # SVG 图谱（可选）
├── graph.graphml       # GraphML 格式（可选）
├── cypher.txt          # Neo4j 脚本（可选）
└── cache/              # SHA256 缓存
```

---

## 🎯 典型应用场景

| 场景 | 用途 |
|------|------|
| **新代码库理解** | 快速找到核心架构和关键节点 |
| **架构决策追溯** | 找到设计背后的"为什么" |
| **文档 + 代码关联** | 将设计文档、截图、代码联系起来 |
| **团队协作** | 新成员快速上手项目 |
| **个人知识库** | Andrej Karpathy 的 /raw 文件夹工作流 |
| **研究论文管理** | 论文 + 推文 + 笔记 → 统一知识图谱 |

---

## 🔧 技术细节

### 处理流程
1. **AST 解析** -  deterministic 提取代码结构（类、函数、导入、调用图）
2. **Claude 子代理** - 并行处理文档、论文、图片，提取概念和关系
3. **图谱合并** - 将结果合并到 NetworkX 图谱
4. **社区检测** - Leiden 算法聚类
5. **导出** - HTML、JSON、审计报告

### Token 效率
- **71.5x 更少的 token** - 相比直接读取原始文件
- **跨会话持久化** - 图谱可保留数周
- **增量更新** - 只处理变更文件

### 透明性
每个关系都有标签：
- **EXTRACTED** - 直接从源码提取
- **INFERRED** - 合理推断（带置信度分数）
- **AMBIGUOUS** - 标记待审查

---

## 📦 安装信息

```bash
# 虚拟环境
/home/tenbox/.openclaw/workspace/venv_graphify/

# 技能文件
/home/tenbox/.claw/skills/graphify/SKILL.md

# 版本
cat /home/tenbox/.claw/skills/graphify/.graphify_version
```

---

## ⚠️ 注意事项

1. **首次运行较慢** - 需要分析所有文件并调用 LLM
2. **大项目建议增量** - 使用 `--update` 模式
3. **隐私文件排除** - 创建 `.graphifyignore` 文件（语法同 `.gitignore`）

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

## 🎓 学习资源

- **GitHub:** https://github.com/safishamsi/graphify
- **PyPI:** https://pypi.org/project/graphifyy/
- **文档:** 查看 SKILL.md 获取完整命令列表

---

**最后更新：** 2026-04-10  
**维护者：** 小爪 🐾
