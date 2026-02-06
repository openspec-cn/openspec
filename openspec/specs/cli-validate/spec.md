# cli-validate 规范

## 目的
待定 - 由归档变更 improve-validate-error-messages 创建。归档后更新目的。

## 需求
### 需求：验证必须提供可操作的补救步骤
验证输出必须包含修复每个错误的具体指导，包括预期的结构、示例标题以及验证修复的建议命令。

#### 场景：在变更中未找到增量
- **当** 验证零解析增量的变更时
- **那么** 显示错误 "No deltas found"（未找到增量）并提供指导：
  - 解释变更规范必须包含 `## ADDED Requirements`, `## MODIFIED Requirements`, `## REMOVED Requirements`, 或 `## RENAMED Requirements`
  - 提醒作者文件必须位于 `openspec/changes/{id}/specs/<capability>/spec.md` 下
  - 包含明确说明："Spec delta files cannot start with titles before the operation headers"（规范增量文件不能以操作标题之前的标题开头）
  - 建议运行 `openspec change show {id} --json --deltas-only` 进行调试

#### 场景：缺少必需部分
- **当** 缺少必需部分时
- **那么** 包含预期的标题名称和最小骨架：
  - 对于规范：`## Purpose`, `## Requirements`
  - 对于变更：`## Why`, `## What Changes`
  - 提供带有准备复制的占位符散文的缺失部分示例片段
  - 提及 `openspec/AGENTS.md` 中的快速参考部分作为权威模板

#### 场景：缺少需求描述性文本
- **当** 需求标题在场景之前缺少描述性文本时
- **那么** 发出错误，解释 `### Requirement:` 行后面必须跟叙述性文本，然后才是任何 `#### Scenario:` 标题
  - 显示合规示例："### Requirement: Foo" 后跟 "The system SHALL ..."
  - 建议在列出场景之前添加 1-2 句话描述规范性行为
  - 参考 `openspec/AGENTS.md` 中的预验证检查清单

### 需求：验证器必须检测可能格式错误的场景并发出修复警告
验证器必须识别看起来像场景的项目符号行（例如，以 WHEN/THEN/AND 开头的行）并发出针对性的警告以及转换为 `#### Scenario:` 的示例。

#### 场景：需求下的项目符号 WHEN/THEN
- **当** 在没有任何 `#### Scenario:` 标题的需求下发现以 WHEN/THEN/AND 开头的项目符号时
- **那么** 发出警告："Scenarios must use '#### Scenario:' headers"（场景必须使用 '#### Scenario:' 标题），并显示转换模板：
```
#### Scenario: Short name
- **WHEN** ...
- **THEN** ...
- **AND** ...
```

### 需求：所有问题必须包含文件路径和结构化位置
错误、警告和信息消息必须包含：
- 源文件路径 (`openspec/changes/{id}/proposal.md`, `.../specs/{cap}/spec.md`)
- 结构化路径 (例如 `deltas[0].requirements[0].scenarios`)

#### 场景：Zod 验证错误
- **当** schema 验证失败时
- **那么** 消息必须包含 `file`, `path`, 和补救提示（如果适用）

### 需求：无效结果必须在人类可读输出中包含后续步骤页脚
当项目无效且未使用 `--json` 时，CLI 必须附加后续步骤页脚，包括：
- 带有计数的摘要行
- 前 3 个指导要点（针对最频繁或阻塞错误的上下文）
- 建议使用 `--json` 和/或调试命令重新运行

#### 场景：变更无效摘要
- **当** 变更验证失败时
- **那么** 打印带有 2-3 个针对性要点的 "Next steps" 并建议 `openspec change show <id> --json --deltas-only`

### 需求：顶级 validate 命令

CLI 必须提供一个顶级的 `validate` 命令，用于使用灵活的选择选项验证变更和规范。

#### 场景：交互式验证选择

- **当** 执行 `openspec validate` 不带参数时
- **那么** 提示用户选择要验证的内容（全部、变更、规范或特定项目）
- **并且** 根据选择执行验证
- **并且** 使用适当的格式显示结果

#### 场景：非交互式环境不提示

- **给定** stdin 不是 TTY 或提供了 `--no-interactive` 或环境变量 `OPEN_SPEC_INTERACTIVE=0`
- **当** 执行 `openspec validate` 不带参数时
- **那么** 不进行交互式提示
- **并且** 打印列出可用命令/标志的有用提示并以代码 1 退出

#### 场景：直接项目验证

- **当** 执行 `openspec validate <item-name>`
- **那么** 自动检测项目是变更还是规范
- **并且** 验证指定项目
- **并且** 显示验证结果

### 需求：批量和过滤验证

validate 命令必须支持用于批量验证 (--all) 和按类型过滤验证 (--changes, --specs) 的标志。

#### 场景：验证所有内容

- **当** 执行 `openspec validate --all`
- **那么** 验证 openspec/changes/ 中的所有变更（排除 archive）
- **并且** 验证 openspec/specs/ 中的所有规范
- **并且** 显示显示通过/失败项目的摘要
- **并且** 如果任何验证失败，以代码 1 退出

