# CLI 参考

OpenSpec CLI (`openspec`) 提供了用于项目设置、验证、状态检查和管理的终端命令。这些命令是对 [命令](commands.md) 中记录的 AI 斜杠命令（如 `/opsx:new`）的补充。

## 摘要

| 类别 | 命令 | 用途 |
|------|----------|---------|
| **设置** | `init`, `update` | 在你的项目中初始化和更新 OpenSpec |
| **浏览** | `list`, `view`, `show` | 探索变更和规范 |
| **验证** | `validate` | 检查变更和规范的问题 |
| **生命周期** | `archive` | 最终确定已完成的变更 |
| **工作流** | `status`, `instructions`, `templates`, `schemas` | 产物驱动的工作流支持 |
| **Schema** | `schema init`, `schema fork`, `schema validate`, `schema which` | 创建和管理自定义工作流 |
| **配置** | `config` | 查看和修改设置 |
| **实用工具** | `feedback`, `completion` | 反馈和 Shell 集成 |

---

## 人类 vs Agent 命令

大多数 CLI 命令设计用于终端中的 **人类使用**。一些命令也通过 JSON 输出支持 **Agent/脚本使用**。

### 仅限人类使用的命令

这些命令是交互式的，专为终端使用而设计：

| 命令 | 用途 |
|---------|---------|
| `openspec init` | 初始化项目（交互式提示） |
| `openspec view` | 交互式仪表盘 |
| `openspec config edit` | 在编辑器中打开配置 |
| `openspec feedback` | 通过 GitHub 提交反馈 |
| `openspec completion install` | 安装 Shell 补全 |

### Agent 兼容命令

这些命令支持 `--json` 输出，供 AI Agent 和脚本以编程方式使用：

| 命令 | 人类使用 | Agent 使用 |
|---------|-----------|-----------|
| `openspec list` | 浏览变更/规范 | `--json` 获取结构化数据 |
| `openspec show <item>` | 阅读内容 | `--json` 用于解析 |
| `openspec validate` | 检查问题 | `--all --json` 用于批量验证 |
| `openspec status` | 查看产物进度 | `--json` 获取结构化状态 |
| `openspec instructions` | 获取下一步骤 | `--json` 获取 Agent 指令 |
| `openspec templates` | 查找模板路径 | `--json` 用于路径解析 |
| `openspec schemas` | 列出可用 Schema | `--json` 用于 Schema 发现 |

---

## 全局选项

这些选项适用于所有命令：

| 选项 | 描述 |
|--------|-------------|
| `--version`, `-V` | 显示版本号 |
| `--no-color` | 禁用彩色输出 |
| `--help`, `-h` | 显示命令帮助 |

---

## 设置命令

### `openspec init`

在你的项目中初始化 OpenSpec。创建文件夹结构并配置 AI 工具集成。

```
openspec init [path] [options]
```

**参数：**

| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `path` | 否 | 目标目录（默认：当前目录） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--tools <list>` | 非交互式配置 AI 工具。使用 `all`, `none`, 或逗号分隔列表 |
| `--force` | 不提示自动清理旧文件 |

**支持的工具：** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `opencode`, `qoder`, `qwen`, `roocode`, `windsurf`

**示例：**

```bash
# 交互式初始化
openspec init

# 在特定目录初始化
openspec init ./my-project

# 非交互式：配置 Claude 和 Cursor
openspec init --tools claude,cursor

# 配置所有支持的工具
openspec init --tools all

# 跳过提示并自动清理旧文件
openspec init --force
```

**创建内容：**

```
openspec/
├── specs/              # 你的规范（单一事实来源）
├── changes/            # 提议的变更
└── config.yaml         # 项目配置

.claude/skills/         # Claude Code 技能文件（如果选择了 claude）
.cursor/rules/          # Cursor 规则（如果选择了 cursor）
... (其他工具配置)
```

---

### `openspec update`

升级 CLI 后更新 OpenSpec 指令文件。重新生成 AI 工具配置文件。

```
openspec update [path] [options]
```

**参数：**

| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `path` | 否 | 目标目录（默认：当前目录） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--force` | 即使文件是最新的也强制更新 |

**示例：**

```bash
# npm 升级后更新指令文件
npm install -g openspec-cn/openspec
openspec update
```

---

## 浏览命令

### `openspec list`

列出项目中的变更或规范。

```
openspec list [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--specs` | 列出规范而不是变更 |
| `--changes` | 列出变更（默认） |
| `--sort <order>` | 按 `recent`（默认）或 `name` 排序 |
| `--json` | 输出为 JSON |

