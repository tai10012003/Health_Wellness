# Strapi CMS

This app stores Health & Wellness CMS content.

## Article Content Type

`Article` is already defined in:

```txt
src/api/article/content-types/article/schema.json
```

Fields:

- `title`
- `slug`
- `excerpt`
- `content`
- `category`
- `cover`
- `readingTime`
- `seoTitle`
- `seoDescription`

The content type supports draft/publish and localization.

Local media uploads are stored in `public/uploads` during development.

## Run Locally

Start PostgreSQL first:

```bash
docker compose -f ../../infra/docker-compose.yml up -d
```

Then run Strapi:

```bash
npm run develop
```

Admin panel:

```txt
http://localhost:1337/admin
```

## Connect Nuxt

Nuxt expects Strapi at:

```txt
NUXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

For private API access, create a Strapi API token and set:

```txt
NUXT_STRAPI_API_TOKEN=your-token
```

Without Strapi running, Nuxt returns fallback article data so the frontend still works.

## Public Permissions

If you do not use an API token, open Strapi Admin and allow public read access:

```txt
Settings -> Users & Permissions -> Roles -> Public -> Article -> find / findOne
```
