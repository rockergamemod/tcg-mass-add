# # TODO: Add a build stage to build the NestJS application and then copy the built files into the production stage.
# # TODO: Add proper production environment variable declarations and defaults
# # TODO: Add proper labels, annotations, maintainer, etc for registry image storage

# FROM node:22-alpine

# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy source code
# COPY . .

# # Build the NestJS application
# RUN npm run build

# # Expose the port
# EXPOSE 3000

# # Start the production server
# CMD ["npm", "run", "start"]

ARG NODE_VERSION=24.11.1
FROM node:${NODE_VERSION}-slim AS base

# The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.

FROM base AS prepare
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# Set working directory
WORKDIR /app
RUN npm i -g turbo
COPY . .
RUN turbo prune backend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS builder
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
RUN npm install

# Build the project and its dependencies
COPY --from=prepare /app/out/full/ .


# RUN npm run build
# RUN npm i -g turbo
RUN npx turbo build

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=builder /app .

CMD node apps/backend/dist/main.js