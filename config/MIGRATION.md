# 迁移指南

## 新环境启动步骤

### 1. 安装 OpenClaw
按照官方文档安装 OpenClaw。

### 2. 克隆工作区
```bash
git clone https://github.com/devercry/openclaw-workspace.git ~/.openclaw/workspace
```

### 3. 运行配置向导（推荐）
```bash
openclaw configure
```
这会生成基础的 `openclaw.json` 配置文件。

### 4. 添加 API Keys
编辑 `~/.openclaw/openclaw.json`，在 `env.vars` 中添加：
```json
"env": {
  "vars": {
    "TAVILY_API_KEY": "your-tavily-key",
    "MATON_API_KEY": "your-maton-key"
  }
}
```

### 5. 安装依赖

#### GitHub CLI（用于 github 技能）
```bash
# Ubuntu/Debian
sudo apt install gh

# 登录
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
gh auth login
```

#### SkillHub
```bash
curl -fsSL https://skillhub-1388575217.cos.ap-guangzhou.myqcloud.com/install/install.sh | bash
```

### 6. 重启 OpenClaw
```bash
openclaw gateway restart
```

## 可能的问题

### 问题：技能报错 "missing"
**原因**：技能依赖的外部工具未安装
**解决**：安装对应的 CLI 工具（gh, skillhub 等）

### 问题：API 调用失败
**原因**：API Key 未配置或无效
**解决**：检查 `env.vars` 中的 API Keys

### 问题：模型不可用
**原因**：配置中的模型提供商不存在
**解决**：运行 `openclaw configure` 重新配置模型

## 最小可用配置

如果只想快速启动，使用 `openclaw-minimal.json`：
```bash
cp ~/.openclaw/workspace/config/openclaw-minimal.json ~/.openclaw/openclaw.json
# 编辑文件，替换 API Keys
openclaw gateway restart
```
