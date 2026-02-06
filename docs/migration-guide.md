# 迁移到 OPSX (Migrating to OPSX)

本指南将帮助你从旧版 OpenSpec 工作流迁移到 OPSX。迁移过程设计得很平滑——你现有的工作会被保留，而新系统提供了更多的灵活性。

## 有什么变化？

OPSX 取代了旧的阶段锁定工作流，采用了一种流畅的、基于动作的方法。以下是关键转变：

| 方面 | 旧版 (Legacy) | OPSX |
|--------|--------|------|
| **命令** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | `/opsx:new`, `/opsx:continue`, `/opsx:apply`, 等等 |
| **工作流** | 一次性创建所有工件 | 增量创建或一次性创建——由你选择 |
| **回退** | 笨拙的阶段门控 | 自然——随时更新任何工件 |
| **定制化** | 固定结构 | 模式驱动，完全可破解 |
| **配置** | `CLAUDE.md` 带标记 + `project.md` | 清晰的配置在 `openspec/config.yaml` |

**理念的转变：** 工作不是线性的。OPSX 不再假装它是线性的。

---

## 开始之前

### 你现有的工作是安全的

迁移过程在设计时考虑到了保留现有工作：

- **`openspec/changes/` 中的活跃变更** — 完全保留。你可以使用 OPSX 命令继续它们。
- **已归档的变更** — 未触动。你的历史保持完整。
- **`openspec/specs/` 中的主规范** — 未触动。这些是你的事实来源。
- **你在 CLAUDE.md, AGENTS.md 等文件中的内容** — 保留。只有 OpenSpec 标记块被移除；你写的所有内容都会保留。

### 哪些会被移除

只有被替换的 OpenSpec 管理的文件：

| 内容 | 原因 |
|------|-----|
| 旧版斜杠命令目录/文件 | 被新的技能系统取代 |
| `openspec/AGENTS.md` | 过时的工作流触发器 |
| `CLAUDE.md`, `AGENTS.md` 等中的 OpenSpec 标记 | 不再需要 |

