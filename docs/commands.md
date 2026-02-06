# 命令

这是 OpenSpec 斜杠命令的参考。这些命令在你的 AI 编码助手的聊天界面（例如 Claude Code, Cursor, Windsurf）中调用。

关于工作流模式以及何时使用每个命令，请参阅 [工作流](workflows.md)。关于 CLI 命令，请参阅 [CLI](cli.md)。

## 快速参考

| 命令 | 用途 |
|---------|---------|
| `/opsx:explore` | 在提交变更之前思考想法 |
| `/opsx:new` | 开始一个新的变更 |
| `/opsx:continue` | 基于依赖关系创建下一个产物 |
| `/opsx:ff` | 快进：一次性创建所有规划产物 |
| `/opsx:apply` | 实施变更中的任务 |
| `/opsx:verify` | 验证实施是否匹配产物 |
| `/opsx:sync` | 将增量规范合并到主规范 |
| `/opsx:archive` | 归档已完成的变更 |
| `/opsx:bulk-archive` | 一次性归档多个变更 |
| `/opsx:onboard` | 通过完整工作流的引导式教程 |

---

## 命令参考

### `/opsx:explore`

在提交变更之前，思考想法、调查问题并澄清需求。

**语法：**
```
/opsx:explore [topic]
```

**参数：**
| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `topic` | 否 | 你想探索或调查的主题 |

**作用：**
- 开启一个无结构的探索性对话
- 调查代码库以回答问题
- 比较选项和方法
- 创建可视化图表以澄清思路
- 当见解具体化时可以过渡到 `/opsx:new`

**示例：**
```text
You: /opsx:explore

AI:  你想探索什么？

You: 我们应该如何处理移动应用的认证？

AI:  让我调查一下当前的认证设置...
     [分析代码库]

     我看到你的 Web 应用使用的是基于会话的认证。
     对于移动端，我们有三个主要选项：

     1. JWT 令牌（无状态，支持离线）
     2. OAuth2（如果你需要第三方登录）
     3. 扩展当前会话（更简单，但需要连接）

     你的 API 已经配置了 CORS。你对哪个方向感兴趣？

You: 我们用 JWT 吧。我们可以为此开始一个变更吗？

AI:  随时可以。运行 /opsx:new add-jwt-auth 开始。
```

**提示：**
- 当需求不明确或需要调查时使用
- 探索期间不会创建产物
- 适合在决定之前比较多种方法
- 可以阅读文件和搜索代码库

---

### `/opsx:new`

开始一个新的变更。创建变更文件夹结构并使用选定的 Schema 进行脚手架搭建。

**语法：**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**参数：**
| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 变更文件夹名称（如果未提供则提示） |
| `--schema` | 否 | 使用的工作流 Schema（默认：来自配置或 `spec-driven`） |

**作用：**
- 创建 `openspec/changes/<change-name>/` 目录
- 在变更文件夹中创建 `.openspec.yaml` 元数据文件
- 显示准备创建的第一个产物模板
- 如果未提供，提示输入变更名称和 Schema

**创建内容：**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # 变更元数据（Schema，创建日期）
```

**示例：**
```
You: /opsx:new add-dark-mode

AI:  已创建 openspec/changes/add-dark-mode/
     Schema: spec-driven

     准备创建: proposal
     使用 /opsx:continue 创建它，或使用 /opsx:ff 创建所有产物。
```

**提示：**
- 使用描述性名称：`add-feature`, `fix-bug`, `refactor-module`
- 避免通用名称如 `update`, `changes`, `wip`
- Schema 也可以在项目配置中设置 (`openspec/config.yaml`)

---

### `/opsx:continue`

创建依赖链中的下一个产物。一次创建一个产物，实现增量进度。

**语法：**
```
/opsx:continue [change-name]
```

**参数：**
| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 继续哪个变更（如果未提供则从上下文推断） |

**作用：**
- 查询产物依赖图
- 显示哪些产物已就绪 vs 被阻塞
- 创建第一个就绪的产物
- 阅读依赖文件以获取上下文
- 显示创建后可用的内容

**示例：**
```
You: /opsx:continue

AI:  变更: add-dark-mode

     产物状态:
     ✓ proposal    (已完成)
     ◆ specs       (就绪)
     ◆ design      (就绪)
     ○ tasks       (阻塞 - 需要: specs)

     正在创建 specs...

     [读取 proposal.md，基于需求创建 specs]

     ✓ 已创建 openspec/changes/add-dark-mode/specs/ui/spec.md

     现在可用: tasks
     运行 /opsx:continue 创建下一个产物。
