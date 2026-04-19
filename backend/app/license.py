import base64
import hashlib
import hmac
import json
import os
import platform
import sys
import uuid
from pathlib import Path

LICENSE_SERVER_URL = "https://tfqpdfeditor-license.fly.dev"

_SECRET = b"TFQPDFEditor2026-machine-lock-key"


def get_machine_id() -> str:
    raw = f"{platform.node()}{uuid.getnode()}"
    return hashlib.sha256(raw.encode()).hexdigest()[:32]


def get_license_path() -> Path:
    if sys.platform == "win32":
        base = Path(os.environ.get("APPDATA", Path.home()))
    elif sys.platform == "darwin":
        base = Path.home() / "Library" / "Application Support"
    else:
        base = Path.home() / ".config"
    folder = base / "TFQPDFEditor"
    folder.mkdir(parents=True, exist_ok=True)
    return folder / "license.dat"


def _sign(payload: str) -> str:
    return hmac.new(_SECRET, payload.encode(), hashlib.sha256).hexdigest()


def save_license(key: str, machine_id: str) -> None:
    payload = json.dumps({"key": key, "machine_id": machine_id})
    sig = _sign(payload)
    content = base64.b64encode(f"{payload}|||{sig}".encode()).decode()
    get_license_path().write_text(content)


def load_license() -> dict | None:
    path = get_license_path()
    if not path.exists():
        return None
    try:
        raw = base64.b64decode(path.read_text()).decode()
        payload, sig = raw.rsplit("|||", 1)
        if not hmac.compare_digest(_sign(payload), sig):
            return None
        return json.loads(payload)
    except Exception:
        return None


def is_activated() -> bool:
    lic = load_license()
    if not lic:
        return False
    return lic.get("machine_id") == get_machine_id()
