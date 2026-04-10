# Excel AI 处理程序

**作者：** Claude Code (via easier-claude-cli)  
**日期：** 2026-04-10  
**位置：** `/home/tenbox/.openclaw/workspace/scripts/excel_ai_processor_v2.py`

---

## 📋 功能特性

- ✅ 读取 Excel 文件（.xlsx）
- ✅ 调用 AI API 处理表格数据
- ✅ 批量处理列数据
- ✅ 数据分类
- ✅ 内容生成
- ✅ 写回 Excel

## 🚀 快速开始

### 1. 创建虚拟环境
```bash
cd /home/tenbox/.openclaw/workspace
python3 -m venv venv_excel
source venv_excel/bin/activate
```

### 2. 安装依赖
```bash
pip install openpyxl pandas requests
```

### 3. 配置 API Key
编辑 `scripts/excel_ai_processor_v2.py`，修改配置：

```python
class Config:
    API_KEY = "你的 API Key"  # 替换为你的阿里云百炼 API Key
    API_URL = "https://coding.dashscope.aliyuncs.com/v1/chat/completions"
    MODEL = "qwen3.5-plus"
```

**获取 API Key：**
1. 访问 https://bailian.console.aliyun.com/
2. 进入「API-KEY 管理」
3. 创建或复制你的 API Key

### 4. 运行

#### 命令行模式
```bash
source venv_excel/bin/activate
python scripts/excel_ai_processor_v2.py input.xlsx -c 产品名称 -t "生成营销文案" -o 营销文案
```

#### Python 代码模式
```python
from scripts.excel_ai_processor_v2 import ExcelAIProcessor, Config

# 配置
config = Config()
config.API_KEY = "你的 API Key"

# 创建处理器
processor = ExcelAIProcessor(config)

# 处理 Excel
output_path = processor.process_excel_file(
    "input.xlsx",
    task="为每个产品写一段 50 字以内的营销文案",
    column_name="产品名称",
    output_column="营销文案"
)
```

---

## 📖 使用示例

### 示例 1：生成营销文案
```bash
python excel_ai_processor_v2.py products.xlsx \
  -c 产品名称 \
  -t "为每个产品写一段 50 字以内的营销文案" \
  -o 营销文案
```

### 示例 2：数据分类
```python
df = processor.classify_data(
    df,
    column_name="评论",
    categories=["正面评价", "负面评价", "中性评价"],
    output_column="情感分类"
)
```

### 示例 3：数据分析
```python
analysis = processor.analyze_column(
    df,
    column_name="销量",
    task="分析销售趋势和原因"
)
print(analysis)
```

### 示例 4：批量内容生成
```python
def progress_callback(current, total, result):
    print(f"进度：{current}/{total}")

df = processor.batch_process(
    df,
    column_name="产品描述",
    task="翻译成英文",
    output_column="英文描述",
    progress_callback=progress_callback
)
```

---

## 🔧 API 配置选项

### 阿里云百炼（推荐）
```python
API_KEY = "sk-xxx"
API_URL = "https://coding.dashscope.aliyuncs.com/v1/chat/completions"
MODEL = "qwen3.5-plus"
```

### OpenAI
```python
API_KEY = "sk-xxx"
API_URL = "https://api.openai.com/v1/chat/completions"
MODEL = "gpt-4o"
```

### 其他兼容服务
```python
API_KEY = "your-key"
API_URL = "https://your-api.com/v1/chat/completions"
MODEL = "model-name"
```

---

## 📁 文件结构

```
/home/tenbox/.openclaw/workspace/
├── scripts/
│   ├── excel_ai_processor_v2.py    # 主程序（OpenAI 兼容版）
│   ├── excel_ai_processor.py        # 旧版本（DashScope SDK）
│   └── create_test_excel.py         # 测试数据生成
├── output/                          # 输出目录
│   └── *.xlsx                       # 处理后的 Excel 文件
└── venv_excel/                      # Python 虚拟环境
```

---

## ⚠️ 注意事项

1. **API Key 安全**
   - 不要将 API Key 提交到 Git
   - 使用环境变量或配置文件

2. **批量处理限流**
   - 默认延迟 0.5 秒/请求
   - 可根据 API 限制调整 `BATCH_DELAY`

3. **Token 限制**
   - 单次请求最大 2000 tokens
   - 大数据集建议分批处理

---

## 🎯 典型应用场景

| 场景 | 任务示例 |
|------|----------|
| 电商 | 批量生成产品描述、营销文案 |
| 客服 | 自动分类客户反馈、情感分析 |
| 教育 | 批改作业、生成评语 |
| 金融 | 数据分析、风险评估 |
| 人力资源 | 简历筛选、面试评价 |

---

**完整代码：** `/home/tenbox/.openclaw/workspace/scripts/excel_ai_processor_v2.py`
