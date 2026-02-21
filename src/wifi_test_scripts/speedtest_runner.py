import subprocess
import sys
import json
import os
import re

# Map friendly names to binary commands
TOOLS = {
    "1": {"name": "Cloudflare", "cmd": "curl", "type": "cloudflare"},
    "2": {"name": "Ookla Speedtest", "cmd": "speedtest", "type": "ookla"},
    "3": {"name": "iPerf3", "cmd": "iperf3", "type": "iperf"},
    "4": {"name": "LibreSpeed", "cmd": "librespeed-cli", "type": "json"},
    "5": {"name": "OpenSpeedTest", "cmd": "openspeedtest", "type": "text"},
}

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

        elif tool_type == "cloudflare":
            proc = subprocess.run(
                [cmd_base, "-s", "-w", "%{speed_download}", "-o", os.devnull, "https://speed.cloudflare.com/__down?bytes=50000000"],
                capture_output=True, text=True
            )
            bytes_per_sec = float(proc.stdout.strip())
            result = (bytes_per_sec * 8) / 1_000_000

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
