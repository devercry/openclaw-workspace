#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Excel AI 处理程序 (OpenAI 兼容版本)
====================================

使用 OpenAI 兼容 API 格式，适用于：
- 阿里云百炼 (coding.dashscope.aliyuncs.com)
- OpenAI
- 其他兼容服务

作者：Claude Code (via easier-claude-cli)
日期：2026-04-10
"""

import openpyxl
import pandas as pd
import requests
import json
import os
import time
from typing import List, Dict, Optional, Callable
from datetime import datetime

# ==================== 配置区域 ====================

class Config:
    """AI 和 Excel 处理配置"""
    
    # 阿里云百炼 API 配置（使用 OpenAI 兼容格式）
    API_KEY = "sk-sp-0d77815efb7e4c81b95184598ea25f3a"
    API_URL = "https://coding.dashscope.aliyuncs.com/v1/chat/completions"
    MODEL = "qwen3.5-plus"
    
    # 请求超时时间（秒）
    TIMEOUT = 60
    
    # 批量处理时的延迟（避免 API 限流）
    BATCH_DELAY = 0.5
    
    # 输出目录
    OUTPUT_DIR = "/home/tenbox/.openclaw/workspace/output"


# ==================== AI 处理类 ====================

class ExcelAIProcessor:
    """Excel AI 处理器（OpenAI 兼容 API）"""
    
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
        调用 AI API 处理文本（OpenAI 兼容格式）
        
        Args:
            prompt: 用户输入
            system_prompt: 系统提示词
            
        Returns:
            AI 返回的文本结果
        """
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
            
            if "choices" in result and len(result["choices"]) > 0:
                return result["choices"][0]["message"]["content"]
            elif "error" in result:
                return f"⚠️ AI 错误：{result['error'].get('message', '未知错误')}"
            else:
                return f"⚠️ 未知响应格式：{json.dumps(result, ensure_ascii=False)[:200]}"
                
        except requests.exceptions.Timeout:
            return "⚠️ AI 请求超时，请稍后重试"
        except requests.exceptions.RequestException as e:
            return f"⚠️ AI 请求失败：{str(e)}"
        except Exception as e:
            return f"⚠️ AI 异常：{str(e)}"
    
    def analyze_column(self, df: pd.DataFrame, column_name: str, 
                       task: str = "分析这列数据的特征和趋势") -> str:
        """分析 Excel 中的某一列数据"""
        if column_name not in df.columns:
            return f"⚠️ 列 '{column_name}' 不存在"
        
        # 获取列数据（前 100 行避免 token 超限）
        data_sample = df[column_name].head(100).tolist()
        data_str = "\n".join([str(x) for x in data_sample if pd.notna(x)])
        
        prompt = f"""请分析以下数据列：{column_name}

{task}

数据样本：
{data_str}

请给出详细的分析结果。"""
        return self.call_ai(prompt, system_prompt="你是一个专业的数据分析师。")
    
    def batch_process(self, df: pd.DataFrame, column_name: str,
                      task: str, output_column: str = "AI_处理结果",
                      progress_callback: Callable = None) -> pd.DataFrame:
        """批量处理某一列数据"""
        if column_name not in df.columns:
            raise ValueError(f"列 '{column_name}' 不存在")
        
        df[output_column] = None
        total = len(df)
        
        for idx, value in enumerate(df[column_name]):
            if pd.notna(value):
                prompt = f"""请处理以下数据：{value}

任务要求：{task}

请直接给出处理结果。"""
                result = self.call_ai(prompt)
                df.loc[idx, output_column] = result
                
                if progress_callback:
                    progress_callback(idx + 1, total, result)
                
                if idx < total - 1:
                    time.sleep(self.config.BATCH_DELAY)
        
        return df
    
    def classify_data(self, df: pd.DataFrame, column_name: str,
                      categories: List[str], output_column: str = "分类结果") -> pd.DataFrame:
        """对数据进行分类"""
        categories_str = "、".join(categories)
        
        def progress_callback(current, total, result):
            print(f"进度：{current}/{total} ({current/total*100:.1f}%)")
        
        task = f"请将以下内容分类到以下类别之一：{categories_str}\n只返回类别名称，不要其他内容。"
        return self.batch_process(df, column_name, task, output_column, progress_callback)
    
    def process_excel_file(self, input_path: str, task: str,
                           column_name: str, output_column: str = "AI_处理结果",
                           sheet_name: str = 0) -> str:
        """处理 Excel 文件"""
        print(f"📖 正在读取文件：{input_path}")
        
        df = pd.read_excel(input_path, sheet_name=sheet_name)
        print(f"✅ 读取完成，共 {len(df)} 行，{len(df.columns)} 列")
        print(f"   列名：{list(df.columns)}")
        
        print(f"🤖 开始 AI 处理：{task}")
        self.batch_process(df, column_name, task, output_column,
                          lambda c, t, r: print(f"   进度：{c}/{t}"))
        
        filename = os.path.basename(input_path)
        name, ext = os.path.splitext(filename)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = os.path.join(self.config.OUTPUT_DIR, f"{name}_AI_{timestamp}{ext}")
        
        print(f"💾 保存结果到：{output_path}")
        df.to_excel(output_path, index=False)
        
        print("✅ 处理完成！")
        return output_path


# ==================== 主函数 ====================

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Excel AI 处理程序")
    parser.add_argument("input", help="输入 Excel 文件路径")
    parser.add_argument("--column", "-c", required=True, help="要处理的列名")
    parser.add_argument("--task", "-t", required=True, help="处理任务描述")
    parser.add_argument("--output", "-o", default="AI_处理结果", help="输出列名")
    parser.add_argument("--sheet", "-s", default=0, help="工作表名或索引")
    parser.add_argument("--model", "-m", default="qwen3.5-plus", help="AI 模型")
    
    args = parser.parse_args()
    
    processor = ExcelAIProcessor()
    processor.config.MODEL = args.model
    
    output_path = processor.process_excel_file(
        args.input, args.task, args.column, args.output, args.sheet
    )
    
    print(f"\n🎉 处理完成！结果文件：{output_path}")


if __name__ == "__main__":
    import sys
    if len(sys.argv) == 1:
        print("用法：python excel_ai_processor.py <input.xlsx> -c <列名> -t <任务>")
        print("示例：python excel_ai_processor.py data.xlsx -c 产品名称 -t 生成营销文案")
    else:
        main()