**示例：**

```bash
# 列出所有活跃变更
openspec list

# 列出所有规范
openspec list --specs

# 脚本使用的 JSON 输出
openspec list --json
```

**输出（文本）：**

```
Active changes:
  add-dark-mode     UI theme switching support
  fix-login-bug     Session timeout handling
```

---

### `openspec view`

显示用于探索规范和变更的交互式仪表盘。

```
openspec view
```

打开一个基于终端的界面，用于导航你的项目的规范和变更。

---

### `openspec show`

显示变更或规范的详情。

```
openspec show [item-name] [options]
```

**参数：**

| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `item-name` | 否 | 变更或规范的名称（如果省略则提示） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--type <type>` | 指定类型：`change` 或 `spec`（如果无歧义则自动检测） |
| `--json` | 输出为 JSON |
| `--no-interactive` | 禁用提示 |

**变更特定选项：**

| 选项 | 描述 |
|--------|-------------|
| `--deltas-only` | 仅显示增量规范（JSON 模式） |

**规范特定选项：**

| 选项 | 描述 |
|--------|-------------|
| `--requirements` | 仅显示需求，排除场景（JSON 模式） |
| `--no-scenarios` | 排除场景内容（JSON 模式） |
| `-r, --requirement <id>` | 按基于 1 的索引显示特定需求（JSON 模式） |

**示例：**

```bash
# 交互式选择
openspec show

# 显示特定变更
openspec show add-dark-mode

# 显示特定规范
openspec show auth --type spec

# 用于解析的 JSON 输出
openspec show add-dark-mode --json
```

---

## 验证命令

### `openspec validate`

验证变更和规范的结构问题。

```
openspec validate [item-name] [options]
```

**参数：**

| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `item-name` | 否 | 要验证的特定项目（如果省略则提示） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--all` | 验证所有变更和规范 |
| `--changes` | 验证所有变更 |
| `--specs` | 验证所有规范 |
| `--type <type>` | 当名称有歧义时指定类型：`change` 或 `spec` |
| `--strict` | 启用严格验证模式 |
| `--json` | 输出为 JSON |
| `--concurrency <n>` | 最大并行验证数（默认：6，或 `OPENSPEC_CONCURRENCY` 环境变量） |
| `--no-interactive` | 禁用提示 |

**示例：**

```bash
# 交互式验证
openspec validate

# 验证特定变更
openspec validate add-dark-mode

# 验证所有变更
openspec validate --changes

# 验证所有内容并输出 JSON（用于 CI/脚本）
openspec validate --all --json

# 使用增加的并行度进行严格验证
openspec validate --all --strict --concurrency 12
```

**输出（文本）：**

```
Validating add-dark-mode...
  ✓ proposal.md valid
  ✓ specs/ui/spec.md valid
  ⚠ design.md: missing "Technical Approach" section

1 warning found
```

**输出（JSON）：**

```json
{
  "version": "1.0.0",
  "results": {
    "changes": [
      {
        "name": "add-dark-mode",
        "valid": true,
        "warnings": ["design.md: missing 'Technical Approach' section"]
      }
    ]
  },
  "summary": {
    "total": 1,
    "valid": 1,
    "invalid": 0
  }
}
```

---

## 生命期命令

### `openspec archive`

归档已完成的变更并将增量规范合并到主规范中。

```
openspec archive [change-name] [options]
```

**参数：**

| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 要归档的变更（如果省略则提示） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `-y, --yes` | 跳过确认提示 |
| `--skip-specs` | 跳过规范更新（用于基础设施/工具/纯文档变更） |
| `--no-validate` | 跳过验证（需要确认） |

**示例：**

```bash
# 交互式归档
openspec archive

# 归档特定变更
openspec archive add-dark-mode

# 无提示归档（CI/脚本）
openspec archive add-dark-mode --yes

# 归档不影响规范的工具变更
openspec archive update-ci-config --skip-specs
```

**作用：**

1. 验证变更（除非 `--no-validate`）
2. 提示确认（除非 `--yes`）
3. 将增量规范合并到 `openspec/specs/`
4. 将变更文件夹移动到 `openspec/changes/archive/YYYY-MM-DD-<name>/`

---

## 工作流命令

这些命令支持产物驱动的 OPSX 工作流。它们对于检查进度的人类和确定下一步的 Agent 都很有用。

### `openspec status`

显示变更的产物完成状态。

```
openspec status [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--change <id>` | 变更名称（如果省略则提示） |
| `--schema <name>` | Schema 覆盖（从变更配置自动检测） |
| `--json` | 输出为 JSON |

