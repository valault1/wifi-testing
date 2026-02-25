import http.server
import json
import urllib.parse
import urllib.request
import threading
import time
from zeroconf import ServiceBrowser, ServiceStateChange, Zeroconf

PORT = 8082
API_PORT = 8081 # Port used by the clients

# Global dictionary to store discovered nodes
# Format: { "node_name": {"ip": "1.2.3.4", "port": 8081, "status": "healthy"} }
discovered_nodes = {}
nodes_lock = threading.Lock()

def on_service_state_change(zeroconf, service_type, name, state_change):
    """Callback for when a zeroconf service is added, removed, or updated."""
    with nodes_lock:
        if state_change is ServiceStateChange.Added:
            info = zeroconf.get_service_info(service_type, name)
            if info:
                # Convert IP address nicely
                ip_addr = ".".join(map(str, info.addresses[0])) if info.addresses else None
                if ip_addr:
                    discovered_nodes[name] = {
                        "ip": ip_addr,
                        "port": info.port,
                        "status": "discovered"
                    }
                    print(f"Discovered new node: {name} at {ip_addr}:{info.port}")
        
        elif state_change is ServiceStateChange.Removed:
            if name in discovered_nodes:
                del discovered_nodes[name]
                print(f"Node removed: {name}")

class CenterRequestHandler(http.server.BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.end_headers()

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        
        # Enable CORS for GET requests to allow the frontend to access them
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        if parsed_path.path == "/api/nodes":
            # Return list of discovered nodes
            with nodes_lock:
                # To be absolutely sure they are healthy before we send them, 
                # we could do an active healthcheck here, but for speed,
                # we just return what zeroconf has discovered.
                self.wfile.write(json.dumps({"nodes": discovered_nodes}).encode("utf-8"))
                
        elif parsed_path.path == "/api/speedtest":
            # Proxy a speedtest request to a specific node
            query_components = urllib.parse.parse_qs(parsed_path.query)
            node_name = query_components.get("node", [None])[0]
            
            if not node_name:
                self.wfile.write(json.dumps({"error": "Missing 'node' parameter"}).encode("utf-8"))
                return
                
            node_info = None
            with nodes_lock:
                node_info = discovered_nodes.get(node_name)
                
            if not node_info:
                self.wfile.write(json.dumps({"error": f"Node '{node_name}' not found"}).encode("utf-8"))
                return
                
            try:
                # Construct URL for the target node
                target_url = f"http://{node_info['ip']}:{node_info['port']}/speedtest?tool=ookla"
                print(f"Proxying speedtest to {target_url}...")
                
                # We need to increase timeout since speedtests take ~35 seconds
                req = urllib.request.Request(target_url)
                with urllib.request.urlopen(req, timeout=60) as response:
                    data = json.loads(response.read().decode('utf-8'))
                    
                # Return the data from the node back to our frontend
                self.wfile.write(json.dumps(data).encode("utf-8"))
                
            except Exception as e:
                self.wfile.write(json.dumps({"error": f"Failed to reach node: {str(e)}"}).encode("utf-8"))
                
        else:
            self.wfile.write(json.dumps({"error": "Not Found"}).encode("utf-8"))

def run():
    # 1. Start zeroconf browser in a background thread
    zeroconf = Zeroconf()
    browser = ServiceBrowser(zeroconf, "_speedtest._tcp.local.", handlers=[on_service_state_change])
    print("Started mDNS Discovery for '_speedtest._tcp.local.'")
    
    # 2. Start HTTP server
    server_address = ('', PORT)
    httpd = http.server.HTTPServer(server_address, CenterRequestHandler)
    print(f"Starting Speedtest Center API on port {PORT}...")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("Shutting down...")
    finally:
        zeroconf.close()

if __name__ == "__main__":
    run()
