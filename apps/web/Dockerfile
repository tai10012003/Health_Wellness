FROM node:20-alpine AS builder

WORKDIR /repo

COPY apps/web/package*.json ./apps/web/
RUN npm ci --prefix apps/web --legacy-peer-deps

COPY apps/web ./apps/web
WORKDIR /repo/apps/web
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder /repo/apps/web/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
