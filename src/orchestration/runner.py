import sys
import argparse

try:
    import paramiko
except ImportError:
    print("Error: The 'paramiko' library is required to run this script.", file=sys.stderr)
    print("Please install it by running: pip install paramiko", file=sys.stderr)
    print("Or on Ubuntu/Debian: sudo apt-get install python3-paramiko", file=sys.stderr)
    sys.exit(1)

import csv
import os

# --- Configuration ---
HOSTS = [
    "val-server-3.local", # Replace with actual hostnames or IP addresses
]

USERNAME = "val" # Change if needed on target laptops
PASSWORD = "your_password_here" # Hard-coded password for now

# Paths on the remote machine
REMOTE_DIR = "~/wifi_testing"
REMOTE_SCRIPT = "src/wifi_test_scripts/main.py"
REMOTE_CSV = "reports/speed-test-results.csv"

# Local file where all results will be appended
# Assuming the script is run from the project root or src dir, we build absolute path
LOCAL_CSV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "reports", "orchestrated-speed-test-results.csv"))

def run_remote_speedtest(host, tool):
    print(f"\n--- Testing {host} ---")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        # Connect with timeout
        ssh.connect(host, username=USERNAME, password=PASSWORD, timeout=10)
        
        print(f"[{host}] Running speed test... (this may take a minute)")
        
        # Run the script with the specified tool
        command = f"cd {REMOTE_DIR} && python3 {REMOTE_SCRIPT} --tool {tool}"
        stdin, stdout, stderr = ssh.exec_command(command)
        
        # Wait for the command to finish and get exit status
        exit_status = stdout.channel.recv_exit_status()
        
        if exit_status == 0:
            print(f"[{host}] Speed test completed successfully.")
            
            # Read the last line of the remote CSV file
            stdin, stdout, stderr = ssh.exec_command(f"tail -n 1 {REMOTE_DIR}/{REMOTE_CSV}")
            last_line = stdout.read().decode('utf-8').strip()
            
            if last_line:
                print(f"[{host}] Result collected: {last_line.split(',')}")
                
                # Ensure the local directory exists
                os.makedirs(os.path.dirname(LOCAL_CSV_PATH), exist_ok=True)
                
                # Ensure header exists if file is new
                if not os.path.exists(LOCAL_CSV_PATH):
                    with open(LOCAL_CSV_PATH, "w") as f:
                        f.write("Date/Time,Hostname,Tool,SSID,Interface,Band,Frequency (MHz),Width,Speed (Mbps)\n")
                
                # Append to local CSV
                with open(LOCAL_CSV_PATH, "a") as f:
                    f.write(last_line + "\n")
                print(f"[{host}] Saved result to master CSV.")
            else:
                print(f"[{host}] Could not parse CSV output file remotely. It might be empty.")
        else:
            print(f"[{host}] Error running speed test:")
            print(stderr.read().decode('utf-8').strip())
            
    except paramiko.AuthenticationException:
        print(f"[{host}] Authentication failed. Check username and password.")
    except Exception as e:
        print(f"[{host}] Failed to connect or execute: {e}")
    finally:
        ssh.close()

def main():
    parser = argparse.ArgumentParser(description="Orchestrate Wi-Fi Speed Tests across multiple laptops.")
    parser.add_argument("--tool", choices=["ookla", "cloudflare"], default="ookla", help="Speedtest tool to run (ookla or cloudflare)")
    args = parser.parse_args()

    print("==========================================")
    print("   Wi-Fi Speedtest Orchestration          ")
    print("==========================================")
    print(f"Targeting tool: {args.tool}")
    print(f"Master CSV file: {LOCAL_CSV_PATH}")
    
    # Run tests sequentially to avoid saturating network bandwidth 
    # (Running multiple speed tests simultaneously to the internet would ruin the results)
    for host in HOSTS:
        run_remote_speedtest(host, args.tool)
        
    print("\nAll tasks completed.")

if __name__ == "__main__":
    main()
