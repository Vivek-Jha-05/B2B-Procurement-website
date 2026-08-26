# -------------------------------------------------------------
# Stage 1: Build the React / Vite Frontend
# -------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app

# Cache dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend source files
COPY tsconfig.json vite.config.ts index.html ./
COPY public/ ./public/
COPY src/ ./src/

# Build client production bundle (outputs to /app/dist)
RUN npm run build

# -------------------------------------------------------------
# Stage 2: Build the TypeScript Backend
# -------------------------------------------------------------
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

# Cache dependencies
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

# Copy backend source files
COPY backend/tsconfig.json ./
COPY backend/src/ ./src/

# Compile TypeScript to JavaScript (outputs to /app/backend/dist)
RUN npm run build

# -------------------------------------------------------------
# Stage 3: Production Runtime Environment
# -------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Environment defaults
ENV NODE_ENV=production
ENV PORT=3001
ENV CLIENT_DIST_PATH=/app/dist

# Security: Create and use non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Setup backend runtime directory
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled backend output from Stage 2
COPY --from=backend-builder /app/backend/dist ./dist

# Copy compiled frontend output from Stage 1
COPY --from=frontend-builder /app/dist /app/dist

# Ensure proper permissions
RUN chown -R nodejs:nodejs /app

USER nodejs

# Railway provides dynamic $PORT at runtime
EXPOSE 3001

# Health check against backend health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3001}/api/health || exit 1

# Start the unified server
CMD ["node", "dist/server.js"]