**示例：**

```bash
# 交互式状态检查
openspec status

# 特定变更的状态
openspec status --change add-dark-mode

# Agent 使用的 JSON
openspec status --change add-dark-mode --json
```

**输出（文本）：**

```
Change: add-dark-mode
Schema: spec-driven

Artifacts:
  ✓ proposal     proposal.md exists
  ✓ specs        specs/ exists
  ◆ design       ready (requires: specs)
  ○ tasks        blocked (requires: design)

Next: Create design using /opsx:continue
```

**输出（JSON）：**

```json
{
  "change": "add-dark-mode",
  "schema": "spec-driven",
  "artifacts": [
    {"id": "proposal", "status": "complete", "path": "proposal.md"},
    {"id": "specs", "status": "complete", "path": "specs/"},
    {"id": "design", "status": "ready", "requires": ["specs"]},
    {"id": "tasks", "status": "blocked", "requires": ["design"]}
  ],
  "next": "design"
}
```

---

### `openspec instructions`

获取用于创建产物或应用任务的丰富指令。供 AI Agent 使用以了解下一步创建什么。

```
openspec instructions [artifact] [options]
```

**参数：**

| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `artifact` | 否 | 产物 ID：`proposal`, `specs`, `design`, `tasks`, 或 `apply` |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--change <id>` | 变更名称（在非交互模式下必填） |
| `--schema <name>` | Schema 覆盖 |
| `--json` | 输出为 JSON |

**特殊情况：** 使用 `apply` 作为产物来获取任务实施指令。

**示例：**

```bash
# 获取下一个产物的指令
openspec instructions --change add-dark-mode

# 获取特定产物的指令
openspec instructions design --change add-dark-mode

# 获取应用/实施指令
openspec instructions apply --change add-dark-mode

