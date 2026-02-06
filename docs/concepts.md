# 概念

本指南解释了 OpenSpec 背后的核心理念以及它们如何协同工作。关于实际使用，请参阅 [快速开始](getting-started.md) 和 [工作流](workflows.md)。

## 哲学

OpenSpec 围绕四个原则构建：

```
流畅而非僵化       — 没有阶段门控，做有意义的工作
迭代而非瀑布       — 边构建边学习，边进行边完善
简单而非复杂       — 轻量级设置，最少的仪式
既有项目优先       — 适用于现有代码库，不仅仅是新项目
```

### 为什么这些原则很重要

**流畅而非僵化。** 传统的规范系统将你锁定在阶段中：首先计划，然后实施，最后完成。OpenSpec 更灵活——你可以按对你的工作有意义的任何顺序创建产物。

**迭代而非瀑布。** 需求会变。理解会加深。开始时看起来不错的方法在看到代码库后可能站不住脚。OpenSpec 拥抱这一现实。

**简单而非复杂。** 一些规范框架需要广泛的设置、僵化的格式或繁重的流程。OpenSpec 不会妨碍你。几秒钟内初始化，立即开始工作，仅在需要时自定义。

**既有项目优先 (Brownfield-first)。** 大多数软件工作不是从头开始构建——而是修改现有系统。OpenSpec 的基于增量的方法使得指定现有行为的变更变得容易，而不仅仅是描述新系统。

## 宏观图景

OpenSpec 将你的工作组织成两个主要区域：

```
┌─────────────────────────────────────────────────────────────────┐
│                        openspec/                                 │
│                                                                  │
│   ┌─────────────────────┐      ┌──────────────────────────────┐ │
│   │       specs/        │      │         changes/              │ │
│   │                     │      │                               │ │
│   │  单一事实来源       │◄─────│  提议的修改                   │ │
│   │  你的系统当前       │ 合并 │  每个变更 = 一个文件夹        │ │
│   │  如何工作           │      │  包含产物 + 增量              │ │
│   │                     │      │                               │ │
│   └─────────────────────┘      └──────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Specs (规范)** 是单一事实来源——它们描述了你的系统当前的行为。

**Changes (变更)** 是提议的修改——它们存在于单独的文件夹中，直到你准备好合并它们。

这种分离是关键。你可以并行处理多个变更而不会发生冲突。你可以在变更影响主规范之前审查它。当你归档变更时，它的增量会干净地合并到单一事实来源中。

## 规范 (Specs)

规范使用结构化的需求和场景描述你的系统的行为。

### 结构

```
openspec/specs/
├── auth/
│   └── spec.md           # 认证行为
├── payments/
│   └── spec.md           # 支付处理
├── notifications/
│   └── spec.md           # 通知系统
└── ui/
    └── spec.md           # UI 行为和主题
```

按领域组织规范——对你的系统有意义的逻辑分组。常见模式：

- **按功能区域**：`auth/`, `payments/`, `search/`
- **按组件**：`api/`, `frontend/`, `workers/`
- **按限界上下文**：`ordering/`, `fulfillment/`, `inventory/`

### 规范格式

一个规范包含需求，每个需求都有场景：

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**关键要素：**

| 元素 | 用途 |
|---------|---------|
| `## Purpose` | 此规范领域的高级描述 |
| `### Requirement:` | 系统必须具有的特定行为 |
| `#### Scenario:` | 需求在行动中的具体示例 |
| SHALL/MUST/SHOULD | RFC 2119 关键字，指示需求强度 |

### 为什么要这样组织规范

**需求是 "什么"** — 它们陈述系统应该做什么，而不指定实现。

**场景是 "何时"** — 它们提供可验证的具体示例。好的场景：
- 可测试（你可以为它们编写自动化测试）
- 涵盖快乐路径和边缘情况
- 使用 Given/When/Then 或类似的结构化格式

**RFC 2119 关键字** (SHALL, MUST, SHOULD, MAY) 传达意图：
- **MUST/SHALL** — 绝对要求
- **SHOULD** — 推荐，但存在例外
- **MAY** — 可选

## 变更 (Changes)

