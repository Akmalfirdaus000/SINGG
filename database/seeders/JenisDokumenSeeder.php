<?php

namespace Database\Seeders;

use App\Models\JenisDokumen;
use Illuminate\Database\Seeder;

class JenisDokumenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jenisDokumen = [
            [
                'nama' => 'surat_pengantar_rt',
                'nama_tampilan' => 'Surat Pengantar RT',
                'deskripsi' => 'Surat pengantar dari RT untuk keperluan administrasi',
                'persyaratan' => [
                    ['nama' => 'KTP', 'wajib' => true],
                    ['nama' => 'KK', 'wajib' => true],
                    ['nama' => 'Foto 3x4', 'wajib' => true],
                ],
                'biaya' => 0,
                'hari_proses' => 3,
                'is_active' => true,
                'memerlukan_verifikasi' => true,
                'urutan' => 1,
            ],
            [
                'nama' => 'surat_pengantar_rw',
                'nama_tampilan' => 'Surat Pengantar RW',
                'deskripsi' => 'Surat pengantar dari RW untuk keperluan administrasi',
                'persyaratan' => [
                    ['nama' => 'KTP', 'wajib' => true],
                    ['nama' => 'KK', 'wajib' => true],
                    ['nama' => 'Surat Pengantar RT', 'wajib' => true],
                ],
                'biaya' => 0,
                'hari_proses' => 3,
                'is_active' => true,
                'memerlukan_verifikasi' => true,
                'urutan' => 2,
            ],
            [
                'nama' => 'surat_keterangan_domisili',
                'nama_tampilan' => 'Surat Keterangan Domisili',
                'deskripsi' => 'Surat keterangan tempat tinggal/domisili',
                'persyaratan' => [
                    ['nama' => 'KTP', 'wajib' => true],
                    ['nama' => 'KK', 'wajib' => true],
                    ['nama' => 'Foto 3x4', 'wajib' => true],
                ],
                'biaya' => 0,
                'hari_proses' => 3,
                'is_active' => true,
                'memerlukan_verifikasi' => true,
                'urutan' => 3,
            ],
            [
                'nama' => 'surat_keterangan_usaha',
                'nama_tampilan' => 'Surat Keterangan Usaha',
                'deskripsi' => 'Surat keterangan memiliki usaha',
                'persyaratan' => [
                    ['nama' => 'KTP', 'wajib' => true],
                    ['nama' => 'KK', 'wajib' => true],
                    ['nama' => 'Foto usaha', 'wajib' => false],
                ],
                'biaya' => 0,
                'hari_proses' => 5,
                'is_active' => true,
                'memerlukan_verifikasi' => true,
                'urutan' => 4,
            ],
            [
                'nama' => 'surat_pengantar_skck',
                'nama_tampilan' => 'Surat Pengantar SKCK',
                'deskripsi' => 'Surat pengantar untuk pembuatan SKCK',
                'persyaratan' => [
                    ['nama' => 'KTP', 'wajib' => true],
                    ['nama' => 'KK', 'wajib' => true],
                    ['nama' => 'Foto 4x6', 'wajib' => true],
                ],
                'biaya' => 0,
                'hari_proses' => 3,
                'is_active' => true,
                'memerlukan_verifikasi' => true,
                'urutan' => 5,
            ],
            [
                'nama' => 'surat_keterangan_tidak_mampu',
                'nama_tampilan' => 'Surat Keterangan Tidak Mampu',
                'deskripsi' => 'Surat keterangan tidak mampu untuk beasiswa atau bantuan',
                'persyaratan' => [
                    ['nama' => 'KTP', 'wajib' => true],
                    ['nama' => 'KK', 'wajib' => true],
                    ['nama' => 'Foto 3x4', 'wajib' => true],
                    ['nama' => 'Surat permohonan', 'wajib' => true],
                ],
                'biaya' => 0,
                'hari_proses' => 5,
                'is_active' => true,
                'memerlukan_verifikasi' => true,
                'urutan' => 6,
            ],
            [
                'nama' => 'surat_keterangan_belum_menikah',
                'nama_tampilan' => 'Surat Keterangan Belum Menikah',
                'deskripsi' => 'Surat keterangan belum menikah',
                'persyaratan' => [
                    ['nama' => 'KTP', 'wajib' => true],
                    ['nama' => 'KK', 'wajib' => true],
                    ['nama' => 'Foto 3x4', 'wajib' => true],
                ],
                'biaya' => 0,
                'hari_proses' => 3,
                'is_active' => true,
                'memerlukan_verifikasi' => true,
                'urutan' => 7,
            ],
            [
                'nama' => 'surat_keterangan_kematian',
                'nama_tampilan' => 'Surat Keterangan Kematian',
                'deskripsi' => 'Surat keterangan kematian warga',
                'persyaratan' => [
                    ['nama' => 'KTP ahli waris', 'wajib' => true],
                    ['nama' => 'KK almarhum', 'wajib' => true],
                    ['nama' => 'Surat keterangan rumah sakit', 'wajib' => true],
                ],
                'biaya' => 0,
                'hari_proses' => 3,
                'is_active' => true,
                'memerlukan_verifikasi' => true,
                'urutan' => 8,
            ],
            [
                'nama' => 'surat_keterangan_kelahiran',
                'nama_tampilan' => 'Surat Keterangan Kelahiran',
                'deskripsi' => 'Surat keterangan kelahiran bayi',
                'persyaratan' => [
                    ['nama' => 'KTP orang tua', 'wajib' => true],
                    ['nama' => 'KK', 'wajib' => true],
                    ['nama' => 'Surat keterangan bidan/rs', 'wajib' => true],
                ],
                'biaya' => 0,
                'hari_proses' => 3,
                'is_active' => true,
                'memerlukan_verifikasi' => true,
                'urutan' => 9,
            ],
            [
                'nama' => 'surat_pengantar_pembuatan_ktp',
                'nama_tampilan' => 'Surat Pengantar Pembuatan KTP',
                'deskripsi' => 'Surat pengantar untuk pembuatan KTP baru atau penggantian',
                'persyaratan' => [
                    ['nama' => 'KK', 'wajib' => true],
                    ['nama' => 'Foto 3x4', 'wajib' => true],
                ],
                'biaya' => 0,
                'hari_proses' => 3,
                'is_active' => true,
                'memerlukan_verifikasi' => true,
                'urutan' => 10,
            ],
            [
                'nama' => 'surat_pengantar_pembuatan_kk',
                'nama_tampilan' => 'Surat Pengantar Pembuatan KK',
                'deskripsi' => 'Surat pengantar untuk pembuatan KK baru atau penggantian',
                'persyaratan' => [
                    ['nama' => 'KTP Kepala Keluarga', 'wajib' => true],
                    ['nama' => 'Buku Nikah/Akta Cerai', 'wajib' => true],
                ],
                'biaya' => 0,
                'hari_proses' => 3,
                'is_active' => true,
                'memerlukan_verifikasi' => true,
                'urutan' => 11,
            ],
            [
                'nama' => 'lainnya',
                'nama_tampilan' => 'Lainnya',
                'deskripsi' => 'Jenis surat lainnya',
                'persyaratan' => [],
                'biaya' => 0,
                'hari_proses' => 7,
                'is_active' => true,
                'memerlukan_verifikasi' => true,
                'urutan' => 99,
            ],
        ];

        foreach ($jenisDokumen as $dokumen) {
            JenisDokumen::create($dokumen);
        }

        $this->command->info('✅ Jenis Dokumen seeded successfully!');
    }
}
