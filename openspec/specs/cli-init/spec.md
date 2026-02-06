# CLI Init 规范

## 目的

`openspec init` 命令必须在任何项目中创建完整的 OpenSpec 目录结构，以便立即采用 OpenSpec 约定，并支持多个 AI 编码助手。

## 需求
### 需求：进度指示器

该命令必须在初始化期间显示进度指示器，以提供有关每个步骤的清晰反馈。

#### 场景：显示初始化进度

- **当** 执行初始化步骤时
- **那么** 在后台静默验证环境（除非出错，否则无输出）
- **并且** 使用 ora spinners 显示进度：
  - 显示 spinner："⠋ Creating OpenSpec structure..."（正在创建 OpenSpec 结构...）
  - 然后成功："✔ OpenSpec structure created"（OpenSpec 结构已创建）
  - 显示 spinner："⠋ Configuring AI tools..."（正在配置 AI 工具...）
  - 然后成功："✔ AI tools configured"（AI 工具已配置）

### 需求：目录创建
该命令必须创建包含所有必需目录和文件的完整 OpenSpec 目录结构。

#### 场景：创建 OpenSpec 结构
- **当** 执行 `openspec init` 时
- **那么** 创建以下目录结构：
```
openspec/
├── project.md
├── AGENTS.md
├── specs/
└── changes/
    └── archive/
```

### 需求：文件生成
该命令必须生成具有适当内容的必需模板文件，以便立即使用。

#### 场景：生成模板文件
- **当** 初始化 OpenSpec 时
- **那么** 生成包含 AI 助手完整 OpenSpec 指令的 `openspec/AGENTS.md`
- **并且** 生成带有项目上下文模板的 `project.md`

### 需求：AI 工具配置
该命令必须使用分组选择体验为 AI 编码助手配置 OpenSpec 指令，以便团队可以启用原生集成，同时始终为其他助手提供指导。

#### 场景：提示选择 AI 工具
- **当** 以交互方式运行时
- **那么** 提供一个多选向导，将选项分为两个标题：
  - **Natively supported providers**（原生支持的提供商）显示每个可用的第一方集成（Claude Code, Cursor, OpenCode, …）及其复选框
  - **Other tools**（其他工具）解释根级别的 `AGENTS.md` 存根始终为兼容 AGENTS 的助手生成，且无法取消选择
- **并且** 用 "(already configured)"（已配置）标记已配置的原生工具，以表明选择它们将刷新托管内容
- **并且** 将禁用或不可用的提供商标记为 "coming soon"（即将推出），以便用户知道他们尚无法选择加入
- **并且** 即使未选择原生提供商，也允许确认选择，因为根存根默认保持启用状态
- **并且** 将扩展模式下的基本提示文案更改为 "Which natively supported AI tools would you like to add or refresh?"（您想添加或刷新哪些原生支持的 AI 工具？）

### 需求：AI 工具配置详情

该命令必须使用标记系统正确配置选定的 AI 工具及其 OpenSpec 特定指令。

#### 场景：配置 Claude Code

- **当** 选择 Claude Code 时
- **那么** 在项目根目录（不在 openspec/ 内）创建或更新 `CLAUDE.md`
- **并且** 使用指向 `@/openspec/AGENTS.md` 的简短存根填充托管块

#### 场景：配置 CodeBuddy Code

- **当** 选择 CodeBuddy Code 时
- **那么** 在项目根目录（不在 openspec/ 内）创建或更新 `CODEBUDDY.md`
- **并且** 使用指向 `@/openspec/AGENTS.md` 的简短存根填充托管块

#### 场景：配置 Cline

- **当** 选择 Cline 时
- **那么** 在项目根目录（不在 openspec/ 内）创建或更新 `CLINE.md`
- **并且** 使用指向 `@/openspec/AGENTS.md` 的简短存根填充托管块

#### 场景：配置 iFlow CLI

- **当** 选择 iFlow CLI 时
- **那么** 在项目根目录（不在 openspec/ 内）创建或更新 `IFLOW.md`
- **并且** 使用指向 `@/openspec/AGENTS.md` 的简短存根填充托管块

