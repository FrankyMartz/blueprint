# STAGE: BUILD -----------------------------------------------------------------

FROM node:24-alpine AS build

WORKDIR /app

# Copy package.json files for workspace
COPY package*.json ./
COPY apps/server/package*.json ./server/

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY apps/server ./apps/server
COPY .env ./apps/server

# Build the application
WORKDIR apps/server
RUN npm run build

# STAGE: PRODUCTION ------------------------------------------------------------

FROM node:24-alpine AS production

WORKDIR /app

# Copy package.json files
COPY apps/server/package*.json ./server/

# Copy the built application
COPY --from=build /app/packages/api/dist ./dist

# Install production dependencies only
RUN npm ci --only=production

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
