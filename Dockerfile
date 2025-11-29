# Multi-stage build for VideoGraph AI - Render optimized

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build frontend for production
RUN npm run build

# Stage 2: Setup backend to serve frontend
FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy backend source
COPY backend/src ./src

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose single port (Render requirement)
EXPOSE 10000

# Set environment variable for Render
ENV PORT=10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 10000), (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start backend (which will serve frontend)
CMD ["node", "src/server.js"]
