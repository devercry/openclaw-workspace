#!/bin/bash
# 每日科技新闻整理 - 小爪 🐾
# 使用 tech-news-digest 技能生成新闻摘要

# 配置
SKILL_DIR="/home/tenbox/.openclaw/workspace/skills/tech-news-digest"
WORKSPACE="/home/tenbox/.openclaw/workspace"
ARCHIVE_DIR="$WORKSPACE/archive/tech-news-digest"
DATE=$(date '+%Y-%m-%d')
OUTPUT_FILE="/tmp/td-merged.json"
DIGEST_FILE="$WORKSPACE/memory/daily-news-$DATE.md"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] 开始生成每日科技新闻..."

# 创建归档目录
mkdir -p "$ARCHIVE_DIR"

# 运行数据收集流水线
python3 "$SKILL_DIR/scripts/run-pipeline.py" \
  --defaults "$SKILL_DIR/config/defaults" \
  --config "$WORKSPACE/config" \
  --hours 24 \
  --freshness pd \
  --archive-dir "$ARCHIVE_DIR" \
  --output "$OUTPUT_FILE" \
  --verbose \
  --force 2>&1

if [ $? -eq 0 ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 数据收集完成，生成摘要..."
    
    # 获取数据概览
    python3 "$SKILL_DIR/scripts/summarize-merged.py" \
      --input "$OUTPUT_FILE" \
      --top 5 \
      --verbose 2>&1 | head -50 > "$DIGEST_FILE"
    
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 新闻摘要已生成：$DIGEST_FILE"
    echo "新闻整理完成！"
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 数据收集失败，使用简化版本..."
    
    # 简化版本
    cat > "$DIGEST_FILE" << EOF
# 📰 每日科技新闻 - $DATE

## 🔥 今日热点

### 💻 推荐阅读
- [GitHub Trending](https://github.com/trending)
- [Hacker News](https://news.ycombinator.com/)
- [Reddit r/technology](https://www.reddit.com/r/technology/)

*数据收集暂时不可用* 🐾
EOF
    echo "已生成简化版新闻摘要"
fi
