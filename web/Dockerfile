FROM node:24-alpine AS pnpm-base
RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

FROM pnpm-base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    --mount=type=cache,target=/root/.npm \
    pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:24-alpine AS prod-base
RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

FROM prod-base
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    --mount=type=cache,target=/root/.npm \
    pnpm install --prod
EXPOSE 3000
ENV HOST=0.0.0.0 PORT=3000
CMD ["node", "build"]
