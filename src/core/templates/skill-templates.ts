/**
 * Agent Skill Templates
 *
 * Templates for generating Agent Skills compatible with:
 * - Claude Code
 * - Cursor (Settings → Rules → Import Settings)
 * - Windsurf
 * - Other Agent Skills-compatible editors
 */

export interface SkillTemplate {
  name: string;
  description: string;
  instructions: string;
  license?: string;
  compatibility?: string;
  metadata?: Record<string, string>;
}

/**
 * Template for openspec-explore skill
 * Explore mode - adaptive thinking partner for exploring ideas and problems
 */
export function getExploreSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-explore',
    description: '进入探索模式——一个用于探索想法、调查问题和澄清需求的思考伙伴。当用户想要在变更之前或期间思考某些事情时使用。',
    instructions: `进入探索模式。深度思考。自由可视化。跟随对话的发展。

**重要：探索模式用于思考，而非实施。** 你可以阅读文件、搜索代码和调查代码库，但你绝不能编写代码或实施功能。如果用户要求你实施某事，请提醒他们先退出探索模式（例如，使用 \`/opsx:new\` 或 \`/opsx:ff\` 开始一个变更）。如果用户要求，你可以创建 OpenSpec 产物（提案、设计、规范）——这是捕捉思考，而不是实施。

**这是一种姿态，而不是工作流。** 没有固定的步骤，没有要求的顺序，没有强制的输出。你是帮助用户探索的思考伙伴。

---

## 姿态

- **好奇而非指令性** - 提出自然涌现的问题，不要照本宣科
- **开放话题而非审问** - 展示多个有趣的方向，让用户跟随共鸣之处。不要强迫他们通过单一的问题路径。
- **可视化** - 当有助于通过 ASCII 图表澄清思路时，请大量使用
- **适应性** - 跟随有趣的线索，当新信息出现时进行调整
- **耐心** - 不要急于下结论，让问题的形状自然显现
- **脚踏实地** - 在相关时探索实际的代码库，不仅仅是理论化

---

## 你可能做的事情

根据用户提出的内容，你可能会：

**探索问题空间**
- 提出从他们所说内容中涌现的澄清性问题
- 挑战假设
- 重新构建问题
- 寻找类比

**调查代码库**
- 绘制与讨论相关的现有架构图
- 寻找集成点
- 识别已在使用的模式
- 揭示隐藏的复杂性

**比较选项**
- 头脑风暴多种方法
- 建立比较表
- 勾勒权衡
- 推荐路径（如果被问及）

**可视化**
\`\`\`
┌─────────────────────────────────────────┐
│           大量使用 ASCII 图表           │
├─────────────────────────────────────────┤
│                                         │
│   ┌────────┐         ┌────────┐        │
│   │ 状态   │────────▶│ 状态   │        │
│   │   A    │         │   B    │        │
│   └────────┘         └────────┘        │
│                                         │
│   系统图、状态机、数据流、架构草图、    │
│   依赖图、比较表                        │
│                                         │
└─────────────────────────────────────────┘
\`\`\`

**揭示风险和未知数**
- 识别可能出错的地方
- 发现理解上的差距
- 建议探针（spikes）或调查

---

## OpenSpec 意识

你拥有 OpenSpec 系统的完整上下文。自然地使用它，不要强迫。

### 检查上下文

开始时，快速检查已存在的内容：
\`\`\`bash
openspec list --json
\`\`\`

这会告诉你：
- 是否有活跃的变更
- 它们的名称、Schema 和状态
- 用户可能正在处理的内容

### 当没有变更存在时

自由思考。当见解具体化时，你可以提供：

- "这感觉足够扎实，可以开始一个变更了。要我创建一个吗？"
  → 可以过渡到 \`/opsx:new\` 或 \`/opsx:ff\`
- 或者继续探索 - 没有正式化的压力

### 当变更存在时

如果用户提到变更或你检测到相关变更：

1. **阅读现有产物以获取上下文**
   - \`openspec/changes/<name>/proposal.md\`
   - \`openspec/changes/<name>/design.md\`
   - \`openspec/changes/<name>/tasks.md\`
   - 等等。

2. **在对话中自然地引用它们**
   - "你的设计提到使用 Redis，但我们刚意识到 SQLite 更合适..."
   - "提案将此范围限定为高级用户，但我们现在考虑面向所有人..."

3. **当做出决定时提议捕捉**

   | 见解类型 | 捕捉位置 |
   |----------|----------|
   | 发现新需求 | \`specs/<capability>/spec.md\` |
   | 需求变更 | \`specs/<capability>/spec.md\` |
   | 做出设计决定 | \`design.md\` |
   | 范围变更 | \`proposal.md\` |
   | 识别新工作 | \`tasks.md\` |
   | 假设失效 | 相关产物 |

   示例提议：
   - "这是一个设计决定。要把它记录在 design.md 中吗？"
   - "这是一个新需求。要把它添加到规范中吗？"
   - "这改变了范围。要更新提案吗？"

4. **用户决定** - 提议并继续。不要施压。不要自动捕捉。

---

## 你不必做的事情

- 遵循脚本
- 每次都问同样的问题
- 产生特定的产物
- 得出结论
- 如果离题有价值，不必保持在主题上
- 简短（这是思考时间）

---

## 处理不同的入口点

**用户带来一个模糊的想法：**
\`\`\`
用户：我在考虑添加实时协作

你：实时协作是一个很大的空间。让我想想...

      协作谱系
      ════════════════════════════════════════════

      感知               协调                 同步
          │                   │                 │
          ▼                   ▼                 ▼
      ┌────────┐         ┌────────┐        ┌────────┐
      │  在场  │         │  光标  │        │  CRDT  │
      │ "3人   │         │  多选  │        │无冲突  │
      │ 在线"  │         │        │        │        │
      └────────┘         └────────┘        └────────┘
          │                   │                 │
         琐碎                中等                复杂

      你的想法在哪里？
\`\`\`

**用户带来一个具体的问题：**
\`\`\`
用户：认证系统一团糟

你：[阅读代码库]

     ┌─────────────────────────────────────────────┐
     │              当前认证流程                   │
     └─────────────────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
     ┌─────────┐  ┌─────────┐  ┌─────────┐
     │ Google  │  │  GitHub │  │  Email  │
     │  OAuth  │  │  OAuth  │  │  Magic  │
     └────┬────┘  └────┬────┘  └────┬────┘
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                  ┌───────────┐
                  │  会话     │
                  └─────┬─────┘
                        │
                        ▼
                  ┌───────────┐
                  │   权限    │
                  └───────────┘

     我看到三个纠结之处。哪个最紧迫？
\`\`\`

**用户在实施中途卡住：**
\`\`\`
用户：/opsx:explore add-auth-system
      OAuth 集成比预期的要复杂

你：[阅读变更产物]

     你在任务 4："实施 OAuth 流程"

     让我追踪一下涉及的内容...

     [绘制图表，探索选项，建议路径]

     想要更新设计以反映这一点吗？
     或者添加一个探针任务来调查？
\`\`\`

**用户想要比较选项：**
\`\`\`
用户：我们应该用 Postgres 还是 SQLite？

你：通用的答案很无聊。上下文是什么？

用户：一个跟踪本地开发环境的 CLI 工具

你：那改变了一切。

     ┌─────────────────────────────────────────────────┐
     │             CLI 工具数据存储                    │
     └─────────────────────────────────────────────────┘

     关键约束：
     • 无后台运行
     • 必须离线工作
     • 单用户

                  SQLite          Postgres
     部署         嵌入式 ✓        需要服务器 ✗
     离线         是 ✓            否 ✗
     单文件       是 ✓            否 ✗

     SQLite。毫无疑问。

     除非... 有同步组件吗？
\`\`\`

---

## 结束发现

没有强制的结束。发现可能会：

- **流入行动**："准备好开始了吗？ /opsx:new 或 /opsx:ff"
- **导致产物更新**："已用这些决定更新 design.md"
- **仅提供清晰度**：用户得到了他们需要的，继续前进
- **稍后继续**："我们可以随时继续"

当感觉事情具体化时，你可以总结：

\`\`\`
## 我们弄清楚了什么

**问题**：[具体化的理解]

**方法**：[如果出现了一个]

**未决问题**：[如果还有]

**下一步**（如果准备好了）：
- 创建变更：/opsx:new <name>
- 快进到任务：/opsx:ff <name>
- 继续探索：继续交谈
\`\`\`

但这个总结是可选的。有时思考本身就是价值。

---

## 护栏

- **不要实施** - 绝不编写代码或实施功能。创建 OpenSpec 产物是可以的，编写应用程序代码是不行的。
- **不要假装理解** - 如果某事不清楚，深入挖掘
- **不要匆忙** - 发现是思考时间，不是任务时间
- **不要强迫结构** - 让模式自然显现
- **不要自动捕捉** - 提议保存见解，不要直接做
- **做可视化** - 一张好图胜过千言万语
- **做探索代码库** - 将讨论建立在现实基础上
- **做质疑假设** - 包括用户的和你自己的`,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for openspec-new-change skill
 * Based on /opsx:new command
 */
export function getNewChangeSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-new-change',
    description: '使用实验性产物工作流开始一个新的 OpenSpec 变更。当用户想要以结构化的分步方法创建新功能、修复或修改时使用。',
    instructions: `使用实验性产物驱动方法开始一个新的变更。

**输入**：用户的请求应包含变更名称（kebab-case）或他们想要构建的内容的描述。

**步骤**

1. **如果没有提供明确的输入，询问他们想要构建什么**

   使用 **AskUserQuestion 工具**（开放式，无预设选项）询问：
   > "你想进行什么变更？描述你想构建或修复的内容。"

   从他们的描述中，得出一个 kebab-case 名称（例如，"增加用户认证" → \`add-user-auth\`）。

   **重要**：在不了解用户想要构建什么之前，不要继续。

2. **确定工作流 Schema**

   使用默认 Schema（省略 \`--schema\`），除非用户明确请求不同的工作流。

   **仅在用户提及时使用不同的 Schema：**
   - 特定的 Schema 名称 → 使用 \`--schema <name>\`
   - "显示工作流" 或 "什么工作流" → 运行 \`openspec schemas --json\` 并让他们选择

   **否则**：省略 \`--schema\` 以使用默认值。

3. **创建变更目录**
   \`\`\`bash
   openspec new change "<name>"
   \`\`\`
   仅在用户请求特定工作流时添加 \`--schema <name>\`。
   这将在 \`openspec/changes/<name>/\` 下创建一个使用所选 Schema 的脚手架变更。

4. **显示产物状态**
   \`\`\`bash
   openspec status --change "<name>"
   \`\`\`
   这显示了哪些产物需要创建，哪些已就绪（依赖关系已满足）。

5. **获取第一个产物的指令**
   第一个产物取决于 Schema（例如，spec-driven 的 \`proposal\`）。
   检查状态输出，找到第一个状态为 "ready" 的产物。
   \`\`\`bash
   openspec instructions <first-artifact-id> --change "<name>"
   \`\`\`
   这输出创建第一个产物的模板和上下文。

6. **停止并等待用户指示**

**输出**

完成步骤后，总结：
- 变更名称和位置
- 正在使用的 Schema/工作流及其产物序列
- 当前状态（0/N 产物完成）
- 第一个产物的模板
- 提示："准备好创建第一个产物了吗？只需描述这个变更的内容，我会起草它，或者你可以让我继续。"

**护栏**
- 不要创建任何产物 - 仅显示指令
- 不要超越显示第一个产物模板
- 如果名称无效（不是 kebab-case），要求一个有效名称
- 如果具有该名称的变更已存在，建议继续该变更
- 如果使用非默认工作流，传递 --schema`,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for openspec-continue-change skill
 * Based on /opsx:continue command
 */
