#!/usr/bin/env bash
# Starts both processes inside a single container:
#   - FastAPI backend on 127.0.0.1:8000 (internal only — never exposed publicly)
#   - Next.js frontend on 0.0.0.0:$PORT (public — proxies /api/* to the backend)
set -e

export ENVIRONMENT="${ENVIRONMENT:-production}"
export BACKEND_URL="${BACKEND_URL:-http://127.0.0.1:8000}"

echo "==> Starting backend (uvicorn) on 127.0.0.1:8000"
HOST=127.0.0.1 PORT=8000 python3 backend/run.py &
BACKEND_PID=$!

# Give the backend a moment to bind before the frontend starts proxying to it.
sleep 2

FRONTEND_PORT="${PORT:-3000}"
echo "==> Starting frontend (Next.js standalone) on 0.0.0.0:${FRONTEND_PORT}"
HOSTNAME=0.0.0.0 PORT="$FRONTEND_PORT" node .next/standalone/server.js &
FRONTEND_PID=$!

trap 'echo "==> Shutting down"; kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null' EXIT INT TERM

wait -n "$BACKEND_PID" "$FRONTEND_PID"
