# 更新日志 (Changelog)

本文件记录项目的所有显著变更，格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 工程化优化批次（2026-06）

本批次通过 10 项渐进式优化，将项目从"教程级 Demo"提升至"简历级工程项目"，所有改动均保证不影响现有功能。

#### 新增

- **多环境配置**：`.env.development` / `.env.production` 环境变量注入，`baseURL` 与 `base` 路径支持环境切换
- **Vite 构建优化**：`manualChunks` 拆分 5 大 vendor 包（vue/element/gsap/quill/axios），入口文件 212KB→12KB（-94%）；Gzip + Brotli 双压缩
- **Vitest 单元测试**：20 个用例覆盖 `format` 工具函数与 `user` store，核心逻辑覆盖率 100%，80% 门槛保护
- **Composables 通用 Hook**：`useRequest`（loading/data/error 状态管理）、`useTable`（分页列表全封装），重构 ArticleManage 减少 38 行样板代码
- **全局错误处理**：`app.config.errorHandler` + `ErrorBoundary` 组件 + 401 自动清理用户数据
- **网络层增强**：GET 请求自动重试 2 次、路由切换 `AbortController` 取消未完成请求、响应数据可选链兜底
- **暗色模式**：零依赖自实现 `useTheme`（localStorage 持久化 + 跟随系统偏好），Element Plus 暗色主题自动适配
- **国际化 i18n**：零依赖自实现 `useI18n`（响应式 `t()` 函数 + 中英文语言包），登录页与菜单全量双语
- **UX 优化**：keep-alive 缓存列表页状态、基于路由 meta 的面包屑导航、自定义 404 页面
- **文章批量删除**：`el-table` selection + `Promise.allSettled` 并发删除 + 成功/失败统计
- **Docker 容器化**：多阶段构建（node 构建 + nginx 运行）+ healthcheck
- **GitHub Actions CI**：push/PR 触发 lint + test + build 三阶段流水线

#### 修复

- 修复黑马 API HTTP→HTTPS 301 重定向导致的 CORS 预检失败（`VITE_API_BASE_URL` 改为 `https://`）
- 修复登录 Token 提取崩溃：兼容 `res.data.data.token` 与 `res.data.token` 两种响应结构
- 修复取消退出登录时触发全局 errorHandler 显示"页面渲染异常"（`ElMessageBox.confirm` reject 未捕获）
- 修复 eslint 配置缺陷：`.vue` 文件 `<script lang="ts">` 缺少 TS 解析器配置
- 补全 `typescript-eslint` 依赖声明（eslint.config.js 引用但 package.json 未声明）

#### 变更

- `ArticleManage.vue` 重构为使用 `useTable` composable，script 从 130 行减至 92 行
- `request.ts` 的 `baseURL` 改为 `import.meta.env.VITE_API_BASE_URL` 环境变量注入
- 路由配置补全 `name` 与 `meta.title`，新增 404 catchAll 兜底路由
- `LayoutContainer.vue` 顶栏新增主题切换与语言切换按钮，菜单文案全量 i18n

#### 移除

- 删除示例 `counter.ts` store 及其导出
- 删除残留 `jsconfig.json.backup` 备份文件
- 移除 `LoginPage.vue` 中不安全的 Token 兼容 hack（改用可选链）

---

## [1.0.0] - 2025-01

### 初始版本

#### 功能

- Vue 3 Composition API + TypeScript 全量迁移
- 用户认证系统（注册/登录/记住我/JWT Token/路由守卫）
- 文章分类管理（CRUD + 弹窗交互）
- 文章内容管理（发布/编辑/删除/富文本/封面上传）
- 个人中心（资料/头像/密码修改）
- GSAP 交互式登录页动画（4 个动态角色追踪鼠标）
- 2000+ 行 JSDoc 代码注释
- ESLint 9 Flat Config + Prettier + Husky 代码规范体系
- Element Plus 按需自动导入