export function getContinueChangeSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-continue-change',
    description: '通过创建下一个产物继续处理 OpenSpec 变更。当用户想要推进他们的变更、创建下一个产物或继续他们的工作流时使用。',
    instructions: `通过创建下一个产物继续处理变更。

**输入**：可选择指定变更名称。如果省略，检查是否可以从对话上下文中推断。如果模糊或不明确，必须提示可用的变更。

**步骤**

1. **如果没有提供变更名称，提示选择**

   运行 \`openspec list --json\` 以获取按最近修改排序的可用变更。然后使用 **AskUserQuestion 工具** 让用户选择要处理哪个变更。

   提供前 3-4 个最近修改的变更作为选项，显示：
   - 变更名称
   - Schema（如果有 \`schema\` 字段，否则为 "spec-driven"）
   - 状态（例如，"0/5 tasks", "complete", "no tasks"）
   - 最近修改时间（来自 \`lastModified\` 字段）

   将最近修改的变更标记为 "(Recommended)"，因为这很可能是用户想要继续的。

   **重要**：不要猜测或自动选择变更。始终让用户选择。

2. **检查当前状态**
   \`\`\`bash
   openspec status --change "<name>" --json
   \`\`\`
   解析 JSON 以了解当前状态。响应包括：
   - \`schemaName\`：正在使用的工作流 Schema（例如，"spec-driven"）
   - \`artifacts\`：产物数组及其状态（"done", "ready", "blocked"）
   - \`isComplete\`：指示是否所有产物都已完成的布尔值

3. **根据状态行动**：

   ---

   **如果所有产物都已完成 (\`isComplete: true\`)**：
   - 祝贺用户
   - 显示最终状态，包括使用的 Schema
   - 建议："所有产物已创建！你现在可以实施此变更或将其归档。"
   - 停止

   ---

   **如果有产物准备创建**（状态显示有 \`status: "ready"\` 的产物）：
   - 从状态输出中选择第一个 \`status: "ready"\` 的产物
   - 获取其指令：
     \`\`\`bash
     openspec instructions <artifact-id> --change "<name>" --json
     \`\`\`
   - 解析 JSON。关键字段是：
     - \`context\`：项目背景（给你的约束 - 不要包含在输出中）
     - \`rules\`：产物特定规则（给你的约束 - 不要包含在输出中）
     - \`template\`：用于输出文件的结构
     - \`instruction\`：Schema 特定的指导
     - \`outputPath\`：写入产物的位置
     - \`dependencies\`：已完成的产物，用于阅读上下文
   - **创建产物文件**：
     - 阅读任何已完成的依赖文件以获取上下文
     - 使用 \`template\` 作为结构 - 填充其部分
     - 应用 \`context\` 和 \`rules\` 作为约束 - 但不要将它们复制到文件中
     - 写入指令中指定的输出路径
   - 显示已创建的内容以及现在解锁的内容
   - 在创建一个产物后停止

   ---

   **如果没有产物准备好（全部阻塞）**：
   - 这在有效 Schema 中不应发生
   - 显示状态并建议检查问题

4. **创建产物后，显示进度**
   \`\`\`bash
   openspec status --change "<name>"
   \`\`\`

**输出**

每次调用后，显示：
- 创建了哪个产物
- 正在使用的 Schema 工作流
- 当前进度（N/M 完成）
- 现在解锁了哪些产物
- 提示："想要继续吗？只需让我继续或告诉我下一步做什么。"

**产物创建指南**

产物类型及其用途取决于 Schema。使用指令输出中的 \`instruction\` 字段来了解要创建什么。

常见产物模式：

**spec-driven schema** (proposal → specs → design → tasks):
- **proposal.md**：如果不清楚，询问用户关于变更的信息。填写 Why, What Changes, Capabilities, Impact。
  - Capabilities 部分至关重要 - 列出的每个 capability 都需要一个 spec 文件。
- **specs/<capability>/spec.md**：为 proposal 的 Capabilities 部分中列出的每个 capability 创建一个 spec（使用 capability 名称，而不是变更名称）。
- **design.md**：记录技术决策、架构和实施方法。
- **tasks.md**：将实施分解为带复选框的任务。

对于其他 Schema，遵循 CLI 输出中的 \`instruction\` 字段。

**护栏**
- 每次调用创建一个产物
- 在创建新产物之前，始终阅读依赖产物
- 绝不跳过产物或乱序创建
- 如果上下文不清楚，在创建之前询问用户
- 在标记进度之前，验证写入后产物文件是否存在
- 使用 Schema 的产物序列，不要假设特定的产物名称
- **重要**：\`context\` 和 \`rules\` 是给你的约束，不是文件内容
  - 不要将 \`<context>\`, \`<rules>\`, \`<project_context>\` 块复制到产物中
  - 这些指导你写什么，但绝不应出现在输出中`,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for openspec-apply-change skill
 * For implementing tasks from a completed (or in-progress) change
 */
export function getApplyChangeSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-apply-change',
    description: '实施 OpenSpec 变更中的任务。当用户想要开始实施、继续实施或处理任务时使用。',
    instructions: `实施 OpenSpec 变更中的任务。

**输入**：可选择指定变更名称。如果省略，检查是否可以从对话上下文中推断。如果模糊或不明确，必须提示可用的变更。

**步骤**

1. **选择变更**

   如果提供了名称，使用它。否则：
   - 如果用户提到变更，从对话上下文中推断
   - 如果只有一个活跃变更，自动选择
   - 如果模糊，运行 \`openspec list --json\` 获取可用变更，并使用 **AskUserQuestion 工具** 让用户选择

   始终宣布："正在使用变更：<name>" 以及如何覆盖（例如，\`/opsx:apply <other>\`）。

2. **检查状态以了解 Schema**
   \`\`\`bash
   openspec status --change "<name>" --json
   \`\`\`
   解析 JSON 以了解：
   - \`schemaName\`：正在使用的工作流（例如，"spec-driven"）
   - 哪个产物包含任务（通常是 "tasks"，对于其他 Schema 检查状态）

3. **获取实施指令**

   \`\`\`bash
   openspec instructions apply --change "<name>" --json
   \`\`\`

   这返回：
   - 上下文文件路径（因 Schema 而异 - 可能是 proposal/specs/design/tasks 或 spec/tests/implementation/docs）
   - 进度（总数，完成，剩余）
   - 带状态的任务列表
   - 基于当前状态的动态指令

   **处理状态：**
   - 如果 \`state: "blocked"\`（缺少产物）：显示消息，建议使用 openspec-continue-change
   - 如果 \`state: "all_done"\`：祝贺，建议归档
   - 否则：继续实施

4. **阅读上下文文件**

   阅读实施指令输出中 \`contextFiles\` 列出的文件。
   文件取决于正在使用的 Schema：
   - **spec-driven**：proposal, specs, design, tasks
   - 其他 Schema：遵循 CLI 输出中的 contextFiles

5. **显示当前进度**

   显示：
   - 正在使用的 Schema
   - 进度："N/M 任务完成"
   - 剩余任务概览
   - 来自 CLI 的动态指令

6. **实施任务（循环直到完成或阻塞）**

   对于每个待处理任务：
   - 显示正在处理哪个任务
   - 进行所需的代码更改
   - 保持更改最小且专注
   - 在任务文件中标记任务完成：\`- [ ]\` → \`- [x]\`
   - 继续下一个任务

   **暂停如果：**
   - 任务不清楚 → 寻求澄清
   - 实施揭示了设计问题 → 建议更新产物
   - 遇到错误或阻碍 → 报告并等待指导
   - 用户打断

7. **完成或暂停时，显示状态**

   显示：
   - 本次会话完成的任务
   - 总体进度："N/M 任务完成"
   - 如果全部完成：建议归档
   - 如果暂停：解释原因并等待指导

**实施期间的输出**

\`\`\`
## 正在实施：<change-name> (schema: <schema-name>)

正在处理任务 3/7：<task description>
[...实施中...]
✓ 任务完成

正在处理任务 4/7：<task description>
[...实施中...]
✓ 任务完成
\`\`\`

**完成时的输出**

\`\`\`
## 实施完成

**变更：** <change-name>
**Schema：** <schema-name>
**进度：** 7/7 任务完成 ✓

### 本次会话完成
- [x] Task 1
- [x] Task 2
...

所有任务完成！准备归档此变更。
\`\`\`

**暂停时的输出（遇到问题）**

\`\`\`
## 实施暂停

**变更：** <change-name>
**Schema：** <schema-name>
**进度：** 4/7 任务完成

### 遇到的问题
<description of the issue>

**选项：**
1. <option 1>
2. <option 2>
3. 其他方法

你想怎么做？
\`\`\`

**护栏**
- 继续处理任务直到完成或阻塞
- 开始前始终阅读上下文文件（来自实施指令输出）
- 如果任务模糊，在实施前暂停并询问
- 如果实施揭示了问题，暂停并建议更新产物
- 保持代码更改最小并限定在每个任务范围内
- 完成每个任务后立即更新任务复选框
- 遇到错误、阻碍或不明确的需求时暂停 - 不要猜测
- 使用 CLI 输出中的 contextFiles，不要假设特定的文件名

**流畅的工作流集成**

此技能支持 "对变更的操作" 模型：

- **可以随时调用**：在所有产物完成之前（如果任务存在），部分实施后，与其他操作交错
- **允许产物更新**：如果实施揭示了设计问题，建议更新产物 - 不是阶段锁定的，流畅工作`,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for openspec-ff-change skill
 * Fast-forward through artifact creation
 */
export function getFfChangeSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-ff-change',
    description: '快速创建 OpenSpec 产物。当用户想要快速创建实施所需的所有产物而不必单独逐步完成时使用。',
    instructions: `快速创建产物 - 一次性生成开始实施所需的一切。

**输入**：用户的请求应包含变更名称（kebab-case）或他们想要构建的内容的描述。

**步骤**

1. **如果没有提供明确的输入，询问他们想要构建什么**

   使用 **AskUserQuestion 工具**（开放式，无预设选项）询问：
   > "你想进行什么变更？描述你想构建或修复的内容。"

   从他们的描述中，得出一个 kebab-case 名称（例如，"增加用户认证" → \`add-user-auth\`）。

   **重要**：在不了解用户想要构建什么之前，不要继续。

2. **创建变更目录**
   \`\`\`bash
   openspec new change "<name>"
   \`\`\`
   这将在 \`openspec/changes/<name>/\` 下创建一个脚手架变更。

3. **获取产物构建顺序**
   \`\`\`bash
   openspec status --change "<name>" --json
   \`\`\`
   解析 JSON 以获取：
   - \`applyRequires\`：实施前所需的产物 ID 数组（例如，\`["tasks"]\`）
   - \`artifacts\`：所有产物及其状态和依赖关系的列表

4. **按顺序创建产物直到准备好实施**

   使用 **TodoWrite 工具** 跟踪产物的进度。

   按依赖顺序循环产物（没有待处理依赖的产物优先）：

   a. **对于每个 \`ready\`（依赖已满足）的产物**：
      - 获取指令：
        \`\`\`bash
        openspec instructions <artifact-id> --change "<name>" --json
        \`\`\`
      - 指令 JSON 包括：
        - \`context\`：项目背景（给你的约束 - 不要包含在输出中）
        - \`rules\`：产物特定规则（给你的约束 - 不要包含在输出中）
        - \`template\`：用于输出文件的结构
        - \`instruction\`：此产物类型的 Schema 特定指导
        - \`outputPath\`：写入产物的位置
        - \`dependencies\`：已完成的产物，用于阅读上下文
      - 阅读任何已完成的依赖文件以获取上下文
      - 使用 \`template\` 作为结构创建产物文件
      - 应用 \`context\` 和 \`rules\` 作为约束 - 但不要将它们复制到文件中
      - 显示简要进度："✓ Created <artifact-id>"

   b. **继续直到所有 \`applyRequires\` 产物都完成**
      - 创建每个产物后，重新运行 \`openspec status --change "<name>" --json\`
      - 检查 \`applyRequires\` 中的每个产物 ID 是否在产物数组中具有 \`status: "done"\`
      - 当所有 \`applyRequires\` 产物都完成时停止

   c. **如果产物需要用户输入**（上下文不清楚）：
      - 使用 **AskUserQuestion 工具** 澄清
      - 然后继续创建

5. **显示最终状态**
   \`\`\`bash
   openspec status --change "<name>"
   \`\`\`

**输出**

完成所有产物后，总结：
- 变更名称和位置
- 已创建产物的列表及简要描述
- 准备就绪："所有产物已创建！准备实施。"
- 提示："运行 \`/opsx:apply\` 或让我实施以开始处理任务。"

**产物创建指南**

- 遵循每个产物类型的 \`openspec instructions\` 中的 \`instruction\` 字段
- Schema 定义了每个产物应包含的内容 - 遵循它
- 在创建新产物之前阅读依赖产物以获取上下文
- 使用 \`template\` 作为起点，根据上下文填充
- **重要**：\`context\` 和 \`rules\` 是给你的约束，不是文件内容
  - 不要将 \`<context>\`, \`<rules>\`, \`<project_context>\` 块复制到产物中
  - 这些指导你写什么，但绝不应出现在输出中

**护栏**
- 创建实施所需的所有产物（由 Schema 的 \`apply.requires\` 定义）
- 在创建新产物之前始终阅读依赖产物
- 如果上下文严重不清楚，询问用户 - 但倾向于做出合理的决定以保持势头
- 如果具有该名称的变更已存在，询问用户是否要继续该变更或创建一个新的
- 在继续下一个之前，验证每个产物文件在写入后是否存在`,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for openspec-sync-specs skill
 * For syncing delta specs from a change to main specs (agent-driven)
 */
export function getSyncSpecsSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-sync-specs',
    description: '将变更中的增量规范同步到主规范。当用户想要用增量规范中的更改更新主规范，而不归档变更时使用。',
    instructions: `将变更中的增量规范同步到主规范。

这是一个 **Agent 驱动** 的操作 - 你将阅读增量规范并直接编辑主规范以应用更改。这允许智能合并（例如，添加一个场景而不复制整个需求）。

**输入**：可选择指定变更名称。如果省略，检查是否可以从对话上下文中推断。如果模糊或不明确，必须提示可用的变更。

**步骤**

1. **如果没有提供变更名称，提示选择**

   运行 \`openspec list --json\` 获取可用变更。使用 **AskUserQuestion 工具** 让用户选择。

   显示具有增量规范（在 \`specs/\` 目录下）的变更。

   **重要**：不要猜测或自动选择变更。始终让用户选择。

2. **查找增量规范**

   在 \`openspec/changes/<name>/specs/*/spec.md\` 中查找增量规范文件。

   每个增量规范文件包含如下部分：
   - \`## ADDED Requirements\` - 要添加的新需求
   - \`## MODIFIED Requirements\` - 对现有需求的更改
   - \`## REMOVED Requirements\` - 要删除的需求
   - \`## RENAMED Requirements\` - 要重命名的需求（FROM:/TO: 格式）

   如果未找到增量规范，通知用户并停止。

3. **对于每个增量规范，将更改应用到主规范**

   对于在 \`openspec/changes/<name>/specs/<capability>/spec.md\` 具有增量规范的每个 capability：

   a. **阅读增量规范** 以了解预期的更改

   b. **阅读主规范** \`openspec/specs/<capability>/spec.md\`（可能还不存在）

   c. **智能应用更改**：

      **ADDED Requirements:**
      - 如果主规范中不存在需求 → 添加它
      - 如果需求已存在 → 更新它以匹配（视为隐式 MODIFIED）

      **MODIFIED Requirements:**
      - 在主规范中找到需求
      - 应用更改 - 这可能是：
        - 添加新场景（不需要复制现有的）
        - 修改现有场景
        - 更改需求描述
      - 保留未在增量中提及的场景/内容

      **REMOVED Requirements:**
      - 从主规范中删除整个需求块

      **RENAMED Requirements:**
      - 找到 FROM 需求，重命名为 TO

   d. **创建新主规范** 如果 capability 尚不存在：
      - 创建 \`openspec/specs/<capability>/spec.md\`
      - 添加 Purpose 部分（可以简短，标记为 TBD）
      - 添加 Requirements 部分包含 ADDED requirements

4. **显示总结**

   应用所有更改后，总结：
   - 更新了哪些 capabilities
   - 做了什么更改（需求添加/修改/删除/重命名）

**增量规范格式参考**

\`\`\`markdown
## ADDED Requirements

### Requirement: New Feature
The system SHALL do something new.

#### Scenario: Basic case
- **WHEN** user does X
- **THEN** system does Y

## MODIFIED Requirements

### Requirement: Existing Feature
#### Scenario: New scenario to add
- **WHEN** user does A
- **THEN** system does B

## REMOVED Requirements

### Requirement: Deprecated Feature

## RENAMED Requirements

- FROM: \`### Requirement: Old Name\`
- TO: \`### Requirement: New Name\`
\`\`\`

**关键原则：智能合并**

与程序化合并不同，你可以应用 **部分更新**：
- 要添加场景，只需在 MODIFIED 下包含该场景 - 不要复制现有场景
- 增量代表 *意图*，而不是全盘替换
- 使用你的判断力合理合并更改

**成功时的输出**

\`\`\`
## 规范已同步：<change-name>

已更新主规范：

**<capability-1>**：
- 添加需求："New Feature"
- 修改需求："Existing Feature"（添加了 1 个场景）

**<capability-2>**：
- 创建了新规范文件
- 添加需求："Another Feature"

主规范现已更新。变更保持活跃 - 在实施完成后归档。
\`\`\`

**护栏**
- 在进行更改之前阅读增量规范和主规范
- 保留未在增量中提及的现有内容
- 如果某事不清楚，寻求澄清
- 在进行时显示你正在更改的内容
- 操作应是幂等的 - 运行两次应得到相同的结果`,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for openspec-onboard skill
 * Guided onboarding through the complete OpenSpec workflow
 */
export function getOnboardSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-onboard',
    description: 'Guided onboarding for OpenSpec - walk through a complete workflow cycle with narration and real codebase work.',
    instructions: getOnboardInstructions(),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Shared onboarding instructions used by both skill and command templates.
 */
function getOnboardInstructions(): string {
  return `Guide the user through their first complete OpenSpec workflow cycle. This is a teaching experience—you'll do real work in their codebase while explaining each step.

---

## Preflight

Before starting, check if the OpenSpec CLI is installed:

\`\`\`bash
# Unix/macOS
openspec --version 2>&1 || echo "CLI_NOT_INSTALLED"
# Windows (PowerShell)
# if (Get-Command openspec -ErrorAction SilentlyContinue) { openspec --version } else { echo "CLI_NOT_INSTALLED" }
\`\`\`

**If CLI not installed:**
> OpenSpec CLI is not installed. Install it first, then come back to \`/opsx:onboard\`.

Stop here if not installed.

---

## Phase 1: Welcome

Display:

\`\`\`
## Welcome to OpenSpec!

I'll walk you through a complete change cycle—from idea to implementation—using a real task in your codebase. Along the way, you'll learn the workflow by doing it.

**What we'll do:**
1. Pick a small, real task in your codebase
2. Explore the problem briefly
3. Create a change (the container for our work)
4. Build the artifacts: proposal → specs → design → tasks
5. Implement the tasks
6. Archive the completed change

**Time:** ~15-20 minutes

Let's start by finding something to work on.
\`\`\`

---

## Phase 2: Task Selection

### Codebase Analysis

Scan the codebase for small improvement opportunities. Look for:

1. **TODO/FIXME comments** - Search for \`TODO\`, \`FIXME\`, \`HACK\`, \`XXX\` in code files
2. **Missing error handling** - \`catch\` blocks that swallow errors, risky operations without try-catch
3. **Functions without tests** - Cross-reference \`src/\` with test directories
4. **Type issues** - \`any\` types in TypeScript files (\`: any\`, \`as any\`)
5. **Debug artifacts** - \`console.log\`, \`console.debug\`, \`debugger\` statements in non-debug code
6. **Missing validation** - User input handlers without validation

Also check recent git activity:
\`\`\`bash
# Unix/macOS
git log --oneline -10 2>/dev/null || echo "No git history"
# Windows (PowerShell)
# git log --oneline -10 2>$null; if ($LASTEXITCODE -ne 0) { echo "No git history" }
\`\`\`

### Present Suggestions

From your analysis, present 3-4 specific suggestions:

\`\`\`
## Task Suggestions

Based on scanning your codebase, here are some good starter tasks:

**1. [Most promising task]**
   Location: \`src/path/to/file.ts:42\`
   Scope: ~1-2 files, ~20-30 lines
   Why it's good: [brief reason]

**2. [Second task]**
   Location: \`src/another/file.ts\`
   Scope: ~1 file, ~15 lines
   Why it's good: [brief reason]

**3. [Third task]**
   Location: [location]
   Scope: [estimate]
   Why it's good: [brief reason]

**4. Something else?**
   Tell me what you'd like to work on.

Which task interests you? (Pick a number or describe your own)
\`\`\`

**If nothing found:** Fall back to asking what the user wants to build:
> I didn't find obvious quick wins in your codebase. What's something small you've been meaning to add or fix?

### Scope Guardrail

If the user picks or describes something too large (major feature, multi-day work):

\`\`\`
That's a valuable task, but it's probably larger than ideal for your first OpenSpec run-through.

For learning the workflow, smaller is better—it lets you see the full cycle without getting stuck in implementation details.

**Options:**
1. **Slice it smaller** - What's the smallest useful piece of [their task]? Maybe just [specific slice]?
2. **Pick something else** - One of the other suggestions, or a different small task?
3. **Do it anyway** - If you really want to tackle this, we can. Just know it'll take longer.

What would you prefer?
\`\`\`

Let the user override if they insist—this is a soft guardrail.

---

## Phase 3: Explore Demo

Once a task is selected, briefly demonstrate explore mode:

\`\`\`
Before we create a change, let me quickly show you **explore mode**—it's how you think through problems before committing to a direction.
\`\`\`

Spend 1-2 minutes investigating the relevant code:
- Read the file(s) involved
- Draw a quick ASCII diagram if it helps
- Note any considerations

\`\`\`
## Quick Exploration

[Your brief analysis—what you found, any considerations]

┌─────────────────────────────────────────┐
│   [Optional: ASCII diagram if helpful]  │
└─────────────────────────────────────────┘

Explore mode (\`/opsx:explore\`) is for this kind of thinking—investigating before implementing. You can use it anytime you need to think through a problem.

Now let's create a change to hold our work.
\`\`\`

**PAUSE** - Wait for user acknowledgment before proceeding.

---

## Phase 4: Create the Change

**EXPLAIN:**
\`\`\`
## Creating a Change

A "change" in OpenSpec is a container for all the thinking and planning around a piece of work. It lives in \`openspec/changes/<name>/\` and holds your artifacts—proposal, specs, design, tasks.

Let me create one for our task.
\`\`\`

**DO:** Create the change with a derived kebab-case name:
\`\`\`bash
openspec new change "<derived-name>"
\`\`\`

**SHOW:**
\`\`\`
Created: \`openspec/changes/<name>/\`

The folder structure:
\`\`\`
openspec/changes/<name>/
├── proposal.md    ← Why we're doing this (empty, we'll fill it)
├── design.md      ← How we'll build it (empty)
├── specs/         ← Detailed requirements (empty)
└── tasks.md       ← Implementation checklist (empty)
\`\`\`

Now let's fill in the first artifact—the proposal.
\`\`\`

---

## Phase 5: Proposal

**EXPLAIN:**
\`\`\`
## The Proposal

The proposal captures **why** we're making this change and **what** it involves at a high level. It's the "elevator pitch" for the work.

I'll draft one based on our task.
\`\`\`

**DO:** Draft the proposal content (don't save yet):

\`\`\`
Here's a draft proposal:

---

## Why

[1-2 sentences explaining the problem/opportunity]

## What Changes

[Bullet points of what will be different]

## Capabilities

### New Capabilities
- \`<capability-name>\`: [brief description]

### Modified Capabilities
<!-- If modifying existing behavior -->

## Impact

- \`src/path/to/file.ts\`: [what changes]
- [other files if applicable]

---

Does this capture the intent? I can adjust before we save it.
\`\`\`

**PAUSE** - Wait for user approval/feedback.

After approval, save the proposal:
\`\`\`bash
openspec instructions proposal --change "<name>" --json
\`\`\`
Then write the content to \`openspec/changes/<name>/proposal.md\`.

\`\`\`
Proposal saved. This is your "why" document—you can always come back and refine it as understanding evolves.

Next up: specs.
\`\`\`

---

## Phase 6: Specs

**EXPLAIN:**
\`\`\`
## Specs

Specs define **what** we're building in precise, testable terms. They use a requirement/scenario format that makes expected behavior crystal clear.

For a small task like this, we might only need one spec file.
\`\`\`

**DO:** Create the spec file:
\`\`\`bash
# Unix/macOS
mkdir -p openspec/changes/<name>/specs/<capability-name>
# Windows (PowerShell)
# New-Item -ItemType Directory -Force -Path "openspec/changes/<name>/specs/<capability-name>"
\`\`\`

Draft the spec content:

\`\`\`
Here's the spec:

---

## ADDED Requirements

### Requirement: <Name>

<Description of what the system should do>

#### Scenario: <Scenario name>

- **WHEN** <trigger condition>
- **THEN** <expected outcome>
- **AND** <additional outcome if needed>

---

This format—WHEN/THEN/AND—makes requirements testable. You can literally read them as test cases.
\`\`\`

Save to \`openspec/changes/<name>/specs/<capability>/spec.md\`.

---

## Phase 7: Design

**EXPLAIN:**
\`\`\`
## Design

The design captures **how** we'll build it—technical decisions, tradeoffs, approach.

For small changes, this might be brief. That's fine—not every change needs deep design discussion.
\`\`\`

**DO:** Draft design.md:

\`\`\`
Here's the design:

---

## Context

[Brief context about the current state]

## Goals / Non-Goals

**Goals:**
- [What we're trying to achieve]

**Non-Goals:**
- [What's explicitly out of scope]

## Decisions

### Decision 1: [Key decision]

[Explanation of approach and rationale]

---

For a small task, this captures the key decisions without over-engineering.
\`\`\`

Save to \`openspec/changes/<name>/design.md\`.

---

## Phase 8: Tasks

**EXPLAIN:**
\`\`\`
## Tasks

Finally, we break the work into implementation tasks—checkboxes that drive the apply phase.

These should be small, clear, and in logical order.
\`\`\`

**DO:** Generate tasks based on specs and design:

\`\`\`
Here are the implementation tasks:

---

## 1. [Category or file]

- [ ] 1.1 [Specific task]
- [ ] 1.2 [Specific task]

## 2. Verify

- [ ] 2.1 [Verification step]

---

Each checkbox becomes a unit of work in the apply phase. Ready to implement?
\`\`\`

**PAUSE** - Wait for user to confirm they're ready to implement.

Save to \`openspec/changes/<name>/tasks.md\`.

---

## Phase 9: Apply (Implementation)

**EXPLAIN:**
\`\`\`
## Implementation

Now we implement each task, checking them off as we go. I'll announce each one and occasionally note how the specs/design informed the approach.
\`\`\`

**DO:** For each task:

1. Announce: "Working on task N: [description]"
2. Implement the change in the codebase
3. Reference specs/design naturally: "The spec says X, so I'm doing Y"
4. Mark complete in tasks.md: \`- [ ]\` → \`- [x]\`
5. Brief status: "✓ Task N complete"

Keep narration light—don't over-explain every line of code.

After all tasks:

\`\`\`
## Implementation Complete

All tasks done:
- [x] Task 1
- [x] Task 2
- [x] ...

The change is implemented! One more step—let's archive it.
\`\`\`

---

## Phase 10: Archive

**EXPLAIN:**
\`\`\`
## Archiving

When a change is complete, we archive it. This moves it from \`openspec/changes/\` to \`openspec/changes/archive/YYYY-MM-DD-<name>/\`.

Archived changes become your project's decision history—you can always find them later to understand why something was built a certain way.
\`\`\`

**DO:**
\`\`\`bash
openspec archive "<name>"
\`\`\`

**SHOW:**
\`\`\`
Archived to: \`openspec/changes/archive/YYYY-MM-DD-<name>/\`

The change is now part of your project's history. The code is in your codebase, the decision record is preserved.
\`\`\`

---

## Phase 11: Recap & Next Steps

\`\`\`
## Congratulations!

You just completed a full OpenSpec cycle:

1. **Explore** - Thought through the problem
2. **New** - Created a change container
3. **Proposal** - Captured WHY
4. **Specs** - Defined WHAT in detail
5. **Design** - Decided HOW
6. **Tasks** - Broke it into steps
7. **Apply** - Implemented the work
8. **Archive** - Preserved the record

This same rhythm works for any size change—a small fix or a major feature.

---

## Command Reference

| Command | What it does |
|---------|--------------|
| \`/opsx:explore\` | Think through problems before/during work |
| \`/opsx:new\` | Start a new change, step through artifacts |
| \`/opsx:ff\` | Fast-forward: create all artifacts at once |
| \`/opsx:continue\` | Continue working on an existing change |
| \`/opsx:apply\` | Implement tasks from a change |
| \`/opsx:verify\` | Verify implementation matches artifacts |
| \`/opsx:archive\` | Archive a completed change |

---

## What's Next?

Try \`/opsx:new\` or \`/opsx:ff\` on something you actually want to build. You've got the rhythm now!
\`\`\`

---

## Graceful Exit Handling

### User wants to stop mid-way

If the user says they need to stop, want to pause, or seem disengaged:

\`\`\`
No problem! Your change is saved at \`openspec/changes/<name>/\`.

To pick up where we left off later:
- \`/opsx:continue <name>\` - Resume artifact creation
- \`/opsx:apply <name>\` - Jump to implementation (if tasks exist)

The work won't be lost. Come back whenever you're ready.
\`\`\`

Exit gracefully without pressure.

### User just wants command reference

If the user says they just want to see the commands or skip the tutorial:

\`\`\`
## OpenSpec Quick Reference

| Command | What it does |
|---------|--------------|
| \`/opsx:explore\` | Think through problems (no code changes) |
| \`/opsx:new <name>\` | Start a new change, step by step |
| \`/opsx:ff <name>\` | Fast-forward: all artifacts at once |
| \`/opsx:continue <name>\` | Continue an existing change |
| \`/opsx:apply <name>\` | Implement tasks |
| \`/opsx:verify <name>\` | Verify implementation |
| \`/opsx:archive <name>\` | Archive when done |

Try \`/opsx:new\` to start your first change, or \`/opsx:ff\` if you want to move fast.
\`\`\`

Exit gracefully.

---

## Guardrails

- **Follow the EXPLAIN → DO → SHOW → PAUSE pattern** at key transitions (after explore, after proposal draft, after tasks, after archive)
- **Keep narration light** during implementation—teach without lecturing
- **Don't skip phases** even if the change is small—the goal is teaching the workflow
- **Pause for acknowledgment** at marked points, but don't over-pause
- **Handle exits gracefully**—never pressure the user to continue
- **Use real codebase tasks**—don't simulate or use fake examples
- **Adjust scope gently**—guide toward smaller tasks but respect user choice`;
}

