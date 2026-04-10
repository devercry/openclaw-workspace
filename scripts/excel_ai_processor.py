#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Excel AI 处理程序
================

功能：
- 读取 Excel 文件（.xlsx）
- 调用阿里云 DashScope AI API 处理表格数据
- 将处理结果写回 Excel
- 支持批量处理

作者：Claude Code (via easier-claude-cli)
日期：2026-04-10
"""

import openpyxl
import pandas as pd
import requests
import json
import os
from typing import List, Dict, Optional, Callable
from datetime import datetime

# ==================== 配置区域 ====================

class Config:
    """AI 和 Excel 处理配置"""
    
    # 阿里云 DashScope API 配置
    API_KEY = "sk-sp-0d77815efb7e4c81b95184598ea25f3a"
    API_URL = "https://coding.dashscope.aliyuncs.com/v1/chat/completions"  # 使用 coding 端点
    MODEL = "qwen3.5-plus"  # 或 qwen-turbo, qwen-max
    
    # 请求超时时间（秒）
    TIMEOUT = 30
    
    # 批量处理时的延迟（避免 API 限流）
    BATCH_DELAY = 0.5
    
    # 输出目录
    OUTPUT_DIR = "/home/tenbox/.openclaw/workspace/output"


# ==================== AI 处理类 ====================

class ExcelAIProcessor:
    """Excel AI 处理器"""
    
    def __init__(self, config: Config = None):
        self.config = config or Config()
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {self.config.API_KEY}",
            "Content-Type": "application/json"
        })
        
        # 确保输出目录存在
        os.makedirs(self.config.OUTPUT_DIR, exist_ok=True)
    
    def call_ai(self, prompt: str, system_prompt: str = "你是一个数据分析助手。") -> str:
        """
        调用 AI API 处理文本
        使用阿里云 DashScope SDK 方式
        
        Args:
            prompt: 用户输入
            system_prompt: 系统提示词
            
        Returns:
            AI 返回的文本结果
        """
        try:
            import dashscope
            dashscope.api_key = self.config.API_KEY
            
            response = dashscope.Generation.call(
                model=self.config.MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            if response.status_code == 200:
                return response.output.choices[0].message.content
            else:
                return f"⚠️ AI 请求失败：{response.code} - {response.message}"
                
        except ImportError:
            # SDK 未安装，使用 HTTP 方式（需要正确的 API Key）
            return self._call_ai_http(prompt, system_prompt)
        except Exception as e:
            return f"⚠️ AI 请求异常：{str(e)}"
    
    def _call_ai_http(self, prompt: str, system_prompt: str) -> str:
        """HTTP 方式调用（备用）"""
        payload = {
            "model": self.config.MODEL,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 2000
        }
        
        try:
            response = self.session.post(
                self.config.API_URL,
                json=payload,
                timeout=self.config.TIMEOUT
            )
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
        except requests.exceptions.Timeout:
            return "⚠️ AI 请求超时，请稍后重试"
        except requests.exceptions.RequestException as e:
            return f"⚠️ AI 请求失败：{str(e)}"
        except (KeyError, IndexError) as e:
            return f"⚠️ AI 响应解析失败：{str(e)}"
    
    def analyze_column(self, df: pd.DataFrame, column_name: str, 
                       task: str = "分析这列数据的特征和趋势") -> str:
        """
        分析 Excel 中的某一列数据
        
        Args:
            df: DataFrame
            column_name: 列名
            task: 分析任务描述
            
        Returns:
            分析结果
        """
        if column_name not in df.columns:
            return f"⚠️ 列 '{column_name}' 不存在"
        
        # 获取列数据（前 100 行避免 token 超限）
        data_sample = df[column_name].head(100).tolist()
        data_str = "\n".join([str(x) for x in data_sample if pd.notna(x)])
        
        prompt = f"""
请分析以下数据列：{column_name}

{task}

数据样本：
{data_str}

请给出详细的分析结果。
"""
        return self.call_ai(prompt, system_prompt="你是一个专业的数据分析师。")
    
    def generate_content(self, df: pd.DataFrame, row_index: int,
                         template: str, output_column: str) -> str:
        """
        根据模板为某一行生成内容
        
        Args:
            df: DataFrame
            row_index: 行索引
            template: 内容生成模板（使用 {列名} 占位）
            output_column: 输出列名
            
        Returns:
            生成的内容
        """
        # 构建提示词
        prompt = template
        for col in df.columns:
            value = df.loc[row_index, col]
            if pd.notna(value):
                prompt = prompt.replace(f"{{{col}}}", str(value))
        
        result = self.call_ai(prompt)
        
        # 写回 DataFrame
        df.loc[row_index, output_column] = result
        return result
    
    def batch_process(self, df: pd.DataFrame, column_name: str,
                      task: str, output_column: str = "AI_处理结果",
                      progress_callback: Callable = None) -> pd.DataFrame:
        """
        批量处理某一列数据
        
        Args:
            df: DataFrame
            column_name: 要处理的列
            task: 处理任务描述
            output_column: 输出列名
            progress_callback: 进度回调函数 (current, total, result)
            
        Returns:
            处理后的 DataFrame
        """
        import time
        
        if column_name not in df.columns:
            raise ValueError(f"列 '{column_name}' 不存在")
        
        # 创建输出列
        df[output_column] = None
        
        total = len(df)
        for idx, value in enumerate(df[column_name]):
            if pd.notna(value):
                prompt = f"""
请处理以下数据：{value}

