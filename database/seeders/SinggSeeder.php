<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SinggSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks temporarily
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // ============================================================
        // 1. CREATE SUPERADMIN USER
        // ============================================================

        $superadminId = (string) Str::uuid();

        DB::table('users')->insert([
            'id' => $superadminId,
            'email' => 'admin@negeri.id',
            'password_hash' => Hash::make('Admin123!'),
            'auth_method' => 'password',
            'email_verified_at' => now(),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('user_profiles')->insert([
            'id' => (string) Str::uuid(),
            'user_id' => $superadminId,
            'full_name' => 'Super Administrator',
            'address' => 'Kantor Negeri',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('user_roles')->insert([
            'id' => (string) Str::uuid(),
            'user_id' => $superadminId,
            'role' => 'superadmin',
            'assigned_at' => now(),
            'is_active' => true,
        ]);

        $this->command->info('✅ Superadmin user created (admin@negeri.id / Admin123!)');

        // ============================================================
        // 2. TICKET CATEGORIES
        // ============================================================

        $categories = [
            [
                'id' => (string) Str::uuid(),
                'name' => 'infrastruktur',
                'display_name' => 'Infrastruktur',
                'description' => 'Masalah jalan, jembatan, drainase, dll',
                'icon' => '🚧',
                'color' => '#FF6B6B',
                'sla_hours' => 72,
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'kebersihan',
                'display_name' => 'Kebersihan',
                'description' => 'Masalah sampah, kebersihan lingkungan',
                'icon' => '🗑️',
                'color' => '#4ECDC4',
                'sla_hours' => 48,
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'keamanan',
                'display_name' => 'Keamanan',
                'description' => 'Masalah keamanan, ketertiban',
                'icon' => '👮',
                'color' => '#95E1D3',
                'sla_hours' => 24,
                'is_active' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'kesehatan',
                'display_name' => 'Kesehatan',
                'description' => 'Masalah kesehatan, puskesmas, dll',
                'icon' => '🏥',
                'color' => '#F38181',
                'sla_hours' => 48,
                'is_active' => true,
                'sort_order' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'pendidikan',
                'display_name' => 'Pendidikan',
                'description' => 'Masalah sekolah, pendidikan',
                'icon' => '📚',
                'color' => '#AA96DA',
                'sla_hours' => 120,
                'is_active' => true,
                'sort_order' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'pelayanan_publik',
                'display_name' => 'Pelayanan Publik',
                'description' => 'Pelayanan publik lainnya',
                'icon' => '🏛️',
                'color' => '#FCBAD3',
                'sla_hours' => 72,
                'is_active' => true,
                'sort_order' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'administrasi',
                'display_name' => 'Administrasi',
                'description' => 'Masalah administratif',
                'icon' => '📄',
                'color' => '#FFFFD2',
                'sla_hours' => 168,
                'is_active' => true,
                'sort_order' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'lainnya',
                'display_name' => 'Lainnya',
                'description' => 'Kategori lainnya',
                'icon' => '📦',
                'color' => '#A8E6CF',
                'sla_hours' => 168,
                'is_active' => true,
                'sort_order' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('ticket_categories')->insert($categories);
        $this->command->info('✅ Ticket categories seeded');

        // ============================================================
        // 3. DOCUMENT TYPES
        // ============================================================

        $documentTypes = [
            [
                'id' => (string) Str::uuid(),
                'name' => 'surat_pengantar_rt',
                'display_name' => 'Surat Pengantar RT',
                'description' => 'Surat pengantar dari Ketua RT',
                'requirements' => json_encode(['Foto KTP', 'Foto KK', 'Pas Foto']),
                'fee' => 0,
                'processing_days' => 1,
                'is_active' => true,
                'requires_verification' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'surat_pengantar_rw',
                'display_name' => 'Surat Pengantar RW',
                'description' => 'Surat pengantar dari Ketua RW',
                'requirements' => json_encode(['Foto KTP', 'Foto KK', 'Surat Pengantar RT']),
                'fee' => 0,
                'processing_days' => 2,
                'is_active' => true,
                'requires_verification' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'surat_keterangan_domisili',
                'display_name' => 'Surat Keterangan Domisili',
                'description' => 'Surat keterangan tempat tinggal',
                'requirements' => json_encode(['Foto KTP', 'Foto KK', 'Surat Pengantar RT/RW']),
                'fee' => 0,
                'processing_days' => 3,
                'is_active' => true,
                'requires_verification' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'surat_keterangan_usaha',
                'display_name' => 'Surat Keterangan Usaha',
                'description' => 'Surat keterangan usaha/niaga',
                'requirements' => json_encode(['Foto KTP', 'Foto KK', 'Bukti usaha']),
                'fee' => 0,
                'processing_days' => 3,
                'is_active' => true,
                'requires_verification' => true,
                'sort_order' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'surat_pengantar_skck',
                'display_name' => 'Surat Pengantar SKCK',
                'description' => 'Surat pengantar pembuatan SKCK',
                'requirements' => json_encode(['Foto KTP', 'Foto KK', 'Surat Pengantar RT/RW']),
                'fee' => 0,
                'processing_days' => 1,
                'is_active' => true,
                'requires_verification' => true,
                'sort_order' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'surat_keterangan_tidak_mampu',
                'display_name' => 'Surat Keterangan Tidak Mampu',
                'description' => 'Surat keterangan tidak mampu (SKTM)',
                'requirements' => json_encode(['Foto KTP', 'Foto KK', 'Surat Pengantar RT/RW', 'Penghasilan orang tua']),
                'fee' => 0,
                'processing_days' => 5,
                'is_active' => true,
                'requires_verification' => true,
                'sort_order' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'surat_keterangan_belum_menikah',
                'display_name' => 'Surat Keterangan Belum Menikah',
                'description' => 'Surat keterangan belum menikah',
                'requirements' => json_encode(['Foto KTP', 'Foto KK', 'Surat Pengantar RT/RW']),
                'fee' => 0,
                'processing_days' => 2,
                'is_active' => true,
                'requires_verification' => true,
                'sort_order' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'surat_keterangan_kematian',
                'display_name' => 'Surat Keterangan Kematian',
                'description' => 'Surat keterangan kematian',
                'requirements' => json_encode(['Foto KTP pelapor', 'Surat keterangan RS', 'Surat Pengantar RT/RW']),
                'fee' => 0,
                'processing_days' => 2,
                'is_active' => true,
                'requires_verification' => true,
                'sort_order' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'surat_keterangan_kelahiran',
                'display_name' => 'Surat Keterangan Kelahiran',
                'description' => 'Surat keterangan kelahiran',
                'requirements' => json_encode(['Foto KTP ortu', 'Surat bidan/rs', 'Surat Pengantar RT/RW', 'KK']),
                'fee' => 0,
                'processing_days' => 2,
                'is_active' => true,
                'requires_verification' => true,
                'sort_order' => 9,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'surat_pengantar_pembuatan_ktp',
                'display_name' => 'Surat Pengantar Pembuatan KTP',
                'description' => 'Surat pengantar pembuatan KTP baru',
                'requirements' => json_encode(['Foto KK', 'Surat Pengantar RT/RW']),
                'fee' => 0,
                'processing_days' => 1,
                'is_active' => true,
                'requires_verification' => true,
                'sort_order' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'surat_pengantar_pembuatan_kk',
                'display_name' => 'Surat Pengantar Pembuatan KK',
                'description' => 'Surat pengantar pembuatan KK',
                'requirements' => json_encode(['Foto KTP', 'Surat Pengantar RT/RW']),
                'fee' => 0,
                'processing_days' => 1,
                'is_active' => true,
                'requires_verification' => true,
                'sort_order' => 11,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('document_types')->insert($documentTypes);
        $this->command->info('✅ Document types seeded');

        // ============================================================
        // 4. POINT RULES
        // ============================================================

        $pointRules = [
            [
                'id' => (string) Str::uuid(),
                'name' => 'create_ticket',
                'display_name' => 'Buat Pengaduan',
                'description' => 'Poin untuk membuat pengaduan baru',
                'action' => 'create_ticket',
                'points' => 10,
                'max_per_day' => 50,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'upload_photo',
                'display_name' => 'Upload Foto',
                'description' => 'Poin untuk mengupload foto bukti',
                'action' => 'upload_photo',
                'points' => 5,
                'max_per_day' => 25,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'rate_ticket',
                'display_name' => 'Beri Rating',
                'description' => 'Poin untuk memberi rating',
                'action' => 'rate_ticket',
                'points' => 5,
                'max_per_day' => 20,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'helpful_comment',
                'display_name' => 'Komentar Berguna',
                'description' => 'Poin untuk komentar yang dianggap berguna',
                'action' => 'helpful_comment',
                'points' => 10,
                'max_per_day' => 50,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'forum_post',
                'display_name' => 'Posting Forum',
                'description' => 'Poin untuk membuat postingan forum',
                'action' => 'forum_post',
                'points' => 5,
                'max_per_day' => 20,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'login_daily',
                'display_name' => 'Login Harian',
                'description' => 'Poin untuk login setiap hari',
                'action' => 'login_daily',
                'points' => 1,
                'max_per_day' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'complete_profile',
                'display_name' => 'Lengkapi Profil',
                'description' => 'Poin untuk melengkapi profil',
                'action' => 'complete_profile',
                'points' => 50,
                'max_per_day' => 50,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'referral',
                'display_name' => 'Referal Teman',
                'description' => 'Poin untuk mengajak teman',
                'action' => 'referral',
                'points' => 100,
                'max_per_day' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('point_rules')->insert($pointRules);
        $this->command->info('✅ Point rules seeded');

        // ============================================================
        // 5. BADGES
        // ============================================================

        $badges = [
            [
                'id' => (string) Str::uuid(),
                'name' => 'first_complaint',
                'display_name' => 'Pengaduan Pertama',
                'description' => 'Membuat pengaduan pertama',
                'badge_type' => 'first_complaint',
                'requirement' => json_encode(['min_tickets' => 1]),
                'points_reward' => 10,
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'active_citizen',
                'display_name' => 'Warga Aktif',
                'description' => 'Membuat 10 pengaduan valid',
                'badge_type' => 'active_citizen',
                'requirement' => json_encode(['min_tickets' => 10]),
                'points_reward' => 100,
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'photographer',
                'display_name' => 'Fotografer',
                'description' => 'Mengupload 20 foto',
                'badge_type' => 'photographer',
                'requirement' => json_encode(['min_uploads' => 20]),
                'points_reward' => 50,
                'is_active' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'contributor',
                'display_name' => 'Kontributor',
                'description' => '50 komentar di forum',
                'badge_type' => 'contributor',
                'requirement' => json_encode(['min_comments' => 50]),
                'points_reward' => 75,
                'is_active' => true,
                'sort_order' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'verified_user',
                'display_name' => 'User Terverifikasi',
                'description' => 'Profil sudah terverifikasi',
                'badge_type' => 'verified_user',
                'requirement' => json_encode(['is_verified' => true]),
                'points_reward' => 25,
                'is_active' => true,
                'sort_order' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'top_reviewer',
                'display_name' => 'Top Reviewer',
                'description' => 'Memberi 20 rating',
                'badge_type' => 'top_reviewer',
                'requirement' => json_encode(['min_ratings' => 20]),
                'points_reward' => 60,
                'is_active' => true,
                'sort_order' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'early_adopter',
                'display_name' => 'Early Adopter',
                'description' => 'Gabung dalam 30 hari pertama',
                'badge_type' => 'early_adopter',
                'requirement' => json_encode(['joined_within_days' => 30]),
                'points_reward' => 15,
                'is_active' => true,
                'sort_order' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('badges')->insert($badges);
        $this->command->info('✅ Badges seeded');

        // ============================================================
        // 6. FORUM CATEGORIES
        // ============================================================

        $forumCategories = [
            [
                'id' => (string) Str::uuid(),
                'name' => 'pengumuman',
                'description' => 'Pengumuman resmi dari negeri',
                'icon' => '📢',
                'color' => '#FF6B6B',
                'sort_order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'diskusi',
                'description' => 'Diskusi umum antar warga',
                'icon' => '💬',
                'color' => '#4ECDC4',
                'sort_order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'ide_saran',
                'description' => 'Ide dan saran untuk negeri',
                'icon' => '💡',
                'color' => '#95E1D3',
                'sort_order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'tanya_jawab',
                'description' => 'Tanya jawab seputar negeri',
                'icon' => '❓',
                'color' => '#F38181',
                'sort_order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'jual_beli',
                'description' => 'Jual beli barang antar warga',
                'icon' => '🛒',
                'color' => '#AA96DA',
                'sort_order' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('forum_categories')->insert($forumCategories);
        $this->command->info('✅ Forum categories seeded');

        // ============================================================
        // 7. SYSTEM SETTINGS
        // ============================================================

        $systemSettings = [
            [
                'id' => (string) Str::uuid(),
                'setting_key' => 'system_name',
                'setting_value' => 'Sistem Pelayanan Publik Negeri',
                'value_type' => 'string',
                'description' => 'Nama sistem',
                'is_public' => true,
                'is_encrypted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'setting_key' => 'maintenance_mode',
                'setting_value' => 'false',
                'value_type' => 'boolean',
                'description' => 'Mode maintenance',
                'is_public' => false,
                'is_encrypted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'setting_key' => 'max_upload_size',
                'setting_value' => '10485760',
                'value_type' => 'number',
                'description' => 'Maksimal upload file dalam bytes',
                'is_public' => false,
                'is_encrypted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'setting_key' => 'allowed_file_types',
                'setting_value' => json_encode(['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']),
                'value_type' => 'json',
                'description' => 'Tipe file yang diizinkan',
                'is_public' => false,
                'is_encrypted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'setting_key' => 'default_sla_hours',
                'setting_value' => '168',
                'value_type' => 'number',
                'description' => 'SLA default dalam jam',
                'is_public' => false,
                'is_encrypted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'setting_key' => 'registration_enabled',
                'setting_value' => 'true',
                'value_type' => 'boolean',
                'description' => 'Apakah pendaftaran user baru diizinkan',
                'is_public' => true,
                'is_encrypted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('system_settings')->insert($systemSettings);
        $this->command->info('✅ System settings seeded');

        // ============================================================
        // 8. FEATURE FLAGS
        // ============================================================

        $featureFlags = [
            [
                'id' => (string) Str::uuid(),
                'name' => 'forum',
                'description' => 'Fitur Forum Diskusi',
                'is_enabled' => true,
                'enabled_for_roles' => json_encode(['warga', 'admin', 'superadmin']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'events',
                'description' => 'Fitur Event & Kegiatan',
                'is_enabled' => true,
                'enabled_for_roles' => json_encode(['warga', 'admin', 'superadmin']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'gamification',
                'description' => 'Fitur Gamifikasi (Poin & Badge)',
                'is_enabled' => true,
                'enabled_for_roles' => json_encode(['warga', 'admin', 'superadmin']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'dark_mode',
                'description' => 'Tema Dark Mode',
                'is_enabled' => true,
                'enabled_for_roles' => json_encode(['warga', 'admin', 'superadmin']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'mobile_app',
                'description' => 'Akses via Mobile App',
                'is_enabled' => false,
                'enabled_for_roles' => json_encode(['warga', 'admin', 'superadmin']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('feature_flags')->insert($featureFlags);
        $this->command->info('✅ Feature flags seeded');

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $this->command->info('🎉 Database seeding completed successfully!');
        $this->command->newLine();
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('📝 LOGIN CREDENTIALS:');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('Email: admin@negeri.id');
        $this->command->info('Password: Admin123!');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}
