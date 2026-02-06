# 变更创建规范 (change-creation Specification)

## 目的
提供用于以编程方式创建和验证 OpenSpec 变更目录的实用程序。

## 需求

### 需求：变更创建
系统必须提供一个函数来以编程方式创建新的变更目录。

#### 场景：创建变更
- **当** 调用 `createChange(projectRoot, 'add-auth')` 时
- **那么** 系统创建 `openspec/changes/add-auth/` 目录

#### 场景：拒绝重复变更
- **当** 调用 `createChange(projectRoot, 'add-auth')` 且 `openspec/changes/add-auth/` 已存在时
- **那么** 系统抛出一个错误，指出变更已存在

#### 场景：如果需要则创建父目录
- **当** 调用 `createChange(projectRoot, 'add-auth')` 且 `openspec/changes/` 不存在时
- **那么** 系统创建包含父目录的完整路径

#### 场景：拒绝无效的变更名称
- **当** 使用无效名称调用 `createChange(projectRoot, 'Add Auth')` 时
- **那么** 系统抛出一个验证错误

### 需求：变更名称验证
系统必须验证变更名称遵循 kebab-case (短横线命名) 约定。

#### 场景：接受有效的 kebab-case 名称
- **当** 验证像 `add-user-auth` 这样的变更名称时
- **那么** 验证返回 `{ valid: true }`

#### 场景：接受数字后缀
- **当** 验证像 `add-feature-2` 这样的变更名称时
- **那么** 验证返回 `{ valid: true }`

#### 场景：接受单个单词
- **当** 验证像 `refactor` 这样的变更名称时
- **那么** 验证返回 `{ valid: true }`

#### 场景：拒绝大写字符
- **当** 验证像 `Add-Auth` 这样的变更名称时
- **那么** 验证返回 `{ valid: false, error: "..." }`

#### 场景：拒绝空格
- **当** 验证像 `add auth` 这样的变更名称时
- **那么** 验证返回 `{ valid: false, error: "..." }`

#### 场景：拒绝下划线
- **当** 验证像 `add_auth` 这样的变更名称时
- **那么** 验证返回 `{ valid: false, error: "..." }`

#### 场景：拒绝特殊字符
- **当** 验证像 `add-auth!` 这样的变更名称时
- **那么** 验证返回 `{ valid: false, error: "..." }`

#### 场景：拒绝前导连字符
- **当** 验证像 `-add-auth` 这样的变更名称时
- **那么** 验证返回 `{ valid: false, error: "..." }`

#### 场景：拒绝尾随连字符
- **当** 验证像 `add-auth-` 这样的变更名称时
- **那么** 验证返回 `{ valid: false, error: "..." }`

#### 场景：拒绝连续连字符
- **当** 验证像 `add--auth` 这样的变更名称时
- **那么** 验证返回 `{ valid: false, error: "..." }`
