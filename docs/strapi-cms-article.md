# Strapi CMS Và Luồng Article

Tài liệu này giải thích phần `apps/cms` trong project Health & Wellness: Strapi hoạt động như th�?nào, các file chính có vai trò gì, và luồng nhập bài viết trong Content Manager được lưu xuống PostgreSQL/Neon ra sao.

## 1. Bức Tranh Tổng Quan

Trong project này, `apps/cms` là backend CMS dùng Strapi. Strapi cung cấp sẵn:

- Admin dashboard tại `http://localhost:1337/admin`.
- Content Manager đ�?nhập bài viết.
- REST API đ�?Nuxt frontend đọc bài viết.
- Quản lý role, permission, media upload, i18n, draft/publish.
- Kết nối PostgreSQL, hiện đang dùng Neon qua `DATABASE_URL`.

Luồng chính:

```txt
Người quản tr�?  -> Strapi Admin UI
  -> Content Manager
  -> Article content type
  -> Strapi core controller/service
  -> PostgreSQL/Neon

Nuxt frontend
  -> Nuxt server API
  -> Strapi REST API
  -> PostgreSQL/Neon
```

Điểm quan trọng: phần nhập form, validate, save, publish trong Content Manager là do **Strapi core** x�?lý. Source code của mình ch�?yếu định nghĩa cấu trúc d�?liệu Article và cấu hình h�?thống.

## 2. Cấu Trúc Thư Mục CMS

Các file quan trọng hiện tại:

```txt
apps/cms
├── config
�?  ├── admin.ts
�?  ├── api.ts
�?  ├── database.ts
�?  ├── middlewares.ts
�?  ├── plugins.ts
�?  └── server.ts
├── public
�?  └── uploads
├── src
�?  ├── index.ts
�?  └── api
�?      └── article
�?          ├── content-types
�?          �?  └── article
�?          �?      └── schema.json
�?          ├── controllers
�?          �?  └── article.ts
�?          ├── routes
�?          �?  └── article.ts
�?          └── services
�?              └── article.ts
├── package.json
├── tsconfig.json
└── .env.development
```

Các thư mục không nên sửa trực tiếp:

- `node_modules`: thư viện đã cài.
- `dist`: code build t�?TypeScript sang JavaScript.
- `.cache`, `.tmp`: cache/build tạm của Strapi.

## 3. `package.json`

File: `apps/cms/package.json`

File này định nghĩa Strapi app, dependencies và script chạy CMS.

Scripts chính:

```json
{
  "develop": "node ./scripts/strapi-env.mjs develop",
  "start": "strapi start",
  "build": "strapi build",
  "strapi": "strapi"
}
```

Ý nghĩa:

- `npm run develop`: chạy Strapi �?ch�?đ�?development, có admin panel và reload khi code đổi.
- `npm run build`: build admin panel và server code.
- `npm run start`: chạy production sau khi build.
- `npm run strapi`: gọi trực tiếp Strapi CLI.

Dependency đáng chú ý:

- `@strapi/strapi`: core framework của Strapi.
- `@strapi/plugin-users-permissions`: plugin phân quyền public/API user.
- `@strapi/plugin-cloud`: plugin Strapi Cloud, hiện chưa phải phần chính của project.
- `pg`: PostgreSQL driver, giúp Strapi kết nối Neon/PostgreSQL.
- `react`, `react-dom`, `styled-components`: Strapi Admin UI dùng React bên trong.
- `typescript`: project CMS đang viết config bằng TypeScript.

## 4. `.env.development`

File: `apps/cms/.env.development`

Đây là file cấu hình runtime cho môi trường dev. Script `npm run develop` nạp file này trước rồi mới chạy Strapi.

Các nhóm biến chính:

```env
HOST=0.0.0.0
PORT=1337
```

Nghĩa là Strapi chạy �?port `1337`.

```env
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
JWT_SECRET=...
```

Đây là các secret đ�?Strapi ký session, JWT, API token và transfer token. Dev có th�?dùng giá tr�?local, production nên tạo secret mạnh.

