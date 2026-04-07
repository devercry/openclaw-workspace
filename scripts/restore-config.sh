#!/bin/bash
# 🐾 OpenClaw 配置恢复脚本
# 用法：./restore-config.sh [备份提交 hash]

set -e

WORKSPACE=~/.openclaw/workspace
OPENCLAW_DIR=~/.openclaw
EXTENSIONS_DIR=~/.openclaw/extensions

echo "═══════════════════════════════════════════════════════════"
echo "  🐾 OpenClaw 配置恢复脚本"
echo "═══════════════════════════════════════════════════════════"

# 1. 从 git 恢复配置文件
echo ""
echo "📦 步骤 1: 恢复配置文件..."
cd $WORKSPACE
git pull origin main --allow-unrelated-histories --no-rebase || true

# 2. 扫描配置文件中的频道配置
echo ""
echo "🔍 步骤 2: 扫描需要的插件..."

CONFIG_FILE=~/.openclaw/openclaw.json

# 提取需要的频道插件
CHANNELS=$(cat $CONFIG_FILE | grep -oP '"(qqbot|dingtalk|telegram|whatsapp|discord|slack|feishu)"' | tr -d '"' | sort -u)

echo "检测到的频道插件："
for channel in $CHANNELS; do
    echo "  - $channel"
done

# 3. 检查并安装缺失的插件
echo ""
echo "📥 步骤 3: 检查并安装缺失的插件..."

for plugin in $CHANNELS; do
    PLUGIN_PATH="$EXTENSIONS_DIR/$plugin"
    
    if [ -d "$PLUGIN_PATH" ]; then
        echo "  ✅ $plugin 已安装"
    else
        echo "  ⚠️  $plugin 未安装，正在安装..."
        
        # 尝试从 npm 安装
        if npm list -g @openclaw-china/$plugin &>/dev/null; then
            echo "     从全局 npm 包复制..."
            mkdir -p $EXTENSIONS_DIR
            cp -r ~/.npm-global/lib/node_modules/@openclaw-china/$plugin $PLUGIN_PATH
            echo "     ✅ 安装完成"
        elif npm list -g @openclaw/$plugin &>/dev/null; then
            echo "     从全局 npm 包复制..."
            mkdir -p $EXTENSIONS_DIR
            cp -r ~/.npm-global/lib/node_modules/@openclaw/$plugin $PLUGIN_PATH
            echo "     ✅ 安装完成"
        else
            echo "     尝试从 npm 安装..."
            npm install -g @openclaw-china/$plugin 2>/dev/null || \
            npm install -g @openclaw/$plugin 2>/dev/null || {
                echo "     ❌ 安装失败，请手动安装"
                continue
            }
            
            # 复制插件
            mkdir -p $EXTENSIONS_DIR
            cp -r ~/.npm-global/lib/node_modules/@openclaw-china/$plugin $PLUGIN_PATH 2>/dev/null || \
            cp -r ~/.npm-global/lib/node_modules/@openclaw/$plugin $PLUGIN_PATH 2>/dev/null || {
                echo "     ❌ 复制失败"
                continue
            }
            echo "     ✅ 安装完成"
        fi
    fi
done

# 4. 扫描技能包
echo ""
echo "🔍 步骤 4: 扫描技能包..."

SKILLS_DIR=$WORKSPACE/skills
if [ -d "$SKILLS_DIR" ]; then
    echo "  ✅ 技能目录存在"
    ls -la $SKILLS_DIR | head -10
fi

# 5. 重启 Gateway
echo ""
echo "🔄 步骤 5: 重启 Gateway..."
openclaw gateway restart

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ 恢复完成！"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "验证命令："
echo "  openclaw channels list   # 查看频道状态"
echo "  openclaw plugins list    # 查看插件状态"
echo ""
