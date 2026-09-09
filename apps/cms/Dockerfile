FROM node:20-alpine AS builder

WORKDIR /repo

RUN apk add --no-cache build-base python3 vips-dev

COPY package.json ./package.json
COPY apps/cms/package*.json ./apps/cms/
RUN npm ci --prefix apps/cms --legacy-peer-deps

COPY apps/cms ./apps/cms
WORKDIR /repo/apps/cms
ENV NODE_ENV=production
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /repo
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

RUN apk add --no-cache vips

COPY package.json ./package.json
COPY apps/cms/package*.json ./apps/cms/
RUN npm ci --prefix apps/cms --omit=dev --legacy-peer-deps

COPY --from=builder /repo/apps/cms ./apps/cms

WORKDIR /repo/apps/cms
EXPOSE 1337

CMD ["npm", "run", "start"]