# Agent 消费的 JSON
openspec instructions design --change add-dark-mode --json
```

**输出包含：**

- 产物的模板内容
- 来自配置的项目上下文
- 来自依赖产物的内容
- 来自配置的每个产物规则

---

### `openspec templates`

显示 Schema 中所有产物的解析模板路径。

```
openspec templates [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--schema <name>` | 要检查的 Schema（默认：`spec-driven`） |
| `--json` | 输出为 JSON |

**示例：**

```bash
# 显示默认 Schema 的模板路径
openspec templates

# 显示自定义 Schema 的模板
openspec templates --schema my-workflow

# 编程使用的 JSON
openspec templates --json
```

**输出（文本）：**

```
Schema: spec-driven

Templates:
  proposal  → ~/.openspec/schemas/spec-driven/templates/proposal.md
  specs     → ~/.openspec/schemas/spec-driven/templates/specs.md
  design    → ~/.openspec/schemas/spec-driven/templates/design.md
  tasks     → ~/.openspec/schemas/spec-driven/templates/tasks.md
```

---

### `openspec schemas`

列出可用的工作流 Schema 及其描述和产物流程。

```
openspec schemas [options]
```

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--json` | 输出为 JSON |

**示例：**

```bash
openspec schemas
```

**输出：**

```
Available schemas:

  spec-driven (package)
    The default spec-driven development workflow
    Flow: proposal → specs → design → tasks

  my-custom (project)
    Custom workflow for this project
    Flow: research → proposal → tasks
```

---

## Schema 命令

用于创建和管理自定义工作流 Schema 的命令。

### `openspec schema init`

创建一个新的项目本地 Schema。

```
openspec schema init <name> [options]
```

**参数：**

| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `name` | 是 | Schema 名称 (kebab-case) |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--description <text>` | Schema 描述 |
| `--artifacts <list>` | 逗号分隔的产物 ID（默认：`proposal,specs,design,tasks`） |
| `--default` | 设置为项目默认 Schema |
| `--no-default` | 不提示设置为默认 |
| `--force` | 覆盖现有 Schema |
| `--json` | 输出为 JSON |

**示例：**

```bash
# 交互式 Schema 创建
openspec schema init research-first

# 具有特定产物的非交互式创建
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

**创建内容：**

```
openspec/schemas/<name>/
├── schema.yaml           # Schema 定义
└── templates/
    ├── proposal.md       # 每个产物的模板
    ├── specs.md
    ├── design.md
    └── tasks.md
```

---

### `openspec schema fork`

复制现有 Schema 到你的项目以进行自定义。

```
openspec schema fork <source> [name] [options]
```

**参数：**

| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `source` | 是 | 要复制的 Schema |
| `name` | 否 | 新 Schema 名称（默认：`<source>-custom`） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--force` | 覆盖现有目标 |
| `--json` | 输出为 JSON |

**示例：**

```bash
# Fork 内置的 spec-driven schema
openspec schema fork spec-driven my-workflow
```

---

### `openspec schema validate`

验证 Schema 的结构和模板。

```
openspec schema validate [name] [options]
```

**参数：**

| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `name` | 否 | 要验证的 Schema（如果省略则验证所有） |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--verbose` | 显示详细验证步骤 |
| `--json` | 输出为 JSON |

**示例：**

```bash
# 验证特定 Schema
openspec schema validate my-workflow

# 验证所有 Schema
openspec schema validate
```

---

### `openspec schema which`

显示 Schema 从何处解析（用于调试优先级）。

```
openspec schema which [name] [options]
```

**参数：**

| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `name` | 否 | Schema 名称 |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--all` | 列出所有 Schema 及其来源 |
| `--json` | 输出为 JSON |

**示例：**

```bash
# 检查 Schema 来自哪里
openspec schema which spec-driven
```

**输出：**

```
spec-driven resolves from: package
  Source: /usr/local/lib/node_modules/@fission-ai/openspec/schemas/spec-driven
```

**Schema 优先级：**

1. 项目：`openspec/schemas/<name>/`
2. 用户：`~/.local/share/openspec/schemas/<name>/`
3. 包：内置 Schema

---

## 配置命令

### `openspec config`

查看和修改全局 OpenSpec 配置。

```
openspec config <subcommand> [options]
```

**子命令：**

| 子命令 | 描述 |
|------------|-------------|
| `path` | 显示配置文件位置 |
| `list` | 显示所有当前设置 |
| `get <key>` | 获取特定值 |
| `set <key> <value>` | 设置值 |
| `unset <key>` | 移除键 |
| `reset` | 重置为默认值 |
| `edit` | 在 `$EDITOR` 中打开 |

**示例：**

```bash
# 显示配置文件路径
openspec config path

# 列出所有设置
openspec config list

# 获取特定值
openspec config get telemetry.enabled

# 设置值
openspec config set telemetry.enabled false

# 显式设置字符串值
openspec config set user.name "My Name" --string

# 移除自定义设置
openspec config unset user.name

# 重置所有配置
openspec config reset --all --yes

# 在你的编辑器中编辑配置
openspec config edit
```

---

## 实用工具命令

### `openspec feedback`

提交关于 OpenSpec 的反馈。创建一个 GitHub issue。

```
openspec feedback <message> [options]
```

**参数：**

| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `message` | 是 | 反馈消息 |

**选项：**

| 选项 | 描述 |
|--------|-------------|
| `--body <text>` | 详细描述 |

**要求：** 必须安装并验证 GitHub CLI (`gh`)。

**示例：**

```bash
openspec feedback "Add support for custom artifact types" \
  --body "I'd like to define my own artifact types beyond the built-in ones."
```

---

### `openspec completion`

管理 OpenSpec CLI 的 Shell 补全。

```
openspec completion <subcommand> [shell]
```

**子命令：**

| 子命令 | 描述 |
|------------|-------------|
| `generate [shell]` | 输出补全脚本到 stdout |
| `install [shell]` | 为你的 Shell 安装补全 |
| `uninstall [shell]` | 移除已安装的补全 |

**支持的 Shell：** `bash`, `zsh`, `fish`, `powershell`

**示例：**

```bash
# 安装补全（自动检测 Shell）
openspec completion install

# 为特定 Shell 安装
openspec completion install zsh

# 生成脚本用于手动安装
openspec completion generate bash > ~/.bash_completion.d/openspec

# 卸载
openspec completion uninstall
```

---

## 退出码

| 代码 | 含义 |
|------|---------|
| `0` | 成功 |
| `1` | 错误（验证失败、文件缺失等） |

---

## 环境变量

| 变量 | 描述 |
|----------|-------------|
| `OPENSPEC_CONCURRENCY` | 批量验证的默认并发数（默认：6） |
| `EDITOR` 或 `VISUAL` | `openspec config edit` 使用的编辑器 |
| `NO_COLOR` | 设置时禁用彩色输出 |

---

## 相关文档

- [命令](commands.md) - AI 斜杠命令 (`/opsx:new`, `/opsx:apply` 等)
- [工作流](workflows.md) - 常见模式以及何时使用每个命令
- [自定义](customization.md) - 创建自定义 Schema 和模板
- [快速开始](getting-started.md) - 首次设置指南