```

**提示：**
- 当你想在继续之前审查每个产物时使用
- 适合你需要控制的复杂变更
- 多个产物可能同时变得可用
- 你可以在继续之前编辑已创建的产物

---

### `/opsx:ff`

快进产物创建。一次性创建所有规划产物。

**语法：**
```
/opsx:ff [change-name]
```

**参数：**
| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 快进哪个变更（如果未提供则从上下文推断） |

**作用：**
- 按依赖顺序创建所有产物
- 通过待办事项列表跟踪进度
- 当所有 `apply-required` 产物完成时停止
- 在创建下一个产物之前阅读每个依赖

**示例：**
```
You: /opsx:ff add-dark-mode

AI:  正在快进 add-dark-mode...

     ✓ 正在创建 proposal.md
     ✓ 正在创建 specs/ui/spec.md
     ✓ 正在创建 design.md
     ✓ 正在创建 tasks.md

     所有规划产物已完成！
     准备实施。运行 /opsx:apply 开始。
```

**提示：**
- 当你对要构建的内容有清晰的图景时使用
- 对于简单的变更比 `/opsx:continue` 更快
- 你仍然可以在之后编辑产物
- 适合中小型功能

---

### `/opsx:apply`

实施变更中的任务。逐个处理任务列表，编写代码并勾选项目。

**语法：**
```
/opsx:apply [change-name]
```

**参数：**
| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 实施哪个变更（如果未提供则从上下文推断） |

**作用：**
- 读取 `tasks.md` 并识别未完成的任务
- 逐个处理任务
- 根据需要编写代码、创建文件、运行测试
- 用复选框 `[x]` 标记任务完成

**示例：**
```
You: /opsx:apply

AI:  正在实施 add-dark-mode...

     读取 tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     正在处理 1.1: Create ThemeContext...
     [创建 src/context/ThemeContext.tsx]

     ✓ 1.1 完成

     正在处理 1.2: Add CSS custom properties...
     [更新 src/styles/globals.css]

     ✓ 1.2 完成
     ...
```

**提示：**
- 如果中断，可以从上次离开的地方恢复
- 通过指定变更名称用于并行变更
- 完成状态在 `tasks.md` 复选框中跟踪

---

### `/opsx:verify`

验证实施是否匹配你的变更产物。检查完整性、正确性和一致性。

**语法：**
```
/opsx:verify [change-name]
```

**参数：**
| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 验证哪个变更（如果未提供则从上下文推断） |

**作用：**
- 检查实施质量的三个维度
- 在代码库中搜索实施证据
- 报告分类为 CRITICAL（严重）、WARNING（警告）或 SUGGESTION（建议）的问题
- 不会阻止归档，但会暴露问题

**验证维度：**

| 维度 | 验证内容 |
|-----------|-------------------|
| **完整性 (Completeness)** | 所有任务已完成，所有需求已实施，场景已覆盖 |
| **正确性 (Correctness)** | 实施匹配规范意图，边缘情况已处理 |
| **一致性 (Coherence)** | 设计决策反映在代码中，模式一致 |

**示例：**
```
You: /opsx:verify

AI:  正在验证 add-dark-mode...

     完整性
     ✓ tasks.md 中的所有 8 个任务已勾选
     ✓ specs 中的所有需求都有对应的代码
     ⚠ 场景 "System preference detection" 没有测试覆盖

     正确性
     ✓ 实施匹配规范意图
     ✓ 场景中的边缘情况已处理
     ✓ 错误状态匹配规范定义

     一致性
     ✓ 设计决策反映在代码结构中
     ✓ 命名约定与 design.md 一致
     ⚠ 设计提到 "CSS variables" 但实施使用的是 Tailwind 类

     摘要
     ─────────────────────────────
     严重问题: 0
     警告: 2
     准备归档: 是（带警告）

     建议:
     1. 为系统偏好检测添加测试
     2. 更新 design.md 以反映 Tailwind 的使用，或重构以使用 CSS 变量
