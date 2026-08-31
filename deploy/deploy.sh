#!/usr/bin/env bash
# Search2Service — deploy/redeploy script. Run this ON THE VPS from the project root
# (/var/www/search2service), as the deploy user. Safe to re-run on every update:
#   ./deploy/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Pulling latest code from GitHub"
git pull origin main

echo "==> Installing frontend dependencies"
npm ci

echo "==> Building frontend (Next.js standalone)"
npm run build
# Standalone output needs the static assets copied in manually — Next doesn't do this itself.
cp -r .next/static .next/standalone/.next/static

echo "==> Installing backend dependencies"
if [ ! -d backend/venv ]; then
  python3 -m venv backend/venv
fi
backend/venv/bin/pip install --upgrade pip -q
backend/venv/bin/pip install -r backend/requirements.txt -q

echo "==> Restarting services"
sudo systemctl restart search2service-backend
sudo systemctl restart search2service-frontend

echo "==> Done. Checking service status:"
sudo systemctl --no-pager status search2service-backend search2service-frontend | head -20
