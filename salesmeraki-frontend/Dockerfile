FROM node:18.19.1-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies with cache optimization
RUN npm ci --production=false --no-audit

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_SOCKET_URL

# Note: Sensitive environment variables should be passed at runtime
# For build-time, we only set public variables
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}
ENV NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL}
ENV NODE_ENV=production

# Next.js collects anonymous telemetry data about general usage
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application with type checking disabled
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir -p .next/cache .next/static
RUN chown -R nextjs:nodejs .next

# Copy the standalone directory if it exists, otherwise copy the regular .next directory
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Note: Security-related environment variables should be passed at runtime
# These are placeholders that will be overridden by runtime environment variables
ENV NEXTAUTH_URL=http://localhost:3002

# Switch to non-root user
USER nextjs

# Expose the port
EXPOSE 3002

# Set the environment variable for the port
ENV PORT=3002

# Use a flexible start command
CMD ["sh", "-c", "if [ -f server.js ]; then node server.js; else node node_modules/next/dist/bin/next start -p 3002; fi"]
