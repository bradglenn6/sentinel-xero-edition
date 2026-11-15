# ==============================================================================
# ZeroLabz Sentinel: Xero Edition - Production Dockerfile
# ==============================================================================

# --- Stage 1: Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies required for native modules
RUN apk add --no-cache build-base python3

# Copy package descriptors
COPY package*.json ./

# Install all dependencies (bypassing peer dependency conflicts)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build application (compiles TypeScript and bundles static assets via Vite)
RUN npm run build

# --- Stage 2: Production Runtime Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Create non-root system user for security hardening
RUN addgroup --system --gid 1001 zerolabz && \
    adduser --system --uid 1001 sentinel --ingroup zerolabz

# Copy built artifacts and production dependencies from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies safely AND install 'serve' to host the UI
RUN npm ci --only=production --legacy-peer-deps && \
    npm install -g serve && \
    npm cache clean --force

# Change ownership to non-root user
USER sentinel

# Expose Cloud Run default port
EXPOSE 8080

# Serve the static React frontend on port 8080
CMD ["serve", "-s", "dist", "-l", "8080"]