FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects anonymous telemetry data about general usage
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application with type checking disabled
RUN npm run build:force

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir -p .next/static
RUN chown nextjs:nodejs .next

# Copy the built app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy Next.js output
COPY --from=builder /app/.next ./.next

USER nextjs

EXPOSE 3001

ENV PORT=3001

# Use a flexible start command
CMD ["sh", "-c", "if [ -f .next/standalone/server.js ]; then node .next/standalone/server.js; else node node_modules/next/dist/bin/next start -p 3001; fi"]
