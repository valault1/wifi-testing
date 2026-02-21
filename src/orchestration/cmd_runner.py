import os
import subprocess
import sys

def run_command(command):
    """Runs a system command and returns output."""
    env = os.environ.copy()
    # Ensure system directories are in PATH, especially for non-interactive SSH sessions
    env["PATH"] = env.get("PATH", "") + ":/usr/sbin:/sbin:/usr/local/sbin:/usr/bin:/bin"
    
    try:
        result = subprocess.run(
            command,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            env=env
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {' '.join(command)}", file=sys.stderr)
        print(f"Stderr: {e.stderr.strip()}", file=sys.stderr)
        return None
    except FileNotFoundError:
        print(f"Command not found: {command[0]}", file=sys.stderr)
        return None
