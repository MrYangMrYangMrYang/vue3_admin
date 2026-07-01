# 🚀 大事件管理系统 (Big Event Admin)

<p align="center">
  <img src="./src/assets/logo.png" alt="Logo" width="120">
</p>

<p align="center">
  基于 <b>Vue 3 + TypeScript + Vite + Element Plus</b> 构建的现代化后台管理系统
</p>

<p align="center">
  <a href="http://8.163.98.227:8082" target="_blank">
    <img src="https://img.shields.io/badge/在线预览-http://8.163.98.227:8082-blue?style=for-the-badge" alt="在线预览">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5.22-42b883?logo=vue.js" alt="Vue">
  <img src="https://img.shields.io/badge/TypeScript-6.0.3-3178c6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-7.1.11-646cff?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Element--Plus-2.11.5-409eff?logo=element-plus" alt="Element Plus">
  <img src="https://img.shields.io/badge/Pinia-3.0.3-yellow?logo=pinia" alt="Pinia">
  <img src="https://img.shields.io/badge/GSAP-3.15.0-88ce02?logo=greensock" alt="GSAP">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
</p>

---

## 📋 目录

- [项目简介](#项目简介)
- [✨ 核心亮点](#核心亮点)
- [功能特性](#功能特性)
- [技术选型](#技术选型)
- [目录结构](#目录结构)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [代码规范与质量](#代码规范与质量)
- [部署说明](#部署说明)
- [常见问题](#常见问题)
- [贡献指南](#贡献指南)
- [功能路线图](#功能路线图)
- [开源协议](#开源协议)

---

## 🌟 项目简介

**大事件管理系统 (Big Event Admin)** 是一款基于 Vue 3 Composition API + TypeScript 开发的现代化文章后台管理系统。项目采用前后端分离架构，集成了 GSAP 交互动画引擎，为传统的管理后台注入了生动的视觉活力。

本项目具备**企业级工程化标准**，包含完整的类型系统、2000+ 行 JSDoc 文档注释、完善的错误处理机制和优秀的用户体验设计。

### 🎯 适用场景

- 企业内容管理系统 (CMS)
- 博客/新闻管理后台
- 内部信息发布平台
- Vue 3 + TypeScript 学习参考项目

---

## ✨ 核心亮点

### 🔷 完整的 TypeScript 类型系统
- ✅ **100% TypeScript 覆盖**：所有业务代码使用 TypeScript 编写
- ✅ **集中式类型定义**：`src/types/index.ts` 统一管理接口类型
- ✅ **API 响应类型化**：所有接口返回值都有完整的泛型约束
- ✅ **组件 Props 类型化**：Vue 组件属性全部类型安全
- ✅ **0 个类型错误**：通过 `vue-tsc` 类型检查验证

### 📚 企业级代码文档
- ✅ **2000+ 行 JSDoc 注释**：覆盖所有核心模块
- ✅ **完整的函数文档**：参数说明、返回值、示例代码
- ✅ **组件级注释**：每个 Vue 组件都有详细的功能说明
- ✅ **配置文件文档**：Vite/ESLint/Router 等配置均有注释

### 🎨 卓越的用户体验
- ✅ **无闪烁页面切换**：智能 Loading 状态管理
- ✅ **骨架屏加载态**：表格数据加载时展示 shimmer 骨架占位
- ✅ **友好的错误提示**：所有操作失败都有明确的用户反馈
- ✅ **登录体验优化**：成功后直接跳转到有数据的分类页
- ✅ **退出登录提示**：安全退出的友好确认与提示
- ✅ **GSAP 交互动画**：4 个动态角色实时追踪鼠标
- ✅ **响应式布局**：适配桌面/平板/移动端，移动端侧边栏浮层交互
- ✅ **无障碍优化**：ARIA label、语义化导航、键盘可访问性

### 🛡️ 健壮的错误处理
- ✅ **Token 安全提取**：兼容多种后端响应格式
- ✅ **全局异常捕获**：Axios 拦截器统一处理 HTTP 错误
- ✅ **401 自动跳转**：Token 过期自动返回登录页
- ✅ **表单校验完善**：注册/登录/密码修改都有完整校验

### ⚡ 构建性能与工程化
- ✅ **Vite 分包优化**：manualChunks 拆分 vendor-vue/element/gsap/quill/axios 5 大包，入口文件 212KB→12KB（-94%）
- ✅ **Gzip + Brotli 双压缩**：vite-plugin-compression 预压缩，大幅减少传输体积
- ✅ **多环境配置**：.env.development / .env.production 环境变量注入
- ✅ **Vitest 单元测试**：37 个用例覆盖 utils/stores/composables，核心逻辑覆盖率 100%
- ✅ **Playwright E2E 测试**：12 个用例覆盖登录/导航/主题/国际化关键用户流程
- ✅ **API 响应解包**：Axios interceptor 自动解包，消除 `res.data.data` 冗余访问
- ✅ **Composables 抽离**：useRequest / useTable / useTheme / useI18n 通用 Hook
- ✅ **GitHub Actions CI**：push/PR 自动触发 lint + test + build 流水线
- ✅ **Docker 多阶段构建**：node 构建 + nginx 运行，一键容器化部署

### 📊 Lighthouse 跑分（生产构建 · 桌面端 · 登录页）

| 指标 | 分数 | 评级 |
|------|------|------|
| Performance（性能） | **96** | 优秀 |
| Best Practices（最佳实践） | **100** | 完美 |
| Accessibility（无障碍） | **95** | 优秀 |
| SEO | **75** | 良好（已补充 meta/OG 标签） |

**关键性能指标**：FCP 0.9s · LCP 1.0s · TTI 1.0s · TBT 0ms

> 跑分环境：`pnpm build && pnpm preview` + Edge DevTools Lighthouse，Desktop 模式，4 项全选。

---

## 功能特性

### 🔐 用户认证系统
- ✅ 用户注册与登录（多规则表单校验）
- ✅ JWT Token 认证机制（Bearer Token）
- ✅ 路由守卫与权限控制（全局前置守卫）
- ✅ 登录状态持久化（Pinia + pinia-plugin-persistedstate）
- ✅ 记住我功能（localStorage）
- ✅ 密码显示/隐藏切换
- ✅ 登录成功自动跳转到主页面

### 📝 文章管理系统

#### 文章分类管理
- ✅ 分类列表展示（表格 + 分页）
- ✅ 添加/编辑/删除分类（弹窗交互）
- ✅ 分类名称和别名设置
- ✅ 删除二次确认（MessageBox 确认框）

#### 文章内容管理
- ✅ 文章列表分页查询（支持搜索过滤）
- ✅ 发布新文章（支持草稿状态）
- ✅ 编辑已有文章（数据回显）
- ✅ 删除文章（二次确认）
- ✅ 富文本编辑器集成（VueQuill）
- ✅ 封面图片上传与预览（Element Upload）
- ✅ 网络图片自动回显转换

### 👤 个人中心
- ✅ 个人资料编辑（昵称、邮箱修改）
- ✅ 头像上传与更新（Base64 格式 + FileReader）
- ✅ 密码修改（旧密码验证 + 一致性检查）

### 🎨 UI/UX 体验
- ✅ 响应式布局设计（Grid + Flexbox）
- ✅ 侧边栏菜单折叠动画
- ✅ 全站路由过渡动画（GPU 加速 cubic-bezier）
- ✅ 模态框丝滑过渡效果（fade-slide 动画）
- ✅ **GSAP 交互式登录角色动画**（4 个动态角色追踪鼠标）
- ✅ 表单输入交互动画（打字检测、密码偷看检测）

### 🌓 主题与国际化
- ✅ 暗色/亮色主题切换（零依赖自实现 useTheme，localStorage 持久化 + 跟随系统偏好）
- ✅ **完整中英文国际化**（零依赖自实现 useI18n，120+ key 全覆盖，支持参数插值）
- ✅ **Element Plus 组件库国际化联动**（分页/空状态/上传等组件同步切换语言）
- ✅ Element Plus 暗色主题自动适配

### 🧭 导航与体验增强
- ✅ keep-alive 缓存列表页（切换保留分页与搜索状态）
- ✅ 面包屑导航（基于路由 meta，i18n 联动）
- ✅ 自定义 404 页面（catchAll 兜底路由）
- ✅ 文章批量删除（Promise.allSettled 并发 + 成功/失败统计）

### 🛠️ 工程化支持
- ✅ ESLint 9 Flat Config（Vue + TypeScript 支持）
- ✅ Prettier 代码格式化（保存时自动修复）
- ✅ Husky Git Hooks（提交前自动 lint）
- ✅ lint-staged 自动修复（仅检查暂存文件）
- ✅ Element Plus 按需自动导入（unplugin-auto-import）
- ✅ 组件自动注册（unplugin-vue-components）
- ✅ Vite 极速热重载（HMR）
- ✅ Vitest 单元测试框架（jsdom 环境 + v8 coverage）
- ✅ GitHub Actions CI/CD（lint + test + build 三阶段）
- ✅ Docker 容器化部署（多阶段构建 + nginx）

---

## 🛠️ 技术选型

| 技术栈 | 版本 | 说明 |
| :--- | :--- | :--- |
| **Vue 3** | ^3.5.22 | Composition API + `<script setup>` 语法糖 |
| **TypeScript** | ^6.0.3 | 完整的类型系统与 IDE 智能提示 |
| **Vite 7** | ^7.1.11 | 下一代前端构建工具，极速 HMR |
| **Vue Router 4** | ^4.6.3 | 官方路由管理，导航守卫与懒加载 |
| **Pinia 3** | ^3.0.3 | 新一代状态管理，Composition API 风格 |
| **Element Plus** | ^2.11.5 | Vue 3 组件库，按需自动导入 |
| **Axios** | ^1.12.2 | HTTP 客户端，请求/响应拦截器 |
| **GSAP** | ^3.15.0 | 专业级 Web 动画引擎（登录页交互） |
| **VueQuill** | ^1.2.0 | 富文本编辑器（基于 Quill） |
| **Sass** | ^1.93.2 | CSS 预处理器（SCSS 语法） |
| **ESLint 9** | ^9.37.0 | 代码质量检查（Flat Config + TS 支持） |
| **Prettier** | 3.6.2 | 代码格式化工具 |
| **Husky** | ^8.0.0 | Git Hooks 管理 |
| **Vitest** | ^4.1.9 | 单元测试框架（jsdom + v8 coverage） |
| **Playwright** | ^1.54 | E2E 测试框架（Chromium 浏览器自动化） |

---

## 📁 目录结构

```text
vue3-big-event-admin/
├── .husky/                          # Git Hooks 配置
│   └── pre-commit                  # 提交前钩子（ESLint 检查）
├── .vscode/                        # VS Code 编辑器配置
│   ├── extensions.json             # 推荐扩展插件
│   └── settings.json               # 工作区设置
├── public/                         # 静态资源目录
│   └── favicon.svg                 # 网站图标
├── dist/                           # 构建输出目录（生产环境）
├── e2e/                            # E2E 测试（Playwright）
│   ├── login.spec.ts               # 登录流程测试
│   ├── navigation.spec.ts          # 导航与布局测试
│   └── theme-locale.spec.ts        # 主题与国际化测试
├── src/                            # 源代码目录
│   ├── api/                       # API 接口层（Axios 封装）
│   │   ├── article.ts             # 文章相关接口（9个 API）
│   │   └── user.ts                # 用户相关接口（6个 API）
│   │
│   ├── assets/                    # 静态资源与全局样式
│   │   ├── *.jpg/png              # 图片资源（头像、封面、背景等）
│   │   └── main.scss              # 全局 SCSS 样式变量
│   │
│   ├── components/                # 全局公共组件
│   │   ├── AnimatedCharacters.vue # GSAP 动画组件（登录页角色）
│   │   ├── AppBreadcrumb.vue      # 面包屑导航组件（基于路由 meta + i18n）
│   │   ├── ErrorBoundary.vue      # 错误边界组件（捕获子树异常）
│   │   ├── PageContainer.vue      # 页面容器组件（标题+插槽）
│   │   └── SkeletonTable.vue      # 骨架屏组件（shimmer 动画表格占位）
│   │
│   ├── composables/               # 可组合式函数（useRequest/useTable/useTheme/useI18n）
│   │   ├── __tests__/             # composables 单元测试
│   │   │   ├── useRequest.test.ts
│   │   │   └── useTable.test.ts
│   │   ├── useRequest.ts          # 通用请求 Hook（loading/error/data）
│   │   ├── useTable.ts            # 列表页通用 Hook（分页+查询+CRUD）
│   │   ├── useTheme.ts            # 主题切换 Hook（暗色/亮色 + 系统偏好）
│   │   ├── useI18n.ts             # 国际化 Hook（零依赖自实现 t() + 参数插值）
│   │   └── index.ts               # 统一导出
│   │
│   ├── locales/                   # 国际化语言包
│   │   ├── zh.ts                  # 中文语言包
│   │   └── en.ts                  # 英文语言包
│   │
│   ├── router/                    # 路由配置
│   │   └── index.ts               # 路由定义 + 全局前置守卫 + catchAll 兜底
│   │
│   ├── stores/                    # Pinia 状态管理
│   │   ├── index.ts               # Store 入口文件
│   │   └── modules/               # 模块化 Store
│   │       ├── __tests__/         # Store 单元测试
│   │       │   └── user.test.ts
│   │       └── user.ts            # 用户状态（Token + 用户信息）
│   │
│   ├── types/                     # TypeScript 类型定义 ⭐
│   │   └── index.ts               # 全局类型接口（UserInfo, ArticleDetail 等）
│   │
│   ├── utils/                     # 工具函数库
│   │   ├── __tests__/             # 工具函数单元测试
│   │   │   └── format.test.ts
│   │   ├── format.ts              # 时间格式化工具
│   │   ├── request.ts             # Axios 实例封装 + 拦截器（注入 baseURL）
│   │   └── requestCancel.ts       # 路由切换取消未完成请求（AbortController）
│   │
│   ├── views/                     # 业务视图页面
│   │   ├── article/               # 文章管理模块
│   │   │   ├── components/        # 子组件
│   │   │   │   ├── ArticleEdit.vue    # 文章编辑/发布弹窗
│   │   │   │   ├── ChannelEdit.vue    # 分类编辑弹窗
│   │   │   │   └── ChannelSelect.vue  # 分类选择下拉框
│   │   │   ├── ArticleChannel.vue     # 分类管理页面
│   │   │   └── ArticleManage.vue      # 文章列表页面
│   │   │
│   │   ├── layout/                # 布局组件
│   │   │   └── LayoutContainer.vue    # 主布局（侧边栏+头部+内容区）
│   │   │
│   │   ├── login/                 # 登录注册模块
│   │   │   └── LoginPage.vue          # 交互式登录页（带 GSAP 动画）
│   │   │
│   │   ├── user/                  # 用户中心
│   │   │   ├── UserAvatar.vue         # 头像设置页面
│   │   │   ├── UserPassword.vue       # 密码修改页面
│   │   │   └── UserProfile.vue        # 个人资料编辑
│   │   │
│   │   └── NotFound.vue           # 404 页面（catchAll 兜底路由）
│   │
│   ├── App.vue                    # 根组件
│   └── main.ts                    # 应用入口（挂载 Vue 实例）
│
├── .editorconfig                  # 编辑器统一配置
├── .gitattributes                 # Git 属性配置
├── .gitignore                     # Git 忽略文件配置
├── .prettierrc.json               # Prettier 格式化配置
├── .github/                       # GitHub 配置目录
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI 流水线（lint + test + build）
├── .env.development               # 开发环境变量（VITE_API_BASE_URL）
├── .env.production                # 生产环境变量（VITE_API_BASE_URL）
├── .dockerignore                  # Docker 构建忽略列表
├── Dockerfile                     # 多阶段构建（node 构建 + nginx 运行）
├── nginx.conf                     # Nginx 配置（SPA fallback + gzip）
├── eslint.config.js               # ESLint 9 Flat Config（Vue + TS 规则）
├── index.html                     # HTML 入口模板
├── package.json                   # 项目依赖与脚本命令
├── pnpm-lock.yaml                 # pnpm 锁定文件（确保依赖一致性）
├── tsconfig.json                  # TypeScript 项目配置
├── tsconfig.node.json             # Node.js 环境 TS 配置
├── vite.config.ts                 # Vite 构建配置（含自动导入插件 + 分包压缩）
└── vitest.config.ts               # Vitest 单元测试配置（jsdom + v8 coverage）
```

---

## 🚀 快速开始

### 前置要求

请确保你的开发环境已安装以下工具：

- **Node.js**: >= 18.0.0（推荐 LTS 版本）
- **pnpm**: >= 8.0.0（推荐包管理器，更快速高效）
- **Git**: 最新版本

> 💡 **推荐**: 使用 [nvm](https://github.com/nvm-sh/nvm) 或 [fnm](https://github.com/Schniz/fnm) 管理 Node.js 版本

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/your-username/vue3-big-event-admin.git

# 进入项目目录
cd vue3-big-event-admin

# 使用 pnpm 安装依赖（推荐 ⚡）
pnpm install

# 或者使用 npm
npm install

# 或者使用 yarn
yarn install
```

### 开发环境运行

```bash
# 启动开发服务器（默认端口: 5173）
pnpm dev

# 启动后访问: http://localhost:5173
```

**默认测试账号：**
- 用户名：`admin`
- 密码：`123456`

> 📝 后端 API 地址已配置为：`https://big-event-vue-api-t.itheima.net`

### 生产环境构建

```bash
# 构建（会先进行 TypeScript 类型检查）
pnpm build

# 预览构建结果
pnpm preview
```

### 其他常用命令

```bash
# 代码检查与自动修复（ESLint）
pnpm lint

# 代码格式化（Prettier）
pnpm format

# 类型检查（vue-tsc）
npx vue-tsc --noEmit

# 单元测试（Vitest，37 用例）
pnpm test:run

# 单元测试 + 覆盖率报告
pnpm test:coverage

# E2E 测试（Playwright，12 用例）
pnpm test:e2e

# E2E 测试 + UI 模式
pnpm test:e2e:ui
```

---

## ⚙️ 环境配置

### 多环境变量配置

项目采用 Vite 原生多环境变量机制，API 地址不再硬编码在源码中，而是通过 `.env.*` 文件注入：

| 文件 | 作用 | 示例值 |
| :--- | :--- | :--- |
| `.env.development` | 开发环境（`pnpm dev` 加载） | `VITE_API_BASE_URL=https://big-event-vue-api-t.itheima.net` |
| `.env.production` | 生产环境（`pnpm build` 加载） | `VITE_API_BASE_URL=https://big-event-vue-api-t.itheima.net` |

在 [src/utils/request.ts](src/utils/request.ts) 中通过 `import.meta.env` 注入：

```typescript
const baseURL = import.meta.env.VITE_API_BASE_URL
```

如需更换后端地址，直接修改对应 `.env.*` 文件中的 `VITE_API_BASE_URL` 即可，无需改动业务代码。

### ⚠️ 关于 HTTPS 强制

API 地址已统一改为 `https://`，原因：

- 后端 API 服务端会强制将 HTTP 重定向到 HTTPS
- HTTP → HTTPS 重定向会触发 CORS 预检失败（跨协议重定向被浏览器拦截）
- 直接使用 `https://` 可避免 308/301 重定向，省去不必要的预检请求

> ⚠️ **注意**: 自定义环境变量必须以 `VITE_` 开头才能在客户端通过 `import.meta.env` 访问

---

## 📏 代码规范与质量

本项目采用**企业级代码质量保障体系**：

### 🛡️ TypeScript 类型安全

- ✅ **严格模式启用**：`strict: true` 在 tsconfig 中
- ✅ **完整类型覆盖**：所有函数参数、返回值、组件 Props 都有类型注解
- ✅ **集中式类型管理**：`src/types/index.ts` 定义全局接口
- ✅ **构建时类型检查**：`vue-tsc --noEmit` 确保 0 类型错误

### 🔍 Linting & Formatting 工具链

| 工具 | 用途 | 配置文件 |
|-----|------|---------|
| **ESLint 9** | 代码质量检查 + 错误检测 | `eslint.config.js` |
| **Prettier** | 代码格式化风格统一 | `.prettierrc.json` |
| **Husky** | Git 提交前自动执行检查 | `.husky/pre-commit` |
| **lint-staged** | 仅对暂存文件执行 Lint | `package.json` |

### 📝 代码规范要点

- **Vue 组件**：使用 `<script setup lang="ts">` 语法
- **命名规范**：
  - 组件文件：PascalCase（如 `ArticleManage.vue`）
  - 工具函数：camelCase（如 `formatTime()`）
  - 类型接口：PascalCase（如 `ArticleDetail`）
- **注释规范**：所有公开函数必须有 JSDoc 注释

### 🎯 Git 提交流程

每次提交代码时会自动触发：

1. **Husky** 拦截 `git commit`
2. **lint-staged** 筛选出暂存的 `.ts/.vue` 文件
3. **ESLint** 执行代码检查并自动修复可解决问题
4. **提交成功**（如有不可自动修复的错误则阻止提交）

### 💻 推荐的 VS Code 扩展

项目已配置推荐扩展（[.vscode/extensions.json](.vscode/extensions.json)），安装 VS Code 时会自动提示：

- **Vue - Official** (Volar) - Vue 3 语言支持
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **TypeScript Vue Plugin (Volar)** - TS 支持

---

## 🌐 部署说明

### 在线预览

项目已部署到自有服务器，可直接访问体验：

- 🌐 **在线预览地址**：http://8.163.98.227:8082
- 🐧 **测试账号**：`admin` / `123456`

### Docker 部署（推荐）

项目根目录已提供生产可用的 [Dockerfile](Dockerfile) 和 [nginx.conf](nginx.conf)，采用多阶段构建（node 构建 + nginx 运行），一键容器化部署：

```bash
# 构建镜像（包含 pnpm install + vite build 两阶段）
docker build -t big-event-admin .

# 运行容器（映射宿主机 8082 → 容器 80）
docker run -d --name big-event-admin -p 8082:80 big-event-admin

# 访问 http://localhost:8082
```

**Dockerfile 关键设计**：

- **构建阶段**：基于 `node:18-alpine`，使用 corepack 启用 pnpm，`--frozen-lockfile` 保证依赖一致性
- **运行阶段**：基于 `nginx:stable-alpine`，仅拷贝 `dist/` 产物与 `nginx.conf`，镜像体积约 30MB
- **构建缓存**：先 `COPY package*.json pnpm-lock.yaml` 再 `pnpm install`，依赖未变时复用缓存层

**nginx.conf 关键配置**：

- SPA 路由 fallback（`try_files $uri $uri/ /index.html`）
- 静态资源 gzip 压缩
- 构建产物的预压缩 `.gz` / `.br` 文件直接由 nginx 返回

### Nginx 手动部署

如不使用 Docker，可手动将 `pnpm build` 产出的 `dist/` 目录拷贝到服务器，参考 [nginx.conf](nginx.conf) 中的配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # SPA 路由 fallback（必需！）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 预压缩文件（vite-plugin-compression 产出 .gz / .br）
    gzip_static on;
    brotli_static on;

    # 静态资源长缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## ❓ 常见问题

### Q: 为什么推荐使用 pnpm？

A: pnpm 具有**更快的安装速度**（比 npm 快 2-3 倍）、**严格的依赖管理**（避免 phantom dependencies）、**节省磁盘空间**（内容寻址存储）。

### Q: 如何切换后端 API 地址？

A: 修改根目录的 `.env.development` 或 `.env.production` 文件中的 `VITE_API_BASE_URL` 变量即可，无需改动源码：

```bash
# .env.development 或 .env.production
VITE_API_BASE_URL=https://your-new-api-address.com
```

[src/utils/request.ts](src/utils/request.ts) 会通过 `import.meta.env.VITE_API_BASE_URL` 自动读取。

### Q: 登录页面的动画不流畅怎么办？

A: 请确保浏览器启用了 GPU 硬件加速。可在 Chrome 地址栏输入 `chrome://gpu` 检查状态。GSAP 动画依赖 GPU 合成层。

### Q: 如何添加新的管理页面？

A: 按照 3 步操作：

1. **创建组件**：在 `src/views/` 下新建 `.vue` 文件
2. **添加路由**：在 [src/router/index.ts](src/router/index.ts) 的 `/` 路由 `children` 数组中添加配置
3. **添加菜单**（可选）：在 [LayoutContainer.vue](src/views/layout/LayoutContainer.vue) 的 `<el-menu>` 中添加菜单项

### Q: Element Plus 组件需要手动 import 吗？

A: **不需要**。项目已配置 `unplugin-auto-import` 和 `unplugin-vue-components`，所有 Element Plus 组件和图标都会按需自动导入。

### Q: TypeScript 报错怎么解决？

A: 运行以下命令检查类型错误：

```bash
npx vue-tsc --noEmit
```

如果仍有问题，请查看本文档的[技术选型](#技术选型)部分确认依赖版本正确。

### Q: 页面切换时有闪烁怎么办？

A: 本项目已优化此问题。确保数据获取函数中的 `loading` 初始值为 `true`，这样组件首次渲染就会显示 Loading 动画而非空内容。

---

## 🤝 贡献指南

欢迎对本项目做出贡献！请遵循以下步骤：

1. **Fork** 本仓库到你的 GitHub
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 进行开发并确保通过类型检查 (`npx vue-tsc --noEmit`)
4. 提交改动 (`git commit -m 'feat: add amazing feature'`)
5. 推送到分支 (`git push origin feature/AmazingFeature`)
6. 打开 **Pull Request**

### Commit Message 规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

| 类型 | 说明 |
|-----|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式调整（不影响功能） |
| `refactor` | 代码重构（不新增功能也不修 bug） |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具链/依赖变更 |

**示例**：
```
feat(article): 添加文章批量删除功能
fix(login): 修复 Token 提取导致的登录失败问题
docs(readme): 更新部署说明文档
```

---

## 📈 功能路线图

### ✅ 已完成
- [x] 完整的 TypeScript 类型系统迁移
- [x] 用户认证系统（注册/登录/记住我/路由守卫）
- [x] 文章分类管理（CRUD + 弹窗交互）
- [x] 文章内容管理（发布/编辑/删除/富文本/封面上传）
- [x] 个人中心（资料/头像/密码修改）
- [x] GSAP 交互动画（登录页角色互动）
- [x] 2000+ 行 JSDoc 代码注释
- [x] ESLint 9 + Prettier 代码规范体系
- [x] 用户体验优化（无闪烁加载/友好提示）
- [x] 单元测试（Vitest + jsdom，37 用例覆盖 utils/stores/composables）
- [x] E2E 测试（Playwright，12 用例覆盖登录/导航/主题/国际化）
- [x] 国际化 (i18n) 支持（零依赖自实现 useI18n，120+ key 全覆盖 + 参数插值）
- [x] Element Plus 组件库国际化联动（分页/空状态/上传等同步切换）
- [x] 暗色模式主题切换（零依赖自实现 useTheme + 跟随系统偏好）
- [x] 构建分包优化（manualChunks 拆分 + Gzip/Brotli 双压缩，入口 -94%）
- [x] API 响应解包（Interceptor 自动返回 ApiResponse，消除 res.data.data）
- [x] Composables 抽离（useRequest / useTable 消除列表页样板代码）
- [x] 全局错误处理（Axios 拦截器 + 401 自动跳转 + ErrorBoundary）
- [x] 网络层增强（路由切换取消请求 + GET 自动重试 + 多环境变量注入）
- [x] 骨架屏加载态（shimmer 动画表格占位，首次加载平滑过渡）
- [x] 响应式布局（桌面/平板/移动端适配，移动端侧边栏浮层）
- [x] 无障碍优化（ARIA label + 语义化导航 + 键盘可访问性）
- [x] keep-alive 缓存列表页（切换保留分页与搜索状态）
- [x] 面包屑导航（基于路由 meta + i18n 联动）
- [x] 404 页面（catchAll 兜底路由）
- [x] 文章批量删除（Promise.allSettled 并发 + 成功/失败统计）
- [x] Docker 容器化部署（多阶段构建 + nginx）
- [x] GitHub Actions CI 流水线（lint + test + build）

### 🚧 进行中
- 暂无

### 📌 计划中
- [ ] RBAC 权限控制（角色管理 + 按钮级权限）
- [ ] Excel/PDF 数据导出
- [ ] PWA 离线支持（Service Worker + Manifest）
- [ ] RBAC 权限管理（角色/菜单权限）
- [ ] 操作日志记录
- [ ] 数据导出（Excel/PDF）
- [ ] WebSocket 实时通知

---

## 📊 浏览器兼容性

| 浏览器 | 最低版本 | 推荐版本 |
| :--- | :--- | :--- |
| Chrome | >= 90 | 最新版 |
| Firefox | >= 88 | 最新版 |
| Safari | >= 14 | 最新版 |
| Edge | >= 90 | 最新版 |

> ⚠️ **注意**: 项目使用了现代 ESNext 特性、CSS Grid/Flexbox、CSS 变量等，**不支持 IE 浏览器**

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源协议发布。

```
MIT License

Copyright (c) 2024-2025 Big Event Admin Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 致谢

感谢以下优秀开源项目和技术社区：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Element Plus](https://element-plus.org/) - Vue 3 UI 组件库
- [Pinia](https://pinia.vuejs.org/) - 直观的状态管理
- [GSAP](https://greensock.com/gsap/) - 专业 Web 动画平台
- [Axios](https://axios-http.com/) - 基于 Promise 的 HTTP 客户端

特别感谢公开的后端 API 服务对本项目的支持！

---

<div align="center">

**⭐ 如果这个项目对你有帮助，欢迎给一个 Star！⭐**

**Made with ❤️ using Vue 3 + TypeScript by Big Event Admin Team**

</div>
