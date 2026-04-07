# 🚀 Panduan Migrasi & Seeding Database SINGG

## 📋 **Struktur File**

```
database/
├── migrations/
│   ├── 0001_01_01_000000_create_users_table.php          (Default Laravel)
│   ├── 0001_01_01_000001_create_cache_table.php          (Default Laravel)
│   ├── 0001_01_01_000002_create_jobs_table.php           (Default Laravel)
│   ├── 2025_08_14_170933_add_two_factor_columns_to_users_table.php  (Default Laravel)
│   ├── 2024_04_07_000001_create_singg_tables.php        ✨ SINGG Core Tables
│   └── 2024_04_07_000002_create_system_tables.php       ✨ SINGG System Tables
└── seeders/
    ├── DatabaseSeeder.php                               ✨ Updated
    └── SinggSeeder.php                                  ✨ NEW
```

---

## 🎯 **Langkah Penggunaan**

### **1. Setup Environment**

Pastikan file `.env` sudah terkonfigurasi dengan benar untuk MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=singg_public_service
DB_USERNAME=root
DB_PASSWORD=your_password
```

### **2. Buat Database (Manual)**

```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE singg_public_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit
EXIT;
```

### **3. Jalankan Migrasi**

```bash
# Fresh install (hapus semua tabel dan buat ulang)
php artisan migrate:fresh

# Atau kalau mau langsung seed sekaligus
php artisan migrate:fresh --seed

# Atau kalau database sudah ada
php artisan migrate
```

### **4. Verifikasi Database**

```bash
# Cek tabel yang terbuat
php artisan db:table

# Atau via MySQL
mysql -u root -p singg_public_service -e "SHOW TABLES;"
```

---

## ✅ **Yang Akan Dibuat**

### **Total: 45+ Tabel**

#### **1. User Management (6 tabel)**
- ✅ users
- ✅ user_profiles
- ✅ user_roles
- ✅ user_preferences
- ✅ refresh_tokens
- ✅ password_resets

#### **2. Pengaduan/Tickets (7 tabel)**
- ✅ ticket_categories
- ✅ tickets
- ✅ ticket_attachments
- ✅ ticket_comments
- ✅ ticket_history
- ✅ ticket_supports
- ✅ ticket_ratings

#### **3. Dokumen/Administrasi (6 tabel)**
- ✅ document_types
- ✅ document_templates
- ✅ documents
- ✅ document_attachments
- ✅ document_approvals
- ✅ document_history

#### **4. Notifikasi (2 tabel)**
- ✅ notification_templates
- ✅ notifications

#### **5. Gamifikasi/Poin (5 tabel)**
- ✅ point_rules
- ✅ user_points
- ✅ point_transactions
- ✅ badges
- ✅ user_badges

#### **6. Messages/Chat (2 tabel)**
- ✅ conversations
- ✅ messages

#### **7. Pengumuman (2 tabel)**
- ✅ announcements
- ✅ announcement_reads

#### **8. Forum & Community (6 tabel)**
- ✅ forum_categories
- ✅ forum_posts
- ✅ forum_comments
- ✅ forum_post_likes
- ✅ forum_comment_likes
- ✅ forum_poll_votes

#### **9. Events (3 tabel)**
- ✅ events
- ✅ event_registrations
- ✅ event_interests

#### **10. Audit & Analytics (2 tabel)**
- ✅ audit_logs
- ✅ analytics_events

#### **11. System Configuration (4 tabel)**
- ✅ system_settings
- ✅ feature_flags
- ✅ report_schedules
- ✅ report_cache

---

## 🌱 **Data Awal (Seed)**

Setelah menjalankan `php artisan migrate:fresh --seed`, data berikut akan dibuat:

### **1. Superadmin User**
```
Email: admin@negeri.id
Password: Admin123!
Role: superadmin
```

### **2. Ticket Categories (8 items)**
- 🚧 Infrastruktur (SLA: 72 jam)
- 🗑️ Kebersihan (SLA: 48 jam)
- 👮 Keamanan (SLA: 24 jam)
- 🏥 Kesehatan (SLA: 48 jam)
- 📚 Pendidikan (SLA: 120 jam)
- 🏛️ Pelayanan Publik (SLA: 72 jam)
- 📄 Administrasi (SLA: 168 jam)
- 📦 Lainnya (SLA: 168 jam)

### **3. Document Types (11 items)**
- Surat Pengantar RT
- Surat Pengantar RW
- Surat Keterangan Domisili
- Surat Keterangan Usaha
- Surat Pengantar SKCK
- Surat Keterangan Tidak Mampu
- Surat Keterangan Belum Menikah
- Surat Keterangan Kematian
- Surat Keterangan Kelahiran
- Surat Pengantar Pembuatan KTP
- Surat Pengantar Pembuatan KK

### **4. Point Rules (8 items)**
- Buat Pengaduan (+10 poin)
- Upload Foto (+5 poin)
- Beri Rating (+5 poin)
- Komentar Berguna (+10 poin)
- Posting Forum (+5 poin)
- Login Harian (+1 poin)
- Lengkapi Profil (+50 poin)
- Referal Teman (+100 poin)

### **5. Badges (7 items)**
- 🥇 Pengaduan Pertama
- 🥈 Warga Aktif
- 🥉 Fotografer
- 🎖️ Kontributor
- ✅ User Terverifikasi
- ⭐ Top Reviewer
- 🌟 Early Adopter

### **6. Forum Categories (5 items)**
- 📢 Pengumuman
- 💬 Diskusi
- 💡 Ide & Saran
- ❓ Tanya Jawab
- 🛒 Jual Beli

### **7. System Settings (6 items)**
- system_name
- maintenance_mode
- max_upload_size
- allowed_file_types
- default_sla_hours
- registration_enabled

### **8. Feature Flags (5 items)**
- forum ✅
- events ✅
- gamification ✅
- dark_mode ✅
- mobile_app ❌

---

## 🔧 **Troubleshooting**

### **Error: SQLSTATE[HY000] [2002] Connection refused**

**Solusi:** Pastikan MySQL server berjalan
```bash
# Linux
sudo systemctl start mysql

