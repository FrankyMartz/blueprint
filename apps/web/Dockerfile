# STAGE: BUILD -----------------------------------------------------------------

# Build stage
FROM node:24-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the application
WORKDIR /app/apps/web
RUN npm run build


# STAGE: PRODUCTION ------------------------------------------------------------

# Production stage
FROM nginx:alpine AS production

# Copy the build output
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
