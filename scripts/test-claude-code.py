#!/usr/bin/env python3
"""
Claude Code 测试脚本
验证 easier-claude-cli + 阿里云 API 配置是否正常
"""

import subprocess
import sys
import os

# 配置
CLAUDE_BIN = "/home/tenbox/.openclaw/workspace/easier-claude-cli/cli-dev"
WORKSPACE = "/home/tenbox/.openclaw/workspace"

ENV = {
    **os.environ,
    "CLAUDE_CODE_USE_OPENAI": "1",
    "OPENAI_API_KEY": "sk-sp-0d77815efb7e4c81b95184598ea25f3a",
    "OPENAI_BASE_URL": "https://coding.dashscope.aliyuncs.com/v1",
    "OPENAI_MODEL": "qwen3.5-plus",
}

def run_claude(task, max_turns=5):
    """运行 Claude Code 任务"""
    cmd = [CLAUDE_BIN, "-p", task, "--max-turns", str(max_turns)]
    
    result = subprocess.run(
        cmd,
        cwd=WORKSPACE,
        env=ENV,
        capture_output=True,
        text=True,
        timeout=300
    )
    
    return result.stdout, result.stderr, result.returncode

def main():
    print("🧪 Claude Code 配置测试")
    print("=" * 50)
    print()
    
    # 测试任务
    task = "用一句话回答：1+1 等于多少？不需要解释。"
    
    print(f"任务：{task}")
    print()
    print("运行中...")
    print()
    
    stdout, stderr, code = run_claude(task, max_turns=3)
    
    print("输出:")
    print("-" * 50)
    print(stdout)
    
    if stderr:
        print("错误:")
        print(stderr)
    
    print("-" * 50)
    print(f"退出码：{code}")
    
    if code == 0 and "2" in stdout:
        print("\n✅ 测试成功！Claude Code 配置正常。")
        return 0
    else:
        print("\n⚠️ 测试完成，但可能需要检查配置。")
        return 1

if __name__ == "__main__":
    sys.exit(main())
