import time
import sys
import http.client

def wait_for_connection(host="www.google.com", port=80):
    """
    Checks for a successful HTTP connection to a host.
    This replaces the need to shell out to `ping`.
    """
    print(f"🌐 Checking connectivity to {host}...", file=sys.stderr)
    for i in range(30):
        try:
            conn = http.client.HTTPSConnection(host, timeout=1)
            conn.request("HEAD", "/")
            conn.close()
            print(file=sys.stderr) # Newline after dots
            return True
        except Exception:
            time.sleep(1)
            print(".", end="", flush=True, file=sys.stderr)
    print("\n❌ Timed out waiting for internet.", file=sys.stderr)
    return False
