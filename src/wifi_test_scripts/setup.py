import sys
import subprocess
from pathlib import Path

def setup_environment():
    """Creates a venv and installs requirements if needed."""
    print("--- Environment Setup ---", flush=True)
    
    venv_dir = Path("venv")
    # Path to the python executable inside the venv (Lubuntu/Linux path)
    venv_python = venv_dir / "bin" / "python"
    venv_pip = venv_dir / "bin" / "pip"

    # 1 & 2: Check for venv and make it if it doesn't exist
    if not venv_python.exists():
        print("⚙️  Creating virtual environment...", flush=True)
        # Call the system's python to create the venv
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
    else:
        print("✅ Virtual environment already exists.", flush=True)

    # 3 & 4: "Activate" and install imports
    # By calling the pip executable inside the venv, it installs directly to the venv!
    req_file = Path("requirements.txt")
    if req_file.exists():
        print("📦 Checking/Installing dependencies from requirements.txt...", flush=True)
        subprocess.run([str(venv_pip), "install", "-r", "requirements.txt"], check=True)
    else:
        print("⚠️ No requirements.txt found. Skipping dependency installation.", flush=True)
        
    print("--- Setup Complete ---\n", flush=True)

if __name__ == "__main__":
    setup_environment()