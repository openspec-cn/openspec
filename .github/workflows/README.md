# Github Workflows

## 本地测试 CI

使用 [act](https://nektosact.com/) 在本地测试 GitHub Actions 工作流：

```bash
# 测试所有 PR 检查
act pull_request

# 测试特定作业
act pull_request -j nix-flake-validate

# 空运行以查看将执行的内容
act pull_request --dryrun
```

`.actrc` 文件配置 act 使用适当的 Docker 镜像。
