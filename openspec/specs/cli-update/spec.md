# Update 命令规范

## 目的

作为使用 OpenSpec 的开发人员，我希望在发布新版本时更新项目中的 OpenSpec 指令，以便我可以从 AI 代理指令的改进中受益。

## 需求
### 需求：更新行为
update 命令必须以对团队友好的方式将 OpenSpec 指令文件更新为最新模板。

#### 场景：运行 update 命令
- **当** 用户运行 `openspec update` 时
- **那么** 用最新模板替换 `openspec/AGENTS.md`
- **并且** 如果存在根级存根（`AGENTS.md`/`CLAUDE.md`），刷新它以便指向 `@/openspec/AGENTS.md`

### 需求：先决条件

该命令必须在允许更新之前要求存在现有的 OpenSpec 结构。

#### 场景：检查先决条件

- **给定** 该命令需要现有的 `openspec` 目录（由 `openspec init` 创建）
- **当** `openspec` 目录不存在时
- **那么** 显示错误："No OpenSpec directory found. Run 'openspec init' first."（未找到 OpenSpec 目录。请先运行 'openspec init'。）
- **并且** 以代码 1 退出

### 需求：文件处理
update 命令必须以可预测且安全的方式处理文件更新。

#### 场景：更新文件
- **当** 更新文件时
- **那么** 用最新模板完全替换 `openspec/AGENTS.md`
- **并且** 如果存在根级存根，更新托管块内容，以便它继续引导团队成员到 `@/openspec/AGENTS.md`

### 需求：工具无关更新
update 命令必须以可预测的方式刷新 OpenSpec 托管的文件，同时尊重每个团队选择的工具。

#### 场景：更新文件
- **当** 更新文件时
- **那么** 用最新模板完全替换 `openspec/AGENTS.md`
- **并且** 使用托管标记块创建或刷新根级 `AGENTS.md` 存根，即使文件以前不存在
- **并且** 仅更新现有 AI 工具文件中的 OpenSpec 托管部分，保持用户创作的内容不变
- **并且** 避免创建新的原生工具配置文件（斜杠命令、CLAUDE.md 等），除非它们已经存在

### 需求：核心文件始终更新
update 命令必须始终更新核心 OpenSpec 文件并显示 ASCII 安全的成功消息。

#### 场景：成功更新
- **当** 更新成功完成时
- **那么** 用最新模板替换 `openspec/AGENTS.md`
- **并且** 如果存在根级存根，刷新它以便它仍然引导贡献者到 `@/openspec/AGENTS.md`

### 需求：斜杠命令更新

update 命令必须刷新已配置工具的现有斜杠命令文件而不创建新文件，并确保 OpenCode 归档命令接受变更 ID 参数。

#### 场景：更新 Antigravity 的斜杠命令
- **当** `.agent/workflows/` 包含 `openspec-proposal.md`, `openspec-apply.md`, 和 `openspec-archive.md` 时
- **那么** 刷新每个文件的 OpenSpec 托管部分，以便工作流文案与其他工具匹配，同时保留现有的单字段 `description` frontmatter
- **并且** 在更新期间跳过创建任何丢失的工作流文件，以反映 Windsurf 和其他 IDE 的行为

#### 场景：更新 Claude Code 的斜杠命令
- **当** `.claude/commands/openspec/` 包含 `proposal.md`, `apply.md`, 和 `archive.md` 时
- **那么** 使用共享模板刷新每个文件
- **并且** 确保模板包含相关工作流阶段的说明

#### 场景：更新 CodeBuddy Code 的斜杠命令
- **当** `.codebuddy/commands/openspec/` 包含 `proposal.md`, `apply.md`, 和 `archive.md` 时
- **那么** 使用包含用于 `description` 和 `argument-hint` 字段的 YAML frontmatter 的共享 CodeBuddy 模板刷新每个文件
- **并且** 对 `argument-hint` 参数使用方括号格式（例如 `[change-id]`）
- **并且** 保留 OpenSpec 托管标记之外的任何用户自定义内容

