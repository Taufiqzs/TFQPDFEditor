import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="TFQPDFEditor License Server")

DB_PATH = Path(__file__).parent / "licenses.db"


def init_db():
    with _db() as con:
        con.execute("""
            CREATE TABLE IF NOT EXISTS licenses (
                key          TEXT PRIMARY KEY,
                machine_id   TEXT,
                activated_at TEXT
            )
        """)


@contextmanager
def _db():
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    try:
        yield con
        con.commit()
    finally:
        con.close()


init_db()


class ActivateRequest(BaseModel):
    key: str
    machine_id: str


class DeactivateRequest(BaseModel):
    key: str
    machine_id: str


@app.post("/activate")
def activate(req: ActivateRequest):
    key = req.key.upper().strip()
    with _db() as con:
        row = con.execute("SELECT * FROM licenses WHERE key = ?", (key,)).fetchone()
        if not row:
            return {"ok": False, "message": "Invalid license key."}
        if row["machine_id"] is None:
            # First activation — bind to this machine
            con.execute(
                "UPDATE licenses SET machine_id = ?, activated_at = ? WHERE key = ?",
                (req.machine_id, datetime.now(timezone.utc).isoformat(), key),
            )
            return {"ok": True, "message": "Activated successfully."}
        if row["machine_id"] == req.machine_id:
            return {"ok": True, "message": "Already activated on this machine."}
        return {"ok": False, "message": "This key is already used on another machine."}


@app.post("/deactivate")
def deactivate(req: DeactivateRequest):
    key = req.key.upper().strip()
    with _db() as con:
        row = con.execute("SELECT * FROM licenses WHERE key = ?", (key,)).fetchone()
        if not row:
            return {"ok": False, "message": "Invalid license key."}
        if row["machine_id"] != req.machine_id:
            return {"ok": False, "message": "Key is not activated on this machine."}
        con.execute("UPDATE licenses SET machine_id = NULL, activated_at = NULL WHERE key = ?", (key,))
    return {"ok": True, "message": "Deactivated. Key can now be used on another machine."}


@app.get("/health")
def health():
    return {"status": "ok"}