**按工具分类的旧版命令位置**（示例——你的工具可能不同）：

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md`
- 其他 (Augment, Continue, Amazon Q, 等)

迁移会自动检测你配置了哪些工具，并清理它们的旧文件。

移除列表看起来很长，但这些都是 OpenSpec 最初创建的文件。你自己的内容永远不会被删除。

### 需要你关注的内容

有一个文件需要手动迁移：

**`openspec/project.md`** — 这个文件不会自动删除，因为它可能包含你写的项目上下文。你需要：

1. 审查其内容
2. 将有用的上下文移动到 `openspec/config.yaml`（参见下面的指南）
3. 准备好后删除该文件

**我们为什么要改动这个：**

旧的 `project.md` 是被动的——代理可能会读它，也可能不会，甚至读了就忘。我们发现其可靠性不一致。

新的 `config.yaml` 上下文会被**主动注入到每个 OpenSpec 规划请求中**。这意味着当 AI 创建工件时，你的项目约定、技术栈和规则始终存在。可靠性更高。

**权衡：**

因为上下文被注入到每个请求中，你需要保持简洁。专注于真正重要的内容：
- 技术栈和关键约定
- AI 需要知道的非显而易见的约束
- 以前经常被忽略的规则

不要担心做得不够完美。我们仍在学习什么是最好的，随着我们的实验，我们将不断改进上下文注入的工作方式。

---

## 运行迁移

`openspec init` 和 `openspec update` 都会检测旧文件并引导你完成相同的清理过程。使用适合你情况的那个：

### 使用 `openspec init`

如果你想添加新工具或重新配置已设置的工具，请运行此命令：

```bash
openspec init
```

init 命令会检测旧文件并引导你进行清理：

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**当你选择 Yes 时会发生什么：**

1. 旧版斜杠命令目录被移除
2. OpenSpec 标记从 `CLAUDE.md`, `AGENTS.md` 等文件中剥离（你的内容保留）
3. `openspec/AGENTS.md` 被删除
4. 新技能安装在 `.claude/skills/` 中
5. 创建带有默认模式的 `openspec/config.yaml`

### 使用 `openspec update`

如果你只是想迁移并将现有工具刷新到最新版本，请运行此命令：

```bash
openspec update
```

update 命令也会检测并清理旧工件，然后将你的技能刷新到最新版本。

### 非交互式 / CI 环境

对于脚本化迁移：

```bash
openspec init --force --tools claude
```

`--force` 标志会跳过提示并自动接受清理。

---

## 将 project.md 迁移到 config.yaml

旧的 `openspec/project.md` 是一个自由格式的 markdown 文件，用于项目上下文。新的 `openspec/config.yaml` 是结构化的，而且关键是——**注入到每个规划请求中**，这样你的约定在 AI 工作时始终存在。

### 之前 (project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### 之后 (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### 关键区别

| project.md | config.yaml |
|------------|-------------|
| 自由格式 markdown | 结构化 YAML |
| 一大块文本 | 分离的上下文和按工件规则 |
| 不清楚何时使用 | 上下文出现在所有工件中；规则仅出现在匹配的工件中 |
| 无模式选择 | 显式的 `schema:` 字段设置默认工作流 |

### 保留什么，丢弃什么

迁移时，要有所选择。问问自己：“AI 在*每次*规划请求时都需要这个吗？”

**适合放进 `context:` 的内容**
- 技术栈（语言、框架、数据库）
- 关键架构模式（monorepo、微服务等）
- 非显而易见的约束（“我们不能使用库 X，因为……”）
- 经常被忽略的关键约定

**移至 `rules:` 的内容**
- 特定工件的格式（“在 specs 中使用 Given/When/Then”）
- 审查标准（“proposal 必须包含回滚计划”）
- 这些只出现在匹配的工件中，使其他请求更轻量

**完全舍弃的内容**
- AI 已经知道的通用最佳实践
- 可以概括的冗长解释
- 不影响当前工作的历史背景

### 迁移步骤

1. **创建 config.yaml**（如果 init 尚未创建）：
   ```yaml
   schema: spec-driven
   ```

2. **添加你的上下文**（保持简洁——这会进入每个请求）：
   ```yaml
   context: |
     Your project background goes here.
     Focus on what the AI genuinely needs to know.
   ```

3. **添加按工件规则**（可选）：
   ```yaml
   rules:
     proposal:
       - Your proposal-specific guidance
     specs:
       - Your spec-writing rules
   ```

4. **删除 project.md** 一旦你移动了所有有用的东西。

**不要想得太复杂。** 从基础开始，然后迭代。如果你发现 AI 遗漏了某些重要内容，就添加进去。如果上下文感觉臃肿，就删减它。这是一个活的文件。

### 需要帮助？使用这个提示词

如果你不确定如何提炼你的 project.md，请询问你的 AI 助手：

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

AI 将帮助你识别什么是必要的，什么可以删减。

---

## 新命令

迁移后，你有 9 个 OPSX 命令，而不是 3 个：

| 命令 | 用途 |
|---------|---------|
| `/opsx:explore` | 无结构地思考想法 |
| `/opsx:new` | 开始一个新的变更 |
| `/opsx:continue` | 创建下一个工件（一次一个） |
| `/opsx:ff` | 快进——一次性创建所有规划工件 |
| `/opsx:apply` | 实施 tasks.md 中的任务 |
| `/opsx:verify` | 验证实施是否符合规范 |
| `/opsx:sync` | 预览规范合并（可选——如果需要归档提示） |
| `/opsx:archive` | 完成并归档变更 |
| `/opsx:bulk-archive` | 一次归档多个变更 |

### 与旧版命令的映射

| 旧版 | OPSX 等效 |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:new` 然后 `/opsx:ff` |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### 新能力

**细粒度工件创建：**
```
/opsx:continue
```
根据依赖关系一次创建一个工件。当你想要审查每一步时使用这个。

**探索模式：**
```
/opsx:explore
```
在致力于变更之前与伙伴一起思考想法。

---

## 理解新架构

### 从阶段锁定到流畅

旧版工作流强制线性推进：

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