变更是一个提议的系统修改，打包为一个文件夹，包含理解和实施它所需的一切。

### 变更结构

```
openspec/changes/add-dark-mode/
├── proposal.md           # 为什么和什么
├── design.md             # 如何（技术方案）
├── tasks.md              # 实施清单
├── .openspec.yaml        # 变更元数据（可选）
└── specs/                # 增量规范
    └── ui/
        └── spec.md       # ui/spec.md 中的变更内容
```

每个变更是自包含的。它有：
- **产物 (Artifacts)** — 捕获意图、设计和任务的文档
- **增量规范 (Delta specs)** — 对添加、修改或删除内容的规范
- **元数据 (Metadata)** — 此特定变更的可选配置

### 为什么变更是文件夹

将变更打包为文件夹有几个好处：

1. **一切在一起。** 提案、设计、任务和规范都在一个地方。无需在不同位置寻找。

2. **并行工作。** 多个变更可以同时存在而不冲突。在 `fix-auth-bug` 进行中的同时处理 `add-dark-mode`。

3. **干净的历史。** 归档时，变更移动到 `changes/archive/`，保留其完整上下文。你可以回顾并理解不仅仅是什么变了，还有为什么。

4. **易于审查。** 变更文件夹易于审查——打开它，阅读提案，检查设计，查看规范增量。

## 产物 (Artifacts)

产物是变更中指导工作的文档。

### 产物流程

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

产物相互构建。每个产物为下一个提供上下文。

### 产物类型

#### 提案 (`proposal.md`)

提案在高层次捕获 **意图**、**范围** 和 **方法**。

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**何时更新提案：**
- 范围变更（缩小或扩大）
- 意图澄清（对问题的更好理解）
- 方法发生根本转变

#### 规范 (增量规范在 `specs/` 中)

