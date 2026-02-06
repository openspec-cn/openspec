# cli-change 规范 (cli-change Specification)

## 目的
待定 - 由归档变更 add-change-commands 创建。归档后更新目的。

## 需求

### 需求：Change 命令

系统必须提供一个 `change` 命令，带有用于显示、列出和验证变更提案的子命令。

#### 场景：显示变更为 JSON

- **当** 执行 `openspec change show update-error --json` 时
- **那么** 解析 markdown 变更文件
- **且** 提取变更结构和增量
- **且** 输出有效的 JSON 到 stdout

#### 场景：列出所有变更

- **当** 执行 `openspec change list` 时
- **那么** 扫描 openspec/changes 目录
- **且** 返回所有待处理变更的列表
- **且** 支持带 `--json` 标志的 JSON 输出

#### 场景：仅显示需求变更

- **当** 执行 `openspec change show update-error --requirements-only` 时
- **那么** 仅显示需求变更 (ADDED/MODIFIED/REMOVED/RENAMED)
- **且** 排除 why 和 what changes 部分

#### 场景：验证变更结构

- **当** 执行 `openspec change validate update-error` 时
- **那么** 解析变更文件
- **且** 根据 Zod 模式进行验证
- **且** 确保增量格式良好

### 需求：旧版兼容性

系统必须保持与现有 `list` 命令的向后兼容性，同时显示弃用通知。

#### 场景：旧版 list 命令

- **当** 执行 `openspec list` 时
- **那么** 显示当前变更列表（现有行为）
- **且** 显示弃用通知："Note: 'openspec list' is deprecated. Use 'openspec change list' instead."

#### 场景：带 --all 标志的旧版 list

- **当** 执行 `openspec list --all` 时
- **那么** 显示所有变更（现有行为）
- **且** 显示相同的弃用通知

### 需求：交互式 show 选择

当未提供变更名称时，change show 命令必须支持交互式选择。

#### 场景：show 的交互式变更选择

- **当** 不带参数执行 `openspec change show` 时
- **那么** 显示可用变更的交互式列表
- **且** 允许用户选择要显示的变更
- **且** 显示选定变更的内容
- **且** 保持所有现有 show 选项 (--json, --deltas-only)

#### 场景：非交互式回退保持当前行为

- **给定** stdin 不是 TTY 或提供了 `--no-interactive` 或环境变量 `OPEN_SPEC_INTERACTIVE=0`
- **当** 在没有变更名称的情况下执行 `openspec change show` 时
- **那么** 不进行交互式提示
- **且** 打印包含可用变更 ID 的现有提示
- **且** 设置 `process.exitCode = 1`

### 需求：交互式 validate 选择

当未提供变更名称时，change validate 命令必须支持交互式选择。

#### 场景：validate 的交互式变更选择

- **当** 不带参数执行 `openspec change validate` 时
- **那么** 显示可用变更的交互式列表
- **且** 允许用户选择要验证的变更
- **且** 验证选定的变更

#### 场景：非交互式回退保持当前行为

- **给定** stdin 不是 TTY 或提供了 `--no-interactive` 或环境变量 `OPEN_SPEC_INTERACTIVE=0`
- **当** 在没有变更名称的情况下执行 `openspec change validate` 时
- **那么** 不进行交互式提示
- **且** 打印包含可用变更 ID 的现有提示
- **且** 设置 `process.exitCode = 1`
