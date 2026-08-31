# Deploying Search2Service to a VPS (via GitHub)

This app is two processes behind one nginx reverse proxy:

- **Frontend** — Next.js (built with `output: 'standalone'`), serves the site and
  internally proxies `/api/*` to the backend.
- **Backend** — FastAPI (Python), stores data in a local SQLite file by default
  (no separate database server to install).

Tested against a small VPS (1 vCPU / a few GB RAM — e.g. Hostinger KVM 1) running
Ubuntu 22.04/24.04. Debian works the same way with minor package-manager differences.

## 1. One-time server setup

SSH into the VPS as root (or a sudo user), then:

```bash
# System packages
sudo apt update && sudo apt install -y git curl nginx python3 python3-venv python3-pip

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# A dedicated, non-root user to run the app
sudo adduser --disabled-password --gecos "" deploy
sudo mkdir -p /var/www/search2service
sudo chown deploy:deploy /var/www/search2service
```

## 2. Get the code onto the server

**Public repo** — simplest:

```bash
sudo -u deploy git clone https://github.com/<your-username>/<your-repo>.git /var/www/search2service
```

**Private repo** — generate a deploy key on the server and add it as a read-only
Deploy Key on the GitHub repo (Settings > Deploy keys):

```bash
sudo -u deploy ssh-keygen -t ed25519 -f /home/deploy/.ssh/id_ed25519 -N ""
sudo -u deploy cat /home/deploy/.ssh/id_ed25519.pub   # paste this into GitHub
sudo -u deploy git clone git@github.com:<your-username>/<your-repo>.git /var/www/search2service
```

## 3. Configure environment variables

```bash
cd /var/www/search2service
sudo -u deploy cp .env.example .env
sudo -u deploy nano .env
```

At minimum, set:
- `JWT_SECRET` — generate with `openssl rand -hex 32`. **The app refuses to start
  in production without this.**
- `ENVIRONMENT=production`
- `BACKEND_URL=http://127.0.0.1:8000` (leave as-is — internal loopback, not public)
- `CORS_ORIGINS=https://yourdomain.com` (tighten from the default `*`)

## 4. First build and install

```bash
cd /var/www/search2service
sudo chmod +x deploy/deploy.sh
sudo -u deploy ./deploy/deploy.sh   # first run will fail at the "restart services" step — that's expected, they don't exist yet
```

That builds the frontend, copies static assets into the standalone output, and
creates/populates the Python venv. Ignore the systemctl error at the end for now.

## 5. Install the systemd services

```bash
sudo cp deploy/search2service-backend.service /etc/systemd/system/
sudo cp deploy/search2service-frontend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now search2service-backend
sudo systemctl enable --now search2service-frontend
sudo systemctl status search2service-backend search2service-frontend
```

Both should show `active (running)`. If not, check logs:

```bash
sudo journalctl -u search2service-backend -n 50 --no-pager
sudo journalctl -u search2service-frontend -n 50 --no-pager
```

## 6. nginx + SSL

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/search2service
sudo nano /etc/nginx/sites-available/search2service   # replace yourdomain.com
sudo ln -s /etc/nginx/sites-available/search2service /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Free SSL cert (also sets up auto-renewal)
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Point your domain's DNS A record at the VPS IP before running certbot.

Visit `https://yourdomain.com` — the site should load.

## 7. Redeploying after future pushes

**Manual** — SSH in and run:

```bash
cd /var/www/search2service && sudo -u deploy ./deploy/deploy.sh
```

**Automatic on `git push`** — this repo includes
`.github/workflows/deploy.yml`, which SSHes into the VPS and runs the same script.
To enable it, add these secrets on GitHub (Settings > Secrets and variables >
Actions):

| Secret | Value |
|---|---|
| `VPS_HOST` | your server IP or domain |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | private key with access to the `deploy` user (see below) |
| `VPS_PORT` | `22` (optional, only needed if you use a different SSH port) |

To create a key pair for CI to use:

```bash
ssh-keygen -t ed25519 -f github-actions-deploy -N ""
# Add the PUBLIC key to the deploy user on the VPS:
ssh-copy-id -i github-actions-deploy.pub deploy@your-server-ip
# Paste the PRIVATE key contents (github-actions-deploy) as the VPS_SSH_KEY secret
```

If you don't want auto-deploy, just delete `.github/workflows/deploy.yml`.

## Notes

- **Database**: SQLite by default at `backend/data/search2service.db` — it is
  *not* committed to git (see `.gitignore`); it's created automatically on first
  run. Back it up periodically (`sqlite3 backend/data/search2service.db ".backup backup.db"`)
  since it's the only copy of your data. To use MySQL instead, set `DB_ENGINE=mysql`
  and the `MYSQL_*` vars in `.env`.
- **File uploads** (provider banners, gallery photos, résumés) are stored inside
  the same SQLite database as blobs — no separate uploads directory to worry about
  or lose on redeploy.
- **Ports**: backend on `127.0.0.1:8000`, frontend on `127.0.0.1:3000` — neither is
  exposed to the internet directly; only nginx (80/443) is public.
- **Scaling**: a KVM-1-class VPS is fine for low-moderate traffic with the default
  single-process setup. If you outgrow it, the first lever is usually adding
  `--workers N` to the uvicorn backend (note: SQLite doesn't love high write
  concurrency — switch to MySQL first if you go this route).
