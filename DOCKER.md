# 🐳 Docker Deployment Guide

## Quick Start with Docker

### Option 1: Using Docker Compose (Recommended)

```bash

#Clone repo before

# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Option 2: Using Docker CLI

```bash
# Build the image
docker build -t videograph-ai .

# Run the container
docker run -d \
  --name videograph-ai \
  -p 5173:5173 \
  -p 5001:5001 \
  videograph-ai

# View logs
docker logs -f videograph-ai

# Stop the container
docker stop videograph-ai
docker rm videograph-ai
```

## Access the Application

Once the container is running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001

## How It Works

The Docker setup uses a **multi-stage build**:

1. **Stage 1**: Builds the React frontend into optimized static files
2. **Stage 2**: Sets up the Node.js backend and serves the built frontend

Both services run in a single container:
- Backend runs on port **5001**
- Frontend is served on port **5173**

## Container Details

- **Base Image**: `node:18-alpine` (lightweight)
- **Services**: Backend API + Frontend static server
- **Health Check**: Monitors backend API health
- **Auto-restart**: Container restarts automatically unless stopped

## Useful Commands

```bash
# Check container status
docker ps

# Check container health
docker inspect videograph-ai | grep Health -A 10

# Access container shell
docker exec -it videograph-ai sh

# Rebuild after code changes
docker-compose up -d --build

# Remove everything (including volumes)
docker-compose down -v
```

## Troubleshooting

**Container won't start?**
- Check logs: `docker-compose logs`
- Ensure ports 5173 and 5001 are not in use

**Can't access the frontend?**
- Wait 10-15 seconds after starting for services to initialize
- Check health status: `docker ps` (should show "healthy")

**Need to update the code?**
- Rebuild: `docker-compose up -d --build`

## Environment Variables

You can customize the deployment by setting environment variables in `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=5001  # Backend port (optional)
```

## Production Notes

- The frontend is built and optimized for production
- Backend runs in production mode
- Health checks ensure service availability
- Container automatically restarts on failure