#### 场景：批量验证范围

- **当** 使用 `--all` 或 `--changes` 验证时
- **那么** 包含 `openspec/changes/` 下的所有变更提案
- **并且** 排除 `openspec/changes/archive/` 目录

- **当** 使用 `--specs` 验证时
- **那么** 包含 `openspec/specs/<id>/spec.md` 下所有具有 `spec.md` 的规范

#### 场景：验证所有变更

- **当** 执行 `openspec validate --changes`
- **那么** 验证 openspec/changes/ 中的所有变更（排除 archive）
- **并且** 显示每个变更的结果
- **并且** 显示摘要统计信息

#### 场景：验证所有规范

- **当** 执行 `openspec validate --specs`
- **那么** 验证 openspec/specs/ 中的所有规范
- **并且** 显示每个规范的结果
- **并且** 显示摘要统计信息

### 需求：验证选项和进度指示

validate 命令必须支持标准验证选项 (--strict, --json) 并在批量操作期间显示进度。

#### 场景：严格验证

- **当** 执行 `openspec validate --all --strict`
- **那么** 对所有项目应用严格验证
- **并且** 将警告视为错误
- **并且** 如果任何项目有警告或错误，则失败

#### 场景：JSON 输出

- **当** 执行 `openspec validate --all --json`
- **那么** 将验证结果输出为 JSON
- **并且** 包含每个项目的详细问题
- **并且** 包含摘要统计信息

#### 场景：批量验证的 JSON 输出 schema

- **当** 执行 `openspec validate --all --json` (或 `--changes` / `--specs`)
- **那么** 输出具有以下形状的 JSON 对象：
  - `items`: 具有字段 `{ id: string, type: "change"|"spec", valid: boolean, issues: Issue[], durationMs: number }` 的对象数组
  - `summary`: 对象 `{ totals: { items: number, passed: number, failed: number }, byType: { change?: { items: number, passed: number, failed: number }, spec?: { items: number, passed: number, failed: number } } }`
  - `version`: schema 的字符串标识符（例如，`"1.0"`）
- **并且** 如果任何 `items[].valid === false`，以代码 1 退出

其中 `Issue` 遵循现有的每项目验证报告形状 `{ level: "ERROR"|"WARNING"|"INFO", path: string, message: string }`。

#### 场景：显示验证进度

- **当** 验证多个项目 (--all, --changes, 或 --specs)
- **那么** 显示进度指示器或状态更新
- **并且** 指示当前正在验证哪个项目
- **并且** 显示已通过/失败项目的运行计数

#### 场景：性能并发限制

- **当** 验证多个项目时
- **那么** 以有限的并发运行验证（例如，并行 4–8 个）
- **并且** 确保进度指示器保持响应

### 需求：项目类型检测和歧义处理

validate 命令必须处理歧义名称和显式类型覆盖，以确保清晰、确定性的行为。

#### 场景：带自动类型检测的直接项目验证

- **当** 执行 `openspec validate <item-name>`
- **那么** 如果 `<item-name>` 唯一匹配一个变更或规范，则验证该项目

#### 场景：变更和规范名称之间的歧义

- **给定** `<item-name>` 既作为变更又作为规范存在
- **当** 执行 `openspec validate <item-name>`
- **那么** 打印解释两个匹配项的歧义错误
- **并且** 建议传递 `--type change` 或 `--type spec`，或使用 `openspec change validate` / `openspec spec validate`
- **并且** 以代码 1 退出而不执行验证

#### 场景：未知项目名称

- **当** `<item-name>` 既不匹配变更也不匹配规范时
- **那么** 打印未找到错误
- **并且** 当可用时显示最近匹配建议
- **并且** 以代码 1 退出

#### 场景：显式类型覆盖

- **当** 执行 `openspec validate --type change <item>`
- **那么** 将 `<item>` 视为变更 ID 并验证它（跳过自动检测）

- **当** 执行 `openspec validate --type spec <item>`
- **那么** 将 `<item>` 视为规范 ID 并验证它（跳过自动检测）

### 需求：交互性控制

- CLI 必须遵守 `--no-interactive` 以禁用提示。
- CLI 必须遵守 `OPEN_SPEC_INTERACTIVE=0` 以全局禁用提示。
- 交互式提示仅当 stdin 为 TTY 且未禁用交互性时显示。

#### 场景：通过标志或环境禁用提示

- **当** 使用 `--no-interactive` 或环境 `OPEN_SPEC_INTERACTIVE=0` 执行 `openspec validate` 时
- **那么** CLI 必须不显示交互式提示
- **并且** 必须根据情况打印非交互式提示或选择的输出

### 需求：解析器必须处理跨平台行尾
markdown 解析器必须正确识别部分，无论行尾格式如何（LF, CRLF, CR）。

#### 场景：使用 CRLF 行尾解析所需部分
- **给定** 保存为 CRLF 行尾的变更提案 markdown
- **并且** 文档包含 `## Why` 和 `## What Changes`
- **当** 运行 `openspec validate <change-id>`
- **那么** 验证必须识别这些部分且不引发解析错误
