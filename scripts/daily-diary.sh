#!/bin/bash
# 每日日记生成脚本 - 小爪 🐾
# 自动总结当天的活动和事件

# 配置
MEMORY_DIR="/home/tenbox/.openclaw/workspace/memory"
LOG_FILE="$MEMORY_DIR/daily-diary.log"
TODAY=$(date '+%Y-%m-%d')
DIARY_FILE="$MEMORY_DIR/$TODAY-diary.md"

echo "📝 生成 $TODAY 的日记..." >> "$LOG_FILE"

# 生成简化版日记
cat > "$DIARY_FILE" <<EOF
# 📔 $TODAY 日记 - 小爪的日常 🐾

**生成时间：** $(date '+%Y-%m-%d %H:%M:%S')

---

## 📌 今日完成

EOF

# 从 daily notes 提取重要内容
if [ -f "$MEMORY_DIR/$TODAY.md" ]; then
    echo "" >> "$DIARY_FILE"
    echo "查看完整记录：\`$MEMORY_DIR/$TODAY.md\`" >> "$DIARY_FILE"
    echo "" >> "$DIARY_FILE"
else
    echo "" >> "$DIARY_FILE"
    echo "今日暂无特别记录" >> "$DIARY_FILE"
    echo "" >> "$DIARY_FILE"
fi

# 明日待办
echo "## 🎯 明日计划" >> "$DIARY_FILE"
echo "" >> "$DIARY_FILE"
echo "- [ ] 待添加..." >> "$DIARY_FILE"
echo "" >> "$DIARY_FILE"
echo "*日记由小爪自动生成，如需修改请编辑此文件* 🐾" >> "$DIARY_FILE"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 日记已生成：$DIARY_FILE" >> "$LOG_FILE"
echo "日记生成完成！"
