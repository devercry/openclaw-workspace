#!/bin/bash
#
# Send TTS voice message to DingTalk
# Usage: ./send-tts-to-dingtalk.sh <USER_ID> <TEXT_CONTENT> [VOICE_NAME]
#

set -e

# Parse arguments
USER_ID="$1"
TEXT_CONTENT="$2"
VOICE_NAME="${3:-zh-CN-XiaoxiaoNeural}"

# Validate input
if [ -z "$USER_ID" ]; then
    echo "Error: User ID is required"
    echo "Usage: $0 <USER_ID> <TEXT_CONTENT> [VOICE_NAME]"
    exit 1
fi

if [ -z "$TEXT_CONTENT" ]; then
    echo "Error: Text content is required"
    echo "Usage: $0 <USER_ID> <TEXT_CONTENT> [VOICE_NAME]"
    exit 1
fi

# Check if edge-tts skill exists
EDGE_TTS_SCRIPT="$HOME/.openclaw/workspace/skills/edge-tts/scripts/tts-converter.js"
if [ ! -f "$EDGE_TTS_SCRIPT" ]; then
    echo "Error: edge-tts skill not found at $EDGE_TTS_SCRIPT"
    echo "Please install it first: skillhub install edge-tts"
    exit 1
fi

# Generate unique temp file
TEMP_FILE="/tmp/tts-dingtalk-$(date +%s)-$$.mp3"

echo "🎙️  Converting text to speech..."
echo "   Text: $TEXT_CONTENT"
echo "   Voice: $VOICE_NAME"

# Generate audio using edge-tts
cd "$HOME/.openclaw/workspace/skills/edge-tts/scripts"
node tts-converter.js "$TEXT_CONTENT" --voice "$VOICE_NAME" --output "$TEMP_FILE"

if [ ! -f "$TEMP_FILE" ]; then
    echo "Error: Failed to generate audio file"
    exit 1
fi

echo "✅ Audio generated: $TEMP_FILE"

# Format target (add user: prefix if not present)
if [[ "$USER_ID" != user:* ]]; then
    TARGET="user:$USER_ID"
else
    TARGET="$USER_ID"
fi

echo "📤 Sending to DingTalk..."
echo "   Target: $TARGET"

# Send to DingTalk
openclaw message send --channel dingtalk --target "$TARGET" --media "$TEMP_FILE"

# Cleanup
rm -f "$TEMP_FILE"
echo "🧹 Cleaned up temp file"

echo "✨ Done!"
