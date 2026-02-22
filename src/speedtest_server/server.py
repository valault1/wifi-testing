import http.server
import json
import urllib.parse
import os
import subprocess
import re
import datetime
import time
PORT = 8081

def run_speedtest(tool="ookla"):
    """Runs the specified speed test tool and parses the result."""
    try:
        if tool == "ookla":
            proc = subprocess.run(["speedtest", "--accept-license", "--accept-gdpr", "-f", "json"], capture_output=True, text=True)
            try:
                data = json.loads(proc.stdout)
                speed = (data["download"]["bandwidth"] * 8) / 1_000_000
                return {"speed_mbps": round(speed, 2), "tool": tool}
            except:
                proc_simple = subprocess.run(["speedtest", "--simple"], capture_output=True, text=True)
                m = re.search(r"Download:\s+([\d.]+)", proc_simple.stdout)
                if m:
                    return {"speed_mbps": float(m.group(1)), "tool": tool}
                return {"error": "Failed to parse ookla output"}
                
        elif tool == "cloudflare":
            proc = subprocess.run(
                ["curl", "-s", "-w", "%{speed_download}", "-o", os.devnull, "https://speed.cloudflare.com/__down?bytes=50000000"],
                capture_output=True, text=True
            )
            bytes_per_sec = float(proc.stdout.strip())
            speed = (bytes_per_sec * 8) / 1_000_000
            return {"speed_mbps": round(speed, 2), "tool": tool}
            
        elif tool == "librespeed":
            proc = subprocess.run(["librespeed-cli", "--json"], capture_output=True, text=True)
            data = json.loads(proc.stdout)
            return {"speed_mbps": float(data.get("download", 0)), "tool": tool}
            
        elif tool == "iperf":
            return {"error": "iPerf requires a server configuration which is not currently supported in this simple runner."}
            
        elif tool == "openspeedtest":
            proc = subprocess.run(["openspeedtest"], capture_output=True, text=True)
            m = re.search(r"([\d.]+)\s*M?bps", proc.stdout, re.IGNORECASE)
            if m:
                return {"speed_mbps": float(m.group(1)), "tool": tool}
            return {"error": "Failed to parse openspeedtest output"}
            
        else:
            return {"error": f"Unknown tool: {tool}"}
            
    except FileNotFoundError:
        return {"error": f"Command for {tool} not found. Please ensure it is installed."}
    except Exception as e:
        return {"error": str(e)}

def save_report(result):
    """Saves the speedtest result to the reports directory."""
    if "error" in result:
        return
        
    os.makedirs("reports", exist_ok=True)
    report_file = os.path.join("reports", "server_speedtests.jsonl")
    
    report_entry = {
        "timestamp": datetime.datetime.now().isoformat(),
        **result
    }
    
    with open(report_file, "a") as f:
        f.write(json.dumps(report_entry) + "\n")

class SpeedtestRequestHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        
        if parsed_path.path == "/health":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "healthy"}).encode("utf-8"))
            
        elif parsed_path.path == "/speedtest":
            query_components = urllib.parse.parse_qs(parsed_path.query)
            # Default to 'ookla' if no tool is provided
            tool = query_components.get("tool", ["ookla"])[0]
            
            start_time = time.time()
            result = run_speedtest(tool)
            duration = time.time() - start_time
            
            if "error" not in result:
                result["duration_seconds"] = round(duration, 2)
                
            save_report(result)
            
            status_code = 500 if "error" in result else 200
            self.send_response(status_code)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode("utf-8"))
            
        else:
            self.send_response(404)
            self.end_headers()

def run(server_class=http.server.HTTPServer, handler_class=SpeedtestRequestHandler, port=PORT):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting speedtest server on port {port}...")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
