#!/usr/bin/env sh
set -eu

# -----------------------------------------------------------------------------
# Deploy/update frontend container on stage host (without direct backend network)
#
# Expected environment variables:
#   FRONTEND_IMAGE        (required)  e.g. ghcr.io/org/repo/frontend:main
#   FRONTEND_CONTAINER    (optional)  default: courses-frontend
#   FRONTEND_HOST_PORT    (optional)  default: 3000
#   NEXT_PUBLIC_API_URL   (required)  e.g. https://stage.example.com
#   FRONTEND_DEPLOY_DIR   (optional)  default: /root/frontend
#
# The container is published only to localhost:
#   127.0.0.1:${FRONTEND_HOST_PORT}:3000
# Nginx (on host) should proxy external traffic to this local port.
# -----------------------------------------------------------------------------

FRONTEND_IMAGE="${FRONTEND_IMAGE:-}"
FRONTEND_CONTAINER="${FRONTEND_CONTAINER:-courses-frontend}"
FRONTEND_HOST_PORT="${FRONTEND_HOST_PORT:-3000}"
NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-}"
FRONTEND_DEPLOY_DIR="${FRONTEND_DEPLOY_DIR:-/root/frontend}"

if [ -z "${FRONTEND_IMAGE}" ]; then
  echo "[frontend-deploy] FRONTEND_IMAGE is required"
  exit 1
fi

if [ -z "${NEXT_PUBLIC_API_URL}" ]; then
  echo "[frontend-deploy] NEXT_PUBLIC_API_URL is required"
  exit 1
fi

case "${FRONTEND_HOST_PORT}" in
  ''|*[!0-9]*)
    echo "[frontend-deploy] FRONTEND_HOST_PORT must be numeric"
    exit 1
    ;;
esac

echo "[frontend-deploy] pulling image: ${FRONTEND_IMAGE}"
docker pull "${FRONTEND_IMAGE}"

mkdir -p "${FRONTEND_DEPLOY_DIR}"

if docker ps -a --format '{{.Names}}' | grep -qx "${FRONTEND_CONTAINER}"; then
  echo "[frontend-deploy] removing existing container: ${FRONTEND_CONTAINER}"
  docker rm -f "${FRONTEND_CONTAINER}"
fi

echo "[frontend-deploy] starting container: ${FRONTEND_CONTAINER}"
docker run -d \
  --name "${FRONTEND_CONTAINER}" \
  --restart unless-stopped \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL}" \
  -p "127.0.0.1:${FRONTEND_HOST_PORT}:3000" \
  "${FRONTEND_IMAGE}"

echo "[frontend-deploy] waiting for container startup"
sleep 5

if ! docker ps --format '{{.Names}}' | grep -qx "${FRONTEND_CONTAINER}"; then
  echo "[frontend-deploy] container is not running"
  exit 1
fi

echo "[frontend-deploy] done"
echo "  container: ${FRONTEND_CONTAINER}"
echo "  image:     ${FRONTEND_IMAGE}"
echo "  deploy dir:${FRONTEND_DEPLOY_DIR}"
echo "  local url: http://127.0.0.1:${FRONTEND_HOST_PORT}/"
