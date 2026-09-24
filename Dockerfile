FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root configurations and package manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/
COPY apps/backend/package.json ./apps/backend/
COPY apps/backend/prisma ./apps/backend/prisma

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy source code for types, utils, config, and backend
COPY packages/ ./packages/
COPY apps/backend/ ./apps/backend/

# Build internal packages, generate Prisma client, and build backend
RUN pnpm --filter @safqa/types build && \
    pnpm --filter @safqa/utils build && \
    pnpm --filter @safqa/backend db:generate && \
    pnpm --filter @safqa/backend build

# Set environment variables and expose port
ENV PORT=10000
ENV NODE_ENV=production
EXPOSE 10000

# Start backend application
CMD ["pnpm", "--filter", "@safqa/backend", "start"]