# MacOS
brew services start mysql

# Windows
net start MySQL
```

### **Error: Access denied for user**

**Solusi:** Cek kredensial di `.env`
```env
DB_USERNAME=root
DB_PASSWORD=your_correct_password
```

### **Error: Database already exists**

**Solusi:** Drop database dulu
```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS singg_public_service;"
```

### **Error: Foreign key constraint fails**

**Solusi:** Gunakan `migrate:fresh` untuk drop semua tabel
```bash
php artisan migrate:fresh --seed
```

---

## 📝 **Commands Berguna**

```bash
# Lihat semua migrasi
php artisan migrate:status

# Rollback migrasi terakhir
php artisan migrate:rollback

# Rollback semua migrasi
php artisan migrate:reset

# Fresh migrate dengan seed
php artisan migrate:fresh --seed

# Hapus semua tabel dan migrate ulang
php artisan migrate:fresh

# Jalankan seeder saja
php artisan db:seed

# Jalankan seeder spesifik
php artisan db:seed --class=SinggSeeder
```

---

## 🎉 **Success Indicators**

Setelah sukses, Anda akan melihat output seperti ini:

```
✅ Superadmin user created (admin@negeri.id / Admin123!)
✅ Ticket categories seeded
✅ Document types seeded
✅ Point rules seeded
✅ Badges seeded
✅ Forum categories seeded
✅ System settings seeded
✅ Feature flags seeded

🎉 Database seeding completed successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 LOGIN CREDENTIALS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: admin@negeri.id
Password: Admin123!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🚀 **Next Steps**

Setelah database siap:

1. **Login sebagai superadmin** untuk setup awal
2. **Buat user admin** lain jika diperlukan
3. **Konfigurasi sistem** via UI atau langsung di database
4. **Testing flow** pengaduan & layanan administrasi
5. **Deploy ke production** (jangan lupa ganti password!)

---

*Dibuat untuk Sistem Pelayanan Publik Negeri*  
*Tanggal: 7 April 2026*
