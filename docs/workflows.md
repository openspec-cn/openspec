# 工作流 (Workflows)

本指南涵盖了 OpenSpec 的常见工作流模式以及何时使用每种模式。有关基本设置，请参阅 [快速开始](getting-started.md)。有关命令参考，请参阅 [命令](commands.md)。

## 理念：动作，而不是阶段

传统工作流强迫你经历各个阶段：计划，然后实施，然后完成。但实际工作并不完全符合这种框框。

OPSX 采用不同的方法：

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**关键原则：**

- **动作，而不是阶段** - 命令是你可以做的事情，而不是你被困住的阶段
- **依赖是推动者** - 它们显示什么是可能的，而不是下一步必须做什么

> **定制化：** OPSX 工作流由定义工件序列的模式驱动。有关创建自定义模式的详细信息，请参阅 [定制化](customization.md)。

## 工作流模式

### 快速特性 (Quick Feature)

当你知道你想构建什么并且只需要执行时：

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**对话示例：**

```text
You: /opsx:new add-logout-button

AI:  Created openspec/changes/add-logout-button/
     Ready to create: proposal

You: /opsx:ff

AI:  Creating all planning artifacts...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Ready for implementation!

You: /opsx:apply

AI:  Working through tasks...
     ✓ Added logout button to header
     ✓ Implemented session clearing
     ✓ Added confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  ✓ Merged specs
     ✓ Archived change
```

**最适合：** 中小型特性，Bug 修复，直接的变更。

### 探索性 (Exploratory)

当需求不明确或你需要先调查时：

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**对话示例：**

```text
You: /opsx:explore

AI:  What would you like to explore?

You: I want to improve page load performance but I'm not sure
     where the bottlenecks are.

AI:  Let me help investigate...
     [Analyzes bundle sizes, identifies slow queries, reviews
     component render patterns]

     I found three main bottlenecks:
     1. Large unoptimized images
     2. Synchronous data fetching in ProductList
     3. Re-renders from context changes

     Which would you like to address first?

You: Let's tackle the data fetching issue.

You: /opsx:new optimize-product-list-fetching

AI:  Created change. Ready to create: proposal

You: /opsx:continue

AI:  Creating proposal based on our exploration...
     [Writes proposal incorporating investigation insights]

     Ready to create: specs, design
     Which would you like next?

You: /opsx:continue

AI:  Creating specs...
```

**最适合：** 性能优化，调试，架构决策，不明确的需求。

### 并行变更 (Parallel Changes)

同时处理多个变更：

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (in progress)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**对话示例：**

```text
You: I'm working on add-dark-mode but got pulled into a bug fix

You: /opsx:new fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Created planning artifacts

You: /opsx:apply

AI:  Working on fix-login-redirect...
     [Implements the fix]
     All tasks complete!

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect

You: Let's get back to dark mode

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode...
     Picking up at task 2.3: Update Header...
```

**最适合：** 并行工作流，紧急中断，团队协作。

当你有多个已完成的变更时，使用 `/opsx:bulk-archive`：

```text
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (all tasks done)
     - fix-login-redirect (all tasks done)
     - update-footer (all tasks done)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will apply in chronological order.

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-redirect
     ✓ Archived update-footer
     Specs merged in order: add-dark-mode → update-footer
```

批量归档检测多个变更是否触及相同的规范，并通过检查实际实施的内容来解决冲突。

### 完成变更 (Completing a Change)

推荐的完成流程：

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### 验证：检查你的工作

`/opsx:verify` 从三个维度验证实施是否符合你的工件：

```text
You: /opsx:verify

AI:  Verifying add-auth...

     COMPLETENESS
     ✓ All 12 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Session timeout after inactivity" not tested

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "event-driven" but implementation uses polling

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for session timeout scenario
     2. Consider refactoring to event-driven as designed, or update design.md
```

**verify 检查什么：**

| 维度 | 验证内容 |
|-----------|------------------|
| 完整性 (Completeness) | 所有任务完成，所有需求已实施，场景已覆盖 |
| 正确性 (Correctness) | 实施符合规范意图，边缘情况已处理 |
| 一致性 (Coherence) | 设计决策反映在代码结构中，模式一致 |

Verify 不会阻止归档，但它会暴露你可能想先解决的问题。

#### 归档：最终化变更

`/opsx:archive` 完成变更并将其移至归档：

