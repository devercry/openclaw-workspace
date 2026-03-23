# Dotfiles 备份

此目录包含其他重要配置文件的备份。

## 目录结构

```
dotfiles/
├── openclaw/          # ~/.openclaw/ 相关文件
│   ├── openclaw.json.bak    # 配置备份
│   └── update-check.json    # 更新检查状态
├── gh/                # ~/.config/gh/ 相关文件
│   └── config.yml     # GitHub CLI 配置（不含 hosts.yml - 包含 Token）
└── local/bin/         # ~/.local/bin/ 相关文件
    └── skillhub       # SkillHub CLI 工具
```

## 恢复方法

### OpenClaw 配置备份
```bash
cp dotfiles/openclaw/openclaw.json.bak ~/.openclaw/openclaw.json.bak
```

### GitHub CLI 配置
```bash
cp dotfiles/gh/config.yml ~/.config/gh/config.yml
# hosts.yml 需要手动创建（包含敏感 Token）
```

### SkillHub CLI
```bash
cp dotfiles/local/bin/skillhub ~/.local/bin/skillhub
chmod +x ~/.local/bin/skillhub
```

## 注意

- `hosts.yml` 和 `openclaw.json` 包含敏感信息，未包含在此备份中
- 请参考 `config/` 目录中的模板进行配置
