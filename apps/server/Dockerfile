# STAGE: BUILD -----------------------------------------------------------------
FROM node:24-alpine AS build
WORKDIR /app

# Copy package files for workspace
COPY package*.json ./
COPY package-lock.json ./
COPY apps/server/package*.json ./apps/server/
COPY packages/shared/package*.json ./packages/shared/
COPY .env ./
COPY .env ./apps/server/

# Copy workspace configuration
COPY tsconfig*.json ./

# Copy shared package source code
COPY packages/shared ./packages/shared

# Copy server source code
COPY apps/server ./apps/server

# Install dependencies
RUN npm ci && npm cache clean --force

# Build the shared package first (if needed)
RUN if [ -f "packages/shared/package.json" ]; then npm run build -w packages/shared || true; fi

# Build the application
WORKDIR /app
RUN npm run build -w apps/server
RUN npm run db:push
RUN npm run db:seed

# STAGE: PRODUCTION ------------------------------------------------------------
FROM node:24-alpine AS production

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

# Copy package files for production
COPY --from=build /app/apps/server/.env ./
COPY --from=build /app/apps/server/.env ./apps/server/
COPY --from=build /app/package*.json ./
COPY --from=build /app/apps/server/package*.json ./apps/server/
COPY --from=build /app/packages/shared/package*.json ./packages/shared/

# Copy the built application
COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY --from=build /app/packages/shared/dist ./packages/shared/dist

# Install production dependencies only
RUN npm ci --omit=dev --workspace=apps/server && npm cache clean --force

# Set ownership to non-root user
RUN chown -R appuser:appgroup /app
USER appuser

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "apps/server/dist/src/main.js"]