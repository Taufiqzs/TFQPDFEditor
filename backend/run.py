import socket
import threading
import time
import webbrowser
import uvicorn


def find_free_port(start: int = 8765) -> int:
    port = start
    while port < 9000:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(("127.0.0.1", port)) != 0:
                return port
        port += 1
    return start


def _open_browser(port: int):
    time.sleep(1.5)
    webbrowser.open(f"http://127.0.0.1:{port}")


if __name__ == "__main__":
    from app.main import app  # direct import so PyInstaller bundles it correctly
    port = find_free_port()
    threading.Thread(target=_open_browser, args=(port,), daemon=True).start()
    uvicorn.run(app, host="127.0.0.1", port=port, log_config=None)
