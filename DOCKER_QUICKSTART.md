# Quick Start Commands

## Start Docker Desktop
Before running the commands below, make sure Docker Desktop is running on your Mac.

## Build and Run (Choose One Method)

### Method 1: Docker Compose (Easiest)
```bash
# Build and start in one command
docker-compose up -d

# View logs
docker-compose logs -f

# Stop when done
docker-compose down
```

### Method 2: Docker CLI
```bash
# Build the image
docker build -t videograph-ai .

# Run the container
docker run -d --name videograph-ai -p 5173:5173 -p 5001:5001 videograph-ai

# View logs
docker logs -f videograph-ai

# Stop when done
docker stop videograph-ai && docker rm videograph-ai
```

## Access the Application
- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:5001**

## Rebuild After Code Changes
```bash
docker-compose up -d --build
```

For complete documentation, see [DOCKER.md](DOCKER.md)