任务要求：{task}

请直接给出处理结果。
"""
                result = self.call_ai(prompt)
                df.loc[idx, output_column] = result
                
                if progress_callback:
                    progress_callback(idx + 1, total, result)
                
                # 延迟避免限流
                if idx < total - 1:
                    time.sleep(self.config.BATCH_DELAY)
        
        return df
    
    def classify_data(self, df: pd.DataFrame, column_name: str,
                      categories: List[str], output_column: str = "分类结果") -> pd.DataFrame:
        """
        对数据进行分类
        
        Args:
            df: DataFrame
            column_name: 要分类的列
            categories: 分类列表
            output_column: 输出列名
            
        Returns:
            处理后的 DataFrame
        """
        categories_str = "、".join(categories)
        
        def progress_callback(current, total, result):
            print(f"进度：{current}/{total} ({current/total*100:.1f}%)")
        
        task = f"请将以下内容分类到以下类别之一：{categories_str}\n只返回类别名称，不要其他内容。"
        return self.batch_process(df, column_name, task, output_column, progress_callback)
    
    def process_excel_file(self, input_path: str, task: str,
                           column_name: str, output_column: str = "AI_处理结果",
                           sheet_name: str = 0) -> str:
        """
        处理 Excel 文件
        
        Args:
            input_path: 输入文件路径
            task: 处理任务
            column_name: 要处理的列
            output_column: 输出列名
            sheet_name: 工作表名或索引
            
        Returns:
            输出文件路径
        """
        print(f"📖 正在读取文件：{input_path}")
        
        # 读取 Excel
        df = pd.read_excel(input_path, sheet_name=sheet_name)
        print(f"✅ 读取完成，共 {len(df)} 行，{len(df.columns)} 列")
        print(f"   列名：{list(df.columns)}")
        
        # 处理数据
        print(f"🤖 开始 AI 处理：{task}")
        self.batch_process(df, column_name, task, output_column,
                          lambda c, t, r: print(f"   进度：{c}/{t}"))
        
        # 生成输出文件名
        filename = os.path.basename(input_path)
        name, ext = os.path.splitext(filename)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = os.path.join(self.config.OUTPUT_DIR, f"{name}_AI_{timestamp}{ext}")
        
        # 保存结果
        print(f"💾 保存结果到：{output_path}")
        df.to_excel(output_path, index=False)
        
        print("✅ 处理完成！")
        return output_path


# ==================== 使用示例 ====================

def example_usage():
    """使用示例"""
    
    # 创建处理器
    processor = ExcelAIProcessor()
    
    # 示例 1：分析数据列
    print("\n=== 示例 1：数据分析 ===")
    df = pd.DataFrame({
        "产品": ["手机", "电脑", "平板", "手表"],
        "价格": [2999, 5999, 3499, 1999],
        "销量": [1000, 500, 800, 1200]
    })
    
    analysis = processor.analyze_column(df, "销量", "分析销售趋势和原因")
    print(analysis)
    
    # 示例 2：批量处理
    print("\n=== 示例 2：批量内容生成 ===")
    df2 = pd.DataFrame({
        "产品名称": ["智能手机 X1", "笔记本电脑 Pro", "平板电脑 Air"],
        "价格": [2999, 5999, 3499],
        "特点": ["5G、高清摄像", "高性能、长续航", "轻薄、长待机"]
    })
    
    def generate_product_description(row):
        prompt = f"""
请为以下产品写一段营销文案（100 字以内）：
产品名称：{row['产品名称']}
价格：{row['价格']}元
特点：{row['特点']}

要求：突出产品优势，吸引消费者购买。
"""
        return processor.call_ai(prompt)
    
    df2['营销文案'] = df2.apply(generate_product_description, axis=1)
    print(df2[['产品名称', '营销文案']])
    
    # 示例 3：数据分类
    print("\n=== 示例 3：数据分类 ===")
    df3 = pd.DataFrame({
        "评论": [
            "质量很好，物流快",
            "价格太贵了，不划算",
            "客服态度差，不推荐",
            "性价比高，值得购买"
        ]
    })
    
    df3 = processor.classify_data(
        df3, 
        "评论", 
        ["正面评价", "负面评价", "中性评价"],
        "情感分类"
    )
    print(df3)


def main():
    """主函数 - 命令行入口"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Excel AI 处理程序 - 使用 AI 自动处理 Excel 数据"
    )
    parser.add_argument("input", help="输入 Excel 文件路径")
    parser.add_argument("--column", "-c", required=True, help="要处理的列名")
    parser.add_argument("--task", "-t", required=True, help="处理任务描述")
    parser.add_argument("--output", "-o", default="AI_处理结果", help="输出列名")
    parser.add_argument("--sheet", "-s", default=0, help="工作表名或索引")
    parser.add_argument("--model", "-m", default="qwen-plus", help="AI 模型")
    
    args = parser.parse_args()
    
    # 创建处理器
    processor = ExcelAIProcessor()
    processor.config.MODEL = args.model
    
    # 处理文件
    output_path = processor.process_excel_file(
        args.input,
        args.task,
        args.column,
        args.output,
        args.sheet
    )
    
    print(f"\n🎉 处理完成！结果文件：{output_path}")


if __name__ == "__main__":
    # 如果没有命令行参数，运行示例
    import sys
    if len(sys.argv) == 1:
        print("=" * 50)
        print("Excel AI 处理程序 - 使用示例")
        print("=" * 50)
        example_usage()
    else:
        main()
