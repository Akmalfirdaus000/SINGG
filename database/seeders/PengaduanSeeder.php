<?php

namespace Database\Seeders;

use App\Models\KategoriPengaduan;
use App\Models\LampiranPengaduan;
use App\Models\Pengaduan;
use App\Models\RiwayatPengaduan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PengaduanSeeder extends Seeder
{
    public function run(): void
    {
        // Temukan user
        $wargaId = User::whereHas('peran', function($q) { $q->where('peran', 'warga'); })->first()?->id;
        $adminId = User::whereHas('peran', function($q) { $q->where('peran', 'admin'); })->first()?->id;
        $kategoriIds = KategoriPengaduan::pluck('id')->toArray();

        if (!$wargaId || !$adminId || empty($kategoriIds)) {
            $this->command->warn('Warga, Admin, atau Kategori tidak ditemukan. Pastikan seeder lain sudah dijalankan.');
            return;
        }

        $statuses = ['menunggu_verifikasi', 'terverifikasi', 'dalam_proses', 'selesai', 'ditolak'];
        $priorities = ['rendah', 'sedang', 'tinggi', 'urgent'];

        for ($i = 1; $i <= 15; $i++) {
            $status = $statuses[array_rand($statuses)];
            $prioritas = $priorities[array_rand($priorities)];
            $nomor = 'PGD-' . date('Ymd') . '-' . str_pad($i, 4, '0', STR_PAD_LEFT) . '-' . substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 4);
            
            $pengaduan = Pengaduan::create([
                'nomor_pengaduan' => $nomor,
                'user_id' => $wargaId,
                'kategori_id' => $kategoriIds[array_rand($kategoriIds)],
                'judul' => 'Contoh Laporan Pengaduan ' . $i,
                'deskripsi' => 'Ini adalah deskripsi pengaduan dummy ke-' . $i . '. Laporan ini mencakup keluhan terkait fasilitas umum di Nagari Gasan Gadang.',
                'status' => $status,
                'prioritas' => $prioritas,
                'progres' => ($status === 'selesai') ? 100 : (($status === 'dalam_proses') ? 50 : 0),
                'alamat_lokasi' => 'Jl. Nagari Gasan Gadang No. ' . $i,
                'latitude' => -0.5,
                'longitude' => 100.2,
            ]);

            // Tambah Lampiran Dummy
            LampiranPengaduan::create([
                'pengaduan_id' => $pengaduan->id,
                'nama_file' => 'img_' . $i . '.jpg',
                'url_file' => 'https://picsum.photos/seed/' . $i . '/800/600',
                'tipe_file' => 'image/jpeg',
                'ukuran_file' => 102400,
                'diunggah_oleh' => $wargaId,
            ]);

            // Tambah Riwayat Awal
            RiwayatPengaduan::create([
                'pengaduan_id' => $pengaduan->id,
                'user_id' => $wargaId,
                'status_lama' => 'draft',
                'status_baru' => 'menunggu_verifikasi',
                'catatan' => 'Laporan diajukan oleh warga.',
            ]);

            // Tambah Riwayat tambahan jika sudah diproses
            if (in_array($status, ['dalam_proses', 'selesai', 'ditolak'])) {
                RiwayatPengaduan::create([
                    'pengaduan_id' => $pengaduan->id,
                    'user_id' => $adminId,
                    'status_lama' => 'menunggu_verifikasi',
                    'status_baru' => $status,
                    'catatan' => 'Laporan diproses oleh petugas admin. ' . ($status === 'selesai' ? 'Masalah sudah diatasi.' : ''),
                ]);
            }
        }
        $this->command->info('✅ 15 Pengaduan seeded successfully with attachments and history!');
    }
}
