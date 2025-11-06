# Panduan Deployment StokApp

## 📋 Langkah-langkah Setup & Deployment

### 1. Setup Git (Jika belum)

```bash
git config --global user.name "Nama Anda"
git config --global user.email "email@anda.com"
```

### 2. Setup Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Add project" atau pilih project yang sudah ada
3. Isi nama project dan ikuti wizard setup
4. Setelah project dibuat, klik "Firestore Database"
5. Klik "Create database"
6. Pilih "Start in test mode" (untuk development) atau "Start in production mode"
7. Pilih lokasi database (pilih yang terdekat)
8. Klik "Enable"

9. Setup Firestore Rules:
   - Buka Firestore Database > Rules
   - Untuk development, gunakan rules ini:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /warehouses/{warehouseId} {
      allow read, write: if true;
    }
  }
}
```
   - Klik "Publish"

10. Dapatkan Firebase Config:
    - Buka Project Settings (icon gear di sidebar)
    - Scroll ke bawah ke bagian "Your apps"
    - Klik icon Web (</>)
    - Isi nama app (opsional)
    - Klik "Register app"
    - Copy konfigurasi yang diberikan

### 3. Setup Environment Variables

1. Buat file `.env` di root project:
```bash
# Windows PowerShell
Copy-Item env.example.txt .env

# Linux/Mac
cp env.example.txt .env
```

2. Edit file `.env` dan isi dengan konfigurasi Firebase:
```
VITE_FIREBASE_API_KEY=AIzaSy... (dari Firebase config)
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 4. Test Local

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` dan pastikan aplikasi berjalan dengan baik.

### 5. Push ke GitHub

1. Buat repository baru di GitHub:
   - Buka [GitHub](https://github.com)
   - Klik "New repository"
   - Isi nama repository (contoh: `stokapp`)
   - Pilih Public atau Private
   - JANGAN centang "Initialize with README" (karena sudah ada)
   - Klik "Create repository"

2. Push code ke GitHub:
```bash
# Tambahkan remote repository
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Ganti USERNAME dan REPO_NAME dengan yang sesuai

# Push ke GitHub
git branch -M main
git push -u origin main
```

### 6. Deploy ke Netlify

#### Metode A: Via GitHub (Recommended)

1. Login ke [Netlify](https://app.netlify.com/)
2. Klik "Add new site" > "Import an existing project"
3. Pilih "GitHub" dan authorize
4. Pilih repository `stokapp`
5. Konfigurasi build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - Klik "Show advanced" dan tambahkan:
     - **Base directory**: (kosongkan)
6. Klik "Deploy site" (tunggu deploy selesai)
7. Setelah deploy, tambahkan Environment Variables:
   - Buka Site Settings (icon gear di sidebar)
   - Klik "Environment variables" di menu kiri
   - Tambahkan semua variable dari `.env`:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
   - Klik "Save"
   - Klik "Trigger deploy" > "Clear cache and deploy site"

#### Metode B: Via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login:
```bash
netlify login
```

3. Build aplikasi:
```bash
npm run build
```

4. Deploy:
```bash
netlify deploy --prod
```

5. Ikuti instruksi untuk setup environment variables di Netlify dashboard

### 7. Verifikasi Deployment

1. Buka URL yang diberikan Netlify
2. Cek apakah aplikasi berjalan dengan baik
3. Cek indikator "Real-time" di header (harus hijau)
4. Test update stok dan pastikan tersimpan
5. Buka aplikasi di device lain untuk test real-time sync

### 🔧 Troubleshooting

**Problem: Firebase tidak terhubung**
- Pastikan semua environment variables sudah ditambahkan di Netlify
- Cek Firestore Rules sudah benar
- Cek console browser untuk error

**Problem: Build gagal di Netlify**
- Pastikan build command: `npm run build`
- Pastikan publish directory: `dist`
- Cek build logs di Netlify

**Problem: Data tidak tersimpan**
- Cek Firestore Rules mengizinkan read/write
- Pastikan environment variables sudah benar
- Cek koneksi internet

### 📝 Catatan Penting

- File `.env` TIDAK akan di-push ke GitHub (sudah di .gitignore)
- Environment variables HARUS ditambahkan manual di Netlify
- Firestore Rules di atas hanya untuk development, untuk production perlu authentication
- Setelah menambahkan environment variables di Netlify, harus redeploy