```

**提示：**
- 在归档前运行以尽早发现不匹配
- 警告不阻止归档但指示潜在问题
- 适合在提交前审查 AI 的工作
- 可以揭示产物与实施之间的偏差

---

### `/opsx:sync`

**可选命令。** 将变更中的增量规范合并到主规范。归档时如果需要会提示同步，所以通常不需要手动运行此命令。

**语法：**
```
/opsx:sync [change-name]
```

**参数：**
| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 同步哪个变更（如果未提供则从上下文推断） |

**作用：**
- 从变更文件夹读取增量规范
- 解析 ADDED/MODIFIED/REMOVED/RENAMED 部分
- 将更改合并到主 `openspec/specs/` 目录
- 保留未在增量中提及的现有内容
- 不会归档变更（保持活跃）

**示例：**
```text
You: /opsx:sync

AI:  正在同步 add-dark-mode 增量规范...

     读取: openspec/changes/add-dark-mode/specs/ui/spec.md
     目标: openspec/specs/ui/spec.md

     应用更改:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     正在合并...
     ✓ openspec/specs/ui/spec.md 已更新

     变更保持活跃。准备好完成时运行 /opsx:archive。
```

**何时手动使用：**

| 场景 | 使用同步？ |
|----------|-----------|
| 长期运行的变更，希望在归档前将规范合并到主规范 | 是 |
| 多个并行变更需要更新的基础规范 | 是 |
| 想要单独预览/审查合并 | 是 |
| 快速变更，直接归档 | 否（归档会处理） |

**提示：**
- 同步是智能的，不是复制粘贴
- 可以在不重复的情况下向现有需求添加场景
- 同步后变更保持活跃（未归档）
- 大多数用户永远不需要直接调用此命令——如果需要，归档会提示

---

### `/opsx:archive`

归档已完成的变更。最终确定变更并将其移动到归档文件夹。

**语法：**
```
/opsx:archive [change-name]
```

**参数：**
| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `change-name` | 否 | 归档哪个变更（如果未提供则从上下文推断） |

**作用：**
- 检查产物完成状态
- 检查任务完成状态（如果未完成则警告）
- 如果尚未同步，提供同步增量规范的选项
- 将变更文件夹移动到 `openspec/changes/archive/YYYY-MM-DD-<name>/`
- 保留所有产物作为审计跟踪

**示例：**
```text
You: /opsx:archive

AI:  正在归档 add-dark-mode...

     产物状态:
     ✓ proposal.md 存在
     ✓ specs/ 存在
     ✓ design.md 存在
     ✓ tasks.md 存在 (8/8 任务完成)

     增量规范: 尚未同步
     → 立即同步？ (推荐)

You: Yes

AI:  ✓ 已同步规范到 openspec/specs/ui/spec.md
     ✓ 已移动到 openspec/changes/archive/2025-01-24-add-dark-mode/

     变更归档成功。
```

**提示：**
- 归档不会因未完成的任务而阻塞，但会警告
- 增量规范可以在归档期间或之前同步
- 已归档的变更保留用于历史记录
- 首先使用 `/opsx:verify` 以发现问题

---

### `/opsx:bulk-archive`

一次性归档多个已完成的变更。处理变更之间的规范冲突。

**语法：**
```
/opsx:bulk-archive [change-names...]
```

**参数：**
| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `change-names` | 否 | 要归档的特定变更（如果未提供则提示选择） |

**作用：**
- 列出所有已完成的变更
- 归档前验证每个变更
- 检测跨变更的规范冲突
- 通过检查实际实施来解决冲突
- 按时间顺序归档

**示例：**
```
You: /opsx:bulk-archive

AI:  发现 3 个已完成的变更:
     - add-dark-mode (8/8 任务完成)
     - fix-login-bug (3/3 任务完成)
     - update-footer (2/2 任务完成)

     正在检查规范冲突...
     ⚠ add-dark-mode 和 update-footer 都触及 specs/ui/

     正在检查代码库以解决...
     两个变更都已实施。将按时间顺序合并:
     1. add-dark-mode (创建于 1月 20日)
     2. update-footer (创建于 1月 22日)

     归档所有 3 个变更？

You: Yes

AI:  ✓ 已归档 add-dark-mode
     ✓ 已归档 fix-login-bug
     ✓ 已归档 update-footer
     规范已合并: add-dark-mode → update-footer
