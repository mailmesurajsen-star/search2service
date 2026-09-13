# syntax=docker/dockerfile:1
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
FROM node:22-alpine AS frontend-builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Force full installs (incl. devDependencies — needed for `next build`'s
# tailwindcss/postcss) regardless of any NODE_ENV=production the platform
# might inject as a build arg/env before this point.
ENV NPM_CONFIG_PRODUCTION=false
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# BACKEND_URL must be present at build time too — next.config.js reads it inside
# rewrites() to decide how /api/* gets proxied to the backend.
ENV BACKEND_URL=http://127.0.0.1:8000
# Cache mount persists Next.js's incremental build cache across image builds
# (BuildKit-only feature — this is what the "No build cache found" notice is
# about; harmless without it, just slower rebuilds).
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build && cp -r .next/static .next/standalone/.next/static

# ---------- Stage 2: runtime image — Node (frontend) + Python (backend) ----------
FROM node:22-alpine AS runner
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

# --- Backend (FastAPI) --- installed into a venv. Python's own `ensurepip`
# bootstraps pip inside it from bundled wheels in the stdlib, so this doesn't
# depend on the base image's system pip being set up any particular way.
COPY backend ./backend
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir --upgrade pip \
    && /opt/venv/bin/pip install --no-cache-dir -r backend/requirements.txt

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