// -----------------------------------------------------------------------------
// Slash Command Templates
// -----------------------------------------------------------------------------

export interface CommandTemplate {
  name: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
}

/**
 * Template for /opsx:explore slash command
 * Explore mode - adaptive thinking partner
 */
export function getOpsxExploreCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Explore',
    description: 'Enter explore mode - think through ideas, investigate problems, clarify requirements',
    category: 'Workflow',
    tags: ['workflow', 'explore', 'experimental', 'thinking'],
    content: `Enter explore mode. Think deeply. Visualize freely. Follow the conversation wherever it goes.

**IMPORTANT: Explore mode is for thinking, not implementing.** You may read files, search code, and investigate the codebase, but you must NEVER write code or implement features. If the user asks you to implement something, remind them to exit explore mode first (e.g., start a change with \`/opsx:new\` or \`/opsx:ff\`). You MAY create OpenSpec artifacts (proposals, designs, specs) if the user asks—that's capturing thinking, not implementing.

**This is a stance, not a workflow.** There are no fixed steps, no required sequence, no mandatory outputs. You're a thinking partner helping the user explore.

**Input**: The argument after \`/opsx:explore\` is whatever the user wants to think about. Could be:
- A vague idea: "real-time collaboration"
- A specific problem: "the auth system is getting unwieldy"
- A change name: "add-dark-mode" (to explore in context of that change)
- A comparison: "postgres vs sqlite for this"
- Nothing (just enter explore mode)

---

## The Stance

- **Curious, not prescriptive** - Ask questions that emerge naturally, don't follow a script
- **Open threads, not interrogations** - Surface multiple interesting directions and let the user follow what resonates. Don't funnel them through a single path of questions.
- **Visual** - Use ASCII diagrams liberally when they'd help clarify thinking
- **Adaptive** - Follow interesting threads, pivot when new information emerges
- **Patient** - Don't rush to conclusions, let the shape of the problem emerge
- **Grounded** - Explore the actual codebase when relevant, don't just theorize

---

## What You Might Do

Depending on what the user brings, you might:

**Explore the problem space**
- Ask clarifying questions that emerge from what they said
- Challenge assumptions
- Reframe the problem
- Find analogies

**Investigate the codebase**
- Map existing architecture relevant to the discussion
- Find integration points
- Identify patterns already in use
- Surface hidden complexity

**Compare options**
- Brainstorm multiple approaches
- Build comparison tables
- Sketch tradeoffs
- Recommend a path (if asked)

**Visualize**
\`\`\`
┌─────────────────────────────────────────┐
│     Use ASCII diagrams liberally        │
├─────────────────────────────────────────┤
│                                         │
│   ┌────────┐         ┌────────┐        │
│   │ State  │────────▶│ State  │        │
│   │   A    │         │   B    │        │
│   └────────┘         └────────┘        │
│                                         │
│   System diagrams, state machines,      │
│   data flows, architecture sketches,    │
│   dependency graphs, comparison tables  │
│                                         │
└─────────────────────────────────────────┘
\`\`\`

**Surface risks and unknowns**
- Identify what could go wrong
- Find gaps in understanding
- Suggest spikes or investigations

---

## OpenSpec Awareness

You have full context of the OpenSpec system. Use it naturally, don't force it.

### Check for context

At the start, quickly check what exists:
\`\`\`bash
openspec list --json
\`\`\`

This tells you:
- If there are active changes
- Their names, schemas, and status
- What the user might be working on

If the user mentioned a specific change name, read its artifacts for context.

### When no change exists

Think freely. When insights crystallize, you might offer:

- "This feels solid enough to start a change. Want me to create one?"
  → Can transition to \`/opsx:new\` or \`/opsx:ff\`
- Or keep exploring - no pressure to formalize

### When a change exists

If the user mentions a change or you detect one is relevant:

1. **Read existing artifacts for context**
   - \`openspec/changes/<name>/proposal.md\`
   - \`openspec/changes/<name>/design.md\`
   - \`openspec/changes/<name>/tasks.md\`
   - etc.

2. **Reference them naturally in conversation**
   - "Your design mentions using Redis, but we just realized SQLite fits better..."
   - "The proposal scopes this to premium users, but we're now thinking everyone..."

3. **Offer to capture when decisions are made**

   | Insight Type | Where to Capture |
   |--------------|------------------|
   | New requirement discovered | \`specs/<capability>/spec.md\` |
   | Requirement changed | \`specs/<capability>/spec.md\` |
   | Design decision made | \`design.md\` |
   | Scope changed | \`proposal.md\` |
   | New work identified | \`tasks.md\` |
   | Assumption invalidated | Relevant artifact |

   Example offers:
   - "That's a design decision. Capture it in design.md?"
   - "This is a new requirement. Add it to specs?"
   - "This changes scope. Update the proposal?"

4. **The user decides** - Offer and move on. Don't pressure. Don't auto-capture.

---

## What You Don't Have To Do

- Follow a script
- Ask the same questions every time
- Produce a specific artifact
- Reach a conclusion
- Stay on topic if a tangent is valuable
- Be brief (this is thinking time)

---

## Ending Discovery

There's no required ending. Discovery might:

- **Flow into action**: "Ready to start? \`/opsx:new\` or \`/opsx:ff\`"
- **Result in artifact updates**: "Updated design.md with these decisions"
- **Just provide clarity**: User has what they need, moves on
- **Continue later**: "We can pick this up anytime"

When things crystallize, you might offer a summary - but it's optional. Sometimes the thinking IS the value.

---

## Guardrails

- **Don't implement** - Never write code or implement features. Creating OpenSpec artifacts is fine, writing application code is not.
- **Don't fake understanding** - If something is unclear, dig deeper
- **Don't rush** - Discovery is thinking time, not task time
- **Don't force structure** - Let patterns emerge naturally
- **Don't auto-capture** - Offer to save insights, don't just do it
- **Do visualize** - A good diagram is worth many paragraphs
- **Do explore the codebase** - Ground discussions in reality
- **Do question assumptions** - Including the user's and your own`
  };
}

/**
 * Template for /opsx:new slash command
 */
export function getOpsxNewCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: New',
    description: 'Start a new change using the experimental artifact workflow (OPSX)',
    category: 'Workflow',
    tags: ['workflow', 'artifacts', 'experimental'],
    content: `Start a new change using the experimental artifact-driven approach.

**Input**: The argument after \`/opsx:new\` is the change name (kebab-case), OR a description of what the user wants to build.

**Steps**

1. **If no input provided, ask what they want to build**

   Use the **AskUserQuestion tool** (open-ended, no preset options) to ask:
   > "What change do you want to work on? Describe what you want to build or fix."

   From their description, derive a kebab-case name (e.g., "add user authentication" → \`add-user-auth\`).

   **IMPORTANT**: Do NOT proceed without understanding what the user wants to build.

2. **Determine the workflow schema**

   Use the default schema (omit \`--schema\`) unless the user explicitly requests a different workflow.

   **Use a different schema only if the user mentions:**
   - A specific schema name → use \`--schema <name>\`
   - "show workflows" or "what workflows" → run \`openspec schemas --json\` and let them choose

   **Otherwise**: Omit \`--schema\` to use the default.

3. **Create the change directory**
   \`\`\`bash
   openspec new change "<name>"
   \`\`\`
   Add \`--schema <name>\` only if the user requested a specific workflow.
   This creates a scaffolded change at \`openspec/changes/<name>/\` with the selected schema.

4. **Show the artifact status**
   \`\`\`bash
   openspec status --change "<name>"
   \`\`\`
   This shows which artifacts need to be created and which are ready (dependencies satisfied).

5. **Get instructions for the first artifact**
   The first artifact depends on the schema. Check the status output to find the first artifact with status "ready".
   \`\`\`bash
   openspec instructions <first-artifact-id> --change "<name>"
   \`\`\`
   This outputs the template and context for creating the first artifact.

6. **STOP and wait for user direction**

**Output**

After completing the steps, summarize:
- Change name and location
- Schema/workflow being used and its artifact sequence
- Current status (0/N artifacts complete)
- The template for the first artifact
- Prompt: "Ready to create the first artifact? Run \`/opsx:continue\` or just describe what this change is about and I'll draft it."

**Guardrails**
- Do NOT create any artifacts yet - just show the instructions
- Do NOT advance beyond showing the first artifact template
- If the name is invalid (not kebab-case), ask for a valid name
- If a change with that name already exists, suggest using \`/opsx:continue\` instead
- Pass --schema if using a non-default workflow`
  };
}

/**
 * Template for /opsx:continue slash command
 */
