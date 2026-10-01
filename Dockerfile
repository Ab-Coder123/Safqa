FROM node:20-alpine

# Install OpenSSL and libc compatibility for Prisma Engine on Alpine Linux
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Enable pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@10 --activate

# Copy workspace metadata and source files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/backend ./apps/backend

# Install workspace dependencies safely
RUN pnpm install --no-frozen-lockfile

# Dummy DATABASE_URL for build-time prisma generate (runtime uses actual Railway variable)
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/safqa"

# Build internal packages, generate Prisma Client, and build NestJS backend
RUN pnpm --filter @safqa/types build && \
    pnpm --filter @safqa/utils build && \
    pnpm --filter @safqa/backend db:generate && \
    pnpm --filter @safqa/backend build

ENV PORT=10000
ENV NODE_ENV=production
EXPOSE 10000

CMD ["pnpm", "--filter", "@safqa/backend", "start"]
