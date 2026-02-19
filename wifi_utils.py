import subprocess
import sys
import time
import re
import json
import os
import http.client

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
# HELPER & ADMIN FUNCTIONS
# ==========================================


def run_command(command):
    """Runs a system command and returns output."""
    try:
        result = subprocess.run(
            command,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {' '.join(command)}", file=sys.stderr)
        print(f"Stderr: {e.stderr.strip()}", file=sys.stderr)
        return None

def get_wifi_details():
    """Detects active Wi-Fi interface and network name (SSID) without sudo."""
    interface = None
    conn_name = None
    
    # Find a wireless interface in /sys/class/net
    for dev in os.listdir('/sys/class/net'):
        if os.path.exists(f'/sys/class/net/{dev}/wireless'):
            interface = dev
            break
            
    if not interface:
        raise RuntimeError("No Wi-Fi interface found.")

    # Get network name (SSID) using 'iw'
    out = run_command(["iw", "dev", interface, "link"])
    if out:
        m = re.search(r"SSID:\s+(.+)", out)
        if m:
            conn_name = m.group(1)

    if not conn_name:
        raise RuntimeError(f"Could not determine network SSID for {interface}.")

    return interface, conn_name

def switch_band(conn_name, band_code):
    """(Not possible without sudo) This function is a placeholder."""
    print(f"SKIPPING band switch for '{band_code}' (requires sudo).")
    # This functionality is not possible without modifying network configurations,
    # which requires elevated privileges.
    pass

def cleanup(conn_name):
    """(Not possible without sudo) This function is a placeholder."""
    print("SKIPPING Wi-Fi cleanup (requires sudo).")
    pass

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


def get_freq_width(interface):
    """Extracts frequency and width using 'iw'."""
    # Note: Replacing 'iw' is hard without external libraries.
    # We can try to read from /sys/class/net/ but it's not always reliable for freq/width.
    # For now, we keep the 'iw' command as it's the most reliable method.
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
# SPEEDTEST PARSING LOGIC
# ==========================================

def run_speedtest_tool(tool_choice, interface, iperf_server=None):
    """Runs the selected tool and parses output."""
    if tool_choice not in TOOLS:
        raise ValueError("Invalid tool choice.")
    
    tool = TOOLS[tool_choice]
    cmd_base = tool["cmd"]
    tool_type = tool["type"]
    
    print(f"🚀 Running {tool['name']}...", file=sys.stderr)
    
    result = 0.0

    try:
        if tool_type == "ookla":
            proc = subprocess.run([cmd_base, "--accept-license", "--accept-gdpr", "-f", "json"], capture_output=True, text=True)
            try:
                data = json.loads(proc.stdout)
                result = (data["download"]["bandwidth"] * 8) / 1_000_000
            except:
                proc_simple = subprocess.run([cmd_base, "--simple"], capture_output=True, text=True)
                m = re.search(r"Download:\s+([\d.]+)", proc_simple.stdout)
                if m: result = float(m.group(1))

        elif tool_type == "iperf":
            proc = subprocess.run([cmd_base, "-c", iperf_server, "-R", "-t", "5", "--json"], capture_output=True, text=True)
            data = json.loads(proc.stdout)
            result = data["end"]["sum_received"]["bits_per_second"] / 1_000_000

        elif tool_type == "json":
            proc = subprocess.run([cmd_base, "--json"], capture_output=True, text=True)
            data = json.loads(proc.stdout)
            result = float(data.get("download", 0))

        else: # Text scraping (Cloudflare, etc.)
            proc = subprocess.run([cmd_base], capture_output=True, text=True)
            output = proc.stdout
            m = re.search(r"([\d.]+)\s*M?bps", output, re.IGNORECASE)
            if m: result = float(m.group(1))

    except FileNotFoundError:
        print(f"❌ Error: Command '{cmd_base}' not found. Please ensure it's installed and in your PATH.", file=sys.stderr)
        return 0.0
    except Exception as e:
        print(f"Error running tool {tool['name']}: {e}", file=sys.stderr)
        return 0.0

    return round(result, 2)