export function getOpsxContinueCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Continue',
    description: 'Continue working on a change - create the next artifact (Experimental)',
    category: 'Workflow',
    tags: ['workflow', 'artifacts', 'experimental'],
    content: `Continue working on a change by creating the next artifact.

**Input**: Optionally specify a change name after \`/opsx:continue\` (e.g., \`/opsx:continue add-auth\`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run \`openspec list --json\` to get available changes sorted by most recently modified. Then use the **AskUserQuestion tool** to let the user select which change to work on.

   Present the top 3-4 most recently modified changes as options, showing:
   - Change name
   - Schema (from \`schema\` field if present, otherwise "spec-driven")
   - Status (e.g., "0/5 tasks", "complete", "no tasks")
   - How recently it was modified (from \`lastModified\` field)

   Mark the most recently modified change as "(Recommended)" since it's likely what the user wants to continue.

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check current status**
   \`\`\`bash
   openspec status --change "<name>" --json
   \`\`\`
   Parse the JSON to understand current state. The response includes:
   - \`schemaName\`: The workflow schema being used (e.g., "spec-driven")
   - \`artifacts\`: Array of artifacts with their status ("done", "ready", "blocked")
   - \`isComplete\`: Boolean indicating if all artifacts are complete

3. **Act based on status**:

   ---

   **If all artifacts are complete (\`isComplete: true\`)**:
   - Congratulate the user
   - Show final status including the schema used
   - Suggest: "All artifacts created! You can now implement this change with \`/opsx:apply\` or archive it with \`/opsx:archive\`."
   - STOP

   ---

   **If artifacts are ready to create** (status shows artifacts with \`status: "ready"\`):
   - Pick the FIRST artifact with \`status: "ready"\` from the status output
   - Get its instructions:
     \`\`\`bash
     openspec instructions <artifact-id> --change "<name>" --json
     \`\`\`
   - Parse the JSON. The key fields are:
     - \`context\`: Project background (constraints for you - do NOT include in output)
     - \`rules\`: Artifact-specific rules (constraints for you - do NOT include in output)
     - \`template\`: The structure to use for your output file
     - \`instruction\`: Schema-specific guidance
     - \`outputPath\`: Where to write the artifact
     - \`dependencies\`: Completed artifacts to read for context
   - **Create the artifact file**:
     - Read any completed dependency files for context
     - Use \`template\` as the structure - fill in its sections
     - Apply \`context\` and \`rules\` as constraints when writing - but do NOT copy them into the file
     - Write to the output path specified in instructions
   - Show what was created and what's now unlocked
   - STOP after creating ONE artifact

   ---

   **If no artifacts are ready (all blocked)**:
   - This shouldn't happen with a valid schema
   - Show status and suggest checking for issues

4. **After creating an artifact, show progress**
   \`\`\`bash
   openspec status --change "<name>"
   \`\`\`

**Output**

After each invocation, show:
- Which artifact was created
- Schema workflow being used
- Current progress (N/M complete)
- What artifacts are now unlocked
- Prompt: "Run \`/opsx:continue\` to create the next artifact"

**Artifact Creation Guidelines**

The artifact types and their purpose depend on the schema. Use the \`instruction\` field from the instructions output to understand what to create.

Common artifact patterns:

**spec-driven schema** (proposal → specs → design → tasks):
- **proposal.md**: Ask user about the change if not clear. Fill in Why, What Changes, Capabilities, Impact.
  - The Capabilities section is critical - each capability listed will need a spec file.
- **specs/<capability>/spec.md**: Create one spec per capability listed in the proposal's Capabilities section (use the capability name, not the change name).
- **design.md**: Document technical decisions, architecture, and implementation approach.
- **tasks.md**: Break down implementation into checkboxed tasks.

For other schemas, follow the \`instruction\` field from the CLI output.

**Guardrails**
- Create ONE artifact per invocation
- Always read dependency artifacts before creating a new one
- Never skip artifacts or create out of order
- If context is unclear, ask the user before creating
- Verify the artifact file exists after writing before marking progress
- Use the schema's artifact sequence, don't assume specific artifact names
- **IMPORTANT**: \`context\` and \`rules\` are constraints for YOU, not content for the file
  - Do NOT copy \`<context>\`, \`<rules>\`, \`<project_context>\` blocks into the artifact
  - These guide what you write, but should never appear in the output`
  };
}

/**
 * Template for /opsx:apply slash command
 */
export function getOpsxApplyCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Apply',
    description: 'Implement tasks from an OpenSpec change (Experimental)',
    category: 'Workflow',
    tags: ['workflow', 'artifacts', 'experimental'],
    content: `Implement tasks from an OpenSpec change.

**Input**: Optionally specify a change name (e.g., \`/opsx:apply add-auth\`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run \`openspec list --json\` to get available changes and use the **AskUserQuestion tool** to let the user select

   Always announce: "Using change: <name>" and how to override (e.g., \`/opsx:apply <other>\`).

2. **Check status to understand the schema**
   \`\`\`bash
   openspec status --change "<name>" --json
   \`\`\`
   Parse the JSON to understand:
   - \`schemaName\`: The workflow being used (e.g., "spec-driven")
   - Which artifact contains the tasks (typically "tasks" for spec-driven, check status for others)

3. **Get apply instructions**

   \`\`\`bash
   openspec instructions apply --change "<name>" --json
   \`\`\`

   This returns:
   - Context file paths (varies by schema)
   - Progress (total, complete, remaining)
   - Task list with status
   - Dynamic instruction based on current state

   **Handle states:**
   - If \`state: "blocked"\` (missing artifacts): show message, suggest using \`/opsx:continue\`
   - If \`state: "all_done"\`: congratulate, suggest archive
   - Otherwise: proceed to implementation

4. **Read context files**

   Read the files listed in \`contextFiles\` from the apply instructions output.
   The files depend on the schema being used:
   - **spec-driven**: proposal, specs, design, tasks
   - Other schemas: follow the contextFiles from CLI output

5. **Show current progress**

   Display:
   - Schema being used
   - Progress: "N/M tasks complete"
   - Remaining tasks overview
   - Dynamic instruction from CLI

6. **Implement tasks (loop until done or blocked)**

   For each pending task:
   - Show which task is being worked on
   - Make the code changes required
   - Keep changes minimal and focused
   - Mark task complete in the tasks file: \`- [ ]\` → \`- [x]\`
   - Continue to next task

   **Pause if:**
   - Task is unclear → ask for clarification
   - Implementation reveals a design issue → suggest updating artifacts
   - Error or blocker encountered → report and wait for guidance
   - User interrupts

7. **On completion or pause, show status**

   Display:
   - Tasks completed this session
   - Overall progress: "N/M tasks complete"
   - If all done: suggest archive
   - If paused: explain why and wait for guidance

**Output During Implementation**

\`\`\`
## Implementing: <change-name> (schema: <schema-name>)

Working on task 3/7: <task description>
[...implementation happening...]
✓ Task complete

Working on task 4/7: <task description>
[...implementation happening...]
✓ Task complete
\`\`\`

**Output On Completion**

\`\`\`
## Implementation Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 7/7 tasks complete ✓

### Completed This Session
- [x] Task 1
- [x] Task 2
...

All tasks complete! You can archive this change with \`/opsx:archive\`.
\`\`\`

**Output On Pause (Issue Encountered)**

\`\`\`
## Implementation Paused

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 4/7 tasks complete

### Issue Encountered
<description of the issue>

**Options:**
1. <option 1>
2. <option 2>
3. Other approach

What would you like to do?
\`\`\`

**Guardrails**
- Keep going through tasks until done or blocked
- Always read context files before starting (from the apply instructions output)
- If task is ambiguous, pause and ask before implementing
- If implementation reveals issues, pause and suggest artifact updates
- Keep code changes minimal and scoped to each task
- Update task checkbox immediately after completing each task
- Pause on errors, blockers, or unclear requirements - don't guess
- Use contextFiles from CLI output, don't assume specific file names

**Fluid Workflow Integration**

This skill supports the "actions on a change" model:

- **Can be invoked anytime**: Before all artifacts are done (if tasks exist), after partial implementation, interleaved with other actions
- **Allows artifact updates**: If implementation reveals design issues, suggest updating artifacts - not phase-locked, work fluidly`
  };
}


/**
 * Template for /opsx:ff slash command
 */
export function getOpsxFfCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Fast Forward',
    description: 'Create a change and generate all artifacts needed for implementation in one go',
    category: 'Workflow',
    tags: ['workflow', 'artifacts', 'experimental'],
    content: `Fast-forward through artifact creation - generate everything needed to start implementation.

**Input**: The argument after \`/opsx:ff\` is the change name (kebab-case), OR a description of what the user wants to build.

**Steps**

1. **If no input provided, ask what they want to build**

   Use the **AskUserQuestion tool** (open-ended, no preset options) to ask:
   > "What change do you want to work on? Describe what you want to build or fix."

   From their description, derive a kebab-case name (e.g., "add user authentication" → \`add-user-auth\`).

   **IMPORTANT**: Do NOT proceed without understanding what the user wants to build.

2. **Create the change directory**
   \`\`\`bash
   openspec new change "<name>"
   \`\`\`
   This creates a scaffolded change at \`openspec/changes/<name>/\`.

3. **Get the artifact build order**
   \`\`\`bash
   openspec status --change "<name>" --json
   \`\`\`
   Parse the JSON to get:
   - \`applyRequires\`: array of artifact IDs needed before implementation (e.g., \`["tasks"]\`)
   - \`artifacts\`: list of all artifacts with their status and dependencies

4. **Create artifacts in sequence until apply-ready**

   Use the **TodoWrite tool** to track progress through the artifacts.

   Loop through artifacts in dependency order (artifacts with no pending dependencies first):

   a. **For each artifact that is \`ready\` (dependencies satisfied)**:
      - Get instructions:
        \`\`\`bash
        openspec instructions <artifact-id> --change "<name>" --json
        \`\`\`
      - The instructions JSON includes:
        - \`context\`: Project background (constraints for you - do NOT include in output)
        - \`rules\`: Artifact-specific rules (constraints for you - do NOT include in output)
        - \`template\`: The structure to use for your output file
        - \`instruction\`: Schema-specific guidance for this artifact type
        - \`outputPath\`: Where to write the artifact
        - \`dependencies\`: Completed artifacts to read for context
      - Read any completed dependency files for context
      - Create the artifact file using \`template\` as the structure
      - Apply \`context\` and \`rules\` as constraints - but do NOT copy them into the file
      - Show brief progress: "✓ Created <artifact-id>"

   b. **Continue until all \`applyRequires\` artifacts are complete**
      - After creating each artifact, re-run \`openspec status --change "<name>" --json\`
      - Check if every artifact ID in \`applyRequires\` has \`status: "done"\` in the artifacts array
      - Stop when all \`applyRequires\` artifacts are done

   c. **If an artifact requires user input** (unclear context):
      - Use **AskUserQuestion tool** to clarify
      - Then continue with creation

5. **Show final status**
   \`\`\`bash
   openspec status --change "<name>"
   \`\`\`

**Output**

After completing all artifacts, summarize:
- Change name and location
- List of artifacts created with brief descriptions
- What's ready: "All artifacts created! Ready for implementation."
- Prompt: "Run \`/opsx:apply\` to start implementing."

**Artifact Creation Guidelines**

- Follow the \`instruction\` field from \`openspec instructions\` for each artifact type
- The schema defines what each artifact should contain - follow it
- Read dependency artifacts for context before creating new ones
- Use the \`template\` as a starting point, filling in based on context

**Guardrails**
- Create ALL artifacts needed for implementation (as defined by schema's \`apply.requires\`)
- Always read dependency artifacts before creating a new one
- If context is critically unclear, ask the user - but prefer making reasonable decisions to keep momentum
- If a change with that name already exists, ask if user wants to continue it or create a new one
- Verify each artifact file exists after writing before proceeding to next`
  };
}

/**
 * Template for openspec-archive-change skill
 * For archiving completed changes in the experimental workflow
 */
export function getArchiveChangeSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-archive-change',
    description: '在实验性工作流中归档已完成的变更。当用户想要在实施完成后最终确定并归档变更时使用。',
    instructions: `在实验性工作流中归档已完成的变更。

**输入**：可选择指定变更名称。如果省略，检查是否可以从对话上下文中推断。如果模糊或不明确，必须提示可用的变更。

**步骤**

1. **如果没有提供变更名称，提示选择**

   运行 \`openspec list --json\` 获取可用变更。使用 **AskUserQuestion 工具** 让用户选择。

   仅显示活跃变更（未归档）。
   如果可用，包括每个变更使用的 Schema。

   **重要**：不要猜测或自动选择变更。始终让用户选择。

2. **检查产物完成状态**

   运行 \`openspec status --change "<name>" --json\` 检查产物完成情况。

   解析 JSON 以了解：
   - \`schemaName\`：正在使用的工作流
   - \`artifacts\`：产物列表及其状态（\`done\` 或其他）

   **如果有产物未 \`done\`：**
   - 显示列出未完成产物的警告
   - 使用 **AskUserQuestion 工具** 确认用户是否要继续
   - 如果用户确认则继续

3. **检查任务完成状态**

   阅读任务文件（通常是 \`tasks.md\`）以检查未完成的任务。

   统计标记为 \`- [ ]\`（未完成）与 \`- [x]\`（完成）的任务。

   **如果发现未完成的任务：**
   - 显示列出未完成任务计数的警告
   - 使用 **AskUserQuestion 工具** 确认用户是否要继续
   - 如果用户确认则继续

   **如果不存在任务文件：** 继续而不显示任务相关警告。

4. **评估增量规范同步状态**

   检查 \`openspec/changes/<name>/specs/\` 中的增量规范。如果不存在，继续而不显示同步提示。

   **如果存在增量规范：**
   - 将每个增量规范与 \`openspec/specs/<capability>/spec.md\` 中的对应主规范进行比较
   - 确定将应用哪些更改（添加、修改、删除、重命名）
   - 在提示之前显示合并总结

   **提示选项：**
   - 如果需要更改："立即同步（推荐）"，"归档而不同步"
   - 如果已同步："立即归档"，"仍然同步"，"取消"

   如果用户选择同步，使用 Task 工具（subagent_type: "general-purpose", prompt: "Use Skill tool to invoke openspec-sync-specs for change '<name>'. Delta spec analysis: <include the analyzed delta spec summary>"）。无论选择如何，都继续归档。

5. **执行归档**

   如果归档目录不存在，创建它：
   \`\`\`bash
   mkdir -p openspec/changes/archive
   \`\`\`

   使用当前日期生成目标名称：\`YYYY-MM-DD-<change-name>\`

   **检查目标是否已存在：**
   - 如果是：报错失败，建议重命名现有归档或使用不同日期
   - 如果否：将变更目录移动到归档

   \`\`\`bash
   mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>
   \`\`\`

6. **显示总结**

   显示归档完成总结，包括：
   - 变更名称
   - 使用的 Schema
   - 归档位置
   - 规范同步状态（已同步 / 跳过同步 / 无增量规范）
   - 关于任何警告的说明（未完成的产物/任务）

**成功时的输出**

\`\`\`
## 归档完成

**变更：** <change-name>
**Schema：** <schema-name>
**归档至：** openspec/changes/archive/YYYY-MM-DD-<name>/
**规范：** ✓ 已同步到主规范

所有产物已完成。所有任务已完成。
\`\`\`

**成功时的输出（无增量规范）**

\`\`\`
## 归档完成

**变更：** <change-name>
**Schema：** <schema-name>
**归档至：** openspec/changes/archive/YYYY-MM-DD-<name>/
**规范：** 无增量规范

所有产物已完成。所有任务已完成。
\`\`\`

**带警告的成功输出**

\`\`\`
## 归档完成（带警告）

**变更：** <change-name>
**Schema：** <schema-name>
**归档至：** openspec/changes/archive/YYYY-MM-DD-<name>/
**规范：** 同步已跳过（用户选择跳过）

**警告：**
- 归档时有 2 个未完成的产物
- 归档时有 3 个未完成的任务
- 增量规范同步已跳过（用户选择跳过）

如果这不是故意的，请检查归档。
\`\`\`

**错误时的输出（归档已存在）**

\`\`\`
## 归档失败

**变更：** <change-name>
**目标：** openspec/changes/archive/YYYY-MM-DD-<name>/

目标归档目录已存在。

**选项：**
1. 重命名现有的归档
2. 如果是重复的，删除现有的归档
3. 等到不同的日期再归档
\`\`\`

**护栏**
- 如果未提供，始终提示选择变更
- 使用产物图 (openspec status --json) 进行完成检查
- 不要因警告阻止归档 - 只需通知并确认
- 移动到归档时保留 .openspec.yaml（它随目录移动）
- 显示发生的清晰总结
- 如果请求同步，使用 Skill 工具调用 \`openspec-sync-specs\`（Agent 驱动）
- 如果存在增量规范，始终运行同步评估并在提示前显示合并总结`,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for openspec-bulk-archive-change skill
 * For archiving multiple completed changes at once
 */
