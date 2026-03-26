---
name: tts-dingtalk
description: |
  Convert text to speech using edge-tts and send the audio to DingTalk.
  Use when: (1) User wants to send voice messages to DingTalk contacts. (2) Converting text content to audio and delivering it via DingTalk. (3) TTS output needs to be sent to specific DingTalk users or groups.
---

# TTS-DingTalk Skill

## Overview

Convert text to speech and send the resulting audio file to DingTalk contacts. Combines edge-tts for text-to-speech conversion with OpenClaw's DingTalk messaging integration.

## Quick Start

When user wants to send a voice message to DingTalk:

```bash
# Send text as voice to DingTalk
openclaw message send --channel dingtalk --target "user:<USER_ID>" --media $(tts-converter.js "你好，这是一条语音消息" --voice zh-CN-XiaoxiaoNeural --output /tmp/voice.mp3 && echo /tmp/voice.mp3)
```

Or use the bundled script for a streamlined workflow:

```bash
cd ~/.openclaw/workspace/skills/tts-dingtalk/scripts
./send-tts-to-dingtalk.sh "<USER_ID>" "<TEXT_CONTENT>" [VOICE_NAME]
```

## Usage

### Method 1: Using the Send Script (Recommended)

```bash
cd ~/.openclaw/workspace/skills/tts-dingtalk/scripts
./send-tts-to-dingtalk.sh "01044313660620173232" "你好，这是一条测试语音" "zh-CN-XiaoxiaoNeural"
```

**Parameters:**
- `$1`: DingTalk User ID (required)
- `$2`: Text content to convert (required)
- `$3`: Voice name (optional, default: zh-CN-XiaoxiaoNeural)

### Method 2: Manual Steps

1. **Generate audio with edge-tts:**
   ```bash
   cd ~/.openclaw/workspace/skills/edge-tts/scripts
   node tts-converter.js "Your text here" --voice zh-CN-XiaoxiaoNeural --output /tmp/output.mp3
   ```

2. **Send to DingTalk:**
   ```bash
   openclaw message send --channel dingtalk --target "user:<USER_ID>" --media /tmp/output.mp3
   ```

## Voice Options

Common Chinese voices:
- `zh-CN-XiaoxiaoNeural` (female, natural, **default**)
- `zh-CN-YunxiNeural` (male, natural)
- `zh-CN-XiaoyiNeural` (female, gentle)

For full voice list, see edge-tts skill documentation.

## Prerequisites

1. **edge-tts skill** must be installed:
   ```bash
   skillhub install edge-tts
   ```

2. **DingTalk configuration** must be set up in OpenClaw

3. **Target User ID** must be known (use format: `user:<USER_ID>`)

## Scripts

### scripts/send-tts-to-dingtalk.sh
Main script that combines TTS generation and DingTalk sending in one command.

**Features:**
- Auto-generates unique temp file names
- Cleans up temp files after sending
- Provides clear error messages
- Supports custom voice selection

## Workflow

1. **Validate input**: Check user ID and text content
2. **Generate audio**: Use edge-tts to convert text to MP3
3. **Send message**: Use OpenClaw's dingtalk channel to deliver audio
4. **Cleanup**: Remove temporary audio file

## Error Handling

Common issues and solutions:

- **"edge-tts not found"**: Install edge-tts skill first
- **"Unknown target"**: Verify DingTalk User ID format (should be `user:<ID>`)
- **"ModuleNotFoundError"**: Run `npm install` in edge-tts/scripts directory
- **Send fails**: Check DingTalk configuration and user permissions

## Notes

- Audio files are temporarily stored in `/tmp/` and auto-cleaned
- Default voice is `zh-CN-XiaoxiaoNeural` (Chinese female)
- Supports all edge-tts voice options and parameters
- Message delivery status is returned by OpenClaw
