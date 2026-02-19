import subprocess
import sys
import shutil
import datetime
import json

# ==========================================
# CONFIGURATION
# ==========================================
REPORT_FILE = "wifi_speedtest_report.txt"

# Map friendly names to binary commands
TOOLS = {
    "1": {"name": "Cloudflare", "cmd": "speed-cloudflare-cli", "type": "text"},
    "2": {"name": "Ookla Speedtest", "cmd": "speedtest", "type": "ookla"},
    "3": {"name": "iPerf3", "cmd": "iperf3", "type": "iperf"},
    "4": {"name": "LibreSpeed", "cmd": "librespeed-cli", "type": "json"},
    "5": {"name": "OpenSpeedTest", "cmd": "openspeedtest", "type": "text"},
}

IPERF_SERVER = None

# ==========================================
# HELPER FUNCTIONS
# ==========================================

def run_admin_command(command):
    """Runs a command using the admin script with sudo."""
    try:
        # We need to use shell=True to properly handle the sudo command.
        # However, since we are constructing the command, this is safe.
        full_command = f"sudo python3 wifi_admin.py {command}"
        print(f"Executing: {full_command}")
        result = subprocess.run(
            full_command,
            shell=True,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running admin command: {command}")
        print(f"Stderr: {e.stderr.strip()}", file=sys.stderr)
        return None

# ==========================================
# MAIN EXECUTION
# ==========================================

def main():
    global IPERF_SERVER
    
    print("==========================================")
    print("   Wi-Fi Speedtest Automation (Python)    ")
    print("==========================================")
    
    print("
🔍 Detecting Wi-Fi details...")
    details = run_admin_command("get_details")
    if not details:
        sys.exit(1)
    
    try:
        interface, conn_name = details.split(',')
        print(f"✅ Detected: {interface} | Profile: {conn_name}")
    except ValueError:
        print(f"❌ Error: Could not parse Wi-Fi details from admin script. Output: '{details}'")
        sys.exit(1)

    # --- Menu ---
    print("
Select Tool:")
    for key, val in TOOLS.items():
        print(f"{key}. {val['name']}")
    
    choice = input("
Enter choice (1-5): ")
    if choice not in TOOLS:
        print("Invalid choice.")
        sys.exit(1)
        
    chosen_tool = TOOLS[choice]
    
    if not shutil.which(chosen_tool["cmd"]):
        print(f"❌ Error: {chosen_tool['cmd']} not found in PATH.")
        sys.exit(1)
        
    if chosen_tool["type"] == "iperf":
        IPERF_SERVER = input("Enter iPerf3 Server IP: ")
        if not IPERF_SERVER: sys.exit(1)

    # --- Run Tests ---
    results = []
    
    tests = [
        ("bg", "2.4 GHz"),
        ("a", "5 GHz"), # 'a' is more reliable for 5Ghz
        ("6g", "6 GHz")
    ]
    
    try:
        for band_code, label in tests:
            print(f"
📡 Switching to {label} ({band_code or 'Auto'})...")
            # Handle empty string for band argument
            band_arg = f'""' if band_code == "" else band_code
            run_admin_command(f"switch_band --conn-name '{conn_name}' --band {band_arg}")

            print(f"🚀 Running speed test for {label}...")
            
            speed_test_cmd = [
                "python3", "speed_test.py",
                "--interface", interface,
                "--tool", choice
            ]
            if IPERF_SERVER:
                speed_test_cmd.extend(["--iperf-server", IPERF_SERVER])

            try:
                # Run the non-privileged speed test script
                proc = subprocess.run(speed_test_cmd, capture_output=True, text=True, check=True)
                test_output = json.loads(proc.stdout)
                
                print(f"⬇️  Result for {label}: {test_output['speed']} Mbps")
                results.append({"band": label, "freq": test_output["freq"], "speed": test_output["speed"]})

            except (subprocess.CalledProcessError, json.JSONDecodeError) as e:
                print(f"❌ Error running speed test for {label}: {e}")
                results.append({"band": label, "freq": "N/A", "speed": 0.0})


    except KeyboardInterrupt:
        print("
Aborted by user.")
    finally:
        print("
🔄 Restoring Wi-Fi settings...")
        run_admin_command(f"cleanup --conn-name '{conn_name}'")

    # --- Report ---
    if results:
        print(f"
📄 Generating Report: {REPORT_FILE}")
        
        best_result = max(results, key=lambda x: x['speed'])
        
        with open(REPORT_FILE, "w") as f:
            f.write("Wi-Fi Speed Report
")
            f.write(f"Date: {datetime.datetime.now()}
")
            f.write(f"Tool: {chosen_tool['name']}
")
            f.write("-" * 40 + "
")
            f.write(f"🏆 Fastest: {best_result['band']} ({best_result['speed']} Mbps)
")
            f.write("-" * 40 + "
")
            f.write(f"{'Band':<10} | {'Freq':<10} | {'Speed (Mbps)':<10}
")
            f.write("-" * 40 + "
")
            for r in results:
                f.write(f"{r['band']:<10} | {r['freq']:<10} | {r['speed']:<10}
")
                
        print("Done.")

if __name__ == "__main__":
    main()
