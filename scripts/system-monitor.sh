#!/bin/bash
# 系统资源监控脚本 - 小爪 🐾
# 监控 CPU、内存使用情况，超过阈值发送通知

# 配置
CPU_THRESHOLD=80        # CPU 告警阈值 (%)
MEM_THRESHOLD=80        # 内存告警阈值 (%)
DISK_THRESHOLD=85       # 磁盘告警阈值 (%)
LOG_FILE="/home/tenbox/.openclaw/workspace/memory/system-monitor.log"
NOTIFY_CHANNEL="qqbot:c2c:o5MewEXqAe9eAgDkIqOxW6gHsU6jMzdH"

# 获取当前时间
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# 获取 CPU 使用率
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}' | cut -d'.' -f1)
if [ -z "$CPU_USAGE" ] || [ "$CPU_USAGE" = "100" ]; then
    # 备用方法：使用 /proc/stat
    CPU_LINE=$(head -1 /proc/stat)
    CPU_VALUES=($CPU_LINE)
    IDLE=${CPU_VALUES[4]}
    TOTAL=0
    for VAL in "${CPU_VALUES[@]:1}"; do TOTAL=$((TOTAL + VAL)); done
    CPU_USAGE=$((100 - (IDLE * 100 / TOTAL)))
fi

# 确保是整数
CPU_USAGE=${CPU_USAGE:-0}
CPU_USAGE=$(printf "%.0f" "$CPU_USAGE" 2>/dev/null || echo "0")

# 获取内存使用率
MEM_INFO=$(free | grep Mem)
MEM_TOTAL=$(echo "$MEM_INFO" | awk '{print $2}')
MEM_USED=$(echo "$MEM_INFO" | awk '{print $3}')
if [ -n "$MEM_TOTAL" ] && [ "$MEM_TOTAL" -gt 0 ]; then
    MEM_USAGE=$((MEM_USED * 100 / MEM_TOTAL))
else
    MEM_USAGE=0
fi

# 获取磁盘使用率 (根分区)
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | cut -d'%' -f1)

# 获取系统负载
LOAD_AVG=$(cat /proc/loadavg | awk '{print $1, $2, $3}')

# 记录日志
echo "[$TIMESTAMP] CPU: ${CPU_USAGE}% | MEM: ${MEM_USAGE}% | DISK: ${DISK_USAGE}% | LOAD: $LOAD_AVG" >> "$LOG_FILE"

# 检查是否超过阈值
ALERTS=""

if [ "$CPU_USAGE" -ge "$CPU_THRESHOLD" ]; then
    ALERTS="${ALERTS}⚠️ CPU 使用率过高：${CPU_USAGE}%\n"
fi

if [ "$MEM_USAGE" -ge "$MEM_THRESHOLD" ]; then
    ALERTS="${ALERTS}⚠️ 内存使用率过高：${MEM_USAGE}%\n"
fi

if [ "$DISK_USAGE" -ge "$DISK_THRESHOLD" ]; then
    ALERTS="${ALERTS}⚠️ 磁盘使用率过高：${DISK_USAGE}%\n"
fi

# 发送告警
if [ -n "$ALERTS" ]; then
    echo "[$TIMESTAMP] ALERT: $ALERTS" >> "$LOG_FILE"
    
    # 通过 OpenClaw 发送消息
    cat <<EOF | openclaw message send --channel qqbot --target "$NOTIFY_CHANNEL"
🚨 **系统资源告警** 🚨

$ALERTS
📊 当前状态:
- CPU: ${CPU_USAGE}%
- 内存：${MEM_USAGE}%
- 磁盘：${DISK_USAGE}%
- 负载：$LOAD_AVG

时间：$TIMESTAMP
主机：$(hostname)
EOF
    
    echo "[$TIMESTAMP] Alert sent!" >> "$LOG_FILE"
fi

# 保留最近 1000 行日志
tail -n 1000 "$LOG_FILE" > "${LOG_FILE}.tmp" && mv "${LOG_FILE}.tmp" "$LOG_FILE"

echo "Monitor check completed at $TIMESTAMP"
