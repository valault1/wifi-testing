# Speedtest Server Agent Notes

## Purpose
A lightweight, fast REST server to execute Wi-Fi speed tests and record the results to `reports/server_speedtests.jsonl`. Designed to avoid heavy frameworks (like Flask/FastAPI) by using Python's built-in `http.server`.

## Architecture & Deployment
This server is meant to run continuously as a background service on client nodes, exposing endpoints to a central UI orchestrator.
- **Setup Script**: `server-setup.sh` handles the complete machine setup (requires root): creates a `wifi` user with sudo privileges, clones the repo (`valault1/wifi-testing`), sets up system dependencies, creates a systemd service (`speedtest-api.service`), and configures Avahi to broadcast the service over mDNS on port `8081`.

## Files
- `server.py`: The main REST server. Exposes `/health` and `/speedtest` endpoints.
- `test_server.py`: A verification script using `urllib` to test the server endpoints.
- `server-setup.sh`: Automated bash script to bootstrap a clean Ubuntu/Debian node into a functional speedtest endpoint.

## Key Implementation Details
- **Port**: Listens on `8081` (port 8080 was conflicting).
- **Tool Selection**: The `/speedtest` endpoint accepts a `?tool=` query parameter. Supported tools include `ookla`, `cloudflare`, `librespeed`, `iperf`, and `openspeedtest`. Defaults to `ookla`.
- **Execution**: The `run_speedtest(tool)` function shells out to system commands (e.g., `speedtest-cli`, `curl` for cloudflare), captures `stdout`, and parses the results into Mbps.
- **Reporting**: Successful tests are appended natively to `reports/server_speedtests.jsonl`.
- **Duration**: The server calculates the execution time and injects `duration_seconds` into the outgoing JSON response and the report.

## Notes for Future Agents
- **Testing**: Run `./test_server.py` after spinning up `server.py` in the background to verify endpoints.
- **Extending Tools**: When adding new tools to `run_speedtest()`, ensure your block returns either `{"speed_mbps": float, "tool": str}` on success, or `{"error": str}` on failure. `duration_seconds` is appended automatically by the endpoint handler.
- **iPerf**: iPerf currently returns an error message as it requires additional external server IP configuration not yet implemented in this simple runner.
- **Dependencies**: Aim to keep dependencies strictly to Python standard libraries where possible.
