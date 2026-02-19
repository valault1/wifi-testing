import subprocess
import sys
import json

def test_cloudflare_speedtest():
    """
    Tests the speed_test.py script with the Cloudflare tool.
    This test does not require root privileges.
    """
    print("🚀 Running test for speed_test.py with Cloudflare...")

    # We need to provide a dummy interface name. The script should handle it gracefully.
    interface = "dummy_interface"
    tool_choice = "1"  # Cloudflare

    command = [
        "python3",
        "speed_test.py",
        "--interface",
        interface,
        "--tool",
        tool_choice
    ]

    try:
        # Execute the script
        result = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
            timeout=300  # 5 minutes timeout for speed test
        )

        # The script should print a JSON object to stdout
        try:
            output = json.loads(result.stdout)
            print("✅ Test script executed successfully.")
            print(f"📄 Output JSON: {output}")

            # Basic validation of the output
            if "speed" in output and isinstance(output["speed"], (int, float)):
                print("✅ Speed field is present and is a number.")
            else:
                print("❌ ERROR: 'speed' field is missing or not a number in the output.")
                sys.exit(1)

        except json.JSONDecodeError:
            print("❌ ERROR: The script did not output valid JSON.")
            print(f"Raw stdout: {result.stdout}")
            sys.exit(1)

    except FileNotFoundError:
        print(f"❌ ERROR: 'speed_test.py' not found.")
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print(f"❌ ERROR: The script exited with a non-zero status code: {e.returncode}")
        print(f"Stderr: {e.stderr}")
        sys.exit(1)
    except subprocess.TimeoutExpired:
        print("❌ ERROR: The speed test took too long to complete.")
        sys.exit(1)

if __name__ == "__main__":
    test_cloudflare_speedtest()
