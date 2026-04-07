#!/bin/bash
# 🐾 恢复自动任务和内存数据库

set -e

echo "═══════════════════════════════════════════════════════════"
echo "  🐾 恢复自动任务和内存数据库"
echo "═══════════════════════════════════════════════════════════"
echo ""

# 1. 创建 cron 目录
echo "📁 步骤 1: 创建 cron 目录..."
mkdir -p ~/.openclaw/cron

# 2. 从备份恢复 cron 任务配置
echo "📋 步骤 2: 恢复 cron 任务配置..."
cd ~/.openclaw/workspace

# 提取备份中的 cron 配置，更新为当前模型
cat > ~/.openclaw/cron/jobs.json << 'EOF'
{
  "version": 1,
  "jobs": [
    {
      "id": "daily-git-backup-9am",
      "agentId": "main",
      "name": "daily-git-backup-9am",
      "enabled": true,
      "schedule": {
        "kind": "cron",
        "expr": "0 9 * * *",
        "tz": "Asia/Shanghai"
      },
      "sessionTarget": "main",
      "payload": {
        "kind": "systemEvent",
        "text": "每日 Git 备份：cd /home/tenbox/.openclaw/workspace && git add -A && git commit -m \"Backup $(date +%Y-%m-%d)\" && git push origin master"
      }
    },
    {
      "id": "daily-git-backup-4pm",
      "agentId": "main",
      "name": "daily-git-backup-4pm",
      "enabled": true,
      "schedule": {
        "kind": "cron",
        "expr": "0 16 * * *",
        "tz": "Asia/Shanghai"
      },
      "sessionTarget": "main",
      "payload": {
        "kind": "systemEvent",
        "text": "每日 Git 备份（下午）：cd /home/tenbox/.openclaw/workspace && git add -A && git commit -m \"Backup $(date +%Y-%m-%d %H:%M)\" && git push origin master"
      }
    }
  ]
}
EOF

echo "   ✅ cron 任务已配置"
echo "      - 每天 9:00 AM 自动备份"
echo "      - 每天 4:00 PM 自动备份"

# 3. 恢复内存数据库
echo ""
echo "🧠 步骤 3: 恢复内存数据库..."

# 从备份中提取数据库文件
git show 348ceeb:.openclaw-backup/graph-memory.db > ~/.openclaw/graph-memory.db 2>/dev/null || echo "   ⚠️  graph-memory.db 不存在于备份中"
git show 348ceeb:.openclaw-backup/memory/main.sqlite > ~/.openclaw/memory.sqlite 2>/dev/null || echo "   ⚠️  memory.sqlite 不存在于备份中"

echo "   ✅ 内存数据库已恢复"

# 4. 配置 graph-memory 插件
echo ""
echo "🔧 步骤 4: 配置 graph-memory 插件..."

# 检查 graph-memory 是否已安装
if [ -d "~/.openclaw/extensions/graph-memory" ]; then
    echo "   ✅ graph-memory 插件已安装"
else
    echo "   ⚠️  graph-memory 插件未安装，需要手动配置"
fi

# 5. 更新 openclaw.json 添加 memorySearch 配置
echo ""
echo "⚙️  步骤 5: 更新 openclaw.json 配置..."

# 读取当前配置并添加 memorySearch
python3 << 'PYTHON'
import json

with open('/home/tenbox/.openclaw/openclaw.json', 'r') as f:
    config = json.load(f)

# 添加 memorySearch 配置
if 'agents' not in config:
    config['agents'] = {}
if 'defaults' not in config['agents']:
    config['agents']['defaults'] = {}

config['agents']['defaults']['memorySearch'] = {
    'enabled': True,
    'provider': 'openai',  # 需要配置 OPENAI_API_KEY
    'embedding': {
        'model': 'text-embedding-3-small',
        'dimensions': 1536
    }
}

# 添加 graph-memory 插件配置
if 'plugins' not in config:
    config['plugins'] = {}
if 'entries' not in config['plugins']:
    config['plugins']['entries'] = {}

config['plugins']['entries']['graph-memory'] = {
    'enabled': True
}

with open('/home/tenbox/.openclaw/openclaw.json', 'w') as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

print("   ✅ openclaw.json 已更新")
PYTHON

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ⚠️  需要配置 Embedding Provider"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "内存数据库需要 embedding provider 才能工作。选择以下任一方案："
echo ""
echo "方案 1: OpenAI（推荐）"
echo "  export OPENAI_API_KEY=\"你的 key\""
echo ""
echo "方案 2: Google Gemini"
echo "  export GEMINI_API_KEY=\"你的 key\""
echo ""
echo "方案 3: Voyage AI"
echo "  export VOYAGE_API_KEY=\"你的 key\""
echo ""
echo "方案 4: 本地模型（无需 API Key）"
echo "  配置 agents.defaults.memorySearch.provider 为本地模型"
echo ""
echo "配置后运行："
echo "  openclaw gateway restart"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ 恢复完成！"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "验证命令："
echo "  openclaw cron list           # 查看定时任务"
echo "  openclaw memory status       # 查看内存搜索状态"
echo ""
