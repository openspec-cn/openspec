# cli-spec 规范

## 目的
待定 - 由归档变更 add-interactive-show-command 创建。归档后更新目的。

## 需求
### 需求：交互式 spec show

spec show 命令必须在未提供 spec-id 时支持交互式选择。

#### 场景：show 的交互式规范选择

- **当** 执行 `openspec spec show` 不带参数时
- **那么** 显示可用规范的交互式列表
- **并且** 允许用户选择要显示的规范
- **并且** 显示所选规范的内容
- **并且** 保持所有现有的 show 选项 (--json, --requirements, --no-scenarios, -r)

#### 场景：非交互式回退保持当前行为

- **给定** stdin 不是 TTY 或提供了 `--no-interactive` 或环境变量 `OPEN_SPEC_INTERACTIVE=0`
- **当** 执行 `openspec spec show` 不带 spec-id 时
- **那么** 不进行交互式提示
- **并且** 打印丢失 spec-id 的现有错误消息
- **并且** 设置非零退出代码

### 需求：Spec 命令

系统必须提供一个 `spec` 命令，带有用于显示、列出和验证规范的子命令。

#### 场景：将规范显示为 JSON

- **当** 执行 `openspec spec show init --json`
- **那么** 解析 markdown 规范文件
- **并且** 分层提取标题和内容
- **并且** 输出有效的 JSON 到 stdout

#### 场景：列出所有规范

- **当** 执行 `openspec spec list`
- **那么** 扫描 openspec/specs 目录
- **并且** 返回所有可用功能的列表
- **并且** 支持带 `--json` 标志的 JSON 输出

#### 场景：过滤规范内容

- **当** 执行 `openspec spec show init --requirements`
- **那么** 仅显示需求名称和 SHALL 语句
- **并且** 排除场景内容

#### 场景：验证规范结构

- **当** 执行 `openspec spec validate init`
- **那么** 解析规范文件
- **并且** 针对 Zod schema 进行验证
- **并且** 报告任何结构问题

### 需求：JSON Schema 定义

系统必须定义准确表示规范结构以进行运行时验证的 Zod schema。

#### 场景：Schema 验证

- **当** 将规范解析为 JSON 时
- **那么** 使用 Zod schema 验证结构
- **并且** 确保存在所有必填字段
- **并且** 为验证失败提供清晰的错误消息

### 需求：交互式规范验证

spec validate 命令必须在未提供 spec-id 时支持交互式选择。

#### 场景：验证的交互式规范选择

- **当** 执行 `openspec spec validate` 不带参数时
- **那么** 显示可用规范的交互式列表
- **并且** 允许用户选择要验证的规范
- **并且** 验证选定的规范
- **并且** 保持所有现有的验证选项 (--strict, --json)

#### 场景：非交互式回退保持当前行为

- **给定** stdin 不是 TTY 或提供了 `--no-interactive` 或环境变量 `OPEN_SPEC_INTERACTIVE=0`
- **当** 执行 `openspec spec validate` 不带 spec-id 时
- **那么** 不进行交互式提示
- **并且** 打印丢失 spec-id 的现有错误消息
- **并且** 设置非零退出代码
