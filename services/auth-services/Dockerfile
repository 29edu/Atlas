FROM node:22-alpine

WORKDIR /app

# Install auth-service deps first (layer cache)
COPY services/auth-services/package.json ./services/auth-services/
WORKDIR /app/services/auth-services
RUN npm install

# Copy shared folder (needed by import paths)
WORKDIR /app
COPY shared/ ./shared/

# Copy rest of auth-service source
COPY services/auth-services/ ./services/auth-services/

WORKDIR /app/services/auth-services

ENV NODE_PATH=/app/services/auth-services/node_modules

EXPOSE 3001

CMD ["node", "src/index.js"]
