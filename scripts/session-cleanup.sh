#!/bin/bash
# 会话清理脚本 - 小爪 🐾
# 清理超过指定天数的会话记录

# 配置
SESSIONS_DIR="/home/tenbox/.openclaw/sessions"
MEMORY_DIR="/home/tenbox/.openclaw/workspace/memory"
LOG_FILE="/home/tenbox/.openclaw/workspace/memory/session-cleanup.log"
RETENTION_DAYS=7  # 保留最近 7 天的会话

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$TIMESTAMP] 开始清理会话..." >> "$LOG_FILE"

# 统计
DELETED_COUNT=0
KEPT_COUNT=0

# 清理 sessions 目录中的旧会话
if [ -d "$SESSIONS_DIR" ]; then
    echo "[$TIMESTAMP] 检查 $SESSIONS_DIR" >> "$LOG_FILE"
    
    # 查找并删除超过保留天数的会话文件
    while IFS= read -r -d '' file; do
        if [ -f "$file" ]; then
            rm -f "$file"
            DELETED_COUNT=$((DELETED_COUNT + 1))
            echo "[$TIMESTAMP] 已删除：$file" >> "$LOG_FILE"
        fi
    done < <(find "$SESSIONS_DIR" -type f -name "*.json" -mtime +$RETENTION_DAYS -print0 2>/dev/null)
    
    # 统计保留的会话
    KEPT_COUNT=$(find "$SESSIONS_DIR" -type f -name "*.json" -mtime -$RETENTION_DAYS 2>/dev/null | wc -l)
fi

# 清理旧的 memory daily notes (保留最近 30 天)
if [ -d "$MEMORY_DIR" ]; then
    echo "[$TIMESTAMP] 检查 $MEMORY_DIR" >> "$LOG_FILE"
    
    OLD_MEMORIES=$(find "$MEMORY_DIR" -type f -name "202*.md" -mtime +30 2>/dev/null | wc -l)
    if [ "$OLD_MEMORIES" -gt 0 ]; then
        find "$MEMORY_DIR" -type f -name "202*.md" -mtime +30 -delete 2>/dev/null
        echo "[$TIMESTAMP] 清理了 $OLD_MEMORIES 个旧的 daily notes" >> "$LOG_FILE"
    fi
fi

# 清理日志文件 (保留最近 1000 行)
for log in "$LOG_FILE" "/home/tenbox/.openclaw/workspace/memory/system-monitor.log"; do
    if [ -f "$log" ]; then
        tail -n 1000 "$log" > "${log}.tmp" && mv "${log}.tmp" "$log"
    fi
done

echo "[$TIMESTAMP] 清理完成 - 删除：$DELETED_COUNT 个会话，保留：$KEPT_COUNT 个会话" >> "$LOG_FILE"
echo "[$TIMESTAMP] ----------------------------------------" >> "$LOG_FILE"