#### 场景：创建新的 CLAUDE.md

- **当** CLAUDE.md 不存在时
- **那么** 创建用标记包裹存根指令的新文件，以便完整工作流保留在 `openspec/AGENTS.md` 中：
```markdown
<!-- OPENSPEC:START -->
# OpenSpec Instructions

This project uses OpenSpec to manage AI assistant workflows.

- Full guidance lives in '@/openspec/AGENTS.md'.
- Keep this managed block so 'openspec update' can refresh the instructions.
<!-- OPENSPEC:END -->
```

### 需求：交互模式
该命令必须提供带有清晰导航说明的 AI 工具选择交互式菜单。
#### 场景：显示交互式菜单
- **当** 在全新或扩展模式下运行时
- **那么** 提供一个循环选择菜单，让用户使用 Space 切换工具并使用 Enter 查看选择
- **并且** 当在未选中的高亮可选工具上按 Enter 时，在移动到查看之前自动将其添加到选择中，以便配置高亮显示的工具
- **并且** 用 "(already configured)" 标记已配置的工具，同时保持禁用选项标记为 "coming soon"
- **并且** 将扩展模式下的提示文案更改为 "Which AI tools would you like to add or refresh?"
- **并且** 显示内联说明，阐明 Space 切换工具，Enter 在查看选择之前选择高亮显示的工具

### 需求：安全检查
该命令必须执行安全检查，以防止覆盖现有结构并确​​保适当的权限。

#### 场景：检测现有初始化
- **当** `openspec/` 目录已存在时
- **那么** 通知用户 OpenSpec 已初始化，跳过重新创建基本结构，并进入扩展模式
- **并且** 继续进行 AI 工具选择步骤，以便配置其他工具
- **并且** 仅当用户拒绝添加任何 AI 工具时才显示现有初始化错误消息

### 需求：成功输出

该命令必须在成功初始化后提供清晰、可操作的后续步骤。

#### 场景：显示成功消息
- **当** 初始化成功完成时
- **那么** 包含提示："Please explain the OpenSpec workflow from openspec/AGENTS.md and how I should work with you on this project"（请解释 openspec/AGENTS.md 中的 OpenSpec 工作流以及我应该如何在这个项目上与您合作）

#### 场景：显示重启指令
- **当** 初始化成功完成且工具已创建或刷新时
- **那么** 在 "Next steps"（后续步骤）部分之前显示显眼的重启指令
- **并且** 通知用户斜杠命令在启动时加载
- **并且** 指示用户重启其编码助手以确保 /openspec 命令出现

### 需求：退出代码

该命令必须使用一致的退出代码来指示不同的失败模式。

#### 场景：返回退出代码

- **当** 命令完成时
- **那么** 返回适当的退出代码：
  - 0：成功
  - 1：一般错误（包括 OpenSpec 目录已存在的情况）
  - 2：权限不足（保留供将来使用）
  - 3：用户取消操作（保留供将来使用）

### 需求：额外的 AI 工具初始化
`openspec init` 必须允许用户在初始设置后为新的 AI 编码助手添加配置文件。

#### 场景：初始设置后配置额外工具
- **给定** `openspec/` 目录已存在且至少存在一个 AI 工具文件
- **当** 用户运行 `openspec init` 并选择不同的受支持 AI 工具时
- **那么** 以与首次初始化相同的方式生成该工具的带有 OpenSpec 标记的配置文件
- **并且** 保持现有工具配置文件不变，除了需要刷新的托管部分
- **并且** 以代码 0 退出并显示成功摘要，突出显示新添加的工具文件

### 需求：成功输出增强
`openspec init` 必须在初始化或扩展模式完成时总结工具操作。

#### 场景：显示工具摘要
- **当** 命令成功完成时
- **那么** 显示已创建、刷新或跳过（包括已配置的跳过）的工具的分类摘要
- **并且** 使用所选工具的名称个性化 "Next steps" 标题，当没有剩余工具时默认为通用标签

### 需求：退出代码调整
`openspec init` 必须将没有新原生工具选择的扩展模式视为成功刷新。

#### 场景：允许空扩展运行
- **当** OpenSpec 已初始化且用户未选择其他原生支持的工具时
- **那么** 成功完成同时刷新根 `AGENTS.md` 存根
- **并且** 以代码 0 退出

### 需求：斜杠命令配置
init 命令必须使用共享模板为支持的编辑器生成斜杠命令文件。

#### 场景：为 Antigravity 生成斜杠命令
- **当** 用户在初始化期间选择 Antigravity 时
- **那么** 创建 `.agent/workflows/openspec-proposal.md`, `.agent/workflows/openspec-apply.md`, 和 `.agent/workflows/openspec-archive.md`
- **并且** 确保每个文件以 YAML frontmatter 开头，仅包含 `description: <stage summary>` 字段，后跟包裹在托管标记中的共享 OpenSpec 工作流指令
- **并且** 使用与其他工具相同的 proposal/apply/archive 指导填充工作流主体，以便 Antigravity 像 Windsurf 一样行为，同时指向 `.agent/workflows/` 目录

#### 场景：为 Claude Code 生成斜杠命令
- **当** 用户在初始化期间选择 Claude Code 时
- **那么** 创建 `.claude/commands/openspec/proposal.md`, `.claude/commands/openspec/apply.md`, 和 `.claude/commands/openspec/archive.md`
- **并且** 从共享模板填充每个文件，以便命令文本与其他工具匹配
- **并且** 每个模板包含相关 OpenSpec 工作流阶段的说明

#### 场景：为 CodeBuddy Code 生成斜杠命令
- **当** 用户在初始化期间选择 CodeBuddy Code 时
- **那么** 创建 `.codebuddy/commands/openspec/proposal.md`, `.codebuddy/commands/openspec/apply.md`, 和 `.codebuddy/commands/openspec/archive.md`
- **并且** 从包含用于 `description` 和 `argument-hint` 字段的 CodeBuddy 兼容 YAML frontmatter 的共享模板填充每个文件
- **并且** 对 `argument-hint` 参数使用方括号格式（例如 `[change-id]`）
- **并且** 每个模板包含相关 OpenSpec 工作流阶段的说明

#### 场景：为 Cline 生成斜杠命令
- **当** 用户在初始化期间选择 Cline 时
- **那么** 创建 `.clinerules/workflows/openspec-proposal.md`, `.clinerules/workflows/openspec-apply.md`, 和 `.clinerules/workflows/openspec-archive.md`
- **并且** 从共享模板填充每个文件，以便命令文本与其他工具匹配
- **并且** 包含 Cline 特定的 Markdown 标题 frontmatter
- **并且** 每个模板包含相关 OpenSpec 工作流阶段的说明

#### 场景：为 Crush 生成斜杠命令
- **当** 用户在初始化期间选择 Crush 时
- **那么** 创建 `.crush/commands/openspec/proposal.md`, `.crush/commands/openspec/apply.md`, 和 `.crush/commands/openspec/archive.md`
- **并且** 从共享模板填充每个文件，以便命令文本与其他工具匹配
- **并且** 包含带有 OpenSpec 类别和标签的 Crush 特定 frontmatter
- **并且** 每个模板包含相关 OpenSpec 工作流阶段的说明

#### 场景：为 Cursor 生成斜杠命令
- **当** 用户在初始化期间选择 Cursor 时
- **那么** 创建 `.cursor/commands/openspec-proposal.md`, `.cursor/commands/openspec-apply.md`, 和 `.cursor/commands/openspec-archive.md`
- **并且** 从共享模板填充每个文件，以便命令文本与其他工具匹配
- **并且** 每个模板包含相关 OpenSpec 工作流阶段的说明

#### 场景：为 Continue 生成斜杠命令
- **当** 用户在初始化期间选择 Continue 时
- **那么** 创建 `.continue/prompts/openspec-proposal.prompt`, `.continue/prompts/openspec-apply.prompt`, 和 `.continue/prompts/openspec-archive.prompt`
- **并且** 从共享模板填充每个文件，以便命令文本与其他工具匹配
- **并且** 每个模板包含相关 OpenSpec 工作流阶段的说明

#### 场景：为 Factory Droid 生成斜杠命令
- **当** 用户在初始化期间选择 Factory Droid 时
- **那么** 创建 `.factory/commands/openspec-proposal.md`, `.factory/commands/openspec-apply.md`, 和 `.factory/commands/openspec-archive.md`
- **并且** 从包含用于 `description` 和 `argument-hint` 字段的 Factory 兼容 YAML frontmatter 的共享模板填充每个文件
- **并且** 在模板主体中包含 `$ARGUMENTS` 占位符，以便 droid 接收任何用户提供的输入
- **并且** 将生成的内容包裹在 OpenSpec 托管标记中，以便 `openspec update` 可以安全地刷新命令

#### 场景：为 OpenCode 生成斜杠命令
- **当** 用户在初始化期间选择 OpenCode 时
- **那么** 创建 `.opencode/commands/openspec-proposal.md`, `.opencode/commands/openspec-apply.md`, 和 `.opencode/commands/openspec-archive.md`
- **并且** 从共享模板填充每个文件，以便命令文本与其他工具匹配
- **并且** 每个模板包含相关 OpenSpec 工作流阶段的说明

#### 场景：为 Windsurf 生成斜杠命令
- **当** 用户在初始化期间选择 Windsurf 时
- **那么** 创建 `.windsurf/workflows/openspec-proposal.md`, `.windsurf/workflows/openspec-apply.md`, 和 `.windsurf/workflows/openspec-archive.md`
- **并且** 从共享模板（包裹在 OpenSpec 标记中）填充每个文件，以便工作流文本与其他工具匹配
- **并且** 每个模板包含相关 OpenSpec 工作流阶段的说明

#### 场景：为 Kilo Code 生成斜杠命令
- **当** 用户在初始化期间选择 Kilo Code 时
- **那么** 创建 `.kilocode/workflows/openspec-proposal.md`, `.kilocode/workflows/openspec-apply.md`, 和 `.kilocode/workflows/openspec-archive.md`
- **并且** 从共享模板（包裹在 OpenSpec 标记中）填充每个文件，以便工作流文本与其他工具匹配
- **并且** 每个模板包含相关 OpenSpec 工作流阶段的说明

#### 场景：为 Codex 生成斜杠命令
- **当** 用户在初始化期间选择 Codex 时
- **那么** 在 `~/.codex/prompts/openspec-proposal.md`, `~/.codex/prompts/openspec-apply.md`, 和 `~/.codex/prompts/openspec-archive.md`（如果设置了则在 `$CODEX_HOME/prompts` 下）创建全局提示文件
- **并且** 从将第一个编号占位符（`$1`）映射到主要用户输入（例如，变更标识符或问题文本）的共享模板填充每个文件
- **并且** 将生成的内容包裹在 OpenSpec 标记中，以便 `openspec update` 可以刷新提示而不触及周围的自定义注释

#### 场景：为 GitHub Copilot 生成斜杠命令
- **当** 用户在初始化期间选择 GitHub Copilot 时
- **那么** 创建 `.github/prompts/openspec-proposal.prompt.md`, `.github/prompts/openspec-apply.prompt.md`, 和 `.github/prompts/openspec-archive.prompt.md`
- **并且** 使用包含总结工作流阶段的 `description` 字段的 YAML frontmatter 填充每个文件
- **并且** 包含 `$ARGUMENTS` 占位符以捕获用户输入
- **并且** 用 OpenSpec 标记包裹共享模板主体，以便 `openspec update` 可以刷新内容
- **并且** 每个模板包含相关 OpenSpec 工作流阶段的说明

#### 场景：为 Gemini CLI 生成斜杠命令
- **当** 用户在初始化期间选择 Gemini CLI 时
- **那么** 创建 `.gemini/commands/openspec/proposal.toml`, `.gemini/commands/openspec/apply.toml`, 和 `.gemini/commands/openspec/archive.toml`
- **并且** 将每个文件填充为 TOML，设置特定于阶段的 `description = "<summary>"` 和带共享 OpenSpec 模板的多行 `prompt = """` 块
- **并且** 将 OpenSpec 托管标记（`<!-- OPENSPEC:START -->` / `<!-- OPENSPEC:END -->`）包裹在 `prompt` 值内，以便 `openspec update` 可以安全地刷新标记之间的主体而不触及 TOML 框架
- **并且** 确保斜杠命令文案与其他工具使用的现有 proposal/apply/archive 模板匹配

#### 场景：为 iFlow CLI 生成斜杠命令
- **当** 用户在初始化期间选择 iFlow CLI 时
- **那么** 创建 `.iflow/commands/openspec-proposal.md`, `.iflow/commands/openspec-apply.md`, 和 `.iflow/commands/openspec-archive.md`
- **并且** 从共享模板填充每个文件，以便命令文本与其他工具匹配
- **并且** 包含带有每个命令的 `name`, `id`, `category`, 和 `description` 字段的 YAML frontmatter
- **并且** 将生成的内容包裹在 OpenSpec 托管标记中，以便 `openspec update` 可以安全地刷新命令
- **并且** 每个模板包含相关 OpenSpec 工作流阶段的说明

#### 场景：为 RooCode 生成斜杠命令
- **当** 用户在初始化期间选择 RooCode 时
- **那么** 创建 `.roo/commands/openspec-proposal.md`, `.roo/commands/openspec-apply.md`, 和 `.roo/commands/openspec-archive.md`
- **并且** 从共享模板填充每个文件，以便命令文本与其他工具匹配
- **并且** 包含简单的 Markdown 标题（例如，`# OpenSpec: Proposal`）而不包含 YAML frontmatter
- **并且** 在适用的情况下将生成的内容包裹在 OpenSpec 托管标记中，以便 `openspec update` 可以安全地刷新命令
- **并且** 每个模板包含相关 OpenSpec 工作流阶段的说明

### 需求：非交互模式
该命令必须通过命令行选项支持非交互式操作，以用于自动化和 CI/CD 用例。

#### 场景：非交互式选择所有工具
- **当** 运行时带 `--tools all`
- **那么** 自动选择每个可用的 AI 工具而无需提示
- **并且** 使用选定的工具进行初始化

#### 场景：非交互式选择特定工具
- **当** 运行时带 `--tools claude,cursor`
- **那么** 解析逗号分隔的工具 ID 并针对可用工具进行验证
- **并且** 仅使用指定的有效工具进行初始化

#### 场景：非交互式跳过工具配置
- **当** 运行时带 `--tools none`
- **那么** 完全跳过 AI 工具配置
- **并且** 仅创建 OpenSpec 目录结构和模板文件

#### 场景：无效工具规范
- **当** 运行时带 `--tools` 包含任何不在 AI 工具注册表中的 ID
- **那么** 以代码 1 退出并显示可用值（`all`, `none`, 或受支持的工具 ID）

#### 场景：帮助文本列出可用工具 ID
- **当** 显示 `openspec init` 的 CLI 帮助时
- **那么** 显示 `--tools` 选项描述以及源自 AI 工具注册表的有效值

### 需求：根指令存根
`openspec init` 必须始终搭建根级别的 `AGENTS.md` 移交，以便每个团队成员都能找到主要的 OpenSpec 指令。

#### 场景：创建根 `AGENTS.md`
- **给定** 项目可能已包含或未包含 `AGENTS.md` 文件
- **当** 初始化在全新或扩展模式下完成时
- **那么** 使用来自 `TemplateManager.getAgentsStandardTemplate()` 的托管标记块在存储库根目录创建或刷新 `AGENTS.md`
- **并且** 保留托管标记之外的任何现有内容，同时替换其中的存根文本
- **并且** 无论选择了哪些原生 AI 工具，都创建存根

## 原因

手动创建 OpenSpec 结构容易出错并产生采用摩擦。标准化的 init 命令可确保：
- 所有项目结构一致
- 始终包含正确的 AI 指令文件
- 新项目快速上手
- 从一开始就遵循明确的约定