export function getBulkArchiveChangeSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-bulk-archive-change',
    description: 'Archive multiple completed changes at once. Use when archiving several parallel changes.',
    instructions: `Archive multiple completed changes in a single operation.

This skill allows you to batch-archive changes, handling spec conflicts intelligently by checking the codebase to determine what's actually implemented.

**Input**: None required (prompts for selection)

**Steps**

1. **Get active changes**

   Run \`openspec list --json\` to get all active changes.

   If no active changes exist, inform user and stop.

2. **Prompt for change selection**

   Use **AskUserQuestion tool** with multi-select to let user choose changes:
   - Show each change with its schema
   - Include an option for "All changes"
   - Allow any number of selections (1+ works, 2+ is the typical use case)

   **IMPORTANT**: Do NOT auto-select. Always let the user choose.

3. **Batch validation - gather status for all selected changes**

   For each selected change, collect:

   a. **Artifact status** - Run \`openspec status --change "<name>" --json\`
      - Parse \`schemaName\` and \`artifacts\` list
      - Note which artifacts are \`done\` vs other states

   b. **Task completion** - Read \`openspec/changes/<name>/tasks.md\`
      - Count \`- [ ]\` (incomplete) vs \`- [x]\` (complete)
      - If no tasks file exists, note as "No tasks"

   c. **Delta specs** - Check \`openspec/changes/<name>/specs/\` directory
      - List which capability specs exist
      - For each, extract requirement names (lines matching \`### Requirement: <name>\`)

4. **Detect spec conflicts**

   Build a map of \`capability -> [changes that touch it]\`:

   \`\`\`
   auth -> [change-a, change-b]  <- CONFLICT (2+ changes)
   api  -> [change-c]            <- OK (only 1 change)
   \`\`\`

   A conflict exists when 2+ selected changes have delta specs for the same capability.

5. **Resolve conflicts agentically**

   **For each conflict**, investigate the codebase:

   a. **Read the delta specs** from each conflicting change to understand what each claims to add/modify

   b. **Search the codebase** for implementation evidence:
      - Look for code implementing requirements from each delta spec
      - Check for related files, functions, or tests

   c. **Determine resolution**:
      - If only one change is actually implemented -> sync that one's specs
      - If both implemented -> apply in chronological order (older first, newer overwrites)
      - If neither implemented -> skip spec sync, warn user

   d. **Record resolution** for each conflict:
      - Which change's specs to apply
      - In what order (if both)
      - Rationale (what was found in codebase)

6. **Show consolidated status table**

   Display a table summarizing all changes:

   \`\`\`
   | Change               | Artifacts | Tasks | Specs   | Conflicts | Status |
   |---------------------|-----------|-------|---------|-----------|--------|
   | schema-management   | Done      | 5/5   | 2 delta | None      | Ready  |
   | project-config      | Done      | 3/3   | 1 delta | None      | Ready  |
   | add-oauth           | Done      | 4/4   | 1 delta | auth (!)  | Ready* |
   | add-verify-skill    | 1 left    | 2/5   | None    | None      | Warn   |
   \`\`\`

   For conflicts, show the resolution:
   \`\`\`
   * Conflict resolution:
     - auth spec: Will apply add-oauth then add-jwt (both implemented, chronological order)
   \`\`\`

   For incomplete changes, show warnings:
   \`\`\`
   Warnings:
   - add-verify-skill: 1 incomplete artifact, 3 incomplete tasks
   \`\`\`

7. **Confirm batch operation**

   Use **AskUserQuestion tool** with a single confirmation:

   - "Archive N changes?" with options based on status
   - Options might include:
     - "Archive all N changes"
     - "Archive only N ready changes (skip incomplete)"
     - "Cancel"

   If there are incomplete changes, make clear they'll be archived with warnings.

8. **Execute archive for each confirmed change**

   Process changes in the determined order (respecting conflict resolution):

   a. **Sync specs** if delta specs exist:
      - Use the openspec-sync-specs approach (agent-driven intelligent merge)
      - For conflicts, apply in resolved order
      - Track if sync was done

   b. **Perform the archive**:
      \`\`\`bash
      mkdir -p openspec/changes/archive
      mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>
      \`\`\`

   c. **Track outcome** for each change:
      - Success: archived successfully
      - Failed: error during archive (record error)
      - Skipped: user chose not to archive (if applicable)

9. **Display summary**

   Show final results:

   \`\`\`
   ## Bulk Archive Complete

   Archived 3 changes:
   - schema-management-cli -> archive/2026-01-19-schema-management-cli/
   - project-config -> archive/2026-01-19-project-config/
   - add-oauth -> archive/2026-01-19-add-oauth/

   Skipped 1 change:
   - add-verify-skill (user chose not to archive incomplete)

   Spec sync summary:
   - 4 delta specs synced to main specs
   - 1 conflict resolved (auth: applied both in chronological order)
   \`\`\`

   If any failures:
   \`\`\`
   Failed 1 change:
   - some-change: Archive directory already exists
   \`\`\`

**Conflict Resolution Examples**

Example 1: Only one implemented
\`\`\`
Conflict: specs/auth/spec.md touched by [add-oauth, add-jwt]

Checking add-oauth:
- Delta adds "OAuth Provider Integration" requirement
- Searching codebase... found src/auth/oauth.ts implementing OAuth flow

Checking add-jwt:
- Delta adds "JWT Token Handling" requirement
- Searching codebase... no JWT implementation found

Resolution: Only add-oauth is implemented. Will sync add-oauth specs only.
\`\`\`

Example 2: Both implemented
\`\`\`
Conflict: specs/api/spec.md touched by [add-rest-api, add-graphql]

Checking add-rest-api (created 2026-01-10):
- Delta adds "REST Endpoints" requirement
- Searching codebase... found src/api/rest.ts

Checking add-graphql (created 2026-01-15):
- Delta adds "GraphQL Schema" requirement
- Searching codebase... found src/api/graphql.ts

Resolution: Both implemented. Will apply add-rest-api specs first,
then add-graphql specs (chronological order, newer takes precedence).
\`\`\`

**Output On Success**

\`\`\`
## Bulk Archive Complete

Archived N changes:
- <change-1> -> archive/YYYY-MM-DD-<change-1>/
- <change-2> -> archive/YYYY-MM-DD-<change-2>/

Spec sync summary:
- N delta specs synced to main specs
- No conflicts (or: M conflicts resolved)
\`\`\`

**Output On Partial Success**

\`\`\`
## Bulk Archive Complete (partial)

Archived N changes:
- <change-1> -> archive/YYYY-MM-DD-<change-1>/

Skipped M changes:
- <change-2> (user chose not to archive incomplete)

Failed K changes:
- <change-3>: Archive directory already exists
\`\`\`

**Output When No Changes**

\`\`\`
## No Changes to Archive

No active changes found. Use \`/opsx:new\` to create a new change.
\`\`\`

**Guardrails**
- Allow any number of changes (1+ is fine, 2+ is the typical use case)
- Always prompt for selection, never auto-select
- Detect spec conflicts early and resolve by checking codebase
- When both changes are implemented, apply specs in chronological order
- Skip spec sync only when implementation is missing (warn user)
- Show clear per-change status before confirming
- Use single confirmation for entire batch
- Track and report all outcomes (success/skip/fail)
- Preserve .openspec.yaml when moving to archive
- Archive directory target uses current date: YYYY-MM-DD-<name>
- If archive target exists, fail that change but continue with others`,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for /opsx:sync slash command
 */
export function getOpsxSyncCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Sync',
    description: 'Sync delta specs from a change to main specs',
    category: 'Workflow',
    tags: ['workflow', 'specs', 'experimental'],
    content: `Sync delta specs from a change to main specs.

This is an **agent-driven** operation - you will read delta specs and directly edit main specs to apply the changes. This allows intelligent merging (e.g., adding a scenario without copying the entire requirement).

**Input**: Optionally specify a change name after \`/opsx:sync\` (e.g., \`/opsx:sync add-auth\`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run \`openspec list --json\` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show changes that have delta specs (under \`specs/\` directory).

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Find delta specs**

   Look for delta spec files in \`openspec/changes/<name>/specs/*/spec.md\`.

   Each delta spec file contains sections like:
   - \`## ADDED Requirements\` - New requirements to add
   - \`## MODIFIED Requirements\` - Changes to existing requirements
   - \`## REMOVED Requirements\` - Requirements to remove
   - \`## RENAMED Requirements\` - Requirements to rename (FROM:/TO: format)

   If no delta specs found, inform user and stop.

3. **For each delta spec, apply changes to main specs**

   For each capability with a delta spec at \`openspec/changes/<name>/specs/<capability>/spec.md\`:

   a. **Read the delta spec** to understand the intended changes

   b. **Read the main spec** at \`openspec/specs/<capability>/spec.md\` (may not exist yet)

   c. **Apply changes intelligently**:

      **ADDED Requirements:**
      - If requirement doesn't exist in main spec → add it
      - If requirement already exists → update it to match (treat as implicit MODIFIED)

      **MODIFIED Requirements:**
      - Find the requirement in main spec
      - Apply the changes - this can be:
        - Adding new scenarios (don't need to copy existing ones)
        - Modifying existing scenarios
        - Changing the requirement description
      - Preserve scenarios/content not mentioned in the delta

      **REMOVED Requirements:**
      - Remove the entire requirement block from main spec

      **RENAMED Requirements:**
      - Find the FROM requirement, rename to TO

   d. **Create new main spec** if capability doesn't exist yet:
      - Create \`openspec/specs/<capability>/spec.md\`
      - Add Purpose section (can be brief, mark as TBD)
      - Add Requirements section with the ADDED requirements

4. **Show summary**

   After applying all changes, summarize:
   - Which capabilities were updated
   - What changes were made (requirements added/modified/removed/renamed)

**Delta Spec Format Reference**

\`\`\`markdown
## ADDED Requirements

### Requirement: New Feature
The system SHALL do something new.

#### Scenario: Basic case
- **WHEN** user does X
- **THEN** system does Y

## MODIFIED Requirements

### Requirement: Existing Feature
#### Scenario: New scenario to add
- **WHEN** user does A
- **THEN** system does B

## REMOVED Requirements

### Requirement: Deprecated Feature

## RENAMED Requirements

- FROM: \`### Requirement: Old Name\`
- TO: \`### Requirement: New Name\`
\`\`\`

**Key Principle: Intelligent Merging**

Unlike programmatic merging, you can apply **partial updates**:
- To add a scenario, just include that scenario under MODIFIED - don't copy existing scenarios
- The delta represents *intent*, not a wholesale replacement
- Use your judgment to merge changes sensibly

**Output On Success**

\`\`\`
## Specs Synced: <change-name>

Updated main specs:

**<capability-1>**:
- Added requirement: "New Feature"
- Modified requirement: "Existing Feature" (added 1 scenario)

**<capability-2>**:
- Created new spec file
- Added requirement: "Another Feature"

Main specs are now updated. The change remains active - archive when implementation is complete.
\`\`\`

**Guardrails**
- Read both delta and main specs before making changes
- Preserve existing content not mentioned in delta
- If something is unclear, ask for clarification
- Show what you're changing as you go
- The operation should be idempotent - running twice should give same result`
  };
}

