# Sistem Manajemen Stok Minyak (StokApp)

Aplikasi manajemen stok minyak goreng berbasis React + TypeScript dengan real-time database menggunakan Firebase Firestore.

## 🚀 Fitur

- ✅ **Manajemen Stok Real-time** - Update stok tandon secara real-time
- ✅ **Multi-Gudang** - Kelola beberapa gudang sekaligus
- ✅ **Visualisasi Stok** - Progress bar dan indikator visual untuk setiap tandon
- ✅ **Export Laporan** - Export data ke PNG dan JSON
- ✅ **Import Data** - Import data dari file JSON
- ✅ **Sinkronisasi Real-time** - Data tersinkronisasi otomatis dengan Firebase
- ✅ **Offline Support** - Fallback ke localStorage jika Firebase tidak tersedia

## 📋 Prerequisites

- Node.js (v16 atau lebih baru)
- npm atau yarn
- Akun Firebase (untuk database real-time)

## 🔧 Instalasi

1. Clone repository:
```bash
git clone <your-repo-url>
cd StokApp
```

2. Install dependencies:
```bash
npm install
```

3. Setup Firebase:
   - Buat project baru di [Firebase Console](https://console.firebase.google.com/)
   - Buat Firestore Database (mode production atau test mode)
   - Buka Project Settings > General
   - Scroll ke bawah dan klik "Add app" > Web (</>)
   - Copy konfigurasi Firebase yang diberikan

4. Buat file `.env` di root project:
```bash
cp .env.example .env
```

5. Edit file `.env` dan isi dengan konfigurasi Firebase Anda:
```
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

6. Setup Firestore Security Rules:
   - Buka Firebase Console > Firestore Database > Rules
   - Gunakan rules berikut untuk development (tidak untuk production):
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

   ⚠️ **PENTING**: Rules di atas hanya untuk development. Untuk production, gunakan authentication!

## 🏃 Menjalankan Aplikasi

### Development Mode
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Build untuk Production
```bash
npm run build
```

File build akan tersimpan di folder `dist/`

### Preview Build
```bash
npm run preview
```

## 📦 Deployment ke Netlify

### Metode 1: Deploy via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build aplikasi:
```bash
npm run build
```

3. Login ke Netlify:
```bash
netlify login
```

4. Deploy:
```bash
netlify deploy --prod
```

### Metode 2: Deploy via GitHub + Netlify

1. Push code ke GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Login ke [Netlify](https://app.netlify.com/)
3. Klik "Add new site" > "Import an existing project"
4. Pilih GitHub dan pilih repository Anda
5. Konfigurasi build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Tambahkan Environment Variables:
   - Klik "Site settings" > "Environment variables"
   - Tambahkan semua variable dari file `.env`:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
7. Klik "Deploy site"

### Metode 3: Deploy via Drag & Drop

1. Build aplikasi:
```bash
npm run build
```

2. Login ke [Netlify](https://app.netlify.com/)
3. Drag folder `dist` ke Netlify dashboard
4. Tambahkan Environment Variables di Site settings

## 🔐 Environment Variables untuk Netlify

Setelah deploy, pastikan untuk menambahkan environment variables di Netlify:
1. Buka Netlify Dashboard > Site Settings > Environment Variables
2. Tambahkan semua variable dari `.env` file
3. Redeploy site setelah menambahkan variables

## 📱 Struktur Data

### Warehouse
```typescript
{
  id: string;
  name: string;
  location: string;
  tanks: Tank[];
  totalCapacity: { uco: number; cpo: number };
  totalCurrentStock: { uco: number; cpo: number };
  lastUpdated: Date;
}
```

### Tank
```typescript
{
  id: string;
  name: string;
  capacity: number;
  currentStock: number;
  oilType: 'UCO' | 'CPO' | 'Empty';
  lastUpdated: Date;
}
```

## 🛠️ Teknologi yang Digunakan

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Firebase Firestore** - Real-time Database
- **Lucide React** - Icons
- **html2canvas** - Export PNG

## 📝 Scripts

- `npm run dev` - Menjalankan development server
- `npm run build` - Build untuk production
- `npm run preview` - Preview build production
- `npm run lint` - Lint code

## 🐛 Troubleshooting

### Firebase tidak terhubung
- Pastikan semua environment variables sudah diisi dengan benar
- Cek Firestore Database sudah dibuat dan aktif
- Pastikan Firestore Rules sudah dikonfigurasi
- Cek console browser untuk error messages

### Data tidak tersimpan
- Pastikan Firestore Rules mengizinkan read/write
- Cek koneksi internet
- Lihat console browser untuk error

### Build error di Netlify
- Pastikan semua environment variables sudah ditambahkan
- Cek build command: `npm run build`
- Cek publish directory: `dist`
- Lihat build logs di Netlify dashboard

## 📄 License

MIT

## 👤 Author

StokApp - Sistem Manajemen Stok Minyak

