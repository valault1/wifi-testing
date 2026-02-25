# Wi-Fi Speedtest Center Data Flow

This document describes the high-level data flow for discovering network nodes and executing speed tests in the Wi-Fi Speedtest Center ecosystem.

## Node Discovery Flow
```mermaid
sequenceDiagram
    participant Worker as Speedtest Node (Worker)
    participant Coordinator as Speedtest Center (Coordinator)
    participant Frontend as Frontend Dashboard (UI)
    
    Note over Worker: Runs on physical device (e.g., Raspberry Pi)
    Worker->>Coordinator: mDNS Advertising ("_speedtest._tcp.local.")
    Note over Coordinator: Listens via zeroconf
    Coordinator-->>Coordinator: Registers Node (IP, Port, Status)
    
    loop Every 5 seconds
        Frontend->>Coordinator: GET /api/nodes
        Coordinator-->>Frontend: JSON Dictionary of Discovered Nodes
        Frontend-->>Frontend: Renders Node Cards
    end
```

## Speedtest Execution Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend as Frontend Dashboard (UI)
    participant Coordinator as Speedtest Center (Coordinator)
    participant Worker as Target Node (Worker)
    participant External as Network (e.g., Ookla/Cloudflare)
    
    User->>Frontend: Clicks "Run Speedtest" (or "Run All Sequential")
    Frontend->>Frontend: Sets UI Status to 'running' (Spinner)
    
    Frontend->>Coordinator: GET /api/speedtest?node={Node_Name}
    Coordinator->>Coordinator: Looks up {Node_Name} in internal dictionary
    
    Note over Coordinator: Proxies Request (Wait up to 60s)
    Coordinator->>Worker: GET /speedtest?tool=ookla
    
    Note over Worker: Executes CLI Test Command
    Worker->>External: Performs network measurement
    External-->>Worker: Raw bandwidth results
    
    Worker->>Worker: Parses Output (Mbps) & Duration
    Worker->>Worker: Appends Result to local `/reports/*.jsonl`
    
    Worker-->>Coordinator: JSON Result {"speed_mbps": 120.5, "duration_seconds": 32.1}
    Coordinator-->>Frontend: Proxies JSON Result
    
    Frontend->>Frontend: Updates UI to 'success' (Shows Mbps)
    Frontend-->>User: Displays Final Results
```