如果在实施过程中发现设计错了怎么办？
太糟糕了。阶段门控让你很难回去。
```

OPSX 使用动作，而不是阶段：

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### 依赖图

工件形成有向图。依赖是推动者，而不是门控：

```
                        proposal
                       (root node)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (requires:                  (requires:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (requires:
                     specs, design)
```

当你运行 `/opsx:continue` 时，它会检查什么已就绪并提供下一个工件。你也可以按任何顺序创建多个已就绪的工件。

### 技能 vs 命令

旧系统使用特定于工具的命令文件：

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX 使用新兴的 **技能 (skills)** 标准：

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

技能可以在多个 AI 编码工具中被识别，并提供更丰富的元数据。

---

## 继续现有变更

你正在进行的变更可以与 OPSX 命令无缝协作。

**有来自旧工作流的活跃变更吗？**

```
/opsx:apply add-my-feature
```

OPSX 读取现有工件并从你离开的地方继续。

**想向现有变更添加更多工件吗？**

```
/opsx:continue add-my-feature
```

根据已存在的内容显示已就绪可创建的内容。

**需要查看状态？**

```bash
openspec status --change add-my-feature
```

---

## 新配置系统

### config.yaml 结构

```yaml
# 必需：新变更的默认模式
schema: spec-driven

# 可选：项目上下文 (最大 50KB)
# 注入到所有工件指令中
context: |
  Your project background, tech stack,
  conventions, and constraints.

# 可选：按工件规则
# 仅注入到匹配的工件中
rules:
  proposal:
    - Include rollback plan
  specs:
    - Use Given/When/Then format
  design:
    - Document fallback strategies
  tasks:
    - Break into 2-hour maximum chunks
```

### 模式解析

在确定使用哪个模式时，OPSX 按顺序检查：

1. **CLI 标志**: `--schema <name>` (最高优先级)
2. **变更元数据**: 变更目录中的 `.openspec.yaml`
3. **项目配置**: `openspec/config.yaml`
4. **默认**: `spec-driven`

### 可用模式

| 模式 | 工件 | 适用场景 |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | 大多数项目 |

列出所有可用模式：

```bash
openspec schemas
```

### 自定义模式

创建你自己的工作流：

```bash
openspec schema init my-workflow
```

或者 Fork 现有的：

```bash
openspec schema fork spec-driven my-workflow
```

详见 [定制化](customization.md)。

---

## 故障排除

### "Legacy files detected in non-interactive mode"

你在 CI 或非交互式环境中运行。使用：

```bash
openspec init --force
```

### 迁移后命令未出现

重启你的 IDE。技能在启动时被检测。

### "Unknown artifact ID in rules"

检查你的 `rules:` 键是否与你的模式的工件 ID 匹配：

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

运行此命令查看有效的工件 ID：

```bash
openspec schemas --json
```

### 配置未应用

1. 确保文件位于 `openspec/config.yaml`（不是 `.yml`）
2. 验证 YAML 语法
3. 配置更改立即生效——无需重启

### project.md 未迁移

系统特意保留 `project.md`，因为它可能包含你的自定义内容。手动审查它，将有用的部分移动到 `config.yaml`，然后删除它。

### 想看看会被清理什么？

运行 init 并拒绝清理提示——你将看到完整的检测摘要，而不会进行任何更改。

---

## 快速参考

### 迁移后的文件

```
project/
├── openspec/
│   ├── specs/                    # 不变
│   ├── changes/                  # 不变
│   │   └── archive/              # 不变
│   └── config.yaml               # 新增：项目配置
├── .claude/
│   └── skills/                   # 新增：OPSX 技能
│       ├── openspec-explore/
│       ├── openspec-new-change/
│       └── ...
├── CLAUDE.md                     # OpenSpec 标记被移除，你的内容保留
└── AGENTS.md                     # OpenSpec 标记被移除，你的内容保留
```

### 消失的内容

- `.claude/commands/openspec/` — 被 `.claude/skills/` 取代
- `openspec/AGENTS.md` — 过时
- `openspec/project.md` — 迁移到 `config.yaml`，然后删除
- `CLAUDE.md`, `AGENTS.md` 等中的 OpenSpec 标记块

### 命令速查表

```
/opsx:new          开始一个变更
/opsx:continue     创建下一个工件
/opsx:ff           创建所有规划工件
/opsx:apply        实施任务
/opsx:archive      完成并归档
```

---

## 获取帮助

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/openspec-cn/openspec/issues](https://github.com/openspec-cn/openspec/issues)
- **文档**: [docs/opsx.md](opsx.md) 获取完整的 OPSX 参考
