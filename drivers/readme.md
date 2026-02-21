for my device, the asus BE92:

sudo apt update
sudo apt install -y build-essential git dkms linux-headers-$(uname -r)

# Move to a temporary folder
cd ~/Downloads

# Clone the repository
git clone https://github.com/morrownr/rtw89.git
cd rtw89


# Prepare the system for the driver version (currently 6.18 in the repo)
# If this fails, check the 'version' file in the repo for the current number
sudo dkms add .
sudo dkms build rtw89/7.0
sudo dkms install rtw89/7.0
sudo make install_fw
sudo modprobe rtw89_8922au