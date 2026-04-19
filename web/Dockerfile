FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:24-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
RUN npm install -g pnpm && pnpm install --prod
EXPOSE 3000
ENV HOST=0.0.0.0 PORT=3000
CMD ["node", "build"]
