# 安装 (Installation)

## 前置条件

- **Node.js 20.19.0 或更高版本** — 检查你的版本：`node --version`

## 包管理器

### npm

```bash
npm install -g openspec-cn/openspec
```

### pnpm

```bash
pnpm add -g openspec-cn/openspec
```

### yarn

```bash
yarn global add openspec-cn/openspec
```

### bun

```bash
bun add -g openspec-cn/openspec
```

## Nix

无需安装直接运行 OpenSpec：

```bash
nix run github:openspec-cn/openspec -- init
```

或者安装到你的 profile：

```bash
nix profile install github:openspec-cn/openspec
```

或者添加到 `flake.nix` 中的开发环境：

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    openspec.url = "github:openspec-cn/openspec";
  };

  outputs = { nixpkgs, openspec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ openspec.packages.x86_64-linux.default ];
    };
  };
}
```

## 验证安装

```bash
openspec --version
```

## 下一步

安装后，在你的项目中初始化 OpenSpec：

```bash
cd your-project
openspec init
```

查看 [快速开始](getting-started.md) 获取完整流程。
