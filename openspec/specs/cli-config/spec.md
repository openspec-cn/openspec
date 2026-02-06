# cli-config 规范

## 目的
提供一个用户友好的 CLI 界面，用于查看和修改全局 OpenSpec 配置设置，无需手动编辑 JSON 文件。

## 需求
### 需求：命令结构

config 命令必须提供用于所有配置操作的子命令。

#### 场景：可用子命令

- **当** 用户执行 `openspec config --help`
- **那么** 显示可用子命令：
  - `path` - 显示配置文件位置
  - `list` - 显示所有当前设置
  - `get <key>` - 获取特定值
  - `set <key> <value>` - 设置值
  - `unset <key>` - 移除键（恢复默认值）
  - `reset` - 重置配置为默认值
  - `edit` - 在编辑器中打开配置

### 需求：配置路径

config 命令必须显示配置文件位置。

#### 场景：显示配置路径

- **当** 用户执行 `openspec config path`
- **那么** 打印配置文件的绝对路径
- **并且** 以代码 0 退出

### 需求：配置列表

config 命令必须显示所有当前配置值。

#### 场景：以人类可读格式列出配置

- **当** 用户执行 `openspec config list`
- **那么** 以类 YAML 格式显示所有配置值
- **并且** 显示带缩进的嵌套对象

#### 场景：以 JSON 格式列出配置

- **当** 用户执行 `openspec config list --json`
- **那么** 输出完整配置为有效 JSON
- **并且** 仅输出 JSON（无附加文本）

### 需求：获取配置

config 命令必须检索特定配置值。

#### 场景：获取顶级键

- **当** 用户执行 `openspec config get <key>` 且带有有效的顶级键
- **那么** 仅打印原始值（无标签或格式化）
- **并且** 以代码 0 退出

#### 场景：使用点符号获取嵌套键

- **当** 用户执行 `openspec config get featureFlags.someFlag`
- **那么** 使用点符号遍历嵌套结构
- **并且** 打印该路径处的值

#### 场景：获取不存在的键

- **当** 用户执行 `openspec config get <key>` 且键不存在
- **那么** 不打印任何内容（空输出）
- **并且** 以代码 1 退出

#### 场景：获取对象值

- **当** 用户执行 `openspec config get <key>` 且值为对象
- **那么** 将对象作为 JSON 打印

### 需求：设置配置

config 命令必须设置配置值并自动进行类型强制转换。

#### 场景：设置字符串值

- **当** 用户执行 `openspec config set <key> <value>`
- **并且** 值不匹配布尔或数字模式
- **那么** 将值存储为字符串
- **并且** 显示确认消息

#### 场景：设置布尔值

- **当** 用户执行 `openspec config set <key> true` 或 `openspec config set <key> false`
- **那么** 将值存储为布尔值（而非字符串）
- **并且** 显示确认消息

#### 场景：设置数值

- **当** 用户执行 `openspec config set <key> <value>`
- **并且** 值为有效数字（整数或浮点数）
- **那么** 将值存储为数字（而非字符串）

#### 场景：使用 --string 标志强制字符串

- **当** 用户执行 `openspec config set <key> <value> --string`
- **那么** 将值存储为字符串，无论内容如何
- **并且** 这允许将字面量 "true" 或 "123" 存储为字符串

#### 场景：设置嵌套键

- **当** 用户执行 `openspec config set featureFlags.newFlag true`
- **那么** 如果中间对象不存在，则创建它们
- **并且** 在嵌套路径处设置值

### 需求：取消设置配置

config 命令必须移除配置覆盖。

#### 场景：取消设置现有键

- **当** 用户执行 `openspec config unset <key>`
- **并且** 键存在于配置中
- **那么** 从配置文件中移除该键
- **并且** 值恢复为其默认值
- **并且** 显示确认消息

#### 场景：取消设置不存在的键

- **当** 用户执行 `openspec config unset <key>`
- **并且** 键不存在于配置中
- **那么** 显示指示键未设置的消息
- **并且** 以代码 0 退出

### 需求：重置配置

config 命令必须将配置重置为默认值。

#### 场景：带确认的全部重置

- **当** 用户执行 `openspec config reset --all`
- **那么** 在继续之前提示确认
- **并且** 如果确认，删除配置文件或重置为默认值
- **并且** 显示确认消息

#### 场景：使用 -y 标志全部重置

- **当** 用户执行 `openspec config reset --all -y`
- **那么** 无需提示确认直接重置

#### 场景：无 --all 标志重置

- **当** 用户执行 `openspec config reset` 但未带 `--all`
- **那么** 显示错误指示需要 `--all`
- **并且** 以代码 1 退出

### 需求：编辑配置

config 命令必须在用户编辑器中打开配置文件。

#### 场景：成功打开编辑器

- **当** 用户执行 `openspec config edit`
- **并且** 设置了 `$EDITOR` 或 `$VISUAL` 环境变量
- **那么** 在该编辑器中打开配置文件
- **并且** 如果配置文件不存在，则创建带有默认值的配置文件
- **并且** 等待编辑器关闭后返回

#### 场景：未配置编辑器

- **当** 用户执行 `openspec config edit`
- **并且** `$EDITOR` 和 `$VISUAL` 均未设置
- **那么** 显示错误消息建议设置 `$EDITOR`
- **并且** 以代码 1 退出

### 需求：键命名约定

config 命令必须使用与 JSON 结构匹配的 camelCase 键。

#### 场景：键匹配 JSON 结构

- **当** 通过 CLI 访问配置键
- **那么** 使用与实际 JSON 属性名称匹配的 camelCase
- **并且** 支持嵌套访问的点符号（例如 `featureFlags.someFlag`）

### 需求：Schema 验证

config 命令必须使用 zod 根据配置 schema 验证配置写入，同时对于 `config set` 拒绝未知键，除非明确覆盖。

#### 场景：默认拒绝未知键

- **当** 用户执行 `openspec config set someFutureKey 123`
- **那么** 显示描述性错误消息指示键无效
- **并且** 不修改配置文件
- **并且** 以代码 1 退出

#### 场景：使用覆盖接受未知键

- **当** 用户执行 `openspec config set someFutureKey 123 --allow-unknown`
- **那么** 值成功保存
- **并且** 以代码 0 退出

#### 场景：无效功能标志值被拒绝

- **当** 用户执行 `openspec config set featureFlags.someFlag notABoolean`
- **那么** 显示描述性错误消息
- **并且** 不修改配置文件
- **并且** 以代码 1 退出

### 需求：保留 Scope 标志

config 命令必须保留 `--scope` 标志以供未来扩展。

#### 场景：Scope 标志默认为全局

- **当** 用户执行任何不带 `--scope` 的 config 命令
- **那么** 对全局配置进行操作（默认行为）

#### 场景：项目范围尚未实现

- **当** 用户执行 `openspec config --scope project <subcommand>`
- **那么** 显示错误消息："Project-local config is not yet implemented"（项目本地配置尚未实现）
- **并且** 以代码 1 退出
