# Cara Setup GitHub Authentication

## Masalah
GitHub tidak lagi mendukung password authentication. Error yang muncul:
```
remote: Invalid username or token. Password authentication is not supported for Git operations.
```

## Solusi: Gunakan Personal Access Token (PAT)

### Cara 1: Menggunakan Personal Access Token (Recommended)

#### Langkah 1: Buat Personal Access Token di GitHub

1. Buka GitHub → Settings → Developer settings
   - Atau langsung: https://github.com/settings/tokens

2. Klik "Personal access tokens" → "Tokens (classic)"

3. Klik "Generate new token" → "Generate new token (classic)"

4. Isi:
   - **Note**: "StokApp Development" (atau nama lain)
   - **Expiration**: Pilih durasi (90 days, atau No expiration)
   - **Select scopes**: Centang minimal:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)

5. Klik "Generate token" di bawah

6. **PENTING**: Copy token yang muncul (hanya muncul sekali!)
   - Token akan terlihat seperti: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### Langkah 2: Gunakan Token saat Push

**Opsi A: Masukkan token sebagai password**
```bash
git push -u origin main
# Username: ptsbsid (atau username GitHub Anda)
# Password: <paste token di sini> (bukan password GitHub!)
```

**Opsi B: Simpan token di Git credential manager**
```bash
# Windows
git config --global credential.helper wincred

# Lalu push (akan diminta username dan password sekali)
git push -u origin main
# Username: ptsbsid
# Password: <paste token>
```

**Opsi C: Masukkan token langsung di URL (tidak disarankan untuk security)**
```bash
git remote set-url origin https://ghp_YOUR_TOKEN@github.com/ptsbsid/globalstok.git
git push -u origin main
```

### Cara 2: Menggunakan SSH (Alternatif)

#### Langkah 1: Generate SSH Key

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "email@anda.com"

# Tekan Enter untuk semua prompt (atau isi passphrase jika mau)
```

#### Langkah 2: Copy Public Key

```bash
# Windows PowerShell
Get-Content ~/.ssh/id_ed25519.pub

# Copy output yang muncul (berawalan ssh-ed25519...)
```

#### Langkah 3: Tambahkan SSH Key ke GitHub

1. Buka GitHub → Settings → SSH and GPG keys
2. Klik "New SSH key"
3. Title: "StokApp Development"
4. Key: Paste public key yang sudah di-copy
5. Klik "Add SSH key"

#### Langkah 4: Ubah Remote URL ke SSH

```bash
git remote set-url origin git@github.com:ptsbsid/globalstok.git
git push -u origin main
```

## Cara Cepat: Gunakan GitHub CLI (gh)

Jika sudah install GitHub CLI:

```bash
# Login
gh auth login

# Pilih GitHub.com
# Pilih HTTPS
# Authenticate dengan web browser
# Setelah login, push akan otomatis bekerja
git push -u origin main
```

## Troubleshooting

**Token tidak bekerja?**
- Pastikan token masih valid (belum expired)
- Pastikan scope `repo` sudah dicentang
- Pastikan repository ada dan Anda punya akses

**Masih error?**
- Coba logout dan login ulang:
  ```bash
  git credential-manager-core erase
  ```
- Atau coba dengan SSH

