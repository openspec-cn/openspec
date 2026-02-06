# 支持的工具 (Supported Tools)

OpenSpec 可与 20 多个 AI 编码助手配合使用。当你运行 `openspec init` 时，系统会提示你选择你使用的工具，OpenSpec 将配置相应的集成。

## 工作原理

对于你选择的每个工具，OpenSpec 安装：

1. **技能 (Skills)** — 支持 `/opsx:*` 工作流命令的可重用指令文件
2. **命令 (Commands)** — 特定于工具的斜杠命令绑定

## 工具目录参考

| 工具 | 技能位置 | 命令位置 |
|------|-----------------|-------------------|
| Amazon Q Developer | `.amazonq/skills/` | `.amazonq/prompts/` |
| Antigravity | `.agent/skills/` | `.agent/workflows/` |
| Auggie (Augment CLI) | `.augment/skills/` | `.augment/commands/` |
| Claude Code | `.claude/skills/` | `.claude/commands/opsx/` |
| Cline | `.cline/skills/` | `.clinerules/workflows/` |
| CodeBuddy | `.codebuddy/skills/` | `.codebuddy/commands/opsx/` |
| Codex | `.codex/skills/` | `~/.codex/prompts/`* |
| Continue | `.continue/skills/` | `.continue/prompts/` |
| CoStrict | `.cospec/skills/` | `.cospec/openspec/commands/` |
| Crush | `.crush/skills/` | `.crush/commands/opsx/` |
| Cursor | `.cursor/skills/` | `.cursor/commands/` |
| Factory Droid | `.factory/skills/` | `.factory/commands/` |
| Gemini CLI | `.gemini/skills/` | `.gemini/commands/opsx/` |
| GitHub Copilot | `.github/skills/` | `.github/prompts/` |
| iFlow | `.iflow/skills/` | `.iflow/commands/` |
| Kilo Code | `.kilocode/skills/` | `.kilocode/workflows/` |
| OpenCode | `.opencode/skills/` | `.opencode/command/` |
| Qoder | `.qoder/skills/` | `.qoder/commands/opsx/` |
| Qwen Code | `.qwen/skills/` | `.qwen/commands/` |
| RooCode | `.roo/skills/` | `.roo/commands/` |
| Trae | `.trae/skills/` | `.trae/skills/` (via `/openspec-*`) |
| Windsurf | `.windsurf/skills/` | `.windsurf/workflows/` |

\* Codex 命令安装在全局主目录 (`~/.codex/prompts/` 或 `$CODEX_HOME/prompts/`)，而不是项目目录。

## 非交互式设置

对于 CI/CD 或脚本化设置，使用 `--tools` 标志：

```bash
# 配置特定工具
openspec init --tools claude,cursor

# 配置所有支持的工具
openspec init --tools all

# 跳过工具配置
openspec init --tools none
```

**可用工具 ID：** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codebuddy`, `codex`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `opencode`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

## 安装了什么

对于每个工具，OpenSpec 生成 10 个支持 OPSX 工作流的技能文件：

| 技能 | 用途 |
|-------|---------|
| `openspec-explore` | 探索想法的思维伙伴 |
| `openspec-new-change` | 开始一个新的变更 |
| `openspec-continue-change` | 创建下一个工件 |
| `openspec-ff-change` | 快进通过所有规划工件 |
| `openspec-apply-change` | 实施任务 |
| `openspec-verify-change` | 验证实施完整性 |
| `openspec-sync-specs` | 同步增量规范到主规范（可选——如果需要归档提示） |
| `openspec-archive-change` | 归档已完成的变更 |
| `openspec-bulk-archive-change` | 一次归档多个变更 |
| `openspec-onboard` | 引导完成一个完整工作流周期的入职培训 |

这些技能通过 `/opsx:new`, `/opsx:apply` 等斜杠命令调用。查看 [命令](commands.md) 获取完整列表。

## 添加新工具

想添加对另一个 AI 编码助手的支持？查看 [命令适配器模式](../CONTRIBUTING.md) 或在 GitHub 上提交 issue。

---

## 相关

- [CLI 参考](cli.md) — 终端命令
- [命令](commands.md) — 斜杠命令和技能
- [快速开始](getting-started.md) — 首次设置
