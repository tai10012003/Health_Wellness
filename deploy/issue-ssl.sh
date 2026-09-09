#!/bin/sh
set -eu

ENV_FILE="${ENV_FILE:-.env.production}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"

read_env() {
  sed -n "s/^$1=//p" "$ENV_FILE" | tail -n 1
}

CERTBOT_EMAIL="$(read_env CERTBOT_EMAIL)"
NGINX_FRONTEND_HOST="$(read_env NGINX_FRONTEND_HOST)"
NGINX_CMS_HOST="$(read_env NGINX_CMS_HOST)"

if [ -z "$CERTBOT_EMAIL" ] || [ "$CERTBOT_EMAIL" = "your-email@example.com" ]; then
  echo "Please set CERTBOT_EMAIL in $ENV_FILE before issuing SSL certificates."
  exit 1
fi

if [ -z "$NGINX_FRONTEND_HOST" ] || [ -z "$NGINX_CMS_HOST" ]; then
  echo "Please set NGINX_FRONTEND_HOST and NGINX_CMS_HOST in $ENV_FILE."
  exit 1
fi

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" run --rm --entrypoint certbot certbot certonly \
  --webroot \
  -w /var/www/certbot \
  --email "$CERTBOT_EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$NGINX_FRONTEND_HOST"

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" run --rm --entrypoint certbot certbot certonly \
  --webroot \
  -w /var/www/certbot \
  --email "$CERTBOT_EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$NGINX_CMS_HOST"

echo "SSL certificates were issued successfully."
echo "Now set NGINX_CONF_TEMPLATE=ssl.conf.template and switch public URLs to https in $ENV_FILE."
