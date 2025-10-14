# syntax=docker/dockerfile:1.7

############################################
# Base Node image
############################################
FROM node:18-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache tini

############################################
# Install dependencies (including dev deps for build)
############################################
FROM base AS deps
COPY package*.json ./
RUN npm ci

############################################
# Build the Vite application
############################################
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

############################################
# Final runtime image (Node only)
############################################
FROM base AS runner
ENV TZ=Asia/Jakarta

USER node

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --chown=node:node package*.json ./

# Healthcheck: Vite preview serves on port 4173 by default
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4173/ >/dev/null || exit 1

ENTRYPOINT ["/sbin/tini","--"]

EXPOSE 4173

CMD ["npm","run","preview","--","--host","0.0.0.0","--port","4173"]