```text
You: /opsx:archive

AI:  Archiving add-auth...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (12/12 tasks complete)

     Delta specs: Not yet synced to main
     → Would you like to sync now?

You: Yes

AI:  ✓ Synced specs to openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-auth/

     Change archived successfully.
```

如果规范未同步，归档会提示。它不会因为任务未完成而阻塞，但会警告你。

## 何时使用什么

### `/opsx:ff` vs `/opsx:continue`

| 情况 | 使用 |
|-----------|-----|
| 需求明确，准备构建 | `/opsx:ff` |
| 正在探索，想要审查每一步 | `/opsx:continue` |
| 想要在 specs 之前迭代 proposal | `/opsx:continue` |
| 时间紧迫，需要快速行动 | `/opsx:ff` |
| 复杂变更，想要控制 | `/opsx:continue` |

**经验法则：** 如果你可以预先描述完整范围，使用 `/opsx:ff`。如果你是边做边想，使用 `/opsx:continue`。

### 何时更新 vs 重新开始

一个常见问题：什么时候更新现有变更是可以的，什么时候应该开始一个新的？

**在以下情况下更新现有变更：**

- 意图相同，执行更精细
- 范围缩小（先 MVP，其余稍后）
- 学习驱动的修正（代码库不是你预期的那样）
- 基于实施发现的设计调整

**在以下情况下开始新变更：**

- 意图发生了根本变化
- 范围爆炸变成了完全不同的工作
- 原始变更可以独立标记为“完成”
- 补丁会让人困惑而不是澄清

```text
                     ┌─────────────────────────────────────┐
                     │     这是同样的工作吗？              │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          意图相同？        >50% 重叠？        原始变更能在
          问题相同？        范围相同？         没有这些更改
                 │                  │          的情况下“完成”吗？
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      YES               NO YES           NO  NO              YES
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    UPDATE            NEW  UPDATE       NEW  UPDATE          NEW
```

**示例："增加暗黑模式"**

- "还需要支持自定义主题" → 新变更（范围爆炸）
- "系统偏好检测比预期的难" → 更新（意图相同）
- "让我们先发布切换开关，稍后添加偏好设置" → 更新然后归档，然后新变更

## 最佳实践

### 保持变更聚焦

每个变更一个逻辑工作单元。如果你正在做“增加功能 X 并且重构 Y”，考虑分成两个单独的变更。

**为什么重要：**
- 更容易审查和理解
- 更干净的归档历史
- 可以独立发布
- 如果需要，更容易回滚

### 对不明确的需求使用 `/opsx:explore`

在致力于变更之前，探索问题空间：

```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle rate limiting for our API?

AI:  Let me investigate your current setup and options...
     [Researches codebase, considers patterns]

     I see three approaches we could take:
     1. Middleware-based (simple, per-endpoint)
     2. Redis-backed (scalable, shared state)
     3. Token bucket per user (fair, complex)

     Your current stack suggests #1 or #2. What's your scale?
```

探索可以在创建工件之前澄清思路。

### 归档前验证

使用 `/opsx:verify` 检查实施是否符合工件：

```text
You: /opsx:verify

AI:  Verifying add-dark-mode...

     ✓ All tasks in tasks.md are checked
     ✓ Requirements in specs have corresponding code
     ✓ Design decisions are reflected in implementation

     Ready to archive!
```

在关闭变更之前捕获不匹配。

### 清晰地命名变更

好名字让 `openspec list` 更名有用：

```text
Good:                          Avoid:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## 命令快速参考

有关完整的命令详细信息和选项，请参阅 [命令](commands.md)。

| 命令 | 用途 | 何时使用 |
|---------|---------|-------------|
| `/opsx:explore` | 思考想法 | 需求不明确，调查 |
| `/opsx:new` | 开始一个变更 | 开始任何新工作 |
| `/opsx:continue` | 创建下一个工件 | 逐步创建工件 |
| `/opsx:ff` | 创建所有规划工件 | 范围明确，准备构建 |
| `/opsx:apply` | 实施任务 | 准备编写代码 |
| `/opsx:verify` | 验证实施 | 归档前，捕获不匹配 |
| `/opsx:sync` | 合并增量规范 | 可选——如果需要归档提示 |
| `/opsx:archive` | 完成变更 | 所有工作完成 |
| `/opsx:bulk-archive` | 归档多个变更 | 并行工作，批量完成 |

## 下一步

- [命令](commands.md) - 包含选项的完整命令参考
- [核心概念](concepts.md) - 深入了解规范、工件和模式
- [定制化](customization.md) - 创建自定义工作流
