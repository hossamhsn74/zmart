# --- Base image
FROM node:18-alpine

# --- Working directory
WORKDIR /app

# --- Install dependencies (only production deps)
COPY package*.json ./
RUN npm ci --only=production

# --- Copy source code
COPY . .

# --- Build TypeScript
RUN npm run build

# --- Expose app port
EXPOSE 8003

# --- Run migrations before starting app
# (Assumes your TypeORM data source is compiled to dist/data-source.js)
CMD ["sh", "-c", "node dist/migrate.js && node dist/server.js"]