```

**提示：**
- 适合并行工作流
- 冲突解决是 Agent 式的（检查代码库）
- 变更按创建顺序归档
- 覆盖规范内容前提示

---

### `/opsx:onboard`

通过完整 OpenSpec 工作流的引导式教程。使用你的实际代码库进行交互式教程。

**语法：**
```
/opsx:onboard
```

**作用：**
- 通过旁白走完一个完整的工作流周期
- 扫描你的代码库寻找真实的改进机会
- 创建一个带有真实产物的实际变更
- 实施实际工作（小的、安全的变更）
- 归档已完成的变更
- 解释每一步发生的事情

**阶段：**
1. 欢迎和代码库分析
2. 寻找改进机会
3. 创建变更 (`/opsx:new`)
4. 编写提案
5. 创建规范
6. 编写设计
7. 创建任务
8. 实施任务 (`/opsx:apply`)
9. 验证实施
10. 归档变更
11. 总结和后续步骤

**示例：**
```
You: /opsx:onboard

AI:  欢迎使用 OpenSpec!

     我将使用你的实际代码库带你走完完整的工作流。
     我们将找到一些小的改进点，为此创建一个适当的变更，
     实施它，并归档它。

     让我扫描你的代码库寻找机会...

     [分析代码库]

     我发现了一些我们可以做的事情：
     1. 为联系表单添加输入验证
     2. 改进认证流程中的错误消息
     3. 为异步按钮添加加载状态

     你对哪个感兴趣？（或者建议其他的）
```

**提示：**
- 最适合学习工作流的新用户
- 使用真实代码，而非玩具示例
- 创建一个你可以保留或丢弃的真实变更
- 需要 15-30 分钟完成

---

## AI 工具的命令语法

不同的 AI 工具使用略有不同的命令语法。使用匹配你的工具的格式：

| 工具 | 语法示例 |
|------|----------------|
| Claude Code | `/opsx:new`, `/opsx:apply` |
| Cursor | `/opsx-new`, `/opsx-apply` |
| Windsurf | `/opsx-new`, `/opsx-apply` |
| Copilot | `/opsx-new`, `/opsx-apply` |
| Trae | `/openspec-new-change`, `/openspec-apply-change` |

无论语法如何，功能都是相同的。

---

## 遗留命令

这些命令使用旧的 "一次性" 工作流。它们仍然有效，但推荐使用 OPSX 命令。

| 命令 | 作用 |
|---------|--------------|
| `/openspec:proposal` | 一次性创建所有产物（proposal, specs, design, tasks） |
| `/openspec:apply` | 实施变更 |
| `/openspec:archive` | 归档变更 |

**何时使用遗留命令：**
- 使用旧工作流的现有项目
- 不需要增量产物创建的简单变更
- 偏好全有或全无的方法

**迁移到 OPSX：**
遗留变更可以使用 OPSX 命令继续。产物结构是兼容的。

---

## 故障排除

### "Change not found"

命令无法识别要处理哪个变更。

**解决方案：**
- 显式指定变更名称：`/opsx:apply add-dark-mode`
- 检查变更文件夹是否存在：`openspec list`
- 验证你是否在正确的项目目录中

### "No artifacts ready"

所有产物要么已完成，要么被缺失的依赖阻塞。

**解决方案：**
- 运行 `openspec status --change <name>` 查看什么在阻塞
- 检查所需产物是否存在
- 先创建缺失的依赖产物

### "Schema not found"

指定的 Schema 不存在。

**解决方案：**
- 列出可用 Schema：`openspec schemas`
- 检查 Schema 名称拼写
- 如果是自定义的，创建 Schema：`openspec schema init <name>`

### 命令未被识别

AI 工具不识别 OpenSpec 命令。

**解决方案：**
- 确保 OpenSpec 已初始化：`openspec init`
- 重新生成技能：`openspec update`
- 检查 `.claude/skills/` 目录是否存在（对于 Claude Code）
- 重启你的 AI 工具以获取新技能

### 产物生成不正确

AI 创建了不完整或不正确的产物。

**解决方案：**
- 在 `openspec/config.yaml` 中添加项目上下文
- 添加每个产物的规则以获得特定指导
- 在变更描述中提供更多细节
- 使用 `/opsx:continue` 代替 `/opsx:ff` 以获得更多控制

---

## 下一步

- [工作流](workflows.md) - 常见模式以及何时使用每个命令
- [CLI](cli.md) - 管理和验证的终端命令
- [自定义](customization.md) - 创建自定义 Schema 和工作流
