# Health Wellness

Nuxt frontend for a bilingual Health & Wellness service website.

## Apps

- `apps/web`: Nuxt frontend
- `apps/cms`: Strapi CMS backend for content management
- `infra`: infrastructure notes and Docker/PostgreSQL setup later

## Run Frontend

```bash
npm --prefix apps/web install
npm run dev
```

The frontend app is in `apps/web`.

## Run CMS

```bash
npm --prefix apps/cms install --legacy-peer-deps
npm run cms:dev
```

The Strapi admin panel will run at `http://localhost:1337/admin`.

## PostgreSQL

Start the local database before running Strapi:

```bash
docker compose -f infra/docker-compose.yml up -d
```

Create `apps/cms/.env` from `apps/cms/.env.example`, then replace the secret values.

## Articles Flow

Nuxt reads articles through its server API:

```txt
GET /api/articles?locale=vi
GET /api/articles?locale=en
```

The server route tries Strapi first. If Strapi is not running yet, it returns fallback articles from `apps/web/data/site-content.ts`.
