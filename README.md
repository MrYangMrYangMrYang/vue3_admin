# 🚀 大事件管理系统 (Big Event Admin)

<p align="center">
  <img src="./src/assets/logo.png" alt="Logo" width="120">
</p>

<p align="center">
  基于 <b>Vue 3 + Vite + Element Plus</b> 构建的现代化后台管理系统
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5.22-42b883?logo=vue.js" alt="Vue">
  <img src="https://img.shields.io/badge/Vite-7.1.11-646cff?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Element--Plus-2.11.5-409eff?logo=element-plus" alt="Element Plus">
  <img src="https://img.shields.io/badge/GSAP-3.15.0-88ce02?logo=greensock" alt="GSAP">
  <img src="https://img.shields.io/badge/Pinia-3.0.3-yellow?logo=pinia" alt="Pinia">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
</p>

---

## 📋 目录

- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [技术选型](#技术选型)
- [目录结构](#目录结构)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [代码规范](#代码规范)
- [部署说明](#部署说明)
- [常见问题](#常见问题)
- [贡献指南](#贡献指南)
- [开源协议](#开源协议)

---

## 🌟 项目简介

**大事件管理系统 (Big Event Admin)** 是一款基于 Vue 3 Composition API 开发的现代化文章后台管理系统。项目采用前后端分离架构，集成了 GSAP 交互动画引擎，为传统的管理后台注入了生动的视觉活力。

本项目适合作为企业级管理系统的前端解决方案，具备完整的用户认证、文章管理、个人中心等功能模块。

## ✨ 功能特性

### 🔐 用户认证系统
- ✅ 用户注册与登录（表单校验）
- ✅ JWT Token 认证机制
- ✅ 路由守卫与权限控制
- ✅ 登录状态持久化（Pinia + persistedstate）
- ✅ 记住我功能（localStorage）

### 📝 文章管理系统
- **文章分类管理**
  - ✅ 分类列表展示
  - ✅ 添加/编辑/删除分类
  - ✅ 分类名称和别名设置

- **文章内容管理**
  - ✅ 文章列表分页查询
  - ✅ 发布新文章（支持草稿）
  - ✅ 编辑已有文章
  - ✅ 删除文章（二次确认）
  - ✅ 富文本编辑器集成（VueQuill）
  - ✅ 封面图片上传与预览
  - ✅ 网络图片自动回显转换

### 👤 个人中心
- ✅ 个人资料编辑（昵称、邮箱）
- ✅ 头像上传与更新（Base64 格式）
- ✅ 密码修改（旧密码验证）

### 🎨 UI/UX 体验
- ✅ 响应式布局设计
- ✅ 侧边栏菜单折叠
- ✅ 全站路由过渡动画（GPU 加速 cubic-bezier）
- ✅ 模态框丝滑过渡效果
- ✅ **GSAP 交互式登录角色动画**（4 个动态角色追踪鼠标）

### 🛠️ 工程化支持
- ✅ ESLint + Prettier 代码规范
- ✅ Husky Git Hooks（提交前自动检查）
- ✅ lint-staged 自动修复
- ✅ Element Plus 按需自动导入
- ✅ 组件自动注册（unplugin-vue-components）

## 💡 核心亮点

### 🎭 交互式登录体验
- **动态交互角色**：登录页内置 4 个基于 **GSAP** 开发的交互式角色，实时追踪鼠标移动
- **智能行为响应**：根据用户输入状态（聚焦、打字、显示/隐藏密码）触发不同表情与动作
- **性能优化**：通过 `requestAnimationFrame` 与页面可见性检查，确保流畅且低能耗

### 🎨 极致的视觉体验
- **丝滑过渡**：全站采用 GPU 加速的 `cubic-bezier` 过渡动画
- **现代化 UI**：基于 Element Plus 深度定制，符合现代审美规范

## 🛠️ 技术选型

| 技术栈 | 版本 | 说明 |
| :--- | :--- | :--- |
| **Vue 3** | ^3.5.22 | 采用 Composition API 组合式开发模式 |
| **Vite 7** | ^7.1.11 | 下一代前端构建工具，极速热重载 |
| **Vue Router** | ^4.6.3 | 官方路由管理器，支持导航守卫 |
| **Pinia** | ^3.0.3 | 新一代状态管理库，支持数据持久化 |
| **Element Plus** | ^2.11.5 | Vue 3 组件库，按需自动导入 |
| **Axios** | ^1.12.2 | HTTP 请求库，完善的拦截器机制 |
| **GSAP** | ^3.15.0 | 专业级 Web 动画引擎 |
| **VueQuill** | ^1.2.0 | 基于 Quill 的富文本编辑器 |
| **Sass** | ^1.93.2 | CSS 预处理器 |
| **ESLint 9** | ^9.37.0 | 代码质量检查工具（Flat Config）|
| **Prettier** | 3.6.2 | 代码格式化工具 |
| **Husky** | ^8.0.0 | Git Hooks 管理工具 |

## 📁 目录结构

```text
vue3-big-event-admin/
├── .husky/                    # Git Hooks 配置
│   └── pre-commit            # 提交前钩子（ESLint 检查）
├── .vscode/                  # VS Code 编辑器配置
│   ├── extensions.json       # 推荐扩展插件
│   └── settings.json         # 工作区设置
├── public/                   # 静态资源目录
│   └── favicon.svg           # 网站图标
├── dist/                     # 构建输出目录
├── src/                      # 源代码目录
│   ├── api/                 # API 接口模块
│   │   ├── article.js       # 文章相关接口（9个API）
│   │   └── user.js          # 用户相关接口（6个API）
│   ├── assets/              # 静态资源与全局样式
│   │   ├── *.jpg/png        # 图片资源（头像、封面、背景等）
│   │   └── main.scss        # 全局 SCSS 样式
│   ├── components/          # 全局公共组件
│   │   ├── AnimatedCharacters.vue  # GSAP 动画组件（登录页角色）
│   │   └── PageContainer.vue      # 页面容器组件
│   ├── composables/         # 可组合式函数（预留扩展）
│   ├── router/              # 路由配置
│   │   └── index.js         # 路由定义与全局前置守卫
│   ├── stores/              # Pinia 状态管理
│   │   ├── index.js         # Store 入口
│   │   └── modules/         # 模块化 Store
│   │       ├── counter.js   # 示例计数器
│   │       └── user.js      # 用户状态（Token 管理）
│   ├── utils/               # 工具函数库
│   │   ├── format.js        # 时间格式化工具
│   │   └── request.js       # Axios 封装与拦截器
│   ├── views/               # 业务视图页面
│   │   ├── article/         # 文章管理模块
│   │   │   ├── components/  # 子组件
│   │   │   │   ├── ArticleEdit.vue     # 文章编辑/发布弹窗
│   │   │   │   ├── ChannelEdit.vue    # 分类编辑弹窗
│   │   │   │   └── ChannelSelect.vue  # 分类选择下拉框
│   │   │   ├── ArticleChannel.vue    # 分类管理页面
│   │   │   └── ArticleManage.vue     # 文章列表页面
│   │   ├── layout/          # 布局组件
│   │   │   └── LayoutContainer.vue   # 主布局（侧边栏+头部+内容区）
│   │   ├── login/           # 登录注册模块
│   │   │   └── LoginPage.vue         # 交互式登录页
│   │   └── user/            # 用户中心
│   │       ├── UserAvatar.vue        # 头像设置
│   │       ├── UserPassword.vue      # 密码修改
│   │       └── UserProfile.vue       # 资料编辑
│   ├── App.vue              # 根组件
│   └── main.js              # 应用入口
├── .editorconfig            # 编辑器统一配置
├── .gitattributes           # Git 属性配置
├── .gitignore               # Git 忽略文件配置
├── .prettierrc.json         # Prettier 格式化配置
├── eslint.config.js         # ESLint 9 Flat Config 配置
├── index.html               # HTML 入口模板
├── jsconfig.json            # JavaScript 项目配置
├── package.json             # 项目依赖与脚本
├── pnpm-lock.yaml           # pnpm 锁定文件
└── vite.config.js           # Vite 构建配置（含自动导入插件）
```

## 🚀 快速开始

### 前置要求

请确保你的开发环境已安装以下工具：

- **Node.js**: >= 18.0.0（推荐 LTS 版本）
- **pnpm**: >= 8.0.0（推荐包管理器）
- **Git**: 最新版本

> 💡 **提示**: 推荐使用 [nvm](https://github.com/nvm-sh/nvm) 或 [fnm](https://github.com/Schniz/fnm) 管理 Node.js 版本

### 安装依赖

```bash
# 使用 pnpm 安装依赖（推荐）
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

### 生产环境构建

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 其他命令

```bash
# 代码检查与自动修复
pnpm lint

# 代码格式化
pnpm format
```

## ⚙️ 环境配置

项目支持多环境配置，请在根目录创建对应的环境变量文件：

```bash
# 开发环境 (.env.development)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=大事件管理系统(开发)

# 生产环境 (.env.production)
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_TITLE=大事件管理系统

# 示例文件 (.env.example) - 可提交到仓库
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=大事件管理系统
```

> ⚠️ **注意**: 所有自定义环境变量必须以 `VITE_` 开头才能在客户端代码中访问

## 📏 代码规范

本项目已配置完整的代码质量保障体系：

### Linting & Formatting 工具链

- **ESLint 9** (Flat Config): 代码质量检查与错误检测
- **Prettier**: 代码格式化风格统一
- **Husky**: Git 提交前自动执行 ESLint 检查
- **lint-staged**: 仅对暂存区文件执行 Lint 并自动修复

### 提交规范

每次提交代码时会自动触发：
1. ESLint 代码检查并自动修复
2. 代码格式符合 Prettier 规范

### 推荐的 VS Code 扩展

项目已配置推荐扩展列表（[.vscode/extensions.json](file:///d:/desktop/Front-end/Vue/vue3/demo/案例/vue3-big-event-admin/.vscode/extensions.json)），包括：
- Vue Language Features (Volar) - Vue 3 语言支持
- ESLint - 代码质量检查
- Prettier - 代码格式化

## 🌐 部署说明

### Nginx 部署（推荐）

构建后将 `dist` 目录部署到 Nginx：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理
    location /api {
        proxy_pass http://backend-server:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Docker 部署

```dockerfile
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Vercel 部署

可添加 `vercel.json` 配置文件进行一键部署。

## ❓ 常见问题

### Q: 为什么推荐使用 pnpm？

A: pnpm 具有更快的安装速度、更严格的依赖管理和更节省磁盘空间的特点。

### Q: 如何切换后端 API 地址？

A: 通过修改 `.env.development` 或 `.env.production` 中的 `VITE_API_BASE_URL` 变量即可。

### Q: 登录页面的动画不流畅怎么办？

A: 请确保浏览器启用了 GPU 加速。可在 Chrome 地址栏输入 `chrome://gpu` 检查硬件加速状态。

### Q: 如何添加新的管理页面？

A:
1. 在 `src/views/` 下创建新组件
2. 在 `src/router/index.js` 中添加路由配置（作为 `/` 的子路由）
3. 如需在侧边栏显示，需在 `LayoutContainer.vue` 中添加菜单项

### Q: Element Plus 组件需要手动 import 吗？

A: 不需要。项目已配置 `unplugin-auto-import` 和 `unplugin-vue-components`，所有 Element Plus 组件会自动导入。

## 🤝 贡献指南

欢迎对本项目做出贡献！请遵循以下步骤：

1. **Fork** 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 **Pull Request**

### Commit Message 规范

建议遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链变更

## 📊 浏览器兼容性

| 浏览器 | 支持版本 |
| :--- | :--- |
| Chrome | >= 90 |
| Firefox | >= 88 |
| Safari | >= 14 |
| Edge | >= 90 |

> ⚠️ 注意: 项目使用了现代 ES+ 特性和 CSS Grid/Flexbox，不支持 IE 浏览器

## 📈 功能路线图

- [x] 用户认证系统（注册/登录/记住我）
- [x] 文章分类管理（CRUD）
- [x] 文章内容管理（发布/编辑/删除/富文本）
- [x] 个人中心（资料/头像/密码）
- [x] GSAP 交互动画（登录页）
- [ ] 单元测试覆盖
- [ ] E2E 测试
- [ ] 国际化 (i18n) 支持
- [ ] 暗色模式
- [ ] 更多业务模块

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源协议发布。

```
MIT License

Copyright (c) 2024 Big Event Admin

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

感谢以下开源项目和技术社区：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Element Plus](https://element-plus.org/) - Vue 3 UI 组件库
- [GSAP](https://greensock.com/gsap/) - 专业动画平台
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理库

---

<div align="center">

**如果这个项目对你有帮助，欢迎给一个 ⭐ Star！**

Made with ❤️ by Big Event Admin Team

</div>