#### 场景：更新 Cline 的斜杠命令
- **当** `.clinerules/workflows/` 包含 `openspec-proposal.md`, `openspec-apply.md`, 和 `openspec-archive.md` 时
- **那么** 使用共享模板刷新每个文件
- **并且** 包含 Cline 特定的 Markdown 标题 frontmatter
- **并且** 确保模板包含相关工作流阶段的说明

#### 场景：更新 Continue 的斜杠命令
- **当** `.continue/prompts/` 包含 `openspec-proposal.prompt`, `openspec-apply.prompt`, 和 `openspec-archive.prompt` 时
- **那么** 使用共享模板刷新每个文件
- **并且** 确保模板包含相关工作流阶段的说明

#### 场景：更新 Crush 的斜杠命令
- **当** `.crush/commands/` 包含 `openspec/proposal.md`, `openspec/apply.md`, 和 `openspec/archive.md` 时
- **那么** 使用共享模板刷新每个文件
- **并且** 包含带有 OpenSpec 类别和标签的 Crush 特定 frontmatter
- **并且** 确保模板包含相关工作流阶段的说明

#### 场景：更新 Cursor 的斜杠命令
- **当** `.cursor/commands/` 包含 `openspec-proposal.md`, `openspec-apply.md`, 和 `openspec-archive.md` 时
- **那么** 使用共享模板刷新每个文件
- **并且** 确保模板包含相关工作流阶段的说明

#### 场景：更新 Factory Droid 的斜杠命令
- **当** `.factory/commands/` 包含 `openspec-proposal.md`, `openspec-apply.md`, 和 `openspec-archive.md` 时
- **那么** 使用包含用于 `description` 和 `argument-hint` 字段的 YAML frontmatter 的共享 Factory 模板刷新每个文件
- **并且** 确保模板主体保留 `$ARGUMENTS` 占位符，以便用户输入继续流入 droid
- **并且** 仅更新 OpenSpec 托管标记内的内容，保持任何非托管注释不变
- **并且** 在更新期间跳过创建丢失的文件

#### 场景：更新 OpenCode 的斜杠命令
- **当** `.opencode/command/` 包含 `openspec-proposal.md`, `openspec-apply.md`, 和 `openspec-archive.md` 时
- **那么** 使用共享模板刷新每个文件
- **并且** 确保模板包含相关工作流阶段的说明
- **并且** 确保归档命令包含用于接受变更 ID 参数的 frontmatter 中的 `$ARGUMENTS` 占位符

#### 场景：更新 Windsurf 的斜杠命令
- **当** `.windsurf/workflows/` 包含 `openspec-proposal.md`, `openspec-apply.md`, 和 `openspec-archive.md` 时
- **那么** 使用包裹在 OpenSpec 标记中的共享模板刷新每个文件
- **并且** 确保模板包含相关工作流阶段的说明
- **并且** 跳过创建丢失的文件（update 命令仅刷新已存在的内容）

#### 场景：更新 Kilo Code 的斜杠命令
- **当** `.kilocode/workflows/` 包含 `openspec-proposal.md`, `openspec-apply.md`, 和 `openspec-archive.md` 时
- **那么** 使用包裹在 OpenSpec 标记中的共享模板刷新每个文件
- **并且** 确保模板包含相关工作流阶段的说明
- **并且** 跳过创建丢失的文件（update 命令仅刷新已存在的内容）

#### 场景：更新 Codex 的斜杠命令
- **给定** 全局 Codex 提示目录包含 `openspec-proposal.md`, `openspec-apply.md`, 和 `openspec-archive.md`
- **当** 用户运行 `openspec update` 时
- **那么** 使用共享斜杠命令模板（包括占位符指导）刷新每个文件
- **并且** 保留 OpenSpec 标记块之外的任何非托管内容
- **并且** 当 Codex 提示文件丢失时跳过创建

