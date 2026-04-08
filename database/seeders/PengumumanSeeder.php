<?php

namespace Database\Seeders;

use App\Models\Pengumuman;
use App\Models\User;
use Illuminate\Database\Seeder;

class PengumumanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get admin user
        $admin = User::where('email', 'admin@nagari.id')->first();

        if (!$admin) {
            $this->command->error('Admin user not found! Run UserSeeder first.');
            return;
        }

        $pengumuman = [
            [
                'dibuat_oleh' => $admin->id,
                'judul' => 'Selamat Datang di Portal Pelayanan Nagari',
                'isi' => 'Selamat datang di Portal Pelayanan Nagari. Portal ini dibuat untuk memudahkan warga dalam mengajukan pengaduan dan layanan administrasi secara online. Silakan daftar dan login untuk menggunakan layanan kami.',
                'tipe' => 'umum',
                'target_peran' => null,
                'is_penting' => true,
                'is_semat' => true,
                'published_at' => now(),
                'kadaluarsa_at' => null,
                'jumlah_dilihat' => 0,
                'jumlah_dibaca' => 0,
            ],
            [
                'dibuat_oleh' => $admin->id,
                'judul' => 'Jadwal Pelayanan Keliling Bulan Ini',
                'isi' => 'Pemberitahuan kepada seluruh warga Nagari bahwa pelayanan keliling akan dilaksanakan pada:
- Tanggal 15 April 2026 di Balai RW 01
- Tanggal 20 April 2026 di Balai RW 02
- Tanggal 25 April 2026 di Balai RW 03

Pelayanan meliputi: Pembuatan KTP, KK, dan surat keterangan.',
                'tipe' => 'informasi',
                'target_peran' => 'warga',
                'is_penting' => true,
                'is_semat' => true,
                'published_at' => now(),
                'kadaluarsa_at' => now()->addDays(30),
                'jumlah_dilihat' => 0,
                'jumlah_dibaca' => 0,
            ],
            [
                'dibuat_oleh' => $admin->id,
                'judul' => 'Pemeliharaan Sistem - 20 April 2026',
                'isi' => 'Portal pelayanan akan melakukan pemeliharaan sistem pada:
Tanggal: 20 April 2026
Waktu: 02:00 - 06:00 WIB

Selama pemeliharaan, sistem tidak dapat diakses. Mohon maaf atas ketidaknyamanan ini.',
                'tipe' => 'maintenance',
                'target_peran' => null,
                'is_penting' => false,
                'is_semat' => false,
                'published_at' => now(),
                'kadaluarsa_at' => now()->addDays(7),
                'jumlah_dilihat' => 0,
                'jumlah_dibaca' => 0,
            ],
            [
                'dibuat_oleh' => $admin->id,
                'judul' => 'Gotong Royong Massal - Minggu Ini',
                'isi' => 'Diundang seluruh warga Nagari untuk mengikuti gotong royong massal membersihkan lingkungan:
Hari/Tanggal: Minggu, 10 April 2026
Waktu: 07:00 - 11:00 WIB
Tempat: Titik kumpul masing-masing RW

Diharapkan kehadiran seluruh warga. Terima kasih.',
                'tipe' => 'kegiatan',
                'target_peran' => 'warga',
                'is_penting' => true,
                'is_semat' => false,
                'published_at' => now(),
                'kadaluarsa_at' => now()->addDays(7),
                'jumlah_dilihat' => 0,
                'jumlah_dibaca' => 0,
            ],
        ];

        foreach ($pengumuman as $p) {
            Pengumuman::create($p);
        }

        $this->command->info('✅ Pengumuman seeded successfully!');
    }
}
