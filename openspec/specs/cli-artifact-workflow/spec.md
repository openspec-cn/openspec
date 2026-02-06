# cli-artifact-workflow 规范 (cli-artifact-workflow Specification)

## 目的
待定 - 由归档变更 add-artifact-workflow-cli 创建。归档后更新目的。

## 需求

### 需求：状态命令 (Status Command)

系统必须显示变更的工件完成状态，包括已搭建（空）的变更。

> **修复 Bug**：以前通过 `getActiveChangeIds()` 要求 `proposal.md` 必须存在。

#### 场景：显示所有状态

- **当** 用户运行 `openspec status --change <id>` 时
- **那么** 系统显示每个工件及其状态指示器：
  - `[x]` 表示已完成的工件
  - `[ ]` 表示就绪的工件
  - `[-]` 表示受阻的工件（列出缺失的依赖）

#### 场景：状态显示完成摘要

- **当** 用户运行 `openspec status --change <id>` 时
- **那么** 输出包括完成百分比和计数（例如，"2/4 artifacts complete"）

#### 场景：状态 JSON 输出

- **当** 用户运行 `openspec status --change <id> --json` 时
- **那么** 系统输出包含 changeName, schemaName, isComplete 和 artifacts 数组的 JSON

#### 场景：状态 JSON 包含 apply 需求

- **当** 用户运行 `openspec status --change <id> --json` 时
- **那么** 系统输出包含以下内容的 JSON：
  - `changeName`, `schemaName`, `isComplete`, `artifacts` 数组
  - `applyRequires`: apply 阶段所需的工件 ID 数组

#### 场景：已搭建变更的状态

- **当** 用户在没有工件的变更上运行 `openspec status --change <id>` 时
- **那么** 系统显示所有工件及其状态
- **且** 根工件（无依赖）显示为就绪 `[ ]`
- **且** 依赖工件显示为受阻 `[-]`

#### 场景：缺失变更参数

- **当** 用户运行不带 `--change` 的 `openspec status` 时
- **那么** 系统显示包含可用变更列表的错误
- **且** 包括已搭建的变更（没有 proposal.md 的目录）

#### 场景：未知变更

- **当** 用户运行 `openspec status --change unknown-id`
- **且** 目录 `openspec/changes/unknown-id/` 不存在
- **那么** 系统显示列出所有可用变更目录的错误

### 需求：指令命令 (Instructions Command)

系统必须输出用于创建工件的丰富指令，包括针对已搭建的变更。

#### 场景：显示丰富指令

- **当** 用户运行 `openspec instructions <artifact> --change <id>` 时
- **那么** 系统输出：
  - 工件元数据（ID、输出路径、描述）
  - 模板内容
  - 依赖状态（完成/缺失）
  - 解锁的工件（完成后可用的内容）

#### 场景：指令 JSON 输出

- **当** 用户运行 `openspec instructions <artifact> --change <id> --json` 时
- **那么** 系统输出符合 ArtifactInstructions 接口的 JSON

#### 场景：未知工件

- **当** 用户运行 `openspec instructions unknown-artifact --change <id>` 时
- **那么** 系统显示列出模式的有效工件 ID 的错误

#### 场景：具有未满足依赖的工件

- **当** 用户请求受阻工件的指令时
- **那么** 系统显示指令并带有关于缺失依赖的警告

#### 场景：已搭建变更的指令

- **当** 用户在已搭建变更上运行 `openspec instructions proposal --change <id>` 时
- **那么** 系统输出用于创建 proposal 的模板和元数据
- **且** 不要求任何工件已经存在

### 需求：模板命令 (Templates Command)

系统必须显示模式中所有工件的已解析模板路径。

#### 场景：列出默认模式的模板路径
- **当** 用户运行 `openspec templates` 时
- **那么** 系统显示每个工件及其使用默认模式解析的模板路径

#### 场景：列出自定义模式的模板路径
- **当** 用户运行 `openspec templates --schema tdd` 时
- **那么** 系统显示指定模式的模板路径

#### 场景：模板 JSON 输出
- **当** 用户运行 `openspec templates --json` 时
- **那么** 系统输出将工件 ID 映射到模板路径的 JSON

#### 场景：模板解析源
- **当** 显示模板路径时
- **那么** 系统指示每个模板是来自用户覆盖还是包内置

### 需求：新变更命令 (New Change Command)

系统必须创建带有验证的新变更目录。

#### 场景：创建有效变更
- **当** 用户运行 `openspec new change add-feature` 时
- **那么** 系统创建 `openspec/changes/add-feature/` 目录

#### 场景：无效变更名称
- **当** 用户运行 `openspec new change "Add Feature"` 使用无效名称时
- **那么** 系统显示带有指导的验证错误

#### 场景：重复变更名称
- **当** 用户为现有变更运行 `openspec new change existing-change` 时
- **那么** 系统显示指示变更已存在的错误

#### 场景：创建带描述的变更
- **当** 用户运行 `openspec new change add-feature --description "Add new feature"` 时
- **那么** 系统创建变更目录并在 README.md 中包含描述

### 需求：模式选择 (Schema Selection)

系统必须支持工作流命令的自定义模式选择。

#### 场景：默认模式
- **当** 用户运行不带 `--schema` 的工作流命令时
- **那么** 系统使用 "spec-driven" 模式

#### 场景：自定义模式
- **当** 用户运行 `openspec status --change <id> --schema tdd` 时
- **那么** 系统使用指定模式进行工件图处理

#### 场景：未知模式
- **当** 用户指定未知模式时
- **那么** 系统显示列出可用模式的错误

### 需求：输出格式化 (Output Formatting)

系统必须提供一致的输出格式。

#### 场景：彩色输出
- **当** 终端支持颜色时
- **那么** 状态指示器使用颜色：绿色（完成）、黄色（就绪）、红色（受阻）

#### 场景：无颜色输出
- **当** 使用 `--no-color` 标志或设置了 NO_COLOR 环境变量时
- **那么** 输出使用不带 ANSI 颜色的纯文本指示器

#### 场景：进度指示
- **当** 加载变更状态需要时间时
- **那么** 系统在加载期间显示旋转指示器

### 需求：实验性隔离 (Experimental Isolation)

系统必须隔离实现工件工作流命令以便于移除。

#### 场景：单文件实现
- **当** 实现工件工作流功能时
- **那么** 所有命令都在 `src/commands/artifact-workflow.ts` 中

#### 场景：帮助文本标记
- **当** 用户对任何工件工作流命令运行 `--help` 时
- **那么** 帮助文本指示该命令是实验性的

### 需求：模式应用块 (Schema Apply Block)

系统必须支持模式定义中的 `apply` 块，该块控制实施何时以及如何开始。

#### 场景：带有 apply 块的模式

- **当** 模式定义了 `apply` 块时
- **那么** 系统使用 `apply.requires` 来确定 apply 之前必须存在哪些工件
- **且** 使用 `apply.tracks` 来识别用于进度跟踪的文件（如果没有则为 null）
- **且** 使用 `apply.instruction` 为代理显示指导

#### 场景：没有 apply 块的模式

- **当** 模式没有 `apply` 块时
- **那么** 系统要求在 apply 可用之前所有工件都必须存在
- **且** 使用默认指令："All artifacts complete. Proceed with implementation."

### 需求：应用指令命令 (Apply Instructions Command)

系统必须通过 `openspec instructions apply` 生成感知模式的应用指令。

#### 场景：生成应用指令

- **当** 用户运行 `openspec instructions apply --change <id>`
- **且** 所有必需的工件（根据模式的 `apply.requires`）都存在
- **那么** 系统输出：
  - 来自所有现有工件的上下文文件
  - 模式特定的指令文本
  - 进度跟踪文件路径（如果设置了 `apply.tracks`）

#### 场景：应用受阻于缺失工件

- **当** 用户运行 `openspec instructions apply --change <id>`
- **且** 必需的工件缺失
- **那么** 系统指示应用受阻
- **且** 列出必须先创建哪些工件

#### 场景：应用指令 JSON 输出

- **当** 用户运行 `openspec instructions apply --change <id> --json`
- **那么** 系统输出包含以下内容的 JSON：
  - `contextFiles`: 现有工件路径数组
  - `instruction`: 应用指令文本
  - `tracks`: 进度文件路径或 null
  - `applyRequires`: 必需工件 ID 列表

## 移除的需求 (REMOVED Requirements)

### 需求：Next 命令

**原因**：与 Status 命令冗余 - `openspec status` 已经显示了哪些工件是就绪的（status: "ready"）vs 受阻 vs 完成。

**迁移**：使用 `openspec status --change <id> --json` 并过滤 `status: "ready"` 的工件以查找接下来可以创建的工件。