增量规范描述相对于当前规范 **什么在变化**。见下文 [增量规范](#delta-specs)。

#### 设计 (`design.md`)

设计捕获 **技术方案** 和 **架构决策**。

```markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
```

**何时更新设计：**
- 实施揭示该方法行不通
- 发现了更好的解决方案
- 依赖关系或约束发生变化

#### 任务 (`tasks.md`)

任务是 **实施清单** — 带有复选框的具体步骤。

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**任务最佳实践：**
- 将相关任务分组在标题下
- 使用分层编号 (1.1, 1.2 等)
- 保持任务足够小，可以在一次会话中完成
- 完成任务时勾选它们

## 增量规范 (Delta Specs)

增量规范是使 OpenSpec 适用于既有项目开发的关键概念。它们描述 **什么在变化**，而不是重述整个规范。

### 格式

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### 增量部分

| 部分 | 含义 | 归档时发生什么 |
|---------|---------|------------------------|
| `## ADDED Requirements` | 新行为 | 追加到主规范 |
| `## MODIFIED Requirements` | 变更的行为 | 替换现有需求 |
| `## REMOVED Requirements` | 弃用的行为 | 从主规范中删除 |

### 为什么用增量代替完整规范

**清晰。** 增量准确显示了什么在变化。阅读完整规范，你必须在脑海中将其与当前版本进行 diff。

**避免冲突。** 两个变更可以触及同一个规范文件而不冲突，只要它们修改不同的需求。

**审查效率。** 审查者看到的是变更，而不是未变更的上下文。专注于重要的事情。

**既有项目适应性。** 大多数工作修改现有行为。增量使修改成为一等公民，而不是事后的想法。

## Schema

Schema 定义了工作流的产物类型及其依赖关系。

### Schema 如何工作

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # 无依赖，可首先创建

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # 创建前需要 proposal

  - id: design
    generates: design.md
    requires: [proposal]      # 可以与 specs 并行创建

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # 需要 specs 和 design 先完成
```

**产物形成依赖图：**

```
                    proposal
                   (根节点)
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

**依赖是使能者，而不是门控。** 它们显示了什么可能创建，而不是接下来必须创建什么。如果你不需要，可以跳过设计。你可以在设计之前或之后创建规范——两者都仅依赖于提案。

### 内置 Schema

**spec-driven** (默认)

规范驱动开发的标准工作流：

```
proposal → specs → design → tasks → implement
```

最适合：大多数你希望在实施前就规范达成一致的功能工作。

### 自定义 Schema

为你的团队工作流创建自定义 Schema：

```bash
# 从头创建
openspec schema init research-first

# 或 Fork 现有的
openspec schema fork spec-driven research-first
```

**示例自定义 Schema：**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # 先做研究

  - id: proposal
    generates: proposal.md
    requires: [research]   # 提案受研究影响

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # 跳过 specs/design，直接到 tasks
```

有关创建和使用自定义 Schema 的完整详情，请参阅 [自定义](customization.md)。

## 归档 (Archive)

归档通过将其增量规范合并到主规范并保留变更用于历史记录来完成变更。

### 归档时发生什么

```
归档前:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


归档后:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # 现在包含 2FA 需求
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # 保留用于历史记录
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### 归档过程

1. **合并增量。** 每个增量规范部分 (ADDED/MODIFIED/REMOVED) 应用于对应的主规范。

2. **移动到归档。** 变更文件夹移动到 `changes/archive/`，带有日期前缀以便按时间顺序排列。

3. **保留上下文。** 所有产物在归档中保持完整。你总是可以回顾并理解为什么要进行变更。

### 为什么归档很重要

**干净的状态。** 活跃变更 (`changes/`) 仅显示进行中的工作。已完成的工作移出视线。

**审计跟踪。** 归档保留了每个变更的完整上下文——不仅是什么变了，还有解释原因的提案，解释如何做的设计，以及显示已完成工作的任务。

**规范演变。** 规范随着变更的归档而有机增长。每个归档合并其增量，随着时间的推移建立起全面的规范。

## 它们如何协同工作

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              OPENSPEC 流程                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. 开始       │  /opsx:new 创建变更文件夹                               │
│   │     变更       │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. 创建       │  /opsx:ff 或 /opsx:continue                             │
│   │     产物       │  创建 proposal → specs → design → tasks                 │
│   │                │  (基于 Schema 依赖)                                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. 实施       │  /opsx:apply                                            │
│   │     任务       │  处理任务，勾选它们                                     │
│   │                │◄──── 随着学习更新产物                                   │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. 验证       │  /opsx:verify (可选)                                    │
│   │     工作       │  检查实施是否匹配规范                                   │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐   │
│   │  5. 归档       │────►│  增量规范合并到主规范                        │   │
│   │     变更       │     │  变更文件夹移动到 archive/                   │   │
│   └────────────────┘     │  规范现在是更新后的单一事实来源              │   │
│   │                          └──────────────────────────────────────────────┘   │
│   │                                                                              │
│   └─────────────────────────────────────────────────────────────────────────────┘
```

**良性循环：**

1. 规范描述当前行为
2. 变更提议修改（作为增量）
3. 实施使变更成为现实
4. 归档将增量合并到规范
5. 规范现在描述新行为
6. 下一个变更建立在更新的规范之上

## 术语表

| 术语 | 定义 |
|------|------------|
| **Artifact (产物)** | 变更中的文档（提案、设计、任务或增量规范） |
| **Archive (归档)** | 完成变更并将其增量合并到主规范的过程 |
| **Change (变更)** | 提议的系统修改，打包为带有产物的文件夹 |
| **Delta spec (增量规范)** | 描述相对于当前规范的变更（添加/修改/删除）的规范 |
| **Domain (领域)** | 规范的逻辑分组（例如 `auth/`, `payments/`） |
| **Requirement (需求)** | 系统必须具有的特定行为 |
| **Scenario (场景)** | 需求的一个具体示例，通常采用 Given/When/Then 格式 |
| **Schema** | 产物类型及其依赖关系的定义 |
| **Spec (规范)** | 描述系统行为的规范，包含需求和场景 |
| **Source of truth (单一事实来源)** | `openspec/specs/` 目录，包含当前商定的行为 |

## 下一步

- [快速开始](getting-started.md) - 实用的第一步
- [工作流](workflows.md) - 常见模式以及何时使用每个
- [命令](commands.md) - 完整命令参考
- [自定义](customization.md) - 创建自定义 Schema 和配置你的项目
