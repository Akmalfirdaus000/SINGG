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
        // ============================================================
        // 1. AUTENTIKASI & MANAJEMEN PENGGUNA
        // ============================================================

        // Tabel Users (dimodifikasi untuk sistem SINGG)
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique()->nullable();
            $table->string('nik', 16)->unique()->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('password_hash')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip', 45)->nullable();
            $table->integer('failed_login_attempts')->default(0);
            $table->timestamp('locked_until')->nullable();
            $table->boolean('must_change_password')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index('email');
            $table->index('nik');
            $table->index('phone');
            $table->index('is_active');
            $table->index('deleted_at');
        });

        // Profil Pengguna
        Schema::create('profil_pengguna', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->unique();
            $table->string('nama_lengkap');
            $table->string('tempat_lahir', 100)->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('jenis_kelamin', 10)->nullable();
            $table->string('pekerjaan', 100)->nullable();
            $table->string('url_foto_profil', 500)->nullable();
            $table->text('bio')->nullable();
            $table->string('url_kartu_identitas', 500)->nullable();
            $table->text('alamat')->nullable();
            $table->string('provinsi', 100)->nullable();
            $table->string('kota', 100)->nullable();
            $table->string('kecamatan', 100)->nullable();
            $table->string('desa', 100)->nullable();
            $table->string('kode_pos', 10)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('user_id');
            $table->index('nama_lengkap');
            $table->index(['kota', 'kecamatan']);
        });

        // Peran Pengguna (many-to-many)
        Schema::create('peran_pengguna', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->enum('peran', ['admin', 'warga']);
            $table->uuid('assigned_by')->nullable();
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('catatan')->nullable();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('assigned_by')->references('id')->on('users')->onDelete('set null');
            $table->unique(['user_id', 'peran']);
            $table->index('user_id');
            $table->index('peran');
            $table->index('is_active');
        });





        // ============================================================
        // 2. PENGADUAN
        // ============================================================

        // Kategori Pengaduan (master)
        Schema::create('kategori_pengaduan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('nama', ['infrastruktur', 'kebersihan', 'keamanan', 'kesehatan', 'pendidikan', 'pelayanan_publik', 'administrasi', 'lainnya'])->unique();
            $table->string('nama_tampilan');
            $table->text('deskripsi')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Pengaduan
        Schema::create('pengaduan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nomor_pengaduan', 50)->unique();
            $table->uuid('user_id');
            $table->uuid('kategori_id');
            $table->string('judul');
            $table->text('deskripsi');
            $table->enum('status', ['draft', 'menunggu_verifikasi', 'terverifikasi', 'dalam_proses', 'selesai', 'ditutup', 'ditolak'])->default('menunggu_verifikasi');
            $table->enum('prioritas', ['rendah', 'sedang', 'tinggi', 'urgent'])->default('sedang');
            $table->text('alamat_lokasi')->nullable();
            $table->string('kecamatan_lokasi', 100)->nullable();
            $table->string('desa_lokasi', 100)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->uuid('assigned_to')->nullable();
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('batas_waktu')->nullable();
            $table->boolean('pelanggaran_sla')->default(false);
            $table->boolean('pelanggaran_sla_diberitahu')->default(false);
            $table->text('catatan_penyelesaian')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->uuid('resolved_by')->nullable();
            $table->integer('jumlah_dilihat')->default(0);
            $table->boolean('is_anonim')->default(false);
            $table->boolean('is_publik')->default(true);
            $table->json('komentar')->nullable();
            $table->integer('rating')->nullable()->comment('1-5');
            $table->text('ulasan')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('kategori_id')->references('id')->on('kategori_pengaduan');
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');
            $table->foreign('resolved_by')->references('id')->on('users')->onDelete('set null');
            $table->index('user_id');
            $table->index('nomor_pengaduan');
            $table->index('status');
            $table->index('kategori_id');
            $table->index('assigned_to');
            $table->index('created_at');
            $table->index('batas_waktu');
            $table->index(['latitude', 'longitude']);
        });

        // Lampiran Pengaduan
        Schema::create('lampiran_pengaduan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('pengaduan_id');
            $table->string('nama_file');
            $table->string('url_file', 500);
            $table->string('tipe_file');
            $table->bigInteger('ukuran_file');
            $table->uuid('diunggah_oleh');
            $table->boolean('is_utama')->default(false);
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('pengaduan_id')->references('id')->on('pengaduan')->onDelete('cascade');
            $table->foreign('diunggah_oleh')->references('id')->on('users')->onDelete('cascade');
            $table->index('pengaduan_id');
            $table->index('diunggah_oleh');
        });



        // Riwayat Pengaduan
        Schema::create('riwayat_pengaduan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('pengaduan_id');
            $table->uuid('user_id')->nullable();
            $table->enum('status_lama', ['draft', 'menunggu_verifikasi', 'terverifikasi', 'dalam_proses', 'selesai', 'ditutup', 'ditolak'])->nullable();
            $table->enum('status_baru', ['draft', 'menunggu_verifikasi', 'terverifikasi', 'dalam_proses', 'selesai', 'ditutup', 'ditolak']);
            $table->text('catatan')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('pengaduan_id')->references('id')->on('pengaduan')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->index('pengaduan_id');
            $table->index('created_at');
        });

        // ============================================================
        // 3. LAYANAN ADMINISTRASI
        // ============================================================

        // Jenis Dokumen (master)
        Schema::create('jenis_dokumen', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('nama', ['surat_pengantar_rt', 'surat_pengantar_rw', 'surat_keterangan_domisili', 'surat_keterangan_usaha', 'surat_pengantar_skck', 'surat_keterangan_tidak_mampu', 'surat_keterangan_belum_menikah', 'surat_keterangan_kematian', 'surat_keterangan_kelahiran', 'surat_pengantar_pembuatan_ktp', 'surat_pengantar_pembuatan_kk', 'lainnya'])->unique();
            $table->string('nama_tampilan');
            $table->text('deskripsi')->nullable();
            $table->json('persyaratan')->nullable();
            $table->decimal('biaya', 12, 2)->default(0);
            $table->integer('hari_proses')->default(7);
            $table->boolean('is_active')->default(true);
            $table->boolean('memerlukan_verifikasi')->default(true);
            $table->integer('urutan')->default(0);
            $table->timestamps();
        });

        // Template Dokumen
        Schema::create('template_dokumen', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('jenis_dokumen_id');
            $table->string('nama');
            $table->text('isi_template');
            $table->json('variabel')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('versi')->default(1);
            $table->timestamps();

            $table->foreign('jenis_dokumen_id')->references('id')->on('jenis_dokumen')->onDelete('cascade');
        });

        // Dokumen/Permohonan
        Schema::create('dokumen', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nomor_dokumen', 50)->unique();
            $table->uuid('user_id');
            $table->uuid('jenis_dokumen_id');
            $table->enum('status', ['draft', 'menunggu_verifikasi', 'terverifikasi', 'dalam_tinjauan', 'disetujui', 'ditolak', 'selesai', 'kedaluwarsa'])->default('menunggu_verifikasi');
            $table->string('nama_pemohon');
            $table->string('nik_pemohon', 16);
            $table->text('alamat_pemohon');
            $table->string('telepon_pemohon', 20)->nullable();
            $table->json('data_form')->nullable();
            $table->uuid('assigned_to')->nullable();
            $table->timestamp('assigned_at')->nullable();
            $table->uuid('verified_by')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->text('catatan_verifikasi')->nullable();
            $table->uuid('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->text('catatan_persetujuan')->nullable();
            $table->uuid('rejected_by')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->text('alasan_penolakan')->nullable();
            $table->string('url_dokumen_dihasilkan', 500)->nullable();
            $table->timestamp('generated_at')->nullable();
            $table->integer('hari_proses')->nullable();
            $table->timestamp('perkiraan_tanggal_selesai')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->boolean('is_dibayar')->default(false);
            $table->decimal('jumlah_pembayaran', 12, 2)->nullable();
            $table->string('status_pembayaran', 50)->nullable();
            $table->timestamp('tanggal_pembayaran')->nullable();
            $table->boolean('is_dipercepat')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('jenis_dokumen_id')->references('id')->on('jenis_dokumen');
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');
            $table->foreign('verified_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('rejected_by')->references('id')->on('users')->onDelete('set null');
            $table->index('user_id');
            $table->index('nomor_dokumen');
            $table->index('status');
            $table->index('jenis_dokumen_id');
            $table->index('assigned_to');
            $table->index('created_at');
        });

        // Lampiran Dokumen
        Schema::create('lampiran_dokumen', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('dokumen_id');
            $table->string('nama_file');
            $table->string('url_file', 500);
            $table->string('tipe_file');
            $table->bigInteger('ukuran_file');
            $table->string('nama_persyaratan', 255)->nullable();
            $table->uuid('diunggah_oleh');
            $table->boolean('is_terverifikasi')->default(false);
            $table->text('catatan_verifikasi')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('dokumen_id')->references('id')->on('dokumen')->onDelete('cascade');
            $table->foreign('diunggah_oleh')->references('id')->on('users')->onDelete('cascade');
            $table->index('dokumen_id');
            $table->index('diunggah_oleh');
        });

        // Persetujuan Dokumen (workflow)
        Schema::create('persetujuan_dokumen', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('dokumen_id');
            $table->uuid('approver_id');
            $table->integer('tingkat_persetujuan');
            $table->string('status', 50);
            $table->text('catatan')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('dokumen_id')->references('id')->on('dokumen')->onDelete('cascade');
            $table->foreign('approver_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['dokumen_id', 'tingkat_persetujuan']);
            $table->index('dokumen_id');
            $table->index('approver_id');
        });

        // Riwayat Dokumen
        Schema::create('riwayat_dokumen', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('dokumen_id');
            $table->uuid('user_id')->nullable();
            $table->enum('status_lama', ['draft', 'menunggu_verifikasi', 'terverifikasi', 'dalam_tinjauan', 'disetujui', 'ditolak', 'selesai', 'kedaluwarsa'])->nullable();
            $table->enum('status_baru', ['draft', 'menunggu_verifikasi', 'terverifikasi', 'dalam_tinjauan', 'disetujui', 'ditolak', 'selesai', 'kedaluwarsa']);
            $table->text('catatan')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('dokumen_id')->references('id')->on('dokumen')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->index('dokumen_id');
            $table->index('created_at');
        });

        // ============================================================
        // 4. NOTIFIKASI
        // ============================================================

        // Notifikasi
        Schema::create('notifikasi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->enum('tipe', ['email', 'whatsapp', 'sms', 'push', 'in_app']);
            $table->json('saluran');
            $table->string('subject', 500)->nullable();
            $table->text('isi');
            $table->json('data')->nullable();
            $table->enum('status_email', ['pending', 'sent', 'delivered', 'read', 'failed'])->default('pending');
            $table->timestamp('email_sent_at')->nullable();
            $table->enum('status_whatsapp', ['pending', 'sent', 'delivered', 'read', 'failed'])->default('pending');
            $table->timestamp('whatsapp_sent_at')->nullable();
            $table->enum('status_sms', ['pending', 'sent', 'delivered', 'read', 'failed'])->default('pending');
            $table->timestamp('sms_sent_at')->nullable();
            $table->enum('status_push', ['pending', 'sent', 'delivered', 'read', 'failed'])->default('pending');
            $table->timestamp('push_sent_at')->nullable();
            $table->boolean('is_dibaca')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->integer('prioritas')->default(0);
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('sent_at')->nullable();
            $table->integer('retry_count')->default(0);
            $table->timestamp('last_retry_at')->nullable();
            $table->text('pesan_error')->nullable();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('user_id');
            $table->index('is_dibaca');
            $table->index('created_at');
            $table->index('scheduled_at');
        });

        // ============================================================
        // 5. PENGUMUMAN
        // ============================================================

        // Pengumuman
        Schema::create('pengumuman', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('dibuat_oleh');
            $table->string('judul');
            $table->text('isi');
            $table->string('tipe', 50)->default('umum');
            $table->enum('target_peran', ['superadmin', 'admin', 'warga'])->nullable();
            $table->boolean('is_penting')->default(false);
            $table->boolean('is_semat')->default(false);
            $table->timestamp('published_at')->useCurrent();
            $table->timestamp('kadaluarsa_at')->nullable();
            $table->integer('jumlah_dilihat')->default(0);
            $table->integer('jumlah_dibaca')->default(0);
            $table->string('url_lampiran', 500)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('dibuat_oleh')->references('id')->on('users')->onDelete('cascade');
            $table->index('dibuat_oleh');
            $table->index('published_at');
            $table->index('is_semat');
        });

        // Pengumuman Dibaca (tracking)
        Schema::create('pengumuman_dibaca', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('pengumuman_id');
            $table->uuid('user_id');
            $table->timestamp('dibaca_at')->useCurrent();

            $table->foreign('pengumuman_id')->references('id')->on('pengumuman')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['pengumuman_id', 'user_id']);
        });

        // ============================================================
        // 6. PESAN
        // ============================================================

        // Percakapan
        Schema::create('percakapan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id_1');
            $table->uuid('user_id_2');
            $table->enum('status', ['active', 'archived', 'blocked'])->default('active');
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id_1')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('user_id_2')->references('id')->on('users')->onDelete('cascade');
            $table->index('user_id_1');
            $table->index('user_id_2');
            $table->index('status');
        });

        // Pesan
        Schema::create('pesan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('percakapan_id');
            $table->uuid('pengirim_id');
            $table->uuid('penerima_id');
            $table->text('isi');
            $table->enum('status_pesan', ['terkirim', 'diterima', 'dibaca', 'dihapus'])->default('terkirim');
            $table->string('url_lampiran', 500)->nullable();
            $table->string('tipe_lampiran', 50)->nullable();
            $table->uuid('balas_ke_id')->nullable();
            $table->boolean('is_dibaca')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('percakapan_id')->references('id')->on('percakapan')->onDelete('cascade');
            $table->foreign('pengirim_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('penerima_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('balas_ke_id')->references('id')->on('pesan')->onDelete('set null');
            $table->index('percakapan_id');
            $table->index('pengirim_id');
            $table->index('penerima_id');
            $table->index('is_dibaca');
            $table->index('created_at');
        });

        // ============================================================
        // 7. LARAVEL DEFAULT TABLES
        // ============================================================

        // Sessions table
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->uuid('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        // Password reset tokens
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop in reverse order to avoid foreign key constraints
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');

        Schema::dropIfExists('pesan');
        Schema::dropIfExists('percakapan');

        Schema::dropIfExists('pengumuman_dibaca');
        Schema::dropIfExists('pengumuman');

        Schema::dropIfExists('notifikasi');

        Schema::dropIfExists('riwayat_dokumen');
        Schema::dropIfExists('persetujuan_dokumen');
        Schema::dropIfExists('lampiran_dokumen');
        Schema::dropIfExists('dokumen');
        Schema::dropIfExists('template_dokumen');
        Schema::dropIfExists('jenis_dokumen');

        Schema::dropIfExists('riwayat_pengaduan');
        Schema::dropIfExists('lampiran_pengaduan');
        Schema::dropIfExists('pengaduan');
        Schema::dropIfExists('kategori_pengaduan');

        Schema::dropIfExists('peran_pengguna');
        Schema::dropIfExists('profil_pengguna');
        Schema::dropIfExists('users');
    }
};
