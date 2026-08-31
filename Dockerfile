# Search2Service — single-container image running both the Next.js frontend
# (standalone build) and the FastAPI backend, started together by start.sh.
# Only the frontend's port is meant to be published; the backend stays on
# 127.0.0.1 inside the container and is reached only via the frontend's
# internal /api/* proxy (BACKEND_URL).

# ---------- Stage 1: build the Next.js frontend ----------
FROM node:20-slim AS frontend-builder
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
FROM node:20-slim AS runner
WORKDIR /app

# Python runtime + build headers for the FastAPI backend's dependencies
# (cryptography/bcrypt/Pillow occasionally need to compile if no prebuilt wheel
# matches the base image exactly — cheap to keep, safer than a failed pip install).
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 python3-pip python3-venv build-essential libffi-dev \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# --- Frontend (Next.js standalone output) ---
COPY --from=frontend-builder /app/.next/standalone ./
COPY --from=frontend-builder /app/.next/static ./.next/static

# --- Backend (FastAPI) ---
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
