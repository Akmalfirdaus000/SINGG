<?php

namespace Database\Seeders;

use App\Models\Dokumen;
use App\Models\JenisDokumen;
use App\Models\LampiranDokumen;
use App\Models\RiwayatDokumen;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DokumenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $warga = User::whereHas('peran', function($q) {
            $q->where('peran', 'warga');
        })->first();

        $admin = User::whereHas('peran', function($q) {
            $q->where('peran', 'admin');
        })->first();

        if (!$warga || !$admin) {
            $this->command->error('❌ Warga or Admin user not found. Please run UserSeeder first.');
            return;
        }

        $jenisDokumenIds = JenisDokumen::pluck('id')->toArray();
        $statuses = ['menunggu_verifikasi', 'terverifikasi', 'dalam_tinjauan', 'disetujui', 'selesai', 'ditolak'];

        for ($i = 1; $i <= 15; $i++) {
            $status = $statuses[array_rand($statuses)];
            $nomor = 'ADM-' . date('Ymd') . '-' . str_pad($i, 4, '0', STR_PAD_LEFT) . '-' . strtoupper(Str::random(4));
            
            $dokumen = Dokumen::create([
                'nomor_dokumen' => $nomor,
                'user_id' => $warga->id,
                'jenis_dokumen_id' => $jenisDokumenIds[array_rand($jenisDokumenIds)],
                'status' => $status,
                'nama_pemohon' => 'Warga Contoh ' . $i,
                'nik_pemohon' => '123456789012345' . ($i % 10),
                'alamat_pemohon' => 'Nagari Gasan Gadang, RT 0' . ($i % 5 + 1) . '/RW 01',
                'telepon_pemohon' => '0812345678' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'data_form' => [
                    'keperluan' => 'Keperluan administratif dummy ke-' . $i,
                    'keterangan' => 'Ini adalah keterangan tambahan untuk permohonan dokumen.',
                    'tanggal_pengajuan' => now()->subDays(rand(1, 10))->toDateString(),
                ],
                'created_at' => now()->subDays(rand(1, 10)),
            ]);

            // Tambah Lampiran Dummy
            LampiranDokumen::create([
                'dokumen_id' => $dokumen->id,
                'nama_file' => 'syarat_' . $i . '.pdf',
                'url_file' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                'tipe_file' => 'application/pdf',
                'ukuran_file' => 204800,
                'diunggah_oleh' => $warga->id,
            ]);

            // Tambah Riwayat Awal
            RiwayatDokumen::create([
                'dokumen_id' => $dokumen->id,
                'user_id' => $warga->id,
                'status_lama' => 'draft',
                'status_baru' => 'menunggu_verifikasi',
                'catatan' => 'Permohonan diajukan oleh warga.',
            ]);

            // Tambah Riwayat tambahan jika sudah diproses
            if (in_array($status, ['terverifikasi', 'disetujui', 'selesai', 'ditolak'])) {
                RiwayatDokumen::create([
                    'dokumen_id' => $dokumen->id,
                    'user_id' => $admin->id,
                    'status_lama' => 'menunggu_verifikasi',
                    'status_baru' => $status,
                    'catatan' => 'Permohonan diproses oleh petugas admin.',
                ]);
            }
        }

        $this->command->info('✅ 15 Permohonan Dokumen seeded successfully!');
    }
}
