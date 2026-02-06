# cli-show 规范

## 目的
待定 - 由归档变更 add-interactive-show-command 创建。归档后更新目的。

## 需求
### 需求：顶级 show 命令

CLI 必须提供一个顶级的 `show` 命令，用于智能选择显示变更和规范。

#### 场景：交互式 show 选择

- **当** 执行 `openspec show` 不带参数时
- **那么** 提示用户选择类型（change 或 spec）
- **并且** 显示所选类型的可用项目列表
- **并且** 显示所选项的内容

#### 场景：非交互式环境不提示

- **给定** stdin 不是 TTY 或提供了 `--no-interactive` 或环境变量 `OPEN_SPEC_INTERACTIVE=0`
- **当** 执行 `openspec show` 不带参数时
- **那么** 不提示
- **并且** 打印带有 `openspec show <item>` 或 `openspec change/spec show` 示例的有用提示
- **并且** 以代码 1 退出

#### 场景：直接项目显示

- **当** 执行 `openspec show <item-name>`
- **那么** 自动检测项目是变更还是规范
- **并且** 显示项目的内容
- **并且** 根据项目类型使用适当的格式

#### 场景：类型检测和歧义处理

- **当** 执行 `openspec show <item-name>`
- **那么** 如果 `<item-name>` 唯一匹配一个变更或规范，则显示该项目
- **并且** 如果它同时匹配两者，则打印歧义错误并建议使用 `--type change|spec` 或使用 `openspec change show`/`openspec spec show`
- **并且** 如果都不匹配，则打印未找到并提供最近匹配建议

#### 场景：显式类型覆盖

- **当** 执行 `openspec show --type change <item>`
- **那么** 将 `<item>` 视为变更 ID 并显示它（跳过自动检测）

- **当** 执行 `openspec show --type spec <item>`
- **那么** 将 `<item>` 视为规范 ID 并显示它（跳过自动检测）

### 需求：输出格式选项

show 命令必须支持与现有命令一致的各种输出格式。

#### 场景：JSON 输出

- **当** 执行 `openspec show <item> --json`
- **那么** 以 JSON 格式输出项目
- **并且** 包含解析后的元数据和结构
- **并且** 保持与现有 change/spec show 命令的格式一致性

#### 场景：标志范围和委托

- **当** 通过顶级命令显示变更或规范时
- **那么** 接受通用标志，例如 `--json`
- **并且** 将特定于类型的标志传递给相应的实现
  - 仅限变更的标志：`--deltas-only`（别名 `--requirements-only` 已弃用）
  - 仅限规范的标志：`--requirements`, `--no-scenarios`, `-r/--requirement`
- **并且** 忽略检测到的类型的不相关标志并发出警告

### 需求：交互性控制

- CLI 必须遵守 `--no-interactive` 以禁用提示。
- CLI 必须遵守 `OPEN_SPEC_INTERACTIVE=0` 以全局禁用提示。
- 交互式提示仅当 stdin 为 TTY 且未禁用交互性时显示。

#### 场景：变更特定选项

- **当** 使用 `openspec show <change-name> --deltas-only` 显示变更时
- **那么** 仅以 JSON 格式显示增量
- **并且** 保持与现有变更显示选项的兼容性

#### 场景：规范特定选项

- **当** 使用 `openspec show <spec-id> --requirements` 显示规范时
- **那么** 仅以 JSON 格式显示需求
- **并且** 支持其他规范选项 (--no-scenarios, -r)
- **并且** 保持与现有规范显示选项的兼容性
