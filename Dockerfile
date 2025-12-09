# --- Base image ---
  FROM node:20-alpine AS base
  WORKDIR /app
  
  # --- Dependencies stage ---
  FROM base AS deps
  COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
  RUN if [ -f yarn.lock ]; then \
        yarn install --frozen-lockfile; \
      elif [ -f package-lock.json ]; then \
        npm ci; \
      else \
        npm install; \
      fi
  
  # --- Build stage ---
  FROM base AS builder
  WORKDIR /app
  COPY . .
  COPY --from=deps /app/node_modules ./node_modules
  RUN if [ -f yarn.lock ]; then \
        yarn build:production; \
      else \
        npm run build:production; \
      fi
  
  # --- Runtime stage ---
  FROM node:20-alpine AS runner
  WORKDIR /app
  
  ENV NODE_ENV=production
  ENV PORT=4001
  
  COPY --from=builder /app/.next ./.next
  COPY --from=builder /app/public ./public
  COPY --from=builder /app/node_modules ./node_modules
  COPY --from=builder /app/package.json ./package.json
  
  EXPOSE 4001
  
  CMD ["npm", "run", "start:production"]
  