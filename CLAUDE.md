# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Next.js 14 App Router 的中文后台管理系统 (Admin Pro)，使用 TypeScript、Tailwind CSS 4、shadcn/ui 和 framer-motion 构建。

## 技术栈速览
- 框架：Next.js 14 App Router + TypeScript
- 样式：Tailwind CSS 4、shadcn/ui (Radix)、lucide-react
- 动画/交互：framer-motion、react-grid-layout（可拖拽仪表盘）
- 数据：React Query、Zustand（全局/仪表盘布局状态）、recharts（图表）
- Mock：Mock.js（`NEXT_PUBLIC_MOCK=true` 时启用）
- 构建工具：pnpm、ESLint（simple-import-sort / unused-imports）

## 常用命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm lint         # ESLint 检查
pnpm lint:fix     # ESLint 自动修复
```

## 架构

### Provider 层级结构 (src/app/layout.tsx)
```
ThemeProvider → MockProvider → QueryProvider → AuthProvider → PermissionProvider → WebSocketProvider
```

### 核心目录结构（from `find src -maxdepth 3 -type d`）

- src/
  - app/
    - (auth)/ login, register, forgot-password, reset-password（认证分组，独立布局）
    - (dashboard)/ analytics, calendar, docs, documents, files, messages, notifications, profile, settings, users（主业务分组，共享 AdminLayout + TabBar/KeepAlive）
  - components/
    - ui/（shadcn/ui 基础组件）
    - auth/（登录注册等碎片组件）
    - layout/（AdminLayout、Header、Sidebar、TabBar、PendingOverlay、CommandMenu）
    - dashboard/（ConfigurableDashboard 可拖拽仪表盘及图表小部件）
    - data-table/（表格封装）
  - hooks/（React Query hooks，按资源拆分）
  - lib/
    - api/（服务定义、类型、client）
    - validations/（表单/数据校验 schema）
  - mock/（Mock.js 数据拦截，`NEXT_PUBLIC_MOCK=true` 启用）
  - providers/（全局 Provider 组合）
  - stores/（Zustand：auth、dashboard 布局、tabs/navigation/ui-settings 等）
  - types/（通用类型）

### 数据流模式

1. **API 请求**: `src/lib/api/services.ts` 定义服务 → `src/hooks/` 封装 React Query hooks → 页面组件使用
2. **Mock 数据**: 设置 `NEXT_PUBLIC_MOCK=true` 后，MockProvider 会拦截 fetch 请求返回模拟数据
3. **状态管理**: Zustand stores 用于认证和仪表盘布局等全局状态

### 代码规范

- ESLint 配置自动移除未使用的 imports (`unused-imports/no-unused-imports`)
- Import 语句自动排序 (`simple-import-sort`)
- 使用 `@/*` 路径别名指向 `./src/*`
- 注意避免与全局类型冲突，如使用 `Document as DocumentType` 导入

### UI 组件

- 基于 Radix UI 原语构建的 shadcn/ui 组件
- framer-motion 用于动画效果
- lucide-react 图标库
- recharts 用于图表
- react-grid-layout 用于可配置仪表盘

## 环境变量

- `NEXT_PUBLIC_MOCK=true` - 启用 Mock.js 数据拦截
- `NEXT_PUBLIC_API_URL` - API 基础 URL (默认 `/api`)
