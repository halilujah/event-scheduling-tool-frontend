# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configurations
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-main.conf /etc/nginx/nginx.conf

# Create temp directories for nginx to run as non-root
RUN mkdir -p /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chown -R nginx:nginx /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp /usr/share/nginx/html && \
    chmod -R 755 /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp

# Expose port 8080 (Cloud Run standard)
EXPOSE 8080

# Run as non-root user
USER nginx

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