#### 场景：更新 GitHub Copilot 的斜杠命令
- **当** `.github/prompts/` 包含 `openspec-proposal.prompt.md`, `openspec-apply.prompt.md`, 和 `openspec-archive.prompt.md` 时
- **那么** 使用共享模板刷新每个文件，同时保留 YAML frontmatter
- **并且** 仅更新标记之间的 OpenSpec 托管块
- **并且** 确保模板包含相关工作流阶段的说明

#### 场景：更新 Gemini CLI 的斜杠命令
- **当** `.gemini/commands/openspec/` 包含 `proposal.toml`, `apply.toml`, 和 `archive.toml` 时
- **那么** 使用共享的 proposal/apply/archive 模板刷新每个文件的主体
- **并且** 仅替换 `prompt = """` 块内 `<!-- OPENSPEC:START -->` 和 `<!-- OPENSPEC:END -->` 标记之间的内容，以便 TOML 框架（`description`, `prompt`）保持完整
- **并且** 在更新期间跳过创建任何丢失的 `.toml` 文件；仅刷新预先存在的 Gemini 命令

#### 场景：更新 iFlow CLI 的斜杠命令
- **当** `.iflow/commands/` 包含 `openspec-proposal.md`, `openspec-apply.md`, 和 `openspec-archive.md` 时
- **那么** 使用共享模板刷新每个文件
- **并且** 保留带有 `name`, `id`, `category`, 和 `description` 字段的 YAML frontmatter
- **并且** 仅更新标记之间的 OpenSpec 托管块
- **并且** 确保模板包含相关工作流阶段的说明

#### 场景：丢失斜杠命令文件
- **当** 工具缺少斜杠命令文件时
- **那么** 在更新期间不创建新文件

### 需求：归档命令参数支持
归档斜杠命令模板必须为支持 `$ARGUMENTS` 占位符的工具支持可选的变更 ID 参数。

#### 场景：带变更 ID 参数的归档命令
- **当** 用户使用变更 ID 调用 `/openspec:archive <change-id>` 时
- **那么** 模板必须指示 AI 根据 `openspec list` 验证提供的变更 ID
- **并且** 如果有效，使用提供的变更 ID 进行归档
- **并且** 如果提供的变更 ID 与可归档变更不匹配，则快速失败

#### 场景：不带参数的归档命令（向后兼容性）
- **当** 用户调用 `/openspec:archive` 而未提供变更 ID 时
- **那么** 模板必须指示 AI 从上下文或通过运行 `openspec list` 识别变更 ID
- **并且** 继续现有行为（保持向后兼容性）

#### 场景：OpenCode 归档模板生成
- **当** 生成 OpenCode 归档斜杠命令文件时
- **那么** 在 frontmatter 中包含 `$ARGUMENTS` 占位符
- **并且** 将其包裹在清晰的结构中，如 `<ChangeId>\n  $ARGUMENTS\n</ChangeId>` 以指示预期的参数
- **并且** 在模板主体中包含验证步骤以检查变更 ID 是否有效

## 边缘情况

### 需求：错误处理

该命令必须优雅地处理边缘情况。

#### 场景：文件权限错误

- **当** 文件写入失败时
- **那么** 让错误自然冒泡并带上文件路径

#### 场景：丢失 AI 工具文件

- **当** AI 工具配置文件不存在时
- **那么** 跳过更新该文件
- **并且** 不创建它

#### 场景：自定义目录名称

- **当** 考虑自定义目录名称时
- **那么** 此变更中不支持
- **并且** 必须使用默认目录名称 `openspec`

## 成功标准

用户必须能够：
- 使用单个命令更新 OpenSpec 指令
- 获取最新的 AI 代理指令
- 看到更新的清晰确认

更新过程必须是：
- 简单且快速（无版本检查）
- 可预测（每次结果相同）
- 自包含（无需网络）
