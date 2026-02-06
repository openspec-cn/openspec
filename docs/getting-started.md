# 快速开始 (Getting Started)

本指南解释了在安装和初始化 OpenSpec 后它如何工作。关于安装说明，请参阅[主 README](../README.md#quick-start)。

## 工作原理

OpenSpec 帮助你和你的 AI 编程助手在编写任何代码之前就构建内容达成一致。工作流遵循一个简单的模式：

```
┌────────────────────┐
│   启动变更 (Change)  │  /opsx:new
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│    创建工件 (Artifacts)  │  /opsx:ff 或 /opsx:continue
│ (proposal, specs,  │
│  design, tasks)    │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│    执行任务 (Implement)  │  /opsx:apply
│ (AI writes code)   │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│    归档并合并 (Archive)  │  /opsx:archive
│    规范 (Specs)          │
└────────────────────┘
```

## OpenSpec 创建了什么

运行 `openspec init` 后，你的项目结构如下：

```
openspec/
├── specs/              # 事实来源 (你系统的行为)
│   └── <domain>/
│       └── spec.md
├── changes/            # 提议的更新 (每个变更一个文件夹)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # 增量规范 (变动内容)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # 项目配置 (可选)
```

**两个关键目录：**

- **`specs/`** - 事实来源。这些规范描述了你的系统当前的行为。按领域组织（例如 `specs/auth/`, `specs/payments/`）。

- **`changes/`** - 提议的修改。每个变更都有自己的文件夹，包含所有相关工件。当变更完成后，其规范会合并到主 `specs/` 目录中。

## 理解工件 (Artifacts)

每个变更文件夹包含指导工作的工件：

| 工件 | 用途 |
|------|------|
| `proposal.md` | "为什么"和"是什么" - 捕捉意图、范围和方法 |
| `specs/` | 增量规范，显示**新增/修改/移除**的需求 |
| `design.md` | "怎么做" - 技术方案和架构决策 |
| `tasks.md` | 带复选框的实施清单 |

**工件相互构建：**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            在学习过程中更新
```

你总是可以在实施过程中根据学到的新知识回去完善早期的工件。

## 增量规范 (Delta Specs) 如何工作

增量规范是 OpenSpec 中的核心概念。它们展示了相对于当前规范有哪些变化。

### 格式

增量规范使用章节来指示变更类型：

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST require a second factor during login.

#### Scenario: OTP required
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented

## MODIFIED Requirements

### Requirement: Session Timeout
The system SHALL expire sessions after 30 minutes of inactivity.
(Previously: 60 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA)
```

### 归档时发生什么

当你归档一个变更时：

1. **ADDED** (新增) 需求被追加到主规范中
2. **MODIFIED** (修改) 需求替换现有版本
3. **REMOVED** (移除) 需求从主规范中删除

变更文件夹会移动到 `openspec/changes/archive/` 以保留审计历史。

## 示例：你的第一个变更

让我们演示如何为应用程序添加暗黑模式。

### 1. 启动变更

```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Ready to create: proposal
```

### 2. 创建工件

使用 `/opsx:ff` (快进) 一次性创建所有规划工件：

```
You: /opsx:ff

AI:  Creating artifacts for add-dark-mode...
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

### 3. 创建了什么

**proposal.md** - 捕捉意图：

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage.

## Scope
- Add theme toggle in settings
- Support system preference detection
- Persist preference in localStorage

## Approach
Use CSS custom properties for theming with a React context
for state management.
```

**specs/ui/spec.md** - 显示新需求的增量规范：

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
The system SHALL allow users to choose between light and dark themes.

#### Scenario: Manual toggle
- GIVEN a user on any page
- WHEN the user clicks the theme toggle
- THEN the theme switches immediately
- AND the preference persists across sessions

#### Scenario: System preference
- GIVEN a user with no saved preference
- WHEN the application loads
- THEN the system's preferred color scheme is used
```

**tasks.md** - 实施清单：

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
```

### 4. 实施

```
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ✓ 1.2 Added CSS custom properties to globals.css
     ✓ 1.3 Implemented localStorage persistence
     ✓ 2.1 Created ThemeToggle component
     ...
     All tasks complete!
```

在实施过程中，如果你发现设计需要调整，只需更新工件并继续。

### 5. 归档

```
You: /opsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

你的增量规范现在已成为主规范的一部分，记录了你的系统是如何工作的。

## 验证和审查

使用 CLI 检查你的变更：

```bash
# 列出活跃变更
openspec list

# 查看变更详情
openspec show add-dark-mode

# 验证规范格式
openspec validate add-dark-mode

# 交互式仪表板
openspec view
```

## 下一步

- [工作流 (Workflows)](workflows.md) - 常见模式以及何时使用每个命令
- [命令 (Commands)](commands.md) - 所有斜杠命令的完整参考
- [核心概念 (Concepts)](concepts.md) - 深入理解规范、变更和模式
- [定制化 (Customization)](customization.md) - 让 OpenSpec 按照你的方式工作