```env
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://...
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

Đây là phần kết nối Neon. `DATABASE_URL` là connection string Neon. Vì Neon yêu cầu SSL, `database.ts` s�?bật SSL khi thấy `DATABASE_URL`.

```env
STRAPI_SEED=false
```

Biến này điều khiển seed data trong `src/index.ts`. Khi `false`, Strapi không t�?tạo bài mẫu.

## 5. `config/database.ts`

File: `apps/cms/config/database.ts`

File này quyết định Strapi kết nối database nào.

Code chính:

```ts
export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'postgres')
  const databaseUrl = env('DATABASE_URL')

  const connections = {
    postgres: {
      connection: databaseUrl
        ? {
            connectionString: databaseUrl,
            ssl: {
              rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false)
            },
            schema: env('DATABASE_SCHEMA', 'public')
          }
        : {
            host: env('DATABASE_HOST', '127.0.0.1'),
            port: env.int('DATABASE_PORT', 5432),
            database: env('DATABASE_NAME', 'health_wellness'),
            user: env('DATABASE_USERNAME', 'postgres'),
            password: env('DATABASE_PASSWORD', 'postgres'),
            ssl: env.bool('DATABASE_SSL', false) && {
              rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true)
            },
            schema: env('DATABASE_SCHEMA', 'public')
          },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10)
      }
    }
  }

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000)
    }
  }
}
```

Cách hiểu:

- `env('DATABASE_CLIENT', 'postgres')`: đọc loại database, mặc định là PostgreSQL.
- `env('DATABASE_URL')`: nếu có connection string Neon thì dùng Neon.
- Nếu có `DATABASE_URL`, Strapi dùng:
  - `connectionString`: URL Neon.
  - `ssl.rejectUnauthorized`: cấu hình SSL.
  - `schema: public`: schema PostgreSQL mặc định.
- Nếu không có `DATABASE_URL`, Strapi quay v�?cấu hình local:
  - `DATABASE_HOST`
  - `DATABASE_PORT`
  - `DATABASE_NAME`
  - `DATABASE_USERNAME`
  - `DATABASE_PASSWORD`
- `pool.min`, `pool.max`: s�?lượng connection database tối thiểu/tối đa.
- `acquireConnectionTimeout`: thời gian ch�?lấy connection trước khi báo lỗi.

Với project hiện tại, vì `.env.development` có `DATABASE_URL`, Strapi s�?dùng Neon.

## 6. `config/server.ts`

File: `apps/cms/config/server.ts`

```ts
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS')
  }
})
```

Ý nghĩa:

- `host`: địa ch�?Strapi bind server.
- `port`: cổng chạy Strapi, hiện là `1337`.
- `app.keys`: key dùng cho session/cookie signing.

Khi bạn chạy:

```bash
npm run cms:dev
```

Strapi đọc file này đ�?biết chạy �?đâu.

## 7. `config/admin.ts`

File: `apps/cms/config/admin.ts`

```ts
export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET')
  },
  apiToken: {
    salt: env('API_TOKEN_SALT')
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT')
    }
  }
})
```

Ý nghĩa:

- `auth.secret`: secret cho đăng nhập Strapi Admin.
- `apiToken.salt`: salt đ�?tạo API token.
- `transfer.token.salt`: salt cho transfer token, dùng khi migrate/transfer data giữa môi trường.

File này không định nghĩa user/role c�?th�? User và role được Strapi lưu trong database, ví d�?các bảng:

- `admin_users`
- `admin_roles`
- `admin_permissions`

## 8. `config/api.ts`

File: `apps/cms/config/api.ts`

```ts
export default {
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true
  }
}
```

Ý nghĩa:

- `defaultLimit: 25`: nếu API list không truyền pagination, Strapi tr�?tối đa 25 item.
- `maxLimit: 100`: client không được lấy quá 100 item trong một lần.
- `withCount: true`: response pagination có tổng s�?item.

Ví d�?Nuxt đang gọi:

```txt
GET /api/articles?pagination[pageSize]=12
```

Nên Strapi tr�?tối đa 12 bài trong request đó.

## 9. `config/middlewares.ts`

File: `apps/cms/config/middlewares.ts`

```ts
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public'
]
```

Middleware là các lớp x�?lý request trước/sau controller.

Ý nghĩa từng dòng:

- `strapi::logger`: log request.
- `strapi::errors`: format lỗi.
- `strapi::security`: thêm header bảo mật.
- `strapi::cors`: cho phép cross-origin request, cần khi Nuxt gọi Strapi.
- `strapi::poweredBy`: thêm header nhận diện Strapi.
- `strapi::query`: parse query string như `populate=cover`, `filters[...]`.
- `strapi::body`: parse body khi tạo/sửa d�?liệu.
- `strapi::session`: x�?lý session admin.
- `strapi::favicon`: phục v�?favicon.
- `strapi::public`: phục v�?file public, bao gồm ảnh trong `public/uploads`.

Nh�?`strapi::public`, ảnh upload có th�?m�?bằng URL:

```txt
http://localhost:1337/uploads/ten-file.jpg
```

## 10. `config/plugins.ts`

File: `apps/cms/config/plugins.ts`

```ts
export default () => ({})
```

Hiện file này chưa cấu hình plugin riêng.

Strapi vẫn có plugin mặc định/đã cài như:

- Users & Permissions.
- Upload.
- i18n.
- Content Manager.

Sau này nếu cấu hình upload lên Cloudinary/S3/R2, mình s�?thêm config vào file này.

## 11. `src/index.ts`

File: `apps/cms/src/index.ts`

File này chứa lifecycle của Strapi app.

```ts
export default {
  register() {},

  async bootstrap({ strapi }) {
    ...
  }
}
```

`register()`:

- Chạy trong giai đoạn Strapi đăng ký plugin/content type.
- Hiện đang đ�?trống.
- Sau này có th�?dùng đ�?extend plugin hoặc custom field.

`bootstrap({ strapi })`:

- Chạy sau khi Strapi đã load xong.
- Có quyền dùng object `strapi` đ�?gọi service, document service, database, plugin.
- Trong project mình, hàm này dùng đ�?seed bài viết mẫu nếu bật `STRAPI_SEED=true`.

Logic seed:

```ts
if (process.env.STRAPI_SEED !== 'true') {
  return
}
```

Nếu `.env.development` không bật seed, thoát luôn.

```ts
const count = await strapi.documents('api::article.article').count()

if (count > 0) {
  return
}
```

Nếu đã có bài viết, không seed nữa đ�?tránh tạo trùng.

```ts
await strapi.documents('api::article.article').create({
  data: article,
  status: 'published',
  locale: article.locale
})
```

Dòng này tạo Article bằng Document Service của Strapi 5:

- `api::article.article`: UID của content type Article.
- `data`: d�?liệu bài viết.
- `status: 'published'`: tạo và publish luôn.
- `locale`: tạo đúng ngôn ng�?`vi` hoặc `en`.

Hiện `.env.development` đang đ�?

```env
STRAPI_SEED=false
```

nên seed không chạy.

## 12. Article Schema

File: `apps/cms/src/api/article/content-types/article/schema.json`

Đây là file quan trọng nhất cho content Article. Nó định nghĩa Strapi phải tạo content type gì, có field nào, field nào bắt buộc, có đa ngôn ng�?không, có draft/publish không.

Phần đầu:

```json
{
  "kind": "collectionType",
  "collectionName": "articles",
  "info": {
    "singularName": "article",
    "pluralName": "articles",
    "displayName": "Article",
    "description": "Blog article for the Health & Wellness website"
  }
}
```

Ý nghĩa:

- `kind: collectionType`: Article là dạng nhiều bản ghi, giống bảng `articles`.
- `collectionName: articles`: tên collection/table chính trong database.
- `singularName: article`: tên đơn.
- `pluralName: articles`: tên s�?nhiều.
- `displayName: Article`: tên hiển th�?trong Strapi Admin.

Draft & Publish:

```json
"options": {
  "draftAndPublish": true
}
```

Khi bật phần này:

- Bài có trạng thái Draft.
- Bài ch�?public ra API khi Publish, tùy query/permission.
- Database có field liên quan như `published_at`.

i18n:

```json
"pluginOptions": {
  "i18n": {
    "localized": true
  }
}
```

Nghĩa là Article h�?tr�?đa ngôn ng�? Một bài có th�?có bản `vi`, bản `en`.

Các field:

### `title`

```json
"title": {
  "type": "string",
  "required": true,
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  }
}
```

Tiêu đ�?bài viết.

- Kiểu d�?liệu: chuỗi ngắn.
- Bắt buộc nhập.
- Localized: mỗi ngôn ng�?có title riêng.

### `slug`

```json
"slug": {
  "type": "uid",
  "targetField": "title",
  "required": true
}
```

Slug dùng cho URL frontend.

Ví d�?

```txt
/vi/bai-viet/hoc-boxing-cam-nang-nhap-mon
```

`targetField: title` nghĩa là Strapi có th�?t�?gợi ý slug t�?title.

### `excerpt`

```json
"excerpt": {
  "type": "text",
  "required": true,
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  }
}
```

Mô t�?ngắn của bài viết.

Frontend dùng field này �?

- Card bài viết.
- Mô t�?đầu trang chi tiết.
- SEO description fallback.

### `content`

```json
"content": {
  "type": "richtext",
  "required": true,
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  }
}
```

Nội dung chính của bài viết.

Strapi rich text hiện lưu dạng Markdown/string. Nuxt đang parse đơn giản các dạng:

- đoạn văn thường.
- heading `##`.
- heading `###`.
- ảnh Markdown dạng `![alt](url)`.

### `category`

```json
"category": {
  "type": "string",
  "required": true,
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  }
}
```

Chuyên mục bài viết.

Ví d�?

- `Tập luyện`
- `Phục hồi`
- `Dinh dưỡng`
- `boxing`

Nuxt dùng field này đ�?hiển th�?meta và filter.

### `cover`

```json
"cover": {
  "type": "media",
  "multiple": false,
  "required": false,
  "allowedTypes": ["images"]
}
```

Ảnh đại diện bài viết.

- `media`: dùng Upload plugin của Strapi.
- `multiple: false`: mỗi bài ch�?có một ảnh cover.
- `allowedTypes: images`: ch�?cho ảnh.

Lưu ý lưu tr�?

- Metadata ảnh lưu trong PostgreSQL/Neon, ví d�?bảng `files`.
- File ảnh vật lý trong dev nằm �?`apps/cms/public/uploads`.
- Sau này deploy production nên dùng Cloudinary/S3/R2.

### `readingTime`

```json
"readingTime": {
  "type": "integer",
  "default": 4,
  "min": 1
}
```

Thời gian đọc ước tính.

- Kiểu s�?nguyên.
- Mặc định `4`.
- Nh�?nhất `1`.

### `seoTitle`

```json
"seoTitle": {
  "type": "string",
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  }
}
```

Tiêu đ�?SEO riêng nếu sau này muốn dùng khác với title bài viết.

Hiện frontend đang dùng `title` làm SEO title, nhưng field này đã chuẩn b�?sẵn đ�?m�?rộng.

### `seoDescription`

```json
"seoDescription": {
  "type": "text",
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  }
}
```

Mô t�?SEO riêng.

Hiện frontend đang dùng `excerpt` làm description, nhưng sau này có th�?đổi sang `seoDescription`.

## 13. Controller Article

File: `apps/cms/src/api/article/controllers/article.ts`

```ts
import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::article.article')
```

Controller là lớp nhận HTTP request cho Article.

Vì đang dùng `createCoreController`, Strapi t�?tạo các action mặc định:

- `find`: lấy danh sách Article.
- `findOne`: lấy một Article.
- `create`: tạo Article.
- `update`: sửa Article.
- `delete`: xóa Article.

Trong project này, mình chưa custom controller. Nghĩa là mọi CRUD Article dùng logic chuẩn của Strapi.

Ví d�?request t�?frontend:

```txt
GET /api/articles?locale=vi&populate=cover
```

Request này đi vào controller mặc định, sau đó controller gọi service/document service đ�?lấy d�?liệu.

Khi nào cần custom controller?

- Muốn endpoint riêng như `/api/articles/featured`.
- Muốn t�?lọc d�?liệu trước khi tr�?v�?frontend.
- Muốn ẩn một s�?field nhạy cảm.
- Muốn response shape gọn hơn cho Nuxt.

## 14. Service Article

File: `apps/cms/src/api/article/services/article.ts`

```ts
import { factories } from '@strapi/strapi'

export default factories.createCoreService('api::article.article')
```

Service là lớp x�?lý business logic.

Hiện đang dùng service mặc định, nên Strapi t�?x�?lý:

- Query database.
- Tạo bản ghi.
- Cập nhật bản ghi.
- Xóa bản ghi.
- Làm việc với draft/publish.
- Làm việc với locale.
- Làm việc với relation/media.

Khi bạn bấm Save trong Content Manager, Strapi không chạy logic riêng của mình �?đây vì mình chưa override. Nó dùng core service/document service của Strapi.

Khi nào cần custom service?

- T�?tính `readingTime` t�?`content`.
- T�?tạo slug nâng cao.
- T�?gắn category chuẩn hóa.
- Đồng b�?bài viết sang search index.
- Gửi webhook khi publish bài.

## 15. Route Article

File: `apps/cms/src/api/article/routes/article.ts`

```ts
import { factories } from '@strapi/strapi'

export default factories.createCoreRouter('api::article.article')
```

Router tạo REST routes mặc định cho Article.

Các route thường có dạng:

```txt
GET    /api/articles
GET    /api/articles/:id
POST   /api/articles
PUT    /api/articles/:id
DELETE /api/articles/:id
```

Với Strapi 5, bên trong có Document Service và document id, nhưng ý tưởng REST vẫn như trên.

Nuxt hiện dùng:

```txt
GET /api/articles
```

cho c�?danh sách và chi tiết. Với chi tiết, Nuxt truyền filter:

```txt
filters[slug][$eq]=some-slug
pagination[pageSize]=1
```

## 16. Luồng Save Bài Viết Trong Content Manager

Khi bạn tạo bài trong Strapi Admin:

```txt
Content Manager -> Article -> Create new entry
```

và nhập:

- title
- slug
- excerpt
- content
- category
- cover
- readingTime
- locale

Sau đó bấm Save.

Luồng x�?lý:

```txt
1. Admin UI gửi request tới backend Strapi.
2. Strapi kiểm tra bạn có quyền tạo/sửa Article không.
3. Strapi validate d�?liệu theo schema.json.
4. Strapi x�?lý field media, locale, draft/publish.
5. Strapi ghi d�?liệu xuống PostgreSQL/Neon.
6. Strapi tr�?response lại Admin UI.
```

Khi bấm Publish:

```txt
1. Admin UI gửi request publish.
2. Strapi cập nhật trạng thái published.
3. Field published_at được set.
4. Bài viết bắt đầu có th�?được API public tr�?ra, tùy permission/token.
```

Các bảng liên quan trong Neon:

- `articles`: d�?liệu chính của bài viết.
- `files`: metadata file upload.
- `files_related_morphs`: liên kết media với Article.
- `i18n_locale`: danh sách locale.
- `admin_users`: user admin.
- `admin_roles`: role admin.
- `admin_permissions`: quyền admin.
- `strapi_*`: bảng nội b�?của Strapi.

## 17. Luồng Nuxt Đọc Bài Viết T�?Strapi

Phần frontend không gọi database Neon trực tiếp.

Danh sách bài viết:

```txt
apps/web/pages/bai-viet/index.vue
  -> $fetch('/api/articles')
  -> apps/web/server/api/articles.get.ts
  -> fetchFromStrapi('/api/articles')
  -> Strapi REST API
  -> Neon/PostgreSQL
```

Chi tiết bài viết:

```txt
apps/web/pages/bai-viet/[slug].vue
  -> $fetch('/api/articles/:slug')
  -> apps/web/server/api/articles/[slug].get.ts
  -> fetchFromStrapi('/api/articles?filters[slug][$eq]=...')
  -> Strapi REST API
  -> Neon/PostgreSQL
```

Lý do dùng Nuxt server API làm trung gian:

- Giấu API token Strapi nếu sau này cần.
- Format d�?liệu Strapi thành kiểu frontend d�?dùng.
- D�?cache response.
- D�?fallback nếu Strapi chưa chạy.
- Sau này đổi CMS s�?ít ảnh hưởng page Vue.

## 18. Media Upload Hoạt Động Như Th�?Nào

Khi upload ảnh cover trong Strapi:

```txt
Admin UI
  -> Upload plugin
  -> public/uploads
  -> metadata trong bảng files
  -> relation với Article
```

Trong dev local:

```txt
apps/cms/public/uploads
```

là nơi gi�?file ảnh thật.

Trong Neon:

- Không lưu file ảnh thật.
- Ch�?lưu metadata như tên file, url, mime type, size, provider.

Frontend lấy ảnh bằng URL Strapi:

```txt
http://localhost:1337/uploads/ten-file.jpg
```

Trong Nuxt server, hàm `absoluteStrapiUrl()` biến đường dẫn `/uploads/...` thành URL đầy đ�?

## 19. i18n VN/EN Hoạt Động Như Th�?Nào

Article bật localized �?schema:

```json
"pluginOptions": {
  "i18n": {
    "localized": true
  }
}
```

Các field localized gồm:

- `title`
- `excerpt`
- `content`
- `category`
- `seoTitle`
- `seoDescription`

Khi Nuxt gọi:

```txt
GET /api/articles?locale=vi
```

Strapi tr�?bản tiếng Việt.

Khi Nuxt gọi:

```txt
GET /api/articles?locale=en
```

Strapi tr�?bản tiếng Anh.

Field `cover` và `readingTime` hiện không bật localized riêng trong schema, nên thường được xem như d�?liệu chung/không bắt buộc dịch riêng tùy cách Strapi quản lý entry.

## 20. Permission Hoạt Động Như Th�?Nào

Có hai nhóm phân quyền cần phân biệt.

Admin Panel Roles:

```txt
Settings -> Administration Panel -> Roles
```

Dùng cho người vào dashboard Strapi, ví d�?

- Super Admin.
- Marketing ch�?sửa Article.
- HR sau này ch�?sửa Recruitment/Job.

API Public Roles:

```txt
Settings -> Users & Permissions Plugin -> Roles -> Public
```

Dùng cho frontend/public API.

Nếu Nuxt không dùng API token, Public role cần được bật:

```txt
Article -> find
Article -> findOne
```

Nếu dùng API token, Nuxt server gửi token qua header:

```txt
Authorization: Bearer <token>
```

## 21. Khi Nào Cần Code Thêm Backend?

Hiện Article đang dùng CRUD mặc định của Strapi. Đây là cách đúng cho giai đoạn đầu.

Sau này có th�?code thêm khi cần:

- T�?động tính `readingTime` t�?`content`.
- Tạo endpoint bài nổi bật.
- Tạo endpoint bài liên quan.
- Validate category theo danh sách c�?định.
- Tạo collection type `Category` riêng.
- Tạo webhook báo Nuxt revalidate/cache refresh khi publish.
- Cấu hình upload provider cloud.
- Thêm lifecycle hook khi tạo/sửa bài.

Ví d�?logic nên thêm sớm:

```txt
Article content thay đổi
  -> t�?tính readingTime
  -> t�?normalize slug
  -> lưu vào database
```

Nhưng hiện tại chưa bắt buộc, vì Strapi core đã đ�?tốt cho bài viết cơ bản.

## 22. Kết Luận

Phần `apps/cms` hiện là một Strapi backend gọn:

- `schema.json` định nghĩa Article.
- `controller.ts`, `service.ts`, `route.ts` dùng core factory của Strapi.
- `database.ts` kết nối Neon hoặc local PostgreSQL.
- `middlewares.ts` bật các lớp x�?lý request, CORS, body, public uploads.
- `src/index.ts` có seed data tùy chọn.
- Strapi core lo phần form Admin UI, save, publish, permission, media, i18n.

Với Article, mình chưa cần t�?code CRUD vì Strapi đã làm tốt. Code custom ch�?nên thêm khi nghiệp v�?vượt khỏi CMS cơ bản.
