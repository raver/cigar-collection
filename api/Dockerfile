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
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/src/db/schema.ts ./src/db/schema.ts
EXPOSE 3001
CMD ["node", "dist/index.js"]
