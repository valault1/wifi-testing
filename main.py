# This script must be run with sudo, e.g., `sudo python3 main.py`
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
    print("==========================================")
    print("   Wi-Fi Speedtest Automation (Python)    ")
    print("==========================================")
    
    try:
        interface, conn_name = get_wifi_details()
        print(f"✅ Detected: {interface} | Profile: {conn_name}")
    except RuntimeError as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)

    # --- Menu ---
    print("\nSelect Tool:")
    for key, val in TOOLS.items():
        print(f"{key}. {val['name']}")
    
    choice = input("\nEnter choice (1-5): ")
    if choice not in TOOLS:
        print("Invalid choice.", file=sys.stderr)
        sys.exit(1)
        
    chosen_tool_info = TOOLS[choice]
    
    if not shutil.which(chosen_tool_info["cmd"]):
        print(f"❌ Error: {chosen_tool_info['cmd']} not found in PATH. Please install it.", file=sys.stderr)
        sys.exit(1)
        
    iperf_server = None
    if chosen_tool_info["type"] == "iperf":
        iperf_server = input("Enter iPerf3 Server IP: ")
        if not iperf_server:
            sys.exit(1)

    # --- Run Tests ---
    results = []
    tests = [
        ("bg", "2.4 GHz"), # 802.11b/g
        ("a", "5 GHz"),   # 802.11a
        ("6g", "6 GHz")
    ]
    
    try:
        for band_code, label in tests:
            print(f"\n--- Testing {label} ---")
            switch_band(conn_name, band_code)
            
            if wait_for_connection():
                freq, width = get_freq_width(interface)
                print(f"Connected on {label}: {freq} MHz (Width: {width})", file=sys.stderr)
                
                speed = run_speedtest_tool(choice, interface, iperf_server)
                print(f"⬇️  Result: {speed} Mbps")
                
                results.append({"band": label, "freq": freq, "speed": speed})
            else:
                print(f"❌ Could not connect to the internet on {label}.")
                results.append({"band": label, "freq": "N/A", "speed": 0.0})

    except KeyboardInterrupt:
        print("\nAborted by user.")
    finally:
        cleanup(conn_name)

    # --- Report ---
    if results:
        print(f"\n📄 Generating Report...")
        
        # Sort by speed to find the best result
        best_result = max(results, key=lambda x: x['speed'])
        
        report_file = "wifi_speedtest_report.txt"
        with open(report_file, "w") as f:
            f.write("Wi-Fi Speed Report\n")
            f.write(f"Date: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Tool: {chosen_tool_info['name']}\n")
            f.write("-" * 40 + "\n")
            f.write(f"🏆 Fastest: {best_result['band']} ({best_result['speed']} Mbps)\n")
            f.write("-" * 40 + "\n")
            f.write(f"{'Band':<10} | {'Freq (MHz)':<10} | {'Speed (Mbps)':<15}\n")
            f.write("-" * 40 + "\n")
            for r in results:
                f.write(f"{r['band']:<10} | {r['freq']:<10} | {r['speed']:<15.2f}\n")
        
        print(f"✓ Report saved to {report_file}")

if __name__ == "__main__":
    main()