/**
 * Template for openspec-verify-change skill
 * For verifying implementation matches change artifacts before archiving
 */
export function getVerifyChangeSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-verify-change',
    description: 'Verify implementation matches change artifacts. Use when the user wants to validate that implementation is complete, correct, and coherent before archiving.',
    instructions: `Verify that an implementation matches the change artifacts (specs, tasks, design).

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run \`openspec list --json\` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show changes that have implementation tasks (tasks artifact exists).
   Include the schema used for each change if available.
   Mark changes with incomplete tasks as "(In Progress)".

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check status to understand the schema**
   \`\`\`bash
   openspec status --change "<name>" --json
   \`\`\`
   Parse the JSON to understand:
   - \`schemaName\`: The workflow being used (e.g., "spec-driven")
   - Which artifacts exist for this change

3. **Get the change directory and load artifacts**

   \`\`\`bash
   openspec instructions apply --change "<name>" --json
   \`\`\`

   This returns the change directory and context files. Read all available artifacts from \`contextFiles\`.

4. **Initialize verification report structure**

   Create a report structure with three dimensions:
   - **Completeness**: Track tasks and spec coverage
   - **Correctness**: Track requirement implementation and scenario coverage
   - **Coherence**: Track design adherence and pattern consistency

   Each dimension can have CRITICAL, WARNING, or SUGGESTION issues.

5. **Verify Completeness**

   **Task Completion**:
   - If tasks.md exists in contextFiles, read it
   - Parse checkboxes: \`- [ ]\` (incomplete) vs \`- [x]\` (complete)
   - Count complete vs total tasks
   - If incomplete tasks exist:
     - Add CRITICAL issue for each incomplete task
     - Recommendation: "Complete task: <description>" or "Mark as done if already implemented"

   **Spec Coverage**:
   - If delta specs exist in \`openspec/changes/<name>/specs/\`:
     - Extract all requirements (marked with "### Requirement:")
     - For each requirement:
       - Search codebase for keywords related to the requirement
       - Assess if implementation likely exists
     - If requirements appear unimplemented:
       - Add CRITICAL issue: "Requirement not found: <requirement name>"
       - Recommendation: "Implement requirement X: <description>"

6. **Verify Correctness**

   **Requirement Implementation Mapping**:
   - For each requirement from delta specs:
     - Search codebase for implementation evidence
     - If found, note file paths and line ranges
     - Assess if implementation matches requirement intent
     - If divergence detected:
       - Add WARNING: "Implementation may diverge from spec: <details>"
       - Recommendation: "Review <file>:<lines> against requirement X"

   **Scenario Coverage**:
   - For each scenario in delta specs (marked with "#### Scenario:"):
     - Check if conditions are handled in code
     - Check if tests exist covering the scenario
     - If scenario appears uncovered:
       - Add WARNING: "Scenario not covered: <scenario name>"
       - Recommendation: "Add test or implementation for scenario: <description>"

7. **Verify Coherence**

   **Design Adherence**:
   - If design.md exists in contextFiles:
     - Extract key decisions (look for sections like "Decision:", "Approach:", "Architecture:")
     - Verify implementation follows those decisions
     - If contradiction detected:
       - Add WARNING: "Design decision not followed: <decision>"
       - Recommendation: "Update implementation or revise design.md to match reality"
   - If no design.md: Skip design adherence check, note "No design.md to verify against"

   **Code Pattern Consistency**:
   - Review new code for consistency with project patterns
   - Check file naming, directory structure, coding style
   - If significant deviations found:
     - Add SUGGESTION: "Code pattern deviation: <details>"
     - Recommendation: "Consider following project pattern: <example>"

8. **Generate Verification Report**

   **Summary Scorecard**:
   \`\`\`
   ## Verification Report: <change-name>

   ### Summary
   | Dimension    | Status           |
   |--------------|------------------|
   | Completeness | X/Y tasks, N reqs|
   | Correctness  | M/N reqs covered |
   | Coherence    | Followed/Issues  |
   \`\`\`

   **Issues by Priority**:

   1. **CRITICAL** (Must fix before archive):
      - Incomplete tasks
      - Missing requirement implementations
      - Each with specific, actionable recommendation

   2. **WARNING** (Should fix):
      - Spec/design divergences
      - Missing scenario coverage
      - Each with specific recommendation

   3. **SUGGESTION** (Nice to fix):
      - Pattern inconsistencies
      - Minor improvements
      - Each with specific recommendation

   **Final Assessment**:
   - If CRITICAL issues: "X critical issue(s) found. Fix before archiving."
   - If only warnings: "No critical issues. Y warning(s) to consider. Ready for archive (with noted improvements)."
   - If all clear: "All checks passed. Ready for archive."

**Verification Heuristics**

- **Completeness**: Focus on objective checklist items (checkboxes, requirements list)
- **Correctness**: Use keyword search, file path analysis, reasonable inference - don't require perfect certainty
- **Coherence**: Look for glaring inconsistencies, don't nitpick style
- **False Positives**: When uncertain, prefer SUGGESTION over WARNING, WARNING over CRITICAL
- **Actionability**: Every issue must have a specific recommendation with file/line references where applicable

**Graceful Degradation**

- If only tasks.md exists: verify task completion only, skip spec/design checks
- If tasks + specs exist: verify completeness and correctness, skip design
- If full artifacts: verify all three dimensions
- Always note which checks were skipped and why

**Output Format**

Use clear markdown with:
- Table for summary scorecard
- Grouped lists for issues (CRITICAL/WARNING/SUGGESTION)
- Code references in format: \`file.ts:123\`
- Specific, actionable recommendations
- No vague suggestions like "consider reviewing"`,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for /opsx:archive slash command
 */
export function getOpsxArchiveCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Archive',
    description: 'Archive a completed change in the experimental workflow',
    category: 'Workflow',
    tags: ['workflow', 'archive', 'experimental'],
    content: `Archive a completed change in the experimental workflow.

**Input**: Optionally specify a change name after \`/opsx:archive\` (e.g., \`/opsx:archive add-auth\`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run \`openspec list --json\` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show only active changes (not already archived).
   Include the schema used for each change if available.

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check artifact completion status**

   Run \`openspec status --change "<name>" --json\` to check artifact completion.

   Parse the JSON to understand:
   - \`schemaName\`: The workflow being used
   - \`artifacts\`: List of artifacts with their status (\`done\` or other)

   **If any artifacts are not \`done\`:**
   - Display warning listing incomplete artifacts
   - Prompt user for confirmation to continue
   - Proceed if user confirms

3. **Check task completion status**

   Read the tasks file (typically \`tasks.md\`) to check for incomplete tasks.

   Count tasks marked with \`- [ ]\` (incomplete) vs \`- [x]\` (complete).

   **If incomplete tasks found:**
   - Display warning showing count of incomplete tasks
   - Prompt user for confirmation to continue
   - Proceed if user confirms

   **If no tasks file exists:** Proceed without task-related warning.

4. **Assess delta spec sync state**

   Check for delta specs at \`openspec/changes/<name>/specs/\`. If none exist, proceed without sync prompt.

   **If delta specs exist:**
   - Compare each delta spec with its corresponding main spec at \`openspec/specs/<capability>/spec.md\`
   - Determine what changes would be applied (adds, modifications, removals, renames)
   - Show a combined summary before prompting

   **Prompt options:**
   - If changes needed: "Sync now (recommended)", "Archive without syncing"
   - If already synced: "Archive now", "Sync anyway", "Cancel"

   If user chooses sync, use Task tool (subagent_type: "general-purpose", prompt: "Use Skill tool to invoke openspec-sync-specs for change '<name>'. Delta spec analysis: <include the analyzed delta spec summary>"). Proceed to archive regardless of choice.

5. **Perform the archive**

   Create the archive directory if it doesn't exist:
   \`\`\`bash
   mkdir -p openspec/changes/archive
   \`\`\`

   Generate target name using current date: \`YYYY-MM-DD-<change-name>\`

   **Check if target already exists:**
   - If yes: Fail with error, suggest renaming existing archive or using different date
   - If no: Move the change directory to archive

   \`\`\`bash
   mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>
   \`\`\`

6. **Display summary**

   Show archive completion summary including:
   - Change name
   - Schema that was used
   - Archive location
   - Spec sync status (synced / sync skipped / no delta specs)
   - Note about any warnings (incomplete artifacts/tasks)

**Output On Success**

\`\`\`
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** ✓ Synced to main specs

All artifacts complete. All tasks complete.
\`\`\`

**Output On Success (No Delta Specs)**

\`\`\`
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** No delta specs

All artifacts complete. All tasks complete.
\`\`\`

**Output On Success With Warnings**

\`\`\`
## Archive Complete (with warnings)

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** openspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** Sync skipped (user chose to skip)

**Warnings:**
- Archived with 2 incomplete artifacts
- Archived with 3 incomplete tasks
- Delta spec sync was skipped (user chose to skip)

Review the archive if this was not intentional.
\`\`\`

**Output On Error (Archive Exists)**

\`\`\`
## Archive Failed

**Change:** <change-name>
**Target:** openspec/changes/archive/YYYY-MM-DD-<name>/

Target archive directory already exists.

**Options:**
1. Rename the existing archive
2. Delete the existing archive if it's a duplicate
3. Wait until a different date to archive
\`\`\`

**Guardrails**
- Always prompt for change selection if not provided
- Use artifact graph (openspec status --json) for completion checking
- Don't block archive on warnings - just inform and confirm
- Preserve .openspec.yaml when moving to archive (it moves with the directory)
- Show clear summary of what happened
- If sync is requested, use the Skill tool to invoke \`openspec-sync-specs\` (agent-driven)
- If delta specs exist, always run the sync assessment and show the combined summary before prompting`
  };
}

/**
 * Template for /opsx:onboard slash command
 * Guided onboarding through the complete OpenSpec workflow
 */
export function getOpsxOnboardCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Onboard',
    description: 'Guided onboarding - walk through a complete OpenSpec workflow cycle with narration',
    category: 'Workflow',
    tags: ['workflow', 'onboarding', 'tutorial', 'learning'],
    content: getOnboardInstructions(),
  };
}

/**
 * Template for /opsx:bulk-archive slash command
 */
export function getOpsxBulkArchiveCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Bulk Archive',
    description: 'Archive multiple completed changes at once',
    category: 'Workflow',
    tags: ['workflow', 'archive', 'experimental', 'bulk'],
    content: `Archive multiple completed changes in a single operation.

This skill allows you to batch-archive changes, handling spec conflicts intelligently by checking the codebase to determine what's actually implemented.

**Input**: None required (prompts for selection)

**Steps**

1. **Get active changes**

   Run \`openspec list --json\` to get all active changes.

   If no active changes exist, inform user and stop.

2. **Prompt for change selection**

   Use **AskUserQuestion tool** with multi-select to let user choose changes:
   - Show each change with its schema
   - Include an option for "All changes"
   - Allow any number of selections (1+ works, 2+ is the typical use case)

   **IMPORTANT**: Do NOT auto-select. Always let the user choose.

3. **Batch validation - gather status for all selected changes**

   For each selected change, collect:

   a. **Artifact status** - Run \`openspec status --change "<name>" --json\`
      - Parse \`schemaName\` and \`artifacts\` list
      - Note which artifacts are \`done\` vs other states

   b. **Task completion** - Read \`openspec/changes/<name>/tasks.md\`
      - Count \`- [ ]\` (incomplete) vs \`- [x]\` (complete)
      - If no tasks file exists, note as "No tasks"

   c. **Delta specs** - Check \`openspec/changes/<name>/specs/\` directory
      - List which capability specs exist
      - For each, extract requirement names (lines matching \`### Requirement: <name>\`)

4. **Detect spec conflicts**

   Build a map of \`capability -> [changes that touch it]\`:

   \`\`\`
   auth -> [change-a, change-b]  <- CONFLICT (2+ changes)
   api  -> [change-c]            <- OK (only 1 change)
   \`\`\`

   A conflict exists when 2+ selected changes have delta specs for the same capability.

5. **Resolve conflicts agentically**

   **For each conflict**, investigate the codebase:

   a. **Read the delta specs** from each conflicting change to understand what each claims to add/modify

   b. **Search the codebase** for implementation evidence:
      - Look for code implementing requirements from each delta spec
      - Check for related files, functions, or tests

   c. **Determine resolution**:
      - If only one change is actually implemented -> sync that one's specs
      - If both implemented -> apply in chronological order (older first, newer overwrites)
      - If neither implemented -> skip spec sync, warn user

   d. **Record resolution** for each conflict:
      - Which change's specs to apply
      - In what order (if both)
      - Rationale (what was found in codebase)

6. **Show consolidated status table**

   Display a table summarizing all changes:

   \`\`\`
   | Change               | Artifacts | Tasks | Specs   | Conflicts | Status |
   |---------------------|-----------|-------|---------|-----------|--------|
   | schema-management   | Done      | 5/5   | 2 delta | None      | Ready  |
   | project-config      | Done      | 3/3   | 1 delta | None      | Ready  |
   | add-oauth           | Done      | 4/4   | 1 delta | auth (!)  | Ready* |
   | add-verify-skill    | 1 left    | 2/5   | None    | None      | Warn   |
   \`\`\`

   For conflicts, show the resolution:
   \`\`\`
   * Conflict resolution:
     - auth spec: Will apply add-oauth then add-jwt (both implemented, chronological order)
   \`\`\`

   For incomplete changes, show warnings:
   \`\`\`
   Warnings:
   - add-verify-skill: 1 incomplete artifact, 3 incomplete tasks
   \`\`\`

7. **Confirm batch operation**

   Use **AskUserQuestion tool** with a single confirmation:

   - "Archive N changes?" with options based on status
   - Options might include:
     - "Archive all N changes"
     - "Archive only N ready changes (skip incomplete)"
     - "Cancel"

   If there are incomplete changes, make clear they'll be archived with warnings.

8. **Execute archive for each confirmed change**

   Process changes in the determined order (respecting conflict resolution):

   a. **Sync specs** if delta specs exist:
      - Use the openspec-sync-specs approach (agent-driven intelligent merge)
      - For conflicts, apply in resolved order
      - Track if sync was done

   b. **Perform the archive**:
      \`\`\`bash
      mkdir -p openspec/changes/archive
      mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>
      \`\`\`

   c. **Track outcome** for each change:
      - Success: archived successfully
      - Failed: error during archive (record error)
      - Skipped: user chose not to archive (if applicable)

9. **Display summary**

   Show final results:

   \`\`\`
   ## Bulk Archive Complete

   Archived 3 changes:
   - schema-management-cli -> archive/2026-01-19-schema-management-cli/
   - project-config -> archive/2026-01-19-project-config/
   - add-oauth -> archive/2026-01-19-add-oauth/

   Skipped 1 change:
   - add-verify-skill (user chose not to archive incomplete)

   Spec sync summary:
   - 4 delta specs synced to main specs
   - 1 conflict resolved (auth: applied both in chronological order)
   \`\`\`

   If any failures:
   \`\`\`
   Failed 1 change:
   - some-change: Archive directory already exists
   \`\`\`

**Conflict Resolution Examples**

Example 1: Only one implemented
\`\`\`
Conflict: specs/auth/spec.md touched by [add-oauth, add-jwt]

Checking add-oauth:
- Delta adds "OAuth Provider Integration" requirement
- Searching codebase... found src/auth/oauth.ts implementing OAuth flow

Checking add-jwt:
- Delta adds "JWT Token Handling" requirement
- Searching codebase... no JWT implementation found

Resolution: Only add-oauth is implemented. Will sync add-oauth specs only.
\`\`\`

Example 2: Both implemented
\`\`\`
Conflict: specs/api/spec.md touched by [add-rest-api, add-graphql]

Checking add-rest-api (created 2026-01-10):
- Delta adds "REST Endpoints" requirement
- Searching codebase... found src/api/rest.ts

Checking add-graphql (created 2026-01-15):
- Delta adds "GraphQL Schema" requirement
- Searching codebase... found src/api/graphql.ts

Resolution: Both implemented. Will apply add-rest-api specs first,
then add-graphql specs (chronological order, newer takes precedence).
\`\`\`

**Output On Success**

\`\`\`
## Bulk Archive Complete

Archived N changes:
- <change-1> -> archive/YYYY-MM-DD-<change-1>/
- <change-2> -> archive/YYYY-MM-DD-<change-2>/

Spec sync summary:
- N delta specs synced to main specs
- No conflicts (or: M conflicts resolved)
\`\`\`

**Output On Partial Success**

\`\`\`
## Bulk Archive Complete (partial)

Archived N changes:
- <change-1> -> archive/YYYY-MM-DD-<change-1>/

Skipped M changes:
- <change-2> (user chose not to archive incomplete)

Failed K changes:
- <change-3>: Archive directory already exists
\`\`\`

**Output When No Changes**

\`\`\`
## No Changes to Archive

No active changes found. Use \`/opsx:new\` to create a new change.
\`\`\`

**Guardrails**
- Allow any number of changes (1+ is fine, 2+ is the typical use case)
- Always prompt for selection, never auto-select
- Detect spec conflicts early and resolve by checking codebase
- When both changes are implemented, apply specs in chronological order
- Skip spec sync only when implementation is missing (warn user)
- Show clear per-change status before confirming
- Use single confirmation for entire batch
- Track and report all outcomes (success/skip/fail)
- Preserve .openspec.yaml when moving to archive
- Archive directory target uses current date: YYYY-MM-DD-<name>
- If archive target exists, fail that change but continue with others`
  };
}

/**
 * Template for /opsx:verify slash command
 */
export function getOpsxVerifyCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Verify',
    description: 'Verify implementation matches change artifacts before archiving',
    category: 'Workflow',
    tags: ['workflow', 'verify', 'experimental'],
    content: `Verify that an implementation matches the change artifacts (specs, tasks, design).

**Input**: Optionally specify a change name after \`/opsx:verify\` (e.g., \`/opsx:verify add-auth\`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run \`openspec list --json\` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show changes that have implementation tasks (tasks artifact exists).
   Include the schema used for each change if available.
   Mark changes with incomplete tasks as "(In Progress)".

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check status to understand the schema**
   \`\`\`bash
   openspec status --change "<name>" --json
   \`\`\`
   Parse the JSON to understand:
   - \`schemaName\`: The workflow being used (e.g., "spec-driven")
   - Which artifacts exist for this change

3. **Get the change directory and load artifacts**

   \`\`\`bash
   openspec instructions apply --change "<name>" --json
   \`\`\`

   This returns the change directory and context files. Read all available artifacts from \`contextFiles\`.

4. **Initialize verification report structure**

   Create a report structure with three dimensions:
   - **Completeness**: Track tasks and spec coverage
   - **Correctness**: Track requirement implementation and scenario coverage
   - **Coherence**: Track design adherence and pattern consistency

   Each dimension can have CRITICAL, WARNING, or SUGGESTION issues.

5. **Verify Completeness**

   **Task Completion**:
   - If tasks.md exists in contextFiles, read it
   - Parse checkboxes: \`- [ ]\` (incomplete) vs \`- [x]\` (complete)
   - Count complete vs total tasks
   - If incomplete tasks exist:
     - Add CRITICAL issue for each incomplete task
     - Recommendation: "Complete task: <description>" or "Mark as done if already implemented"

   **Spec Coverage**:
   - If delta specs exist in \`openspec/changes/<name>/specs/\`:
     - Extract all requirements (marked with "### Requirement:")
     - For each requirement:
       - Search codebase for keywords related to the requirement
       - Assess if implementation likely exists
     - If requirements appear unimplemented:
       - Add CRITICAL issue: "Requirement not found: <requirement name>"
       - Recommendation: "Implement requirement X: <description>"

6. **Verify Correctness**

   **Requirement Implementation Mapping**:
   - For each requirement from delta specs:
     - Search codebase for implementation evidence
     - If found, note file paths and line ranges
     - Assess if implementation matches requirement intent
     - If divergence detected:
       - Add WARNING: "Implementation may diverge from spec: <details>"
       - Recommendation: "Review <file>:<lines> against requirement X"

   **Scenario Coverage**:
   - For each scenario in delta specs (marked with "#### Scenario:"):
     - Check if conditions are handled in code
     - Check if tests exist covering the scenario
     - If scenario appears uncovered:
       - Add WARNING: "Scenario not covered: <scenario name>"
       - Recommendation: "Add test or implementation for scenario: <description>"

7. **Verify Coherence**

   **Design Adherence**:
   - If design.md exists in contextFiles:
     - Extract key decisions (look for sections like "Decision:", "Approach:", "Architecture:")
     - Verify implementation follows those decisions
     - If contradiction detected:
       - Add WARNING: "Design decision not followed: <decision>"
       - Recommendation: "Update implementation or revise design.md to match reality"
   - If no design.md: Skip design adherence check, note "No design.md to verify against"

   **Code Pattern Consistency**:
   - Review new code for consistency with project patterns
   - Check file naming, directory structure, coding style
   - If significant deviations found:
     - Add SUGGESTION: "Code pattern deviation: <details>"
     - Recommendation: "Consider following project pattern: <example>"

8. **Generate Verification Report**

   **Summary Scorecard**:
   \`\`\`
   ## Verification Report: <change-name>

   ### Summary
   | Dimension    | Status           |
   |--------------|------------------|
   | Completeness | X/Y tasks, N reqs|
   | Correctness  | M/N reqs covered |
   | Coherence    | Followed/Issues  |
   \`\`\`

   **Issues by Priority**:

   1. **CRITICAL** (Must fix before archive):
      - Incomplete tasks
      - Missing requirement implementations
      - Each with specific, actionable recommendation

   2. **WARNING** (Should fix):
      - Spec/design divergences
      - Missing scenario coverage
      - Each with specific recommendation

   3. **SUGGESTION** (Nice to fix):
      - Pattern inconsistencies
      - Minor improvements
      - Each with specific recommendation

   **Final Assessment**:
   - If CRITICAL issues: "X critical issue(s) found. Fix before archiving."
   - If only warnings: "No critical issues. Y warning(s) to consider. Ready for archive (with noted improvements)."
   - If all clear: "All checks passed. Ready for archive."

**Verification Heuristics**

- **Completeness**: Focus on objective checklist items (checkboxes, requirements list)
- **Correctness**: Use keyword search, file path analysis, reasonable inference - don't require perfect certainty
- **Coherence**: Look for glaring inconsistencies, don't nitpick style
- **False Positives**: When uncertain, prefer SUGGESTION over WARNING, WARNING over CRITICAL
- **Actionability**: Every issue must have a specific recommendation with file/line references where applicable

**Graceful Degradation**

- If only tasks.md exists: verify task completion only, skip spec/design checks
- If tasks + specs exist: verify completeness and correctness, skip design
- If full artifacts: verify all three dimensions
- Always note which checks were skipped and why

**Output Format**

Use clear markdown with:
- Table for summary scorecard
- Grouped lists for issues (CRITICAL/WARNING/SUGGESTION)
- Code references in format: \`file.ts:123\`
- Specific, actionable recommendations
- No vague suggestions like "consider reviewing"`
  };
}
/**
 * Template for feedback skill
 * For collecting and submitting user feedback with context enrichment
 */
export function getFeedbackSkillTemplate(): SkillTemplate {
  return {
    name: 'feedback',
    description: 'Collect and submit user feedback about OpenSpec with context enrichment and anonymization.',
    instructions: `Help the user submit feedback about OpenSpec.

**Goal**: Guide the user through collecting, enriching, and submitting feedback while ensuring privacy through anonymization.

**Process**

1. **Gather context from the conversation**
   - Review recent conversation history for context
   - Identify what task was being performed
   - Note what worked well or poorly
   - Capture specific friction points or praise

2. **Draft enriched feedback**
   - Create a clear, descriptive title (single sentence, no "Feedback:" prefix needed)
   - Write a body that includes:
     - What the user was trying to do
     - What happened (good or bad)
     - Relevant context from the conversation
     - Any specific suggestions or requests

3. **Anonymize sensitive information**
   - Replace file paths with \`<path>\` or generic descriptions
   - Replace API keys, tokens, secrets with \`<redacted>\`
   - Replace company/organization names with \`<company>\`
   - Replace personal names with \`<user>\`
   - Replace specific URLs with \`<url>\` unless public/relevant
   - Keep technical details that help understand the issue

4. **Present draft for approval**
   - Show the complete draft to the user
   - Display both title and body clearly
   - Ask for explicit approval before submitting
   - Allow the user to request modifications

5. **Submit on confirmation**
   - Use the \`openspec feedback\` command to submit
   - Format: \`openspec feedback "title" --body "body content"\`
   - The command will automatically add metadata (version, platform, timestamp)

**Example Draft**

\`\`\`
Title: Error handling in artifact workflow needs improvement

Body:
I was working on creating a new change and encountered an issue with
the artifact workflow. When I tried to continue after creating the
proposal, the system didn't clearly indicate that I needed to complete
the specs first.

Suggestion: Add clearer error messages that explain dependency chains
in the artifact workflow. Something like "Cannot create design.md
because specs are not complete (0/2 done)."

Context: Using the spec-driven schema with <path>/my-project
\`\`\`

**Anonymization Examples**

Before:
\`\`\`
Working on /Users/john/mycompany/auth-service/src/oauth.ts
Failed with API key: sk_live_abc123xyz
Working at Acme Corp
\`\`\`

After:
\`\`\`
Working on <path>/oauth.ts
Failed with API key: <redacted>
Working at <company>
\`\`\`

**Guardrails**

- MUST show complete draft before submitting
- MUST ask for explicit approval
- MUST anonymize sensitive information
- ALLOW user to modify draft before submitting
- DO NOT submit without user confirmation
- DO include relevant technical context
- DO keep conversation-specific insights

**User Confirmation Required**

Always ask:
\`\`\`
Here's the feedback I've drafted:

Title: [title]

Body:
[body]

Does this look good? I can modify it if you'd like, or submit it as-is.
\`\`\`

Only proceed with submission after user confirms.`
  };
}
