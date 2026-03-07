#!/usr/bin/env sh
set -eu

# ----------------------------------------------------------------------------
# Nginx reverse proxy bootstrap for stage environment
# Routes:
#   /       -> frontend
#   /api/   -> backend
#   /files/ -> backend
#
# Usage example:
#   sudo DOMAIN=stage.example.com \
#        FRONTEND_UPSTREAM=127.0.0.1:3000 \
#        BACKEND_UPSTREAM=127.0.0.1:8080 \
#        sh scripts/deploy/install-nginx-reverse-proxy.sh
#
# Optional TLS bootstrap (Let's Encrypt):
#   sudo DOMAIN=stage.example.com \
#        ENABLE_HTTPS=true \
#        CERTBOT_EMAIL=devops@example.com \
#        sh scripts/deploy/install-nginx-reverse-proxy.sh
# ----------------------------------------------------------------------------

if [ "$(id -u)" -ne 0 ]; then
  echo "[nginx-setup] run as root (use sudo)"
  exit 1
fi

DOMAIN="${DOMAIN:-}"
SITE_NAME="${SITE_NAME:-courses-stage}"
FRONTEND_UPSTREAM="${FRONTEND_UPSTREAM:-127.0.0.1:3000}"
BACKEND_UPSTREAM="${BACKEND_UPSTREAM:-127.0.0.1:8080}"
ENABLE_HTTPS="${ENABLE_HTTPS:-false}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"

if [ -z "${DOMAIN}" ]; then
  echo "[nginx-setup] DOMAIN is required, e.g. DOMAIN=stage.example.com"
  exit 1
fi

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

install_packages() {
  if command_exists apt-get; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y
    apt-get install -y nginx
    if [ "${ENABLE_HTTPS}" = "true" ]; then
      apt-get install -y certbot python3-certbot-nginx
    fi
    PKG_FAMILY="debian"
    return
  fi

  if command_exists dnf; then
    dnf install -y nginx
    if [ "${ENABLE_HTTPS}" = "true" ]; then
      dnf install -y certbot python3-certbot-nginx
    fi
    PKG_FAMILY="rhel"
    return
  fi

  if command_exists yum; then
    yum install -y nginx
    if [ "${ENABLE_HTTPS}" = "true" ]; then
      yum install -y certbot python3-certbot-nginx
    fi
    PKG_FAMILY="rhel"
    return
  fi

  echo "[nginx-setup] unsupported package manager (apt/dnf/yum not found)"
  exit 1
}

write_nginx_config() {
  if [ "${PKG_FAMILY}" = "debian" ]; then
    SITES_AVAILABLE_DIR="/etc/nginx/sites-available"
    SITES_ENABLED_DIR="/etc/nginx/sites-enabled"
    CONFIG_PATH="${SITES_AVAILABLE_DIR}/${SITE_NAME}.conf"

    mkdir -p "${SITES_AVAILABLE_DIR}" "${SITES_ENABLED_DIR}"

    cat > "${CONFIG_PATH}" <<EOF
server {
    listen 80;
    server_name ${DOMAIN};

    client_max_body_size 200m;

    location / {
        proxy_pass http://${FRONTEND_UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /api/ {
        proxy_pass http://${BACKEND_UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /files/ {
        proxy_pass http://${BACKEND_UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    rm -f /etc/nginx/sites-enabled/default
    ln -sfn "${CONFIG_PATH}" "${SITES_ENABLED_DIR}/${SITE_NAME}.conf"
    return
  fi

  CONFIG_PATH="/etc/nginx/conf.d/${SITE_NAME}.conf"
  cat > "${CONFIG_PATH}" <<EOF
server {
    listen 80;
    server_name ${DOMAIN};

    client_max_body_size 200m;

    location / {
        proxy_pass http://${FRONTEND_UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /api/ {
        proxy_pass http://${BACKEND_UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /files/ {
        proxy_pass http://${BACKEND_UPSTREAM};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
}

enable_and_reload_nginx() {
  systemctl enable nginx
  systemctl start nginx

  nginx -t
  systemctl reload nginx
}

bootstrap_tls_if_enabled() {
  if [ "${ENABLE_HTTPS}" != "true" ]; then
    return
  fi

  if [ -z "${CERTBOT_EMAIL}" ]; then
    echo "[nginx-setup] CERTBOT_EMAIL is required when ENABLE_HTTPS=true"
    exit 1
  fi

  certbot --nginx --non-interactive --agree-tos -m "${CERTBOT_EMAIL}" -d "${DOMAIN}" --redirect

  if command_exists systemctl; then
    systemctl enable certbot.timer || true
    systemctl start certbot.timer || true
  fi
}

print_summary() {
  echo "[nginx-setup] done"
  echo "  domain:              ${DOMAIN}"
  echo "  frontend upstream:   ${FRONTEND_UPSTREAM}"
  echo "  backend upstream:    ${BACKEND_UPSTREAM}"
  echo "  config path:         ${CONFIG_PATH}"
  echo "  https enabled:       ${ENABLE_HTTPS}"
  echo ""
  echo "[nginx-setup] verify:"
  echo "  curl -I http://${DOMAIN}/"
  echo "  curl -I http://${DOMAIN}/api/v1/auth/login"
}

install_packages
write_nginx_config
enable_and_reload_nginx
bootstrap_tls_if_enabled
print_summary
