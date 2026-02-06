# OpenSpec 项目概览 (OpenSpec Project Overview)

一个最小化的 CLI 工具，帮助开发者设置 OpenSpec 文件结构并保持 AI 指令更新。AI 工具本身通过直接处理 markdown 文件来处理所有的变更管理复杂性。

## 技术栈
- 语言: TypeScript
- 运行时: Node.js (≥20.19.0, ESM modules)
- 包管理器: pnpm
- CLI 框架: Commander.js
- 用户交互: @inquirer/prompts
- 分发: npm package

## 项目结构
```
src/
├── cli/        # CLI 命令实现
├── core/       # 核心 OpenSpec 逻辑 (模板, 结构)
└── utils/      # 共享实用程序 (文件操作, 回滚)

dist/           # 编译输出 (gitignored)
```

## 约定
- 启用 TypeScript 严格模式
- 对所有异步操作使用 async/await
- 最小依赖原则
- CLI、核心逻辑和实用程序清晰分离
- 对 AI 友好的代码，使用描述性名称

## 错误处理
- 让错误冒泡到 CLI 级别以获得一致的用户消息
- 使用带有描述性消息的原生 Error 类型
- 以适当的代码退出：0 (成功), 1 (一般错误), 2 (误用)
- 实用程序函数中没有 try-catch，在命令级别处理

## 日志记录
- 直接使用 console 方法（无日志库）
- console.log() 用于正常输出
- console.error() 用于错误（输出到 stderr）
- 初始没有详细/调试模式（保持简单）

## 测试策略
- 开发期间通过 `pnpm link` 进行手动测试
- 仅对关键路径（init, help 命令）进行冒烟测试
- 初始没有单元测试 - 当复杂性增加时添加
- 测试命令：`pnpm test:smoke` (添加后)

## 开发工作流
- 使用 pnpm 进行所有包管理
- 运行 `pnpm run build` 编译 TypeScript
- 运行 `pnpm run dev` 进行开发模式
- 使用 `pnpm link` 本地测试
- 遵循 OpenSpec 自己的变更驱动开发流程
