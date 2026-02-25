# Speedtest Center Agent Notes

## Purpose and Architecture
The Speedtest Center is the central orchestrator UI for testing Wi-Fi signal strength throughout a house. It allows a technician to view all active speedtest client nodes on the network and trigger speedtests on them individually or sequentially.

It uses a dual-layer architecture:
1. **Backend** (`src/speedtest_center/backend/server.py`): A lightweight Python `http.server` running on port 8082. It uses `zeroconf` to passively listen for client nodes broadcasting the `_speedtest._tcp` mDNS service on the local network. It exposes `/api/nodes` (to list discovered nodes) and `/api/speedtest` (to proxy tests to nodes on port 8081 and evade Browser CORS).
2. **Frontend** (`src/speedtest_center/frontend`): A TypeScript/React interface built with Vite and Bun. It polls the backend API to show a real-time card grid of healthy servers and provides buttons to trigger the speed testing logic.

## Running Locally

To run the full Speedtest Center locally, you need two terminal sessions running simultaneously from the root of the repository (`/home/val/wifi-testing`):

**1. Start the Backend API Proxy**
```bash
venv/bin/python src/speedtest_center/backend/server.py
```

**2. Start the Frontend Dev Server**
```bash
# Must use bun's native execution to bypass Node.js version requirements on this machine
cd src/speedtest_center/frontend
~/.bun/bin/bun --bun run dev --port 3000 --host 0.0.0.0
```

## Future Agent Notes
- **Testing**: A dummy node or a live `val-server-x` node must be actively broadcasting `_speedtest._tcp` on port 8081 for the UI to display anything other than the "Empty State".
- **Bundler**: Use `~/.bun/bin/bun` for all frontend package management instead of `npm`.
- **CORS**: Any new endpoints added to client nodes *must* be proxied through the Python backend `server.py` to prevent the React UI from failing CORS checks.
