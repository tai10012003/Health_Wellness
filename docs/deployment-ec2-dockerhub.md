# Deploy EC2 Với Docker Hub, Nginx Và Neon

Tài liệu này mô tả cách deploy project Health & Wellness lên Amazon EC2.

Máy chủ mục tiêu:

```txt
OS: Amazon Linux 2023
Instance: t3.micro
SSH user mặc định: ec2-user
```

`t3.micro` phù hợp dev/test vì GitHub Actions sẽ build Docker image, còn EC2 chỉ kéo image và chạy container. Không nên build image trực tiếp trên `t3.micro` vì RAM 1 GB khá chật cho Nuxt + Strapi.

## Kiến Trúc

```txt
GitHub Actions
  -> build Docker image
  -> push Docker Hub
  -> SSH vào EC2
  -> docker compose pull + up -d

EC2
  -> nginx container, port 80
  -> web container, Nuxt, port 3000 nội bộ
  -> cms container, Strapi, port 1337 nội bộ

Neon
  -> PostgreSQL cloud cho Strapi
```

## Domain Dev/Test Free

Nếu EC2 public IP là `13.250.10.20`, dùng:

```txt
healthwellness.13.250.10.20.nip.io
cms.healthwellness.13.250.10.20.nip.io
```

Không cần cấu hình DNS trên nip.io.

## File Production Trên EC2

Trên EC2 Amazon Linux 2023, cài Docker trước:

```bash
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
```

Đăng xuất SSH rồi đăng nhập lại để quyền Docker có hiệu lực, sau đó kiểm tra:

```bash
docker --version
docker compose version
```

Nếu lệnh `docker compose version` chưa có, cài Docker Compose plugin theo hướng dẫn chính thức của Docker cho Linux/RPM.

Tạo thư mục app cố định trên EC2:

```bash
mkdir -p ~/health-wellness/deploy/nginx
cd ~/health-wellness
```

GitHub Actions sẽ tự copy các file deploy này lên EC2 mỗi lần deploy:

```txt
docker-compose.prod.yml
deploy/.env.production.example
deploy/issue-ssl.sh
deploy/nginx/default.conf.template
deploy/nginx/ssl.conf.template
```

Bạn chỉ cần tự tạo file `.env.production` trên EC2 dựa theo:

```txt
deploy/.env.production.example
```

File `.env.production` trên EC2 không commit lên GitHub.

## GitHub Secrets Cần Tạo

Vào GitHub repo:

```txt
Settings -> Secrets and variables -> Actions -> New repository secret
```

Tạo các secrets thật sự cần thiết:

```txt
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
EC2_HOST
EC2_SSH_KEY
```

Ý nghĩa:

- `DOCKERHUB_USERNAME`: username Docker Hub.
- `DOCKERHUB_TOKEN`: access token Docker Hub, dùng để push image từ GitHub Actions và login Docker Hub trên EC2 khi pull image.
- `EC2_HOST`: public IP hoặc hostname EC2.
- `EC2_SSH_KEY`: private key SSH để vào EC2 bằng user `ec2-user`.

Các giá trị này đã được cố định trong workflow, nên không cần đưa vào GitHub Secrets:

```txt
EC2_USER=ec2-user
EC2_SSH_PORT=22
EC2_APP_DIR=/home/ec2-user/health-wellness
```

Nếu sau này đổi sang Ubuntu hoặc đổi port SSH, lúc đó mới nên sửa workflow hoặc chuyển các giá trị này thành GitHub Variables.

## Biến `.env.production` Trên EC2

Ví dụ:

```env
DOCKERHUB_USERNAME=your-dockerhub-username
IMAGE_TAG=latest
NGINX_CONF_TEMPLATE=default.conf.template
CERTBOT_EMAIL=your-email@example.com

NUXT_PUBLIC_SITE_URL=http://healthwellness.13.250.10.20.nip.io
NUXT_PUBLIC_STRAPI_URL=http://cms.healthwellness.13.250.10.20.nip.io
NGINX_FRONTEND_HOST=healthwellness.13.250.10.20.nip.io
NGINX_CMS_HOST=cms.healthwellness.13.250.10.20.nip.io
PUBLIC_URL=http://cms.healthwellness.13.250.10.20.nip.io
STRAPI_PROXY=true

NUXT_STRAPI_API_TOKEN=

APP_KEYS=replace-with-strong-secret-1,replace-with-strong-secret-2,replace-with-strong-secret-3,replace-with-strong-secret-4
API_TOKEN_SALT=replace-with-strong-secret
ADMIN_JWT_SECRET=replace-with-strong-secret
TRANSFER_TOKEN_SALT=replace-with-strong-secret
JWT_SECRET=replace-with-strong-secret

DATABASE_URL=postgresql://user:password@host/neondb?sslmode=require&channel_binding=require
DATABASE_SSL_REJECT_UNAUTHORIZED=false
STRAPI_SEED=false
```

Nếu dùng Amazon RDS PostgreSQL, nên để `DATABASE_URL` không có `sslmode=require` và để Strapi cấu hình SSL qua `DATABASE_SSL_REJECT_UNAUTHORIZED=false`:

```env
DATABASE_URL=postgresql://postgres:YOUR_RDS_PASSWORD@health-wellness.c1wi4qou8e9k.ap-southeast-1.rds.amazonaws.com:5432/healthwellness_db
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

Sau khi xin SSL thành công, đổi các URL sang `https` và đổi template Nginx:

```env
NGINX_CONF_TEMPLATE=ssl.conf.template
NUXT_PUBLIC_SITE_URL=https://healthwellness.13.250.10.20.nip.io
NUXT_PUBLIC_STRAPI_URL=https://cms.healthwellness.13.250.10.20.nip.io
PUBLIC_URL=https://cms.healthwellness.13.250.10.20.nip.io
```

## Chạy Lần Đầu Trên EC2

Tạo file `.env.production` trên EC2:

```bash
cd ~/health-wellness
nano .env.production
```

Nội dung lấy theo `deploy/.env.production.example`, thay `YOUR_EC2_PUBLIC_IP` bằng public IP thật của EC2 và điền Neon `DATABASE_URL` cùng các secret của Strapi.

Sau đó chạy thử thủ công:

```bash
cd ~/health-wellness
docker compose --env-file .env.production -f docker-compose.prod.yml pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f
```

Mở:

```txt
http://healthwellness.13.250.10.20.nip.io
http://cms.healthwellness.13.250.10.20.nip.io/admin
```

## Bật HTTPS Bằng Let's Encrypt

Chỉ làm phần này sau khi bản HTTP đã chạy được và Security Group đã mở port `80` + `443`.

Trước khi xin cert, đảm bảo `.env.production` đang để:

```env
NGINX_CONF_TEMPLATE=default.conf.template
NUXT_PUBLIC_SITE_URL=http://healthwellness.13.250.10.20.nip.io
NUXT_PUBLIC_STRAPI_URL=http://cms.healthwellness.13.250.10.20.nip.io
PUBLIC_URL=http://cms.healthwellness.13.250.10.20.nip.io
CERTBOT_EMAIL=your-email@example.com
```

Xin certificate:

```bash
sh deploy/issue-ssl.sh
```

Sau khi cả 2 lệnh thành công, sửa `.env.production`:

```env
NGINX_CONF_TEMPLATE=ssl.conf.template
NUXT_PUBLIC_SITE_URL=https://healthwellness.13.250.10.20.nip.io
NUXT_PUBLIC_STRAPI_URL=https://cms.healthwellness.13.250.10.20.nip.io
PUBLIC_URL=https://cms.healthwellness.13.250.10.20.nip.io
```

Restart stack:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f nginx
```

Kiểm tra:

```bash
curl -I https://healthwellness.13.250.10.20.nip.io
curl -I https://cms.healthwellness.13.250.10.20.nip.io/admin
```

Container `certbot` trong Compose sẽ chạy `certbot renew` định kỳ để gia hạn certificate. Sau khi certificate được renew, restart hoặc reload Nginx để Nginx đọc certificate mới:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml exec nginx nginx -s reload
```

## Lưu Ý Upload Ảnh

Hiện Strapi upload ảnh vào Docker volume:

```txt
cms_uploads
```

Deploy lại container không mất ảnh vì volume vẫn còn. Nhưng nếu xóa volume hoặc đổi server EC2 thì ảnh mất. Production lâu dài nên chuyển upload sang S3, Cloudinary hoặc R2.

## Security Group EC2

Mở inbound:

```txt
22/tcp  SSH, chỉ nên cho IP của bạn
80/tcp  HTTP, mở public
443/tcp HTTPS, mở public khi thêm SSL
```

Không cần public port `3000` hoặc `1337` vì Nginx proxy nội bộ.

## CI/CD Hoạt Động Như Nào

Mỗi lần push lên branch `main`, GitHub Actions sẽ:

```txt
1. Build image Nuxt và Strapi trên GitHub runner.
2. Push 2 image lên Docker Hub.
3. SSH vào EC2 bằng user ec2-user.
4. Copy docker-compose.prod.yml và Nginx template lên /home/ec2-user/health-wellness.
5. Login Docker Hub trên EC2.
6. docker compose pull + up -d.
```

File `.env.production` trên EC2 không bị GitHub Actions ghi đè, vì đây là nơi chứa secret runtime như `DATABASE_URL`, `APP_KEYS`, `JWT_SECRET`.
