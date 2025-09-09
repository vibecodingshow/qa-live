# Deployment Options

This project supports two deployment configurations:

## 1. Standalone Deployment

For independent Docker deployment where the application runs on its own domain/port.

### Files:
- `docker-compose-standalone.yml` - Main compose file for standalone deployment
- `web/Dockerfile` - Dockerfile for standalone web build
- `web/vite.config.standalone.js` - Vite config for standalone build
- `web/nginx.conf` - Nginx config for standalone deployment

### Commands:
```bash
# Build and run standalone deployment
npm run build
docker compose up -d

# Access at: http://localhost:6173
```

### Features:
- Serves at root path `/`
- API calls go to `/api/qa-live/`
- Independent deployment
- Port 6173 for web, 3007 for API

## 2. Combined Deployment

For deployment under `/projects/qa-live/` path on the main production site (https://vibecodingshow.ai/projects/qa-live).

### Files:
- `docker-compose-combined-deploy.yml` - Compose file for combined deployment
- `web/Dockerfile-combined-deploy` - Dockerfile for combined web build
- `web/vite.config.prod.js` - Vite config for combined build
- `web/nginx-combined-deploy.conf` - Nginx config for combined deployment

### Commands:
```bash
# Build and run combined deployment
npm run build-combined-deploy
docker compose -f docker-compose-combined-deploy.yml up -d

# Access at: http://localhost:6174/projects/qa-live/
```

### Features:
- Serves under `/projects/qa-live/` path
- API calls go to `/api/qa-live/`
- Designed for integration with main production site
- Port 6174 for web, 3007 for API
- Redirects root `/` to `/projects/qa-live/`

## Development

For development, use the standard npm commands:
```bash
npm run dev  # Starts both server and web in development mode
```

## Configuration Differences

| Aspect | Standalone | Combined |
|--------|------------|----------|
| Base Path | `/` | `/projects/qa-live/` |
| Web Port | 6173 | 6174 |
| Asset Paths | `/assets/...` | `/projects/qa-live/assets/...` |
| Root Redirect | None | Redirects to `/projects/qa-live/` |
| Use Case | Independent deployment | Integration with main site |
