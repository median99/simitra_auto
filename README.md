Berikut adalah panduan lengkap untuk menginstall proyek Node.js Anda di Windows Subsystem for Linux (WSL) dengan terminal Ubuntu:

1. Persiapan WSL
Pastikan WSL dan distro Linux (disarankan Ubuntu) sudah terinstall:
wsl --install -d Ubuntu
Restart komputer jika diperlukan.
2. Update Package Manager
Buka Ubuntu WSL dari Start Menu, lalu:
sudo apt update && sudo apt upgrade -y
3. Install Node.js dan npm
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
Verifikasi instalasi:
node -v && npm -v
4. Install Git
 git clone https://github.com/median99/simitra_auto.git
cd repository
6. Install Dependencies
   npm install
7. Konfigurasi Environment
   Buat file .env jika diperlukan:
   nano .env
8. Jalankan Aplikasi
  node penawaran.js
