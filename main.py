import os
import sys
import shutil
import datetime

# Import the consolidated functions and configuration
from wifi_utils import (
    get_wifi_details,
    switch_band,
    cleanup,
    run_speedtest_tool,
    wait_for_connection,
    get_freq_width,
    TOOLS
)

def main():
    """Main function to run the Wi-Fi speed test."""
    print("==========================================", flush=True)
    print("   Wi-Fi Speedtest Automation (Python)    ", flush=True)
    print("==========================================", flush=True)
    
    try:
        interface, conn_name = get_wifi_details()
        print(f"✅ Detected: {interface} | Profile: {conn_name}", flush=True)
    except RuntimeError as e:
        print(f"❌ Error: {e}", file=sys.stderr, flush=True)
        sys.exit(1)

    # --- Use the first available tool by default ---
    choice = "2"
    chosen_tool_info = TOOLS[choice]
    print(f"\nSelected tool: {chosen_tool_info['name']}", flush=True)

    if not shutil.which(chosen_tool_info["cmd"]):
        print(f"❌ Error: {chosen_tool_info['cmd']} not found in PATH. Please install it.", file=sys.stderr, flush=True)
        sys.exit(1)
        
    iperf_server = None
    if chosen_tool_info["type"] == "iperf":
        # In a non-interactive script, you might get this from an env var or config file
        iperf_server = os.environ.get("IPERF_SERVER")
        if not iperf_server:
            print("❌ Error: iPerf server IP not specified. Set IPERF_SERVER environment variable.", file=sys.stderr, flush=True)
            sys.exit(1)

    # --- Run Single Test ---
    try:
        if wait_for_connection():
            freq, width = get_freq_width(interface)
            print(f"Connected on {conn_name}: {freq} MHz (Width: {width})", file=sys.stderr, flush=True)
            
            speed = run_speedtest_tool(choice, interface, iperf_server)
            print(f"⬇️  Result: {speed} Mbps", flush=True)
            
            # --- Report ---
            if speed > 0.0:
                now = datetime.datetime.now()
                report_dir = "reports"
                os.makedirs(report_dir, exist_ok=True)
                report_filename = os.path.join(report_dir, f"wifi_speedtest_report_{now.strftime('%Y-%m-%d_%H-%M-%S')}.txt")
                
                with open(report_filename, "w") as f:
                    f.write("Wi-Fi Speed Report\n")
                    f.write(f"Date: {now.strftime('%Y-%m-%d %H:%M:%S')}\n")
                    f.write(f"Tool: {chosen_tool_info['name']}\n")
                    f.write("-" * 40 + "\n")
                    f.write(f"SSID: {conn_name}\n")
                    f.write(f"Interface: {interface}\n")
                    f.write(f"Frequency: {freq} MHz\n")
                    f.write(f"Speed: {speed:.2f} Mbps\n")
                print(f"✓ Report saved to {report_filename}", flush=True)
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
