# Use official Node.js runtime as base image
FROM node:latest

# Set working directory in container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev for TypeScript)
RUN npm ci

# Copy TypeScript source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm ci --only=production && npm cache clean --force

# Expose port (if needed for health checks)
EXPOSE 3000

# Start the MCP server with explicit stdin/stdout handling
CMD ["node", "dist/index.js"] 