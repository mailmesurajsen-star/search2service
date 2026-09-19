"""Email notifications over SMTP. Credentials live in system_settings (key
"email_config") and are managed from Admin Console -> SMS & WhatsApp -> Email.

Sending never raises into the request that triggered it: a broken SMTP setup
must not make a booking or contact form fail."""
import asyncio
import html
import smtplib
import ssl
from email.message import EmailMessage
from email.utils import formataddr
from app.db import get_db

CONFIG_KEY = "email_config"


async def get_email_config():
    cfg = await get_db().system_settings.find_one({"key": CONFIG_KEY})
    return cfg or {}


def _send_blocking(cfg: dict, to: str, subject: str, body_html: str, body_text: str):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = formataddr((cfg.get("fromName") or "Search2Service", cfg.get("fromEmail") or cfg.get("smtpUser")))
    msg["To"] = to
    msg.set_content(body_text)
    msg.add_alternative(body_html, subtype="html")

    host, port = cfg["smtpHost"], int(cfg.get("smtpPort") or 587)
    if cfg.get("useSsl"):
        with smtplib.SMTP_SSL(host, port, timeout=20, context=ssl.create_default_context()) as s:
            if cfg.get("smtpUser"):
                s.login(cfg["smtpUser"], cfg.get("smtpPassword", ""))
            s.send_message(msg)
    else:
        with smtplib.SMTP(host, port, timeout=20) as s:
            s.starttls(context=ssl.create_default_context())
            if cfg.get("smtpUser"):
                s.login(cfg["smtpUser"], cfg.get("smtpPassword", ""))
            s.send_message(msg)


async def send_email(to: str, subject: str, lines: list, *, raise_errors: bool = False):
    """Send a simple notification. `lines` is a list of plain strings (escaped for HTML)."""
    try:
        cfg = await get_email_config()
        if not cfg.get("enabled") or not cfg.get("smtpHost") or not to:
            return False
        body_text = "\n".join(lines) + "\n\n- Search2Service"
        body_html = (
            "<div style='font-family:Arial,sans-serif;font-size:14px;color:#111'>"
            + "".join(f"<p style='margin:0 0 8px'>{html.escape(l)}</p>" for l in lines)
            + "<p style='margin-top:16px;color:#666'>- Search2Service</p></div>"
        )
        await asyncio.to_thread(_send_blocking, cfg, to, subject, body_html, body_text)
        return True
    except Exception as e:
        print(f"[EMAIL] failed to send '{subject}' to {to}: {e}")
        if raise_errors:
            raise
        return False


def send_email_background(to: str, subject: str, lines: list):
    """Fire-and-forget from inside an async request handler."""
    if to:
        asyncio.create_task(send_email(to, subject, lines))


async def admin_notify_address():
    cfg = await get_email_config()
    if cfg.get("notifyEmail"):
        return cfg["notifyEmail"]
    platform = await get_db().system_settings.find_one({"key": "platform_config"})
    return (platform or {}).get("supportEmail", "")
