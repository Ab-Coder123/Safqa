FROM node:20-alpine

WORKDIR /app

# Copy package manifests from monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/types ./packages/types
COPY packages/utils ./packages/utils
COPY packages/config ./packages/config
COPY apps/backend ./apps/backend

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Build internal packages & generate prisma client & build backend
RUN pnpm --filter @safqa/types build && \
    pnpm --filter @safqa/utils build && \
    pnpm --filter @safqa/backend db:generate && \
    pnpm --filter @safqa/backend build

ENV PORT=10000
ENV NODE_ENV=production
EXPOSE 10000

CMD ["pnpm", "--filter", "@safqa/backend", "start"]
