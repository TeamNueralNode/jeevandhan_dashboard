# Docker Support

This application supports both production and development environments using Docker.

## Quick Start

1. Copy the environment file and configure it:
```bash
cp .env.example .env
# Edit .env with your Convex credentials
```

2. Development mode with hot-reload:
```bash
docker compose up --build
```

3. Production build:
```bash
docker build -t jeevandhan-dashboard .
docker run -p 3000:3000 \
  --env-file .env \
  jeevandhan-dashboard
```

## Docker Development

The development environment uses docker-compose with the following features:
- Hot reload support
- Volume mounting for local development
- Development dependencies included
- Automatic restart on crashes

### Commands

Start development environment:
```bash
docker compose up --build
```

View logs:
```bash
docker compose logs -f
```

Stop all services:
```bash
docker compose down
```

## Production Deployment

The production image is optimized for size and security:
- Multi-stage build process
- Non-root user
- Production dependencies only
- Health checks enabled

### Production Build

Build the production image:
```bash
docker build -t jeevandhan-dashboard:latest .
```

Run the production container:
```bash
docker run -d \
  --name jeevandhan \
  -p 3000:3000 \
  --env-file .env \
  jeevandhan-dashboard:latest
```

### Required Environment Variables

See `.env.example` for required environment variables. At minimum, you need:
- `CONVEX_URL`: Your Convex deployment URL
- `NEXT_PUBLIC_CONVEX_URL`: Public Convex URL for client-side

## Health Checks

The application includes Docker health checks that verify the service is responding on port 3000. The health check:
- Runs every 30 seconds
- Has a 30-second timeout
- Requires 3 retries before marking unhealthy
- Allows 5 seconds startup time

## Volumes

Development environment mounts:
- `.:/app`: Source code
- `/app/node_modules`: Node modules (internal)
- `/app/.next`: Next.js build output (internal)