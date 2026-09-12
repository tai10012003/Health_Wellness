# Strapi Uploads Với Amazon S3

Project dùng Strapi Upload plugin với provider `@strapi/provider-upload-aws-s3`.

## Mô Hình Lưu Trữ

```txt
Strapi Admin / Media Library
  -> Upload plugin
  -> Amazon S3 bucket
  -> Metadata lưu trong Amazon RDS PostgreSQL
```

File ảnh thật nằm trên S3:

```txt
s3://health-wellness-uploads/uploads/
```

Metadata ảnh vẫn nằm trong RDS, chủ yếu ở:

```txt
files
upload_folders
files_folder_lnk
files_related_mph
```

## Cấu Hình Bucket Đang Dùng

Bucket:

```txt
Bucket name: health-wellness-uploads
Region: ap-southeast-1
Object Ownership: ACLs disabled (recommended)
Block Public Access: No
Versioning: Off
Encryption: SSE-S3
```

Điểm quan trọng:

```txt
Object Ownership = ACLs disabled
```

Vì vậy không được upload object với ACL `public-read`. Nếu Strapi gửi ACL, S3 có thể báo lỗi:

```txt
AccessControlListNotSupported
The bucket does not allow ACLs
```

Do đó `.env.production` phải để:

```env
AWS_ACL=
```

Quyền đọc public sẽ được cấp bằng **Bucket Policy**, không dùng ACL.

## Bucket Policy

Vào:

```txt
S3 -> health-wellness-uploads -> Permissions -> Bucket policy -> Edit
```

Dán policy này:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadUploads",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::health-wellness-uploads/uploads/*"
    }
  ]
}
```

Policy này chỉ cho public read các object trong:

```txt
uploads/*
```

Không public toàn bộ bucket.

Nếu AWS không cho lưu policy vì Block Public Access, kiểm tra:

```txt
S3 -> health-wellness-uploads -> Permissions -> Block public access
```

Với dev/test, cần cho phép public bucket policy đọc object trong `uploads/*`.

## CORS

CORS chỉ cho phép browser từ domain CMS/local gọi request tới S3. CORS không làm object public.

Vào:

```txt
S3 -> health-wellness-uploads -> Permissions -> Cross-origin resource sharing (CORS)
```

Dùng JSON dạng URL thuần, không dùng markdown link:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:1337",
      "https://cms.healthwellness.13.214.164.206.nip.io"
    ],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3000
  }
]
```

Sai:

```txt
[https://cms.healthwellness...](https://cms.healthwellness...)
```

Đúng:

```txt
https://cms.healthwellness.13.214.164.206.nip.io
```

## IAM Policy Cho Strapi

IAM user hoặc role dùng cho Strapi cần quyền với bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "StrapiS3Uploads",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::health-wellness-uploads",
        "arn:aws:s3:::health-wellness-uploads/*"
      ]
    }
  ]
}
```

## Code Liên Quan

```txt
apps/cms/config/plugins.ts
apps/cms/config/middlewares.ts
apps/cms/package.json
apps/cms/package-lock.json
docker-compose.prod.yml
```

`plugins.ts` bật S3 provider khi có `AWS_BUCKET`.

Nếu `AWS_BUCKET` trống, Strapi dùng local upload provider mặc định. Nhờ vậy local dev không bắt buộc dùng S3.

`middlewares.ts` mở Content Security Policy để Strapi Admin preview ảnh từ S3.

`docker-compose.prod.yml` truyền biến AWS vào container `cms`.

## Env Trên EC2

Mở file:

```bash
nano /home/ec2-user/health-wellness/.env.production
```

Thêm hoặc cập nhật:

```env
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=ap-southeast-1
AWS_BUCKET=health-wellness-uploads
AWS_S3_ROOT_PATH=uploads
AWS_S3_BASE_URL=https://health-wellness-uploads.s3.ap-southeast-1.amazonaws.com
AWS_ACL=
```

Vì bucket đang `ACLs disabled`, giữ:

```env
AWS_ACL=
```

Không dùng:

```env
AWS_ACL=public-read
```

## Cấu Trúc Quản Lý Ảnh

Strapi có một Media Library chung. Vì vậy ta lưu object trên S3 dưới root path:

```txt
uploads/
```

Sau đó tạo folder trong Strapi Media Library:

```txt
Articles
Job Posts
Homepage
Careers
```

Các folder này là folder quản lý trong CMS. Chúng giúp editor phân loại ảnh theo nghiệp vụ, còn S3 đóng vai trò storage backend.

Trong Strapi Admin:

```txt
Media Library -> Create new folder
```

Khi upload ảnh cho bài viết, editor chọn folder `Articles`. Khi upload ảnh tuyển dụng, editor chọn folder `Job Posts`.

## Deploy

Sau khi commit code và push lên GitHub, CI/CD sẽ build image mới.

Trên EC2, sau khi `.env.production` có biến S3:

```bash
cd /home/ec2-user/health-wellness
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f cms
```

## Test Upload

Vào Strapi Admin:

```txt
Media Library -> Add new asset
```

Upload ảnh thử.

Kiểm tra trên AWS S3:

```txt
S3 -> health-wellness-uploads -> uploads/
```

Kiểm tra URL object:

```txt
https://health-wellness-uploads.s3.ap-southeast-1.amazonaws.com/uploads/<file-name>
```

Kiểm tra metadata trong RDS:

```sql
SELECT id, name, url, provider, mime, size
FROM files
ORDER BY created_at DESC
LIMIT 10;
```

Kỳ vọng `provider` là:

```txt
aws-s3
```

## Lỗi Thường Gặp

### AccessControlListNotSupported

Nguyên nhân:

```txt
Bucket đang ACLs disabled nhưng env lại để AWS_ACL=public-read.
```

Cách sửa:

```env
AWS_ACL=
```

Sau đó restart CMS.

### 403 Khi Mở URL Ảnh

Nguyên nhân thường gặp:

```txt
Bucket Policy chưa public read uploads/*
Block Public Access đang chặn public policy
Object không nằm trong prefix uploads/
```

Kiểm tra Bucket Policy và `AWS_S3_ROOT_PATH=uploads`.

### Ảnh Upload Được Nhưng Không Preview Trong Strapi Admin

Nguyên nhân thường gặp:

```txt
CORS sai domain
CSP chưa cho phép S3 host
AWS_S3_BASE_URL sai region/bucket
```

Kiểm tra CORS dùng URL thuần:

```txt
https://cms.healthwellness.13.214.164.206.nip.io
```

Không dùng markdown link.

## Lưu Ý Ảnh Cũ

Ảnh cũ từng upload ở local/EC2 volume không tự chuyển sang S3.

Với dev/test, cách đơn giản nhất là upload lại ảnh qua Strapi Admin sau khi S3 provider đã bật.
