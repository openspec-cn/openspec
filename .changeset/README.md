# Changesets

此目录由 [Changesets](https://github.com/changesets/changesets) 管理。

## 快速开始

```bash
pnpm changeset
```

按照提示选择版本升级类型并描述你的变更。

## 工作流

1. **添加 changeset** — 在提交 PR 之前或之后在本地运行 `pnpm changeset`
2. **版本 PR** — 当 changesets 合并到主分支时，CI 会打开/更新一个 "Version Packages" PR
3. **发布** — 合并版本 PR 会触发 npm 发布和 GitHub Release

> **注意：** 贡献者只需要运行 `pnpm changeset`。版本控制 (`changeset version`) 和发布在 CI 中自动发生。

## 模板

使用此结构作为你的 changeset 内容：

```markdown
---
"@fission-ai/openspec": patch
---

### New Features

- **Feature name** — 用户现在可以做什么

### Bug Fixes

- 修复了当 Y 时发生 X 的问题

### Breaking Changes

- `oldMethod()` 已被移除，请改用 `newMethod()`

### Deprecations

- `legacyOption` 已弃用，将在 v2.0 中移除

### Other

- 内部重构 X 以获得更好的性能
```

仅包含与你的变更相关的部分。

## 版本升级指南

| 类型 | 何时使用 | 示例 |
|------|-------------|---------|
| `patch` | Bug 修复，小改进 | 修复缺少配置时的崩溃 |
| `minor` | 新功能，非破坏性增加 | 添加 `--verbose` 标志 |
| `major` | 破坏性变更，移除功能 | 将 `init` 重命名为 `setup` |

## 何时创建 Changeset

**为以下情况创建：**
- 新功能或命令
- 影响用户的 Bug 修复
- 破坏性变更或弃用
- 用户能感知到的性能改进

**跳过以下情况：**
- 仅文档变更
- 测试添加/修复
- 无用户影响的内部重构
- CI/工具变更

## 编写好的描述

**推荐：** 为用户写，而不是开发者
```markdown
- **Shell 补全** — 现在支持 Bash, Fish 和 PowerShell 的 Tab 补全
```

**不推荐：** 写实施细节
```markdown
- 添加 ShellCompletionGenerator 类及其 Bash/Fish/PowerShell 子类
```

**推荐：** 解释影响
```markdown
- 修复配置加载以在 Linux 上遵循 `XDG_CONFIG_HOME`
```

**不推荐：** 仅引用修复
```markdown
- 修复 #123
```
