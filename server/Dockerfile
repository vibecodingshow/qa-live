FROM node:22.18.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22.18.0-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create data directory
RUN mkdir -p ./dist/data

# Set environment variables
ENV NODE_ENV=production
ENV SERVER_PORT=3000
ENV LOG_LEVEL=INFO

# Expose the port - will use SERVER_PORT from environment
EXPOSE ${SERVER_PORT:-3000}

# Start the application
CMD ["npm", "start"]