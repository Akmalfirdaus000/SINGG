<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE dokumen MODIFY COLUMN status ENUM('draft', 'menunggu_verifikasi', 'terverifikasi', 'dalam_tinjauan', 'menunggu_ttd_wali_nagari', 'disetujui', 'ditolak', 'selesai', 'kedaluwarsa') NOT NULL DEFAULT 'menunggu_verifikasi'");
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE riwayat_dokumen MODIFY COLUMN status_lama ENUM('draft', 'menunggu_verifikasi', 'terverifikasi', 'dalam_tinjauan', 'menunggu_ttd_wali_nagari', 'disetujui', 'ditolak', 'selesai', 'kedaluwarsa') NULL");
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE riwayat_dokumen MODIFY COLUMN status_baru ENUM('draft', 'menunggu_verifikasi', 'terverifikasi', 'dalam_tinjauan', 'menunggu_ttd_wali_nagari', 'disetujui', 'ditolak', 'selesai', 'kedaluwarsa') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE dokumen MODIFY COLUMN status ENUM('draft', 'menunggu_verifikasi', 'terverifikasi', 'dalam_tinjauan', 'disetujui', 'ditolak', 'selesai', 'kedaluwarsa') NOT NULL DEFAULT 'menunggu_verifikasi'");
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE riwayat_dokumen MODIFY COLUMN status_lama ENUM('draft', 'menunggu_verifikasi', 'terverifikasi', 'dalam_tinjauan', 'disetujui', 'ditolak', 'selesai', 'kedaluwarsa') NULL");
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE riwayat_dokumen MODIFY COLUMN status_baru ENUM('draft', 'menunggu_verifikasi', 'terverifikasi', 'dalam_tinjauan', 'disetujui', 'ditolak', 'selesai', 'kedaluwarsa') NOT NULL");
    }
};
