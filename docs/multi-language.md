# 多语言指南 (Multi-Language Guide)

配置 OpenSpec 以生成除英语以外的其他语言的工件。

## 快速设置

在你的 `openspec/config.yaml` 中添加语言指令：

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  # Your other project context below...
  Tech stack: TypeScript, React, Node.js
```

就是这样。所有生成的工件现在都将是葡萄牙语的。

## 语言示例

### 葡萄牙语 (巴西)

```yaml
context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.
```

### 西班牙语

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### 中文 (简体)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### 日语

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### 法语

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### 德语

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## 技巧

### 处理技术术语

决定如何处理技术术语：

```yaml
context: |
  Language: Japanese
  Write in Japanese, but:
  - Keep technical terms like "API", "REST", "GraphQL" in English
  - Code examples and file paths remain in English
```

### 与其他上下文结合

语言设置与你的其他项目上下文一起工作：

```yaml
schema: spec-driven

context: |
  Language: Portuguese (pt-BR)
  All artifacts must be written in Brazilian Portuguese.

  Tech stack: TypeScript, React 18, Node.js 20
  Database: PostgreSQL with Prisma ORM
```

## 验证

要验证你的语言配置是否工作：

```bash
# 检查指令 - 应该显示你的语言上下文
openspec instructions proposal --change my-change

# 输出将包含你的语言上下文
```

## 相关文档

- [定制化指南](./customization.md) - 项目配置选项
- [工作流指南](./workflows.md) - 完整工作流文档
