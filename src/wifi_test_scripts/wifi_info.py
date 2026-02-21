import os
import re
from cmd_runner import run_command

def get_wifi_details():
    """Detects connected Wi-Fi interface and network name (SSID) without sudo."""
    # Find a connected wireless interface in /sys/class/net
    for dev in os.listdir('/sys/class/net'):
        if os.path.exists(f'/sys/class/net/{dev}/wireless'):
            # Get network name (SSID) using 'iw' to check if connected
            out = run_command(["iw", "dev", dev, "link"])
            if out:
                m = re.search(r"SSID:\s+(.+)", out)
                if m:
                    # Successfully found a connected interface
                    return dev, m.group(1)

    raise RuntimeError("No connected Wi-Fi interface found.")

def switch_band(conn_name, band_code):
    """(Not possible without sudo) This function is a placeholder."""
    print(f"SKIPPING band switch for '{band_code}' (requires sudo).")
    # This functionality is not possible without modifying network configurations,
    # which requires elevated privileges.
    pass

def cleanup(conn_name):
    """(Not possible without sudo) This function is a placeholder."""
    print("SKIPPING Wi-Fi cleanup (requires sudo).")
    pass

def get_freq_width(interface):
    """Extracts frequency and width using 'iw'."""
    # Note: Replacing 'iw' is hard without external libraries.
    # We can try to read from /sys/class/net/ but it's not always reliable for freq/width.
    # For now, we keep the 'iw' command as it's the most reliable method.
    out = run_command(["iw", "dev", interface, "link"])
    freq = "N/A"
    width = "N/A"
    
    if out:
        m_freq = re.search(r"freq:\s+(\d+)", out)
        if m_freq: freq = m_freq.group(1)
        
        m_width = re.search(r"(\d+)MHz", out)
        if m_width: width = m_width.group(1)
        
    return freq, width
