"""
Usage: python generate_keys.py 50
Generates N license keys, inserts them into licenses.db, and prints them.
Upload the printed keys to itch.io as external keys.
"""
import secrets
import sqlite3
import sys
from pathlib import Path

DB_PATH = Path(__file__).parent / "licenses.db"


def generate_key() -> str:
    raw = secrets.token_hex(8).upper()
    return "-".join(raw[i : i + 4] for i in range(0, 16, 4))


def main():
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    con = sqlite3.connect(DB_PATH)
    con.execute("""
        CREATE TABLE IF NOT EXISTS licenses (
            key TEXT PRIMARY KEY, machine_id TEXT, activated_at TEXT
        )
    """)
    keys = []
    for _ in range(n):
        key = generate_key()
        try:
            con.execute("INSERT INTO licenses (key) VALUES (?)", (key,))
            keys.append(key)
        except sqlite3.IntegrityError:
            pass  # collision, skip
    con.commit()
    con.close()
    print(f"Generated {len(keys)} keys:")
    for k in keys:
        print(k)


if __name__ == "__main__":
    main()
