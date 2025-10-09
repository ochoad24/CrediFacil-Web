# Build stage
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL
ARG PUBLIC_NAME_COMPANY
ARG VITE_RECAPTCHA_SITE_KEY

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV PUBLIC_NAME_COMPANY=$PUBLIC_NAME_COMPANY
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Runtime stage
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

# Expose port (default 3000, can be changed via .env)
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Run the application
CMD ["node", "build"]
