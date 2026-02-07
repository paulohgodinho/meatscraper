# Build stage
FROM node:20-alpine AS builder

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev

# Set working directory
WORKDIR /build

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (ignore optional native builds initially)
RUN npm ci --ignore-scripts || npm install --no-audit --no-fund

# Try to rebuild optional dependencies
RUN npm rebuild 2>/dev/null || true

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Runtime stage
FROM node:20-alpine

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built application from builder
COPY --from=builder --chown=nodejs:nodejs /build/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /build/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /build/package.json ./package.json

# Copy entrypoint script
COPY --chown=nodejs:nodejs docker/docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

# Create directory for input files (when mounting volumes)
RUN mkdir -p /data && chown nodejs:nodejs /data

# Switch to non-root user
USER nodejs

# Expose port for server mode
EXPOSE 8676

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--", "./docker-entrypoint.sh"]

# Default command: will be handled by entrypoint script
# No CMD needed since entrypoint handles all cases
CMD []
