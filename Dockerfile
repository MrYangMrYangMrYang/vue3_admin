# ==================== 阶段 1：构建 ====================
FROM node:22-alpine AS builder
WORKDIR /app

# 启用 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 先复制依赖清单，利用 Docker 层缓存
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 复制源码并构建
COPY . .
RUN pnpm build

# ==================== 阶段 2：运行 ====================
# 使用内置 Brotli 模块的 nginx 镜像（支持 .br 静态文件，比 Gzip 体积小 15-20%）
FROM fholzer/nginx-brotli:latest

# 自定义 nginx 配置（安全头 + Gzip/Brotli 压缩 + SPA fallback + 缓存策略）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 拷贝构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
