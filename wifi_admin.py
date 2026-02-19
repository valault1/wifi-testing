import subprocess
import sys
import time
import argparse

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
        print(f"Error running command: {' '.join(command)}")
        print(f"Stderr: {e.stderr.strip()}")
        return None

def get_wifi_details():
    """Detects active interface and connection profile and prints them."""
    interface = None
    conn_name = None

    out = run_command(["nmcli", "-t", "-f", "DEVICE,TYPE", "device"])
    if out:
        for line in out.split('
'):
            if ":wifi" in line:
                interface = line.split(':')[0]
                break
    
    if not interface:
        print("Error: No Wi-Fi interface found.", file=sys.stderr)
        sys.exit(1)

    out = run_command(["nmcli", "-t", "-f", "NAME,DEVICE", "connection", "show", "--active"])
    if out:
        for line in out.split('
'):
            if f":{interface}" in line:
                conn_name = line.split(':')[0]
                break

    if not conn_name:
        print(f"Error: No active connection on {interface}.", file=sys.stderr)
        sys.exit(1)

    print(f"{interface},{conn_name}")

def switch_band(conn_name, band_code):
    """Switches Wi-Fi band using nmcli."""
    # Modify connection
    cmd_modify = ["nmcli", "connection", "modify", conn_name, "wifi.band", band_code if band_code else ""]
    run_command(cmd_modify)

    # Apply changes
    cmd_up = ["nmcli", "connection", "up", conn_name]
    run_command(cmd_up)

    time.sleep(5)

def cleanup(conn_name):
    """Restores Wi-Fi settings on exit."""
    if conn_name:
        run_command(["nmcli", "connection", "modify", conn_name, "wifi.band", ""])
        run_command(["nmcli", "connection", "up", conn_name])

def main():
    parser = argparse.ArgumentParser(description="Wi-Fi admin tasks requiring sudo.")
    parser.add_argument("command", choices=["get_details", "switch_band", "cleanup"])
    parser.add_argument("--conn-name", help="Connection name (for switch_band and cleanup)")
    parser.add_argument("--band", help="Band code to switch to (e.g., 'bg', 'a')")

    args = parser.parse_args()

    if args.command == "get_details":
        get_wifi_details()
    elif args.command == "switch_band":
        if not args.conn_name or not args.band:
            print("Error: --conn-name and --band are required for switch_band", file=sys.stderr)
            sys.exit(1)
        # The band can be empty string, so we check for None
        if args.band == '""' or args.band == "''":
            args.band = ""
        switch_band(args.conn_name, args.band)
    elif args.command == "cleanup":
        if not args.conn_name:
            print("Error: --conn-name is required for cleanup", file=sys.stderr)
            sys.exit(1)
        cleanup(args.conn_name)

if __name__ == "__main__":
    main()
