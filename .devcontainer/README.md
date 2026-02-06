# Dev Container 设置

此目录包含 OpenSpec 开发的 VS Code Dev Container 配置。

## 包含内容

- **Node.js 20 LTS** (>=20.19.0) - TypeScript/JavaScript 运行时
- **pnpm** - 快速、节省磁盘空间的包管理器
- **Git + GitHub CLI** - 版本控制工具
- **VS Code 扩展**:
  - ESLint & Prettier 用于代码质量
  - Vitest Explorer 用于运行测试
  - GitLens 用于增强 Git 集成
  - Error Lens 用于内联错误高亮
  - Code Spell Checker
  - Path IntelliSense

## 如何使用

### 首次设置

1. **安装先决条件** (在本地机器上):
   - [VS Code](https://code.visualstudio.com/)
   - [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - [Dev Containers 扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. **在容器中打开**:
   - 在 VS Code 中打开此项目
   - 你会看到通知："文件夹包含 Dev Container 配置文件"
   - 点击 "在容器中重新打开 (Reopen in Container)"

   或者

   - 打开命令面板 (`Cmd/Ctrl+Shift+P`)
   - 输入 "Dev Containers: Reopen in Container"
   - 按回车

3. **等待设置完成**:
   - 容器将构建（首次需要几分钟）
   - `pnpm install` 通过 `postCreateCommand` 自动运行
   - 所有扩展自动安装

### 日常开发

设置完成后，容器会保留你的开发环境：

```bash
# 运行开发构建
pnpm run dev

# 运行开发 CLI
pnpm run dev:cli

# 运行测试
pnpm test

# 运行测试（监视模式）
pnpm test:watch

# 构建项目
pnpm run build
```

### SSH 密钥

你的 SSH 密钥从 `~/.ssh` 以只读方式挂载，因此 Git 操作可以与 GitHub/GitLab 无缝配合。

### 重建容器

如果你修改了 `.devcontainer/devcontainer.json`：
- 命令面板 → "Dev Containers: Rebuild Container"

## 优势

- 无需在本地机器上安装 Node.js 或 pnpm
- 团队成员之间保持一致的开发环境
- 与机器上的其他 Node.js 项目隔离
- 所有依赖和工具都容器化
- 新开发者易于上手

## 故障排除

**容器无法构建：**
- 确保 Docker Desktop 正在运行
- 检查 Docker 是否分配了足够的内存（推荐 4GB+）

**扩展未显示：**
- 重建容器："Dev Containers: Rebuild Container"

**权限问题：**
- 容器以 `node` 用户（非 root）运行
- 容器中创建的文件归该用户所有
