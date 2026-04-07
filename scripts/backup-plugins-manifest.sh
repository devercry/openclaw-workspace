#!/bin/bash
# 🐾 OpenClaw 插件清单备份脚本
# 用法：./backup-plugins-manifest.sh

echo "📦 生成插件清单..."

# 生成已安装插件列表
openclaw plugins list --json 2>/dev/null | \
  jq '.plugins[] | select(.status == "loaded") | {name: .id, version: .version, source: .source}' \
  > ~/.openclaw/workspace/backup/plugins-manifest.json

echo "✅ 插件清单已保存到："
echo "   ~/.openclaw/workspace/backup/plugins-manifest.json"

# 同时生成频道配置清单
echo ""
echo "📡 生成频道配置清单..."
cat ~/.openclaw/openclaw.json | \
  jq '.channels | to_entries[] | {channel: .key, enabled: .value.enabled}' \
  > ~/.openclaw/workspace/backup/channels-manifest.json

echo "✅ 频道清单已保存到："
echo "   ~/.openclaw/workspace/backup/channels-manifest.json"
