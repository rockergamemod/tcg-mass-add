# ARG NODE_VERSION=22
# FROM node:${NODE_VERSION}-slim AS base

# #
# # Stage 1: Prune the monorepo to only what the frontend needs
# #
# FROM base AS prepare
# WORKDIR /app
# RUN npm i -g turbo
# COPY . .
# # Produce a minimal workspace containing only tcgplayer-mass-add and its deps
# RUN turbo prune tcgplayer-mass-add --docker

# #
# # Stage 2: Install dependencies for the pruned workspace
# #
# FROM base AS installer
# WORKDIR /app
# COPY --from=prepare /app/out/json/ .
# RUN npm install

# #
# # Stage 3: Build only the frontend
# #
# FROM base AS builder
# WORKDIR /app
# COPY --from=installer /app/node_modules ./node_modules
# COPY --from=prepare /app/out/full/ .
# ENV NEXT_TELEMETRY_DISABLED=1
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
# # Limit turbo to the frontend so the backend build is not triggered
# RUN npx turbo run build --filter=tcgplayer-mass-add...

# #
# # Stage 4: Runtime image
# #
# FROM node:${NODE_VERSION}-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1

# # Create a non-root user
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# # Copy only the artifacts needed to run the app
# COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/public ./apps/frontend/public
# COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static

# USER nextjs

# EXPOSE 3000

# ENV PORT=3000
# ENV HOSTNAME="0.0.0.0"

# # Start the application
# CMD ["node", "apps/frontend/server.js"]


ARG NODE_VERSION=24.11.1
FROM node:${NODE_VERSION}-slim AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# Set working directory
WORKDIR /app

# ---
FROM base AS prepare
RUN npm i -g turbo
COPY . .
# Add lockfile and package.json's of isolated subworkspace
RUN turbo prune frontend --docker

# ---
FROM base AS builder
# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
RUN npm install
# Build the project
COPY --from=prepare /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN npx turbo build

# ---
FROM node:${NODE_VERSION}-alpine AS runner
# Don't run production as root for security reasons
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/public ./apps/frontend/public

CMD node apps/frontend/server.js


