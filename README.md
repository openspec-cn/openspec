<p align="center">
  <a href="https://github.com/openspec-cn/openspec">
    <picture>
      <source srcset="assets/openspec_bg.png">
      <img src="assets/openspec_bg.png" alt="OpenSpec logo">
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://github.com/openspec-cn/openspec/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/openspec-cn/openspec/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
  <a href="https://discord.gg/YctCnvvshC"><img alt="Discord" src="https://img.shields.io/discord/1411657095639601154?style=flat-square&logo=discord&logoColor=white&label=Discord&suffix=%20online" /></a>
</p>

<details>
<summary><strong>最受欢迎的规范框架。</strong></summary>

[![Stars](https://img.shields.io/github/stars/openspec-cn/openspec?style=flat-square&label=Stars)](https://github.com/openspec-cn/openspec/stargazers)
[![Contributors](https://img.shields.io/github/contributors/openspec-cn/openspec?style=flat-square&label=Contributors)](https://github.com/openspec-cn/openspec/graphs/contributors)

</details>
<p></p>
我们的理念：

```text
→ 流畅而非僵化
→ 迭代而非瀑布
→ 简单而非复杂
→ 兼顾老项目与新项目
→ 从个人项目到企业级扩展
```

> [!TIP]
> **新工作流现已可用！** 我们使用全新的产物引导工作流重建了 OpenSpec。
>
> 运行 `/opsx:onboard` 开始使用。 → [了解更多](docs/opsx.md)

<p align="center">
  在 X 上关注 <a href="https://x.com/0xTab">@0xTab</a> 获取更新 · 加入 <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> 获取帮助和答疑。
</p>

### 团队

在团队中使用 OpenSpec？[发送邮件](mailto:teams@openspec.dev) 获取我们的 Slack 频道访问权限。

<!-- TODO: Add GIF demo of /opsx:new → /opsx:archive workflow -->

## 实战演示

```text
You: /opsx:new add-dark-mode
AI:  已创建 openspec/changes/add-dark-mode/
     准备创建: proposal

You: /opsx:ff   # "快进" - 生成所有规划文档
AI:  ✓ proposal.md — 为什么做这个，变更了什么
     ✓ specs/       — 需求和场景
     ✓ design.md    — 技术方案
     ✓ tasks.md     — 实施清单
     准备实施！

You: /opsx:apply
AI:  正在实施任务...
     ✓ 1.1 添加主题上下文提供者
     ✓ 1.2 创建切换组件
     ✓ 2.1 添加 CSS 变量
     ✓ 2.2 连接 localStorage
     所有任务完成！

You: /opsx:archive
AI:  已归档至 openspec/changes/archive/2025-01-23-add-dark-mode/
     规范已更新。准备好进行下一个特性开发。
```

<details>
<summary><strong>OpenSpec 仪表盘</strong></summary>

<p align="center">
  <img src="assets/openspec_dashboard.png" alt="OpenSpec 仪表盘预览" width="90%">
</p>

</details>

## 快速开始

**需要 Node.js 20.19.0 或更高版本。**

全局安装 OpenSpec：

```bash
npm install -g openspec-cn/openspec
```

然后导航到你的项目目录并初始化：

```bash
cd your-project
openspec init
```

现在告诉你的 AI：`/opsx:new <你想构建什么>`

> [!NOTE]
> 不确定是否支持你的工具？[查看完整列表](docs/supported-tools.md) – 我们支持 20 多种工具并持续增加。
>
> 也支持 pnpm, yarn, bun, 和 nix。[查看安装选项](docs/installation.md)。

## 文档

→ **[快速开始](docs/getting-started.md)**: 第一步<br>
→ **[工作流](docs/workflows.md)**: 组合与模式<br>
→ **[命令](docs/commands.md)**: 斜杠命令与技能<br>
→ **[CLI](docs/cli.md)**: 终端参考<br>
→ **[支持的工具](docs/supported-tools.md)**: 工具集成与安装路径<br>
→ **[概念](docs/concepts.md)**: 系统如何协同工作<br>
→ **[多语言](docs/multi-language.md)**: 多语言支持<br>
→ **[自定义](docs/customization.md)**: 定制你的体验

## 为什么选择 OpenSpec？

AI 编码助手很强大，但当需求仅存在于聊天记录中时，它们是不可预测的。OpenSpec 增加了一个轻量级的规范层，让你在编写任何代码之前就构建内容达成一致。

- **构建前达成一致** — 人类和 AI 在代码编写前对规范对齐
- **保持有序** — 每个变更都有自己的文件夹，包含提案、规范、设计和任务
- **工作流畅** — 随时更新任何产物，没有僵化的阶段门控
- **使用你的工具** — 通过斜杠命令与 20+ AI 助手配合工作

### 对比

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — 详尽但沉重。僵化的阶段门控，大量的 Markdown，Python 设置。OpenSpec 更轻量，让你自由迭代。

**vs. [Kiro](https://kiro.dev)** (AWS) — 强大但你被锁定在他们的 IDE 中且仅限于 Claude 模型。OpenSpec 适用于你已经在使用的工具。

**vs. 什么都不用** — 没有规范的 AI 编码意味着模糊的提示和不可预测的结果。OpenSpec 带来了可预测性，而无需繁琐的仪式。

## 更新 OpenSpec

**升级包**

```bash
npm install -g openspec-cn/openspec
```

**刷新 Agent 指令**

在每个项目中运行此命令以重新生成 AI 指导并确保最新的斜杠命令处于活动状态：

```bash
openspec update
```

## 使用说明

**模型选择**：OpenSpec 在高推理能力的模型下表现最佳。我们推荐使用 Opus 4.5 和 GPT 5.2 进行规划和实施。

**上下文卫生**：OpenSpec 受益于干净的上下文窗口。在开始实施前清除上下文，并在整个会话中保持良好的上下文卫生。

## 贡献

**小修补** — Bug 修复、拼写更正和小的改进可以直接提交 PR。

**较大变更** — 对于新功能、重大的重构或架构变更，请先提交 OpenSpec 变更提案，以便我们在实施开始前对齐意图和目标。

撰写提案时，请牢记 OpenSpec 哲学：我们服务于跨不同编码 Agent、模型和用例的广泛用户。变更应适合所有人。

**欢迎 AI 生成的代码** — 只要经过测试和验证。包含 AI 生成代码的 PR 应提及使用的编码 Agent 和模型（例如，"Generated with Claude Code using claude-opus-4-5-20251101"）。

### 开发

- 安装依赖：`pnpm install`
- 构建：`pnpm run build`
- 测试：`pnpm test`
- 本地开发 CLI：`pnpm run dev` 或 `pnpm run dev:cli`
- 常规提交（单行）：`type(scope): subject`

## 其他

<details>
<summary><strong>遥测</strong></summary>

OpenSpec 收集匿名的使用统计信息。

我们仅收集命令名称和版本以了解使用模式。不收集参数、路径、内容或 PII。在 CI 中自动禁用。

**退出：** `export OPENSPEC_TELEMETRY=0` 或 `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>维护者与顾问</strong></summary>

查看 [MAINTAINERS.md](MAINTAINERS.md) 获取帮助指导项目的核心维护者和顾问列表。

</details>

## 致谢与声明

本项目是 [OpenSpec](https://github.com/Fission-AI/OpenSpec) 的中文本地化版本。

- **致谢**：衷心感谢 Fission AI 团队及 OpenSpec 开源社区创造了如此优秀的工具。
- **目的**：本仓库旨在降低中国开发者的使用门槛，并验证和优化中文 LLM 模型在规范驱动开发中的表现。
- **数据收集**：为了更好地服务中国开发者，我们后续将遥测数据地址更改为中国地址，用于收集的数据仅用于产品改进，并会定期同步回原项目以贡献社区，当前阶段仍然沿用原有项目遥测地址。
- **版权声明**：OpenSpec 的原始创意、架构设计及核心代码版权归原作者及团队所有。本项目仅做本地化翻译及适配工作。
- **侵权处理**：如果本项目有任何侵犯原作者权益的内容，请联系我们进行删除。

## 许可证

MIT
