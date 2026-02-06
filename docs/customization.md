# 定制化 (Customization)

OpenSpec 提供三个层级的定制化能力：

| 层级 | 作用 | 适用场景 |
|------|------|----------|
| **项目配置 (Project Config)** | 设置默认值，注入上下文/规则 | 大多数团队 |
| **自定义模式 (Custom Schemas)** | 定义你自己的工件工作流 | 有独特流程的团队 |
| **全局覆盖 (Global Overrides)** | 在所有项目中共享模式 | 高级用户 |

---

## 项目配置

`openspec/config.yaml` 文件是为团队定制 OpenSpec 最简单的方式。它可以让你：

- **设置默认模式** - 免去每次命令都输入 `--schema`
- **注入项目上下文** - 让 AI 了解你的技术栈、约定等
- **添加按工件的规则** - 为特定工件定制规则

### 快速设置

```bash
openspec init
```

这将引导你交互式地创建配置。或者手动创建一个：

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js, PostgreSQL
  API style: RESTful, documented in docs/api.md
  Testing: Jest + React Testing Library
  We value backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format
    - Reference existing patterns before inventing new ones
```

### 工作原理

**默认模式：**

```bash
# 没有配置时
openspec new change my-feature --schema spec-driven

# 有配置时 - 自动使用指定模式
openspec new change my-feature
```

**上下文和规则注入：**

当生成任何工件时，你的上下文和规则会被注入到 AI 提示词中：

```xml
<context>
Tech stack: TypeScript, React, Node.js, PostgreSQL
...
</context>

<rules>
- Include rollback plan
- Identify affected teams
</rules>

<template>
[Schema's built-in template]
</template>
```

- **上下文 (Context)** 出现在所有工件中
- **规则 (Rules)** 仅出现在匹配的工件中

### 模式解析顺序

当 OpenSpec 需要模式时，按以下顺序查找：

1. CLI 标志：`--schema <name>`
2. 变更元数据（变更文件夹中的 `.openspec.yaml`）
3. 项目配置 (`openspec/config.yaml`)
4. 默认值 (`spec-driven`)

---

## 自定义模式

当项目配置不够用时，你可以创建一个拥有完全自定义工作流的模式。自定义模式位于项目的 `openspec/schemas/` 目录中，并随代码一起进行版本控制。

```text
your-project/
├── openspec/
│   ├── config.yaml        # 项目配置
│   ├── schemas/           # 自定义模式存放在这里
│   │   └── my-workflow/
│   │       ├── schema.yaml
│   │       └── templates/
│   └── changes/           # 你的变更
└── src/
```

### Fork 现有模式

定制的最快方法是 Fork 一个内置模式：

```bash
openspec schema fork spec-driven my-workflow
```

这将把整个 `spec-driven` 模式复制到 `openspec/schemas/my-workflow/`，你可以在那里自由编辑。

**你会得到：**

```text
openspec/schemas/my-workflow/
├── schema.yaml           # 工作流定义
└── templates/
    ├── proposal.md       # 提案工件模板
    ├── spec.md           # 规范模板
    ├── design.md         # 设计模板
    └── tasks.md          # 任务模板
```

现在编辑 `schema.yaml` 来改变工作流，或者编辑模板来改变 AI 生成的内容。

### 从头创建模式

创建一个全新的工作流：

```bash
# 交互式
openspec schema init research-first

# 非交互式
openspec schema init rapid \
  --description "Rapid iteration workflow" \
  --artifacts "proposal,tasks" \
  --default
```

### 模式结构

模式定义了工作流中的工件以及它们之间的依赖关系：

```yaml
# openspec/schemas/my-workflow/schema.yaml
name: my-workflow
version: 1
description: My team's custom workflow

artifacts:
  - id: proposal
    generates: proposal.md
    description: Initial proposal document
    template: proposal.md
    instruction: |
      Create a proposal that explains WHY this change is needed.
      Focus on the problem, not the solution.
    requires: []

  - id: design
    generates: design.md
    description: Technical design
    template: design.md
    instruction: |
      Create a design document explaining HOW to implement.
    requires:
      - proposal    # 必须先有 proposal 才能创建 design

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires:
      - design

apply:
  requires: [tasks]
  tracks: tasks.md
```

**关键字段：**

| 字段 | 用途 |
|------|------|
| `id` | 唯一标识符，用于命令和规则 |
| `generates` | 输出文件名（支持 glob，如 `specs/**/*.md`） |
| `template` | `templates/` 目录中的模板文件 |
| `instruction` | 创建此工件的 AI 指令 |
| `requires` | 依赖关系 - 哪些工件必须先存在 |

### 模板

模板是指导 AI 的 markdown 文件。创建工件时，它们会被注入到提示词中。

```markdown
<!-- templates/proposal.md -->
## Why

<!-- Explain the motivation for this change. What problem does this solve? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities or modifications. -->

## Impact

<!-- Affected code, APIs, dependencies, systems -->
```

模板可以包含：
- AI 应该填写的章节标题
- 带有 AI 指导的 HTML 注释
- 展示预期结构的示例格式

### 验证你的模式

在使用自定义模式之前，先验证它：

```bash
openspec schema validate my-workflow
```

这将检查：
- `schema.yaml` 语法是否正确
- 所有引用的模板是否存在
- 没有循环依赖
- 工件 ID 是否有效

### 使用你的自定义模式

创建后，通过以下方式使用你的模式：

```bash
# 在命令中指定
openspec new change feature --schema my-workflow

# 或者在 config.yaml 中设为默认
schema: my-workflow
```

### 调试模式解析

不确定正在使用哪个模式？检查一下：

```bash
# 查看特定模式从哪里解析
openspec schema which my-workflow

# 列出所有可用模式
openspec schema which --all
```

输出显示它来自你的项目、用户目录还是软件包：

```text
Schema: my-workflow
Source: project
Path: /path/to/project/openspec/schemas/my-workflow
```

---

> **注意：** OpenSpec 也支持位于 `~/.local/share/openspec/schemas/` 的用户级模式，用于跨项目共享，但建议将项目级模式放在 `openspec/schemas/` 中，因为它们随代码一起进行版本控制。

---

## 示例

### 快速迭代工作流

一个用于快速迭代的最小工作流：

```yaml
# openspec/schemas/rapid/schema.yaml
name: rapid
version: 1
description: Fast iteration with minimal overhead

artifacts:
  - id: proposal
    generates: proposal.md
    description: Quick proposal
    template: proposal.md
    instruction: |
      Create a brief proposal for this change.
      Focus on what and why, skip detailed specs.
    requires: []

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    requires: [proposal]

apply:
  requires: [tasks]
  tracks: tasks.md
```

### 添加审查工件

Fork 默认模式并添加一个审查步骤：

```bash
openspec schema fork spec-driven with-review
```

然后编辑 `schema.yaml` 添加：

```yaml
  - id: review
    generates: review.md
    description: Pre-implementation review checklist
    template: review.md
    instruction: |
      Create a review checklist based on the design.
      Include security, performance, and testing considerations.
    requires:
      - design

  - id: tasks
    # ... existing tasks config ...
    requires:
      - specs
      - design
      - review    # 现在任务也需要审查了
```

---

## 另请参阅

- [CLI 参考：模式命令](cli.md#schema-commands) - 完整的命令文档
