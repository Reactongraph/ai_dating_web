# ---------- Base image ----------
  FROM node:20-alpine AS base
  WORKDIR /app
  
  # Helpful for Next.js Node-API/native deps
  RUN apk add --no-cache libc6-compat
  
  # ---------- Dependencies stage (YARN) ----------
  FROM base AS deps
  WORKDIR /app
  
  # Copy only manifests first (better caching)
  COPY package.json yarn.lock ./
  
  # Install dependencies with yarn
  RUN yarn install --frozen-lockfile --network-timeout 600000
  
  # ---------- Build stage ----------
  FROM base AS builder
  WORKDIR /app
  
  # Copy the rest of the source code
  COPY . .
  
  # Reuse node_modules from deps stage
  COPY --from=deps /app/node_modules ./node_modules
  
  # Build production bundle (you have build:production in package.json)
  ENV NODE_ENV=production
  RUN yarn build:production
  
  # ---------- Runtime stage ----------
  FROM node:20-alpine AS runner
  WORKDIR /app
  
  RUN apk add --no-cache libc6-compat
  
  ENV NODE_ENV=production
  ENV PORT=4001
  
  # Copy only what's needed to run the app
  COPY --from=builder /app/.next ./.next
  COPY --from=builder /app/public ./public
  COPY --from=deps    /app/node_modules ./node_modules
  COPY --from=builder /app/package.json ./package.json
  
  EXPOSE 4001
  
  # Yarn can run your npm scripts too
  CMD ["yarn", "start:production"]
  