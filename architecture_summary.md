# Wi-Fi Speedtest Center Architecture

This document outlines the architecture for the Wi-Fi Speedtest Center, a distributed system for monitoring and testing network speeds across multiple nodes.

## High-Level Overview

The system consists of three main components:
1. **Frontend Dashboard (Client)**: A React-based web interface to monitor nodes and trigger speed tests.
2. **Speedtest Center (API Gateway / Discovery Layer)**: A central Python backend that discovers available nodes and routes requests.
3. **Speedtest Nodes (Workers)**: Remote Python servers deployed on individual devices (like Raspberry Pis or laptops) that physically execute the speed tests and report results.

---

## Component Details

### 1. Frontend Dashboard
- **Tech Stack**: React, TypeScript, Vite, CSS (with custom Glassmorphism UI)
- **Role**: Provides a real-time UI for the user.
- **Communication**: 
  - Polls the Speedtest Center (`/api/nodes`) every 5 seconds to get a list of active online nodes.
  - Sends a trigger to the Speedtest Center (`/api/speedtest?node=<name>`) when a user wishes to run a test on a specific node.
  - Can orchestrate sequential tests across all discovered nodes.

### 2. Speedtest Center (API / Coordinator)
- **Tech Stack**: Python, `http.server`, `zeroconf` (mDNS)
- **Role**: Acts as a bridge between the browser UI and the remote workers. It abstracts node discovery and network routing away from the frontend.
- **Key Mechanisms**:
  - **mDNS Discovery**: Uses `zeroconf` to passively listen for services advertising as `_speedtest._tcp.local.`.
  - **Node Registration**: Maintains a thread-safe dictionary of online nodes, including their resolved IP address and Port.
- **API Endpoints (Port 8082)**:
  - `GET /api/nodes`: Returns the current healthy dictionary of discovered nodes.
  - `GET /api/speedtest?node=<node_name>`: Looks up the target node's IP/Port and proxies the speedtest request to it, waiting up to 60 seconds for the node to respond.

### 3. Speedtest Node (Worker)
- **Tech Stack**: Python, `http.server`, `subprocess`
- **Role**: The actual physical device performing the underlying network measurement.
- **Key Mechanisms**:
  - **mDNS Advertising**: Advertises itself on the local network via Avahi/Zeroconf as `_speedtest._tcp.local.` (usually handled by an OS-level service file or external script).
  - **Command Execution**: Uses `subprocess` to trigger CLI tools like `speedtest-cli` (Ookla), `curl` (Cloudflare), `librespeed-cli`, or `openspeedtest`.
  - **Data Persistence**: Appends the parsed speedtest data to a local `reports/server_speedtests.jsonl` file to maintain a historical log on the node itself.
- **API Endpoints (Port 8081)**:
  - `GET /health`: Returns a simple `{"status": "healthy"}` for uptime monitoring.
  - `GET /speedtest?tool=<tool>`: Executes a blocking speed test using the requested tool, returning the raw bandwidth (Mbps) and duration.

---

## Data Flow: Running a Speedtest

1. **User Action**: The User clicks "Run Speedtest" for Node 'Alpha' on the Frontend Dashboard.
2. **Frontend Request**: The Frontend sends `GET http://localhost:8082/api/speedtest?node=Alpha` to the Coordinator.
3. **Node Resolution**: The Coordinator looks up 'Alpha' in its mDNS table, resolving it to `192.168.1.100:8081`.
4. **Proxy Request**: The Coordinator sends an HTTP request `GET http://192.168.1.100:8081/speedtest?tool=ookla` to the Worker.
5. **Worker Execution**: The Worker runs the underlying CLI tool (e.g., Ookla Speedtest), waits for completion, parses the JSON output, and saves it to its local `.jsonl` file.
6. **Result Propagation**: The Worker responds with standard JSON to the Coordinator, which proxies it directly back to the Frontend.
7. **UI Update**: The Frontend updates the UI to show the Mbps and duration.
