# Search2Service — single-container image running both the Next.js frontend
# (standalone build) and the FastAPI backend, started together by start.sh.
# Only the frontend's port is meant to be published; the backend stays on
# 127.0.0.1 inside the container and is reached only via the frontend's
# internal /api/* proxy (BACKEND_URL).
#
# Uses Alpine base images to keep the image small — a smaller image downloads
# and extracts faster, which matters on a small/low-bandwidth VPS where large
# layer pulls can time out mid-transfer.

# ---------- Stage 1: build the Next.js frontend ----------
FROM node:20-alpine AS frontend-builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# BACKEND_URL must be present at build time too — next.config.js reads it inside
# rewrites() to decide how /api/* gets proxied to the backend.
ENV BACKEND_URL=http://127.0.0.1:8000
RUN npm run build && cp -r .next/static .next/standalone/.next/static

# ---------- Stage 2: runtime image — Node (frontend) + Python (backend) ----------
FROM node:20-alpine AS runner
WORKDIR /app

# libc6-compat: Next.js standalone's native addons need it at runtime on Alpine,
# not just at build time.
# python3/py3-pip: backend runtime.
# gcc/musl-dev/libffi-dev: fallback build headers, in case a backend dependency
# (cryptography/bcrypt/Pillow) has no prebuilt musl wheel for this Python version.
RUN apk add --no-cache libc6-compat python3 py3-pip gcc musl-dev libffi-dev

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# --- Frontend (Next.js standalone output) ---
COPY --from=frontend-builder /app/.next/standalone ./
COPY --from=frontend-builder /app/.next/static ./.next/static

# --- Backend (FastAPI) --- installed straight into the system Python: this
# container only ever runs this one app, so a venv buys nothing but adds a
# dependency on the `venv` stdlib module being present. --break-system-packages
# opts out of PEP 668's "externally managed" guard, which Alpine's python3
# package enables by default.
COPY backend ./backend
RUN pip install --break-system-packages --no-cache-dir --upgrade pip \
    && pip install --break-system-packages --no-cache-dir -r backend/requirements.txt

COPY start.sh ./start.sh
RUN chmod +x start.sh

# Defaults — override JWT_SECRET (required), CORS_ORIGINS, DB_ENGINE/MYSQL_* etc.
# via your platform's environment variable settings. See .env.example.
ENV BACKEND_URL=http://127.0.0.1:8000
ENV ENVIRONMENT=production
ENV DB_ENGINE=sqlite
ENV SQLITE_PATH=/app/backend/data/search2service.db

EXPOSE 3000
CMD ["./start.sh"]
