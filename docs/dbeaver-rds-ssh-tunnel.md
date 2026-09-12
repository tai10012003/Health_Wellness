# DBeaver Kết Nối Amazon RDS Qua EC2 SSH Tunnel

Tài liệu này hướng dẫn cách dùng DBeaver trên máy local để xem/query database Amazon RDS PostgreSQL của project Health & Wellness.

## Vì Sao Cần SSH Tunnel

RDS hiện đang cấu hình:

```txt
Publicly accessible: No
```

Nghĩa là database không mở trực tiếp ra internet. Máy local không thể kết nối thẳng tới RDS. EC2 nằm trong cùng VPC và security group của RDS cho phép EC2 truy cập port `5432`, nên DBeaver sẽ đi qua EC2:

```txt
DBeaver trên máy local
  -> SSH vào EC2
  -> EC2 kết nối nội bộ tới RDS
  -> PostgreSQL database healthwellness_db
```

## Thông Tin Kết Nối

RDS PostgreSQL:

```txt
Host: health-wellness.c1wi4qou8e9k.ap-southeast-1.rds.amazonaws.com
Port: 5432
Database: healthwellness_db
Username: postgres
Password: mật khẩu RDS của bạn
SSL mode: require
```

EC2 SSH:

```txt
Host: ec2-13-214-164-206.ap-southeast-1.compute.amazonaws.com
Port: 22
User: ec2-user
Private key: C:\Users\pham.tai\Downloads\healthwellness_keypair.pem
```

## Cấu Hình Trong DBeaver

1. Mở DBeaver.
2. Chọn `New Database Connection`.
3. Chọn `PostgreSQL`.
4. Tab `Main`, điền:

```txt
Host: health-wellness.c1wi4qou8e9k.ap-southeast-1.rds.amazonaws.com
Port: 5432
Database: healthwellness_db
Username: postgres
Password: mật khẩu RDS của bạn
```

5. Tab `SSL`, bật SSL nếu DBeaver yêu cầu:

```txt
SSL mode: require
```

6. Tab `SSH`, bật `Use SSH Tunnel`.
7. Điền:

```txt
Host/IP: ec2-13-214-164-206.ap-southeast-1.compute.amazonaws.com
Port: 22
User Name: ec2-user
Authentication Method: Public Key
Private Key: C:\Users\pham.tai\Downloads\healthwellness_keypair.pem
```

8. Bấm `Test Connection`.

Nếu DBeaver hỏi tải PostgreSQL driver, bấm `Download`.

## Lỗi Đã Gặp

Lỗi:

```txt
Error initializing tunnel
Error establishing SSHJ tunnel
java.io.FileNotFoundException: C:\Users\pham.tai\ssh\known_hosts
The system cannot find the path specified
```

Ý nghĩa:

```txt
DBeaver SSHJ đang tìm file known_hosts tại C:\Users\pham.tai\ssh\known_hosts
nhưng đường dẫn đó không tồn tại hoặc parent path không phải thư mục.
```

Trong trường hợp đã gặp, path:

```txt
C:\Users\pham.tai\ssh
```

đang là một file rỗng, không phải folder. Vì vậy Windows không thể tạo:

```txt
C:\Users\pham.tai\ssh\known_hosts
```

## Cách Sửa Lỗi Known Hosts

Mở PowerShell và kiểm tra:

```powershell
Test-Path "$env:USERPROFILE\ssh"
Get-Item "$env:USERPROFILE\ssh" -Force | Format-List FullName,PSIsContainer,Mode,Length
```

Nếu kết quả có:

```txt
PSIsContainer : False
```

thì `ssh` đang là file, cần đổi tên nó đi:

```powershell
Rename-Item "$env:USERPROFILE\ssh" "$env:USERPROFILE\ssh_old"
```

Tạo lại `ssh` thành folder:

```powershell
New-Item -ItemType Directory -Path "$env:USERPROFILE\ssh" -Force
```

Tạo file `known_hosts`:

```powershell
New-Item -ItemType File -Path "$env:USERPROFILE\ssh\known_hosts" -Force
```

Kiểm tra:

```powershell
Test-Path "$env:USERPROFILE\ssh\known_hosts"
```

Nếu trả về:

```txt
True
```

là OK.

Ghi host key EC2 vào `known_hosts`:

```powershell
ssh-keyscan ec2-13-214-164-206.ap-southeast-1.compute.amazonaws.com | Out-File -Encoding ascii "$env:USERPROFILE\ssh\known_hosts"
```

Kiểm tra nội dung:

```powershell
Get-Content "$env:USERPROFILE\ssh\known_hosts"
```

Sau đó quay lại DBeaver và bấm `Test Connection`.

## Kiểm Tra Dữ Liệu Sau Khi Kết Nối

Trong DBeaver, mở:

```txt
healthwellness_db
  -> Schemas
    -> public
      -> Tables
```

Các bảng Strapi thường thấy:

```txt
articles
job_posts
admin_users
admin_roles
admin_permissions
files
upload_folders
i18n_locale
```

Query kiểm tra bài viết:

```sql
SELECT id, title, slug, locale, published_at
FROM articles
LIMIT 10;
```

Query kiểm tra bài tuyển dụng:

```sql
SELECT id, title, slug, locale, published_at
FROM job_posts
LIMIT 10;
```

Xem cấu trúc bảng:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'articles'
ORDER BY ordinal_position;
```

## Lưu Ý

DBeaver dùng để xem/query/debug database. Thêm, sửa, xóa nội dung nghiệp vụ như Article hoặc Job Post nên thao tác qua Strapi Admin để Strapi xử lý đúng draft/publish, i18n, relation, media và permission.

RDS là nơi lưu dữ liệu thật. EC2 chỉ là cầu nối SSH và nơi chạy app.
