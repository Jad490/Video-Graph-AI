# Multi-stage build for VideoGraph AI

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

# Stage 2: Setup backend and serve
FROM node:18-alpine

WORKDIR /app

# Install a simple static file server for frontend
RUN npm install -g serve

# Copy backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Copy backend source
COPY backend/src ./src

# Copy built frontend from previous stage
WORKDIR /app
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'cd /app/backend && node src/server.js &' >> /app/start.sh && \
    echo 'cd /app/frontend/dist && serve -s -l 5173 &' >> /app/start.sh && \
    echo 'wait' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose ports
EXPOSE 5001 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start both services
CMD ["/app/start.sh"]
