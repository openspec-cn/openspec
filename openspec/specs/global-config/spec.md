# global-config 规范

## 目的

本规范定义了 OpenSpec 如何解析、读取和写入用户级全局配置。它管理 `src/core/global-config.ts` 模块，该模块为存储跨项目持久存在的用户首选项、功能标志和设置提供了基础。该规范通过遵循带有特定于平台回退的 XDG 基本目录规范确保跨平台兼容性，并通过 schema 演进规则保证向前/向后兼容性。

## 需求
### 需求：全局配置存储
系统必须将全局配置存储在 `~/.config/openspec/config.json` 中，包括带有 `anonymousId` 和 `noticeSeen` 字段的遥测状态。

#### 场景：初始配置创建
- **当** 不存在全局配置文件时
- **并且** 即将发送第一个遥测事件时
- **那么** 系统创建带有遥测配置的 `~/.config/openspec/config.json`

#### 场景：遥测配置结构
- **当** 读取或写入遥测配置时
- **那么** 配置包含一个带有 `anonymousId`（字符串 UUID）和 `noticeSeen`（布尔值）字段的 `telemetry` 对象

#### 场景：配置文件格式
- **当** 存储配置时
- **那么** 系统写入可由用户读取和修改的有效 JSON

#### 场景：现有配置保留
- **当** 向现有配置文件添加遥测字段时
- **那么** 系统保留所有现有配置字段

### 需求：全局配置目录路径

系统必须按照带有特定于平台回退的 XDG 基本目录规范解析全局配置目录路径。

#### 场景：设置了 XDG_CONFIG_HOME 的 Unix/macOS
- **当** `$XDG_CONFIG_HOME` 环境变量设置为 `/custom/config` 时
- **那么** `getGlobalConfigDir()` 返回 `/custom/config/openspec`

#### 场景：未设置 XDG_CONFIG_HOME 的 Unix/macOS
- **当** `$XDG_CONFIG_HOME` 环境变量未设置时
- **并且** 平台是 Unix 或 macOS
- **那么** `getGlobalConfigDir()` 返回 `~/.config/openspec`（扩展为绝对路径）

#### 场景：Windows 平台
- **当** 平台是 Windows 时
- **并且** `%APPDATA%` 设置为 `C:\Users\User\AppData\Roaming`
- **那么** `getGlobalConfigDir()` 返回 `C:\Users\User\AppData\Roaming\openspec`

### 需求：全局配置加载

当配置文件不存在或无法解析时，系统必须使用合理的默认值从配置目录加载全局配置。

#### 场景：配置文件存在且有效
- **当** `config.json` 存在于全局配置目录中时
- **并且** 文件包含匹配配置 schema 的有效 JSON
- **那么** `getGlobalConfig()` 返回解析后的配置

#### 场景：配置文件不存在
- **当** `config.json` 不存在于全局配置目录中时
- **那么** `getGlobalConfig()` 返回默认配置
- **并且** 不创建目录或文件

#### 场景：配置文件是无效 JSON
- **当** `config.json` 存在但包含无效 JSON 时
- **那么** `getGlobalConfig()` 返回默认配置
- **并且** 将警告记录到 stderr

### 需求：全局配置保存

系统必须将全局配置保存到配置目录，如果目录不存在则创建它。

#### 场景：保存配置到新目录
- **当** 调用 `saveGlobalConfig(config)` 时
- **并且** 全局配置目录不存在
- **那么** 创建目录
- **并且** 用提供的配置写入 `config.json`

#### 场景：保存配置到现有目录
- **当** 调用 `saveGlobalConfig(config)` 时
- **并且** 全局配置目录已存在
- **那么** 写入 `config.json`（如果存在则覆盖）

### 需求：默认配置

系统必须提供默认配置，当不存在配置文件时使用该配置。

#### 场景：默认配置结构
- **当** 不存在配置文件时
- **那么** 默认配置包含一个空的 `featureFlags` 对象

### 需求：配置 Schema 演进

系统必须将加载的配置与默认值合并，以确即使加载旧配置文件时新配置字段也可用。

#### 场景：配置文件缺少新字段
- **当** `config.json` 存在且包含 `{ "featureFlags": {} }` 时
- **并且** 当前 schema 包含新字段 `defaultAiTool`
- **那么** `getGlobalConfig()` 返回 `{ featureFlags: {}, defaultAiTool: <default> }`
- **并且** 加载的值优先于两者中都存在的字段的默认值

#### 场景：配置文件有额外未知字段
- **当** `config.json` 包含不在当前 schema 中的字段时
- **那么** 未知字段保留在返回的配置中
- **并且** 不引发错误或警告
