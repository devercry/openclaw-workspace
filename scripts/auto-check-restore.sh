#!/bin/bash
# 🐾 OpenClaw 自动检查恢复脚本
# 用法：
#   手动运行：./scripts/auto-check-restore.sh
#   自动运行：git hook 自动调用
#   静默模式：./scripts/auto-check-restore.sh --quiet
# 
# 自动检测配置变更，自动安装缺失的插件

set -e

WORKSPACE=~/.openclaw/workspace
OPENCLAW_DIR=~/.openclaw
CONFIG_FILE=~/.openclaw/openclaw.json
RESTORE_SCRIPT=$WORKSPACE/scripts/restore-config.sh

# 检查是否静默模式
QUIET_MODE=false
if [ "$1" == "--quiet" ]; then
    QUIET_MODE=true
fi

if [ "$QUIET_MODE" == "false" ]; then
    echo "═══════════════════════════════════════════════════════════"
    echo "  🐾 OpenClaw 自动检查恢复"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
fi

# 检查配置文件是否存在
if [ ! -f "$CONFIG_FILE" ]; then
    echo "⚠️  配置文件不存在，跳过检查"
    exit 0
fi

# 检查恢复脚本是否存在
if [ ! -f "$RESTORE_SCRIPT" ]; then
    echo "⚠️  恢复脚本不存在，跳过检查"
    exit 0
fi

# 提取配置中的频道
echo "🔍 扫描配置中的频道..."
CHANNELS_IN_CONFIG=$(cat $CONFIG_FILE | grep -oP '"(qqbot|dingtalk|telegram|whatsapp|discord|slack|feishu)"' | tr -d '"' | sort -u)

if [ -z "$CHANNELS_IN_CONFIG" ]; then
    echo "   未发现频道配置"
    echo ""
    echo "✅ 配置正常，无需恢复"
    exit 0
fi

echo "   检测到的频道："
for channel in $CHANNELS_IN_CONFIG; do
    echo "     - $channel"
done

# 检查已加载的插件
echo ""
echo "🔍 检查已加载的插件..."

MISSING_PLUGINS=()

for channel in $CHANNELS_IN_CONFIG; do
    # 检查插件是否已加载
    if openclaw plugins list 2>&1 | grep -qi "$channel.*loaded"; then
        echo "   ✅ $channel 已加载"
    else
        echo "   ⚠️  $channel 未加载"
        MISSING_PLUGINS+=("$channel")
    fi
done

# 如果有缺失的插件
if [ ${#MISSING_PLUGINS[@]} -gt 0 ]; then
    if [ "$QUIET_MODE" == "false" ]; then
        echo ""
        echo "═══════════════════════════════════════════════════════════"
        echo "  ⚠️  发现缺失的插件！"
        echo "═══════════════════════════════════════════════════════════"
        echo ""
        echo "缺失的插件："
        for plugin in "${MISSING_PLUGINS[@]}"; do
            echo "   - $plugin"
        done
        echo ""
        echo "🔧 正在自动运行恢复脚本..."
        echo ""
    fi
    
    # 运行恢复脚本
    bash $RESTORE_SCRIPT
    
else
    if [ "$QUIET_MODE" == "false" ]; then
        echo ""
        echo "═══════════════════════════════════════════════════════════"
        echo "  ✅ 所有插件已就绪，配置正常！"
        echo "═══════════════════════════════════════════════════════════"
    fi
fi
