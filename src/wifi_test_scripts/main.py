import os
import sys
import subprocess

# --- 1. NEW ENVIRONMENT BOOTSTRAP ---
VENV_DIR = "venv"
VENV_PYTHON = os.path.join(VENV_DIR, "bin", "python")

def bootstrap_env():
    """Ensure we are running inside the virtual environment."""
    # Check if the current Python interpreter is the one inside our venv
    if not sys.executable.endswith(VENV_PYTHON):
        print("🔄 Not running in venv. Bootstrapping environment...", flush=True)
        
        # Call our new setup.py script
        subprocess.run([sys.executable, "src/wifi_test_scripts/setup.py"], check=True)
        
        # Re-launch THIS script using the virtual environment's Python.
        # os.execv completely replaces the current running process with the new one.
        args = [VENV_PYTHON] + sys.argv
        os.execv(VENV_PYTHON, args)

# Run the bootstrap immediately
bootstrap_env()
# ------------------------------------

# --- 2. STANDARD IMPORTS ---
import shutil
import datetime
import csv
import socket
import argparse

# --- 3. CUSTOM IMPORTS ---
# These are now safe to import because if they rely on 3rd party tools,
# the bootstrap_env() function has already ensured the venv is active.
from wifi_info import get_wifi_details, get_freq_width, cleanup
from connection_tester import wait_for_connection
from speedtest_runner import run_speedtest_tool, TOOLS

def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Wi-Fi Speedtest Automation")
    parser.add_argument("--tool", choices=["ookla", "cloudflare"], default="ookla", help="Speedtest tool to run (ookla or cloudflare)")
    return parser.parse_args()

def get_tool_info(tool_name):
    """Map tool name to tool info from configuration."""
    tool_map = {"cloudflare": "1", "ookla": "2"}
    choice = tool_map[tool_name]
    chosen_tool_info = TOOLS[choice]
    
    print(f"\nSelected tool: {chosen_tool_info['name']}", flush=True)

    if not shutil.which(chosen_tool_info["cmd"]):
        print(f"❌ Error: {chosen_tool_info['cmd']} not found in PATH. Please install it.", file=sys.stderr, flush=True)
        sys.exit(1)
        
    return choice, chosen_tool_info

def determine_band(freq):
    """Calculate the Wi-Fi band from frequency in MHz."""
    try:
        freq_int = int(freq)
        if 2400 <= freq_int < 2500:
            return "2.4GHz"
        elif 5000 <= freq_int < 6000:
            return "5GHz"
        elif 6000 <= freq_int < 7200:
            return "6GHz"
        else:
            return "Unknown"
    except ValueError:
        return "Unknown"

def save_report(speed, conn_name, interface, freq, width, tool_name):
    """Save the speed test results to a CSV file."""
    now = datetime.datetime.now().astimezone()
    hostname = socket.gethostname()
    report_dir = "reports"
    os.makedirs(report_dir, exist_ok=True)
    csv_filename = os.path.join(report_dir, "speed-test-results.csv")
    
    file_exists = os.path.isfile(csv_filename)
    band = determine_band(freq)

    with open(csv_filename, "a", newline="") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["Date/Time", "Hostname", "Tool", "SSID", "Interface", "Band", "Frequency (MHz)", "Width", "Speed (Mbps)"])
        writer.writerow([
            now.isoformat(),
            hostname,
            tool_name,
            conn_name,
            interface,
            band,
            freq,
            width,
            f"{speed:.2f}"
        ])
    print(f"✓ Result appended to {csv_filename}", flush=True)

def main():
    """Main function to run the Wi-Fi speed test."""
    print("==========================================", flush=True)
    print("   Wi-Fi Speedtest Automation (Python)    ", flush=True)
    print("==========================================", flush=True)
    
    # 1. Parse arguments
    args = parse_args()

    # 2. Get network interface details
    try:
        interface, conn_name = get_wifi_details()
        print(f"✅ Detected: {interface} | Profile: {conn_name}", flush=True)
    except RuntimeError as e:
        print(f"❌ Error: {e}", file=sys.stderr, flush=True)
        sys.exit(1)

    # 3. Setup tool
    choice, chosen_tool_info = get_tool_info(args.tool)
    
    iperf_server = None
    if chosen_tool_info["type"] == "iperf":
        iperf_server = os.environ.get("IPERF_SERVER")
        if not iperf_server:
            print("❌ Error: iPerf server IP not specified. Set IPERF_SERVER environment variable.", file=sys.stderr, flush=True)
            sys.exit(1)

    # 4. Wait for connection & execute speedtest
    try:
        if wait_for_connection():
            freq, width = get_freq_width(interface)
            print(f"Connected on {conn_name}: {freq} MHz (Width: {width})", file=sys.stderr, flush=True)
            
            speed = run_speedtest_tool(choice, interface, iperf_server)
            print(f"⬇️  Result: {speed} Mbps", flush=True)
            
            # 5. Save results
            if speed > 0.0:
                save_report(speed, conn_name, interface, freq, width, chosen_tool_info['name'])
            else:
                print("❌ Speedtest returned 0.0 Mbps. No report generated.", flush=True)
        else:
            print(f"❌ Could not connect to the internet.", flush=True)

    except KeyboardInterrupt:
        print("\nAborted by user.", flush=True)
    finally:
        cleanup(conn_name)

if __name__ == "__main__":
    main()