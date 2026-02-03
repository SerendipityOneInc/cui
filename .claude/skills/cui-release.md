---
name: cui-release
description: CUI 项目开发、测试、发布的标准流程。当需要发布新版本、修复 bug 后发布、或进行任何代码变更提交时使用此 skill。
user_invocable: true
---

# CUI 开发发布流程

本 skill 规范 CUI 项目从开发到发布的完整流程。

## 版本命名规范

- **正式版本**: `v0.x.y-srp`（如 `v0.6.6-srp`）— 触发完整 CI + 构建 + 发布
- **补丁版本**: `v0.x.y-srp.N`（如 `v0.6.3-srp.2`）— 仅打 tag，跳过构建

## 流程步骤

### 第一步：质量检查

在提交代码前，依次运行以下检查，确保全部通过：

```bash
npm run lint        # 代码风格检查
npm run typecheck   # TypeScript 类型检查
npm run build       # 构建项目
npm test            # 运行测试
```

如果任何一步失败，必须先修复问题再继续。

### 第二步：更新版本号

在 `package.json` 中更新 `version` 字段为新版本号（不带 `v` 前缀）：

```
"version": "0.x.y-srp"
```

### 第三步：更新 CHANGELOG

编辑 `CHANGELOG.md`，需要更新两处：

1. **版本概览表格**：在文件头部的表格中插入新行（保持在表格第一行）
2. **详细变更记录**：在详细记录区域新增版本条目

变更条目按以下分类组织：
- `### Added` — 新增功能
- `### Changed` — 修改、重构
- `### Fixed` — 修复 Bug
- `### Removed` — 删除功能

格式示例：

```markdown
## 版本概览

| 版本 | 日期 | 主要变更 |
|------|------|----------|
| 0.x.y-srp | 2026-xx-xx | 简要描述 |
| ... | ... | ... |

## [0.x.y-srp] - 2026-xx-xx

### Added

- **功能名称**: 详细描述。

### Fixed

- **修复内容**: 详细描述。
```

### 第四步：提交代码

```bash
git add package.json CHANGELOG.md [其他变更文件]
git commit -m "Bump version to 0.x.y-srp"
git push
```

### 第五步：打 Tag 发布

```bash
git tag v0.x.y-srp
git push origin v0.x.y-srp
```

推送 tag 后，GitHub Actions 自动执行：
1. **quality** — lint + typecheck + build + test
2. **e2e** — 端到端测试
3. **release** — 创建 GitHub Release（附带 npm tarball）
4. **publish-npm** — 发布到 npm registry

### 第六步：确认发布

检查 GitHub Actions 运行状态：

```bash
gh run list --limit 3
```

如果发布失败，查看日志定位问题并修复后重新发布。

## 快速补丁流程

当需要紧急修复但不需要完整构建时（如仅修改 CI 配置）：

1. 使用补丁版本号：`v0.x.y-srp.N`
2. 补丁 tag 会跳过 quality + e2e + release 步骤
3. 仅在 GitHub 上创建 tag 记录

## 检查清单

发布前确认：

- [ ] `npm run lint` 通过
- [ ] `npm run typecheck` 通过
- [ ] `npm run build` 通过
- [ ] `npm test` 通过
- [ ] `package.json` 版本号已更新
- [ ] `CHANGELOG.md` 版本概览表格已更新
- [ ] `CHANGELOG.md` 详细变更记录已添加
- [ ] 代码已提交并推送
- [ ] Tag 已创建并推送
- [ ] GitHub Actions 发布成功
