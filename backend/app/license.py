import hashlib
import json
import os
import platform
import sys
import uuid
from pathlib import Path

from cryptography.fernet import Fernet

LICENSE_SERVER_URL = "https://tfqpdfeditor-license.onrender.com"

# Stable encryption key — changing this invalidates all existing license files
_FERNET_KEY = b"TFQPDFEditorKey2026XYZabcdefghij012345678901234="
_fernet = Fernet(_FERNET_KEY)


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


def save_license(key: str, machine_id: str) -> None:
    data = json.dumps({"key": key, "machine_id": machine_id}).encode()
    encrypted = _fernet.encrypt(data)
    get_license_path().write_bytes(encrypted)


def load_license() -> dict | None:
    path = get_license_path()
    if not path.exists():
        return None
    try:
        decrypted = _fernet.decrypt(path.read_bytes())
        return json.loads(decrypted)
    except Exception:
        return None


def is_activated() -> bool:
    lic = load_license()
    if not lic:
        return False
    return lic.get("machine_id") == get_machine_id()
