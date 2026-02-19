import subprocess
import time
import sys
import re
import json
import argparse

# ==========================================
# CONFIGURATION
# ==========================================
PING_TARGET = "8.8.8.8"

# Map friendly names to binary commands
TOOLS = {
    "1": {"name": "Cloudflare", "cmd": "speed-cloudflare-cli", "type": "text"},
    "2": {"name": "Ookla Speedtest", "cmd": "speedtest", "type": "ookla"},
    "3": {"name": "iPerf3", "cmd": "iperf3", "type": "iperf"},
    "4": {"name": "LibreSpeed", "cmd": "librespeed-cli", "type": "json"},
    "5": {"name": "OpenSpeedTest", "cmd": "openspeedtest", "type": "text"},
}

# ==========================================
# HELPER FUNCTIONS
# ==========================================

def run_command(command, shell=False):
    """Runs a system command and returns output."""
    try:
        result = subprocess.run(
            command, 
            shell=shell, 
            check=True, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE,
            text=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        return None

def wait_for_connection(target):
    """Pings target until success or timeout."""
    print(f"🌐 Checking connectivity to {target}...", file=sys.stderr)
    for _ in range(30):
        if run_command(["ping", "-c", "1", "-W", "1", target]):
            # Print a newline to stderr to end the dots
            print(file=sys.stderr)
            return True
        time.sleep(1)
        print(".", end="", flush=True, file=sys.stderr)
    print("\n❌ Timed out waiting for internet.", file=sys.stderr)
    return False

def get_freq_width(interface):
    """Extracts frequency and width using 'iw'."""
    out = run_command(["iw", "dev", interface, "link"])
    freq = "N/A"
    width = "N/A"
    
    if out:
        m_freq = re.search(r"freq:\s+(\d+)", out)
        if m_freq: freq = m_freq.group(1)
        
        m_width = re.search(r"(\d+)MHz", out)
        if m_width: width = m_width.group(1)
        
    return freq, width

# ==========================================
# PARSING LOGIC
# ==========================================

def run_speedtest_tool(tool, iperf_server=None):
    """Runs the selected tool and parses output."""
    cmd_base = tool["cmd"]
    tool_type = tool["type"]
    
    print(f"🚀 Running {tool['name']}...", file=sys.stderr)
    
    output = ""
    result = 0.0

    try:
        if tool_type == "ookla":
            proc = subprocess.run([cmd_base, "--accept-license", "--accept-gdpr", "-f", "json"], capture_output=True, text=True)
            try:
                data = json.loads(proc.stdout)
                result = (data["download"]["bandwidth"] * 8) / 1_000_000
            except:
                proc = subprocess.run([cmd_base, "--simple"], capture_output=True, text=True)
                m = re.search(r"Download:\s+([\d.]+)", proc.stdout)
                if m: result = float(m.group(1))

        elif tool_type == "iperf":
            proc = subprocess.run([cmd_base, "-c", iperf_server, "-R", "-t", "5", "--json"], capture_output=True, text=True)
            data = json.loads(proc.stdout)
            result = data["end"]["sum_received"]["bits_per_second"] / 1_000_000

        elif tool_type == "json":
            proc = subprocess.run([cmd_base, "--json"], capture_output=True, text=True)
            data = json.loads(proc.stdout)
            result = float(data.get("download", 0))

        else: # Text scraping
            proc = subprocess.run([cmd_base], capture_output=True, text=True)
            output = proc.stdout
            m = re.search(r"([\d.]+)\s*M?bps", output, re.IGNORECASE)
            if m: result = float(m.group(1))

    except Exception as e:
        print(f"Error running tool: {e}", file=sys.stderr)
        return 0.0

    return round(result, 2)

# ==========================================
# MAIN EXECUTION
# ==========================================

def main():
    parser = argparse.ArgumentParser(description="Run a single Wi-Fi speed test.")
    parser.add_argument("--interface", required=True, help="Wi-Fi interface name")
    parser.add_argument("--tool", required=True, help="Tool choice (1-5)")
    parser.add_argument("--iperf-server", help="iPerf3 server IP")
    args = parser.parse_args()

    if args.tool not in TOOLS:
        print("Invalid tool choice.", file=sys.stderr)
        sys.exit(1)

    chosen_tool = TOOLS[args.tool]
    
    target = args.iperf_server if chosen_tool["type"] == "iperf" else PING_TARGET
    
    if wait_for_connection(target):
        freq, width = get_freq_width(args.interface)
        print(f"Connected: {freq} MHz (Width: {width})", file=sys.stderr)
        
        speed = run_speedtest_tool(chosen_tool, args.iperf_server)
        print(f"⬇️ Result: {speed} Mbps", file=sys.stderr)
        
        result = {"freq": freq, "speed": speed}
        print(json.dumps(result))
    else:
        result = {"freq": "N/A", "speed": 0.0}
        print(json.dumps(result))

if __name__ == "__main__":
    main()
