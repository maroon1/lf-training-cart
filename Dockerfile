FROM node:18-alpine AS builder
WORKDIR /cart/
COPY package.json pnpm-lock.yaml .npmrc ./
RUN corepack enable && pnpm install
ADD . ./
RUN pnpm build

# ---- 将源代码拷贝至 nginx 目录 ----
FROM nginx:1.23.2-alpine
ARG ARTIFACTS_PATHS=/cart/build
# 添加 NGINX 配置文件模版
# NGINX 镜像从 v1.19 开始支持使用环境变量配置 NGINX 的配置文件
COPY nginx/default.conf.template /etc/nginx/templates/
COPY --from=builder ${ARTIFACTS_PATHS} /usr/share/nginx/html/
# 以调试模式启动 NGINX
# ⚠️ 如果需要详细日志，还需要将 NGINX 中的 error_log 日志级别设置为 debug
# CMD ["nginx-debug", "-g", "daemon off;"]
