#!/usr/bin/env python3
# 创建测试 Excel 文件

import pandas as pd

# 创建测试数据
df = pd.DataFrame({
    "产品名称": ["智能手机 X1", "笔记本电脑 Pro", "平板电脑 Air", "智能手表 S3", "无线耳机 B2"],
    "价格": [2999, 5999, 3499, 1999, 599],
    "特点": ["5G、高清摄像、长续航", "高性能处理器、16GB 内存", "轻薄设计、12 小时续航", "心率监测、GPS 定位", "主动降噪、30 小时续航"],
    "库存": [500, 200, 350, 800, 1000]
})

# 保存
df.to_excel("/home/tenbox/.openclaw/workspace/output/test_products.xlsx", index=False)
print("✅ 测试文件已创建：/home/tenbox/.openclaw/workspace/output/test_products.xlsx")
print(f"   共 {len(df)} 行数据")
