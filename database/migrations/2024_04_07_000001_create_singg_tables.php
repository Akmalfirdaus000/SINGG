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
        // Drop default Laravel tables if exists
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');

        // ============================================================
        // 1. AUTHENTICATION & USER MANAGEMENT
        // ============================================================

        // Users table (modified for SINGG system)
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique()->nullable();
            $table->string('nik', 16)->unique()->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('password_hash')->nullable();
            $table->enum('auth_method', ['password', 'otp_whatsapp', 'otp_email', 'magic_link', 'google', 'facebook'])->default('password');
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

        // User profiles
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->unique();
            $table->string('full_name');
            $table->string('place_of_birth', 100)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender', 10)->nullable();
            $table->string('occupation', 100)->nullable();
            $table->string('profile_photo_url', 500)->nullable();
            $table->text('bio')->nullable();
            $table->string('identity_card_url', 500)->nullable();
            $table->text('address')->nullable();
            $table->string('province', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('district', 100)->nullable();
            $table->string('village', 100)->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('user_id');
            $table->index('full_name');
            $table->index(['city', 'district']);
        });

        // User roles (many-to-many)
        Schema::create('user_roles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->enum('role', ['admin', 'warga']);
            $table->uuid('assigned_by')->nullable();
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('assigned_by')->references('id')->on('users')->onDelete('set null');
            $table->unique(['user_id', 'role']);
            $table->index('user_id');
            $table->index('role');
            $table->index('is_active');
        });

        // User preferences
      





        // ============================================================
        // 2. TICKETS / PENGADUAN
        // ============================================================

        // Ticket categories (master)
        Schema::create('ticket_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('name', ['infrastruktur', 'kebersihan', 'keamanan', 'kesehatan', 'pendidikan', 'pelayanan_publik', 'administrasi', 'lainnya'])->unique();
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Tickets
        Schema::create('tickets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('ticket_number', 50)->unique();
            $table->uuid('user_id');
            $table->uuid('category_id');
            $table->string('title');
            $table->text('description');
            $table->enum('status', ['draft', 'pending_verification', 'verified', 'in_progress', 'resolved', 'closed', 'rejected'])->default('pending_verification');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->text('location_address')->nullable();
            $table->string('location_district', 100)->nullable();
            $table->string('location_village', 100)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->uuid('assigned_to')->nullable();
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('sla_deadline')->nullable();
            $table->boolean('sla_breach')->default(false);
            $table->boolean('sla_breach_notified')->default(false);
            $table->text('resolution_notes')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->uuid('resolved_by')->nullable();
            $table->integer('view_count')->default(0);
            $table->integer('support_count')->default(0);
            $table->boolean('is_anonymous')->default(false);
            $table->boolean('is_public')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('ticket_categories');
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');
            $table->foreign('resolved_by')->references('id')->on('users')->onDelete('set null');
            $table->index('user_id');
            $table->index('ticket_number');
            $table->index('status');
            $table->index('category_id');
            $table->index('assigned_to');
            $table->index('created_at');
            $table->index('sla_deadline');
            $table->index(['latitude', 'longitude']);
            $table->fullText(['title', 'description']);
        });

        // Ticket attachments
        Schema::create('ticket_attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('ticket_id');
            $table->string('file_name');
            $table->string('file_url', 500);
            $table->string('file_type');
            $table->bigInteger('file_size');
            $table->uuid('uploaded_by');
            $table->boolean('is_primary')->default(false);
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('ticket_id')->references('id')->on('tickets')->onDelete('cascade');
            $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('cascade');
            $table->index('ticket_id');
            $table->index('uploaded_by');
        });

      

        // ============================================================
        // 3. DOCUMENTS / LAYANAN ADMINISTRASI
        // ============================================================

        // Document types (master)
        Schema::create('document_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('name', ['surat_pengantar_rt', 'surat_pengantar_rw', 'surat_keterangan_domisili', 'surat_keterangan_usaha', 'surat_pengantar_skck', 'surat_keterangan_tidak_mampu', 'surat_keterangan_belum_menikah', 'surat_keterangan_kematian', 'surat_keterangan_kelahiran', 'surat_pengantar_pembuatan_ktp', 'surat_pengantar_pembuatan_kk', 'lainnya'])->unique();
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->json('requirements')->nullable();
            $table->decimal('fee', 12, 2)->default(0);
            $table->integer('processing_days')->default(7);
            $table->boolean('is_active')->default(true);
            $table->boolean('requires_verification')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Document templates
        Schema::create('document_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('document_type_id');
            $table->string('name');
            $table->text('template_content');
            $table->json('variables')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('version')->default(1);
            $table->timestamps();

            $table->foreign('document_type_id')->references('id')->on('document_types');
        });

        // Documents
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('document_number', 50)->unique();
            $table->uuid('user_id');
            $table->uuid('document_type_id');
            $table->enum('status', ['draft', 'pending_verification', 'verified', 'in_review', 'approved', 'rejected', 'completed', 'expired'])->default('pending_verification');
            $table->string('applicant_name');
            $table->string('applicant_nik', 16);
            $table->text('applicant_address');
            $table->string('applicant_phone', 20)->nullable();
            $table->json('form_data')->nullable();
            $table->uuid('assigned_to')->nullable();
            $table->timestamp('assigned_at')->nullable();
            $table->uuid('verified_by')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->text('verification_notes')->nullable();
            $table->uuid('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->text('approval_notes')->nullable();
            $table->uuid('rejected_by')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->string('generated_document_url', 500)->nullable();
            $table->timestamp('generated_at')->nullable();
            $table->integer('processing_days')->nullable();
            $table->timestamp('estimated_completion_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->boolean('is_paid')->default(false);
            $table->decimal('payment_amount', 12, 2)->nullable();
            $table->string('payment_status', 50)->nullable();
            $table->timestamp('payment_date')->nullable();
            $table->boolean('is_expedited')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('document_type_id')->references('id')->on('document_types');
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');
            $table->foreign('verified_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('rejected_by')->references('id')->on('users')->onDelete('set null');
            $table->index('user_id');
            $table->index('document_number');
            $table->index('status');
            $table->index('document_type_id');
            $table->index('assigned_to');
            $table->index('created_at');
        });

        // Document attachments
        Schema::create('document_attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('document_id');
            $table->string('file_name');
            $table->string('file_url', 500);
            $table->string('file_type');
            $table->bigInteger('file_size');
            $table->string('requirement_name', 255)->nullable();
            $table->uuid('uploaded_by');
            $table->boolean('is_verified')->default(false);
            $table->text('verification_notes')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('document_id')->references('id')->on('documents')->onDelete('cascade');
            $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('cascade');
            $table->index('document_id');
            $table->index('uploaded_by');
        });

        // Document approvals (workflow)
        Schema::create('document_approvals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('document_id');
            $table->uuid('approver_id');
            $table->integer('approval_level');
            $table->string('status', 50);
            $table->text('notes')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('document_id')->references('id')->on('documents')->onDelete('cascade');
            $table->foreign('approver_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['document_id', 'approval_level']);
            $table->index('document_id');
            $table->index('approver_id');
        });

        // Document history
        Schema::create('document_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('document_id');
            $table->uuid('user_id');
            $table->enum('old_status', ['draft', 'pending_verification', 'verified', 'in_review', 'approved', 'rejected', 'completed', 'expired'])->nullable();
            $table->enum('new_status', ['draft', 'pending_verification', 'verified', 'in_review', 'approved', 'rejected', 'completed', 'expired']);
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('document_id')->references('id')->on('documents')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->index('document_id');
            $table->index('created_at');
        });

        // ============================================================
        // 4. NOTIFICATIONS
        // ============================================================


        // Notifications
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('template_id')->nullable();
            $table->enum('type', ['email', 'whatsapp', 'sms', 'push', 'in_app']);
            $table->json('channels');
            $table->string('subject', 500)->nullable();
            $table->text('content');
            $table->json('data')->nullable();
            $table->enum('email_status', ['pending', 'sent', 'delivered', 'read', 'failed'])->default('pending');
            $table->timestamp('email_sent_at')->nullable();
            $table->enum('whatsapp_status', ['pending', 'sent', 'delivered', 'read', 'failed'])->default('pending');
            $table->timestamp('whatsapp_sent_at')->nullable();
            $table->enum('sms_status', ['pending', 'sent', 'delivered', 'read', 'failed'])->default('pending');
            $table->timestamp('sms_sent_at')->nullable();
            $table->enum('push_status', ['pending', 'sent', 'delivered', 'read', 'failed'])->default('pending');
            $table->timestamp('push_sent_at')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->integer('priority')->default(0);
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('sent_at')->nullable();
            $table->integer('retry_count')->default(0);
            $table->timestamp('last_retry_at')->nullable();
            $table->text('error_message')->nullable();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('template_id')->references('id')->on('notification_templates')->onDelete('set null');
            $table->index('user_id');
            $table->index('is_read');
            $table->index('created_at');
            $table->index('scheduled_at');
        });

        // ============================================================
        // 5. GAMIFICATION (POINTS & BADGES)
        // ============================================================

        // Messages
        Schema::create('messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('conversation_id');
            $table->uuid('sender_id');
            $table->uuid('receiver_id');
            $table->text('content');
            $table->enum('message_status', ['sent', 'delivered', 'read', 'deleted'])->default('sent');
            $table->string('attachment_url', 500)->nullable();
            $table->string('attachment_type', 50)->nullable();
            $table->uuid('reply_to_id')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('conversation_id')->references('id')->on('conversations')->onDelete('cascade');
            $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('receiver_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('reply_to_id')->references('id')->on('messages')->onDelete('set null');
            $table->index('conversation_id');
            $table->index('sender_id');
            $table->index('receiver_id');
            $table->index('is_read');
            $table->index('created_at');
        });

        // ============================================================
        // 7. ANNOUNCEMENTS
        // ============================================================

        // Announcements
        Schema::create('announcements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('created_by');
            $table->string('title');
            $table->text('content');
            $table->string('announcement_type', 50)->default('general');
            $table->enum('target_role', ['superadmin', 'admin', 'verifikator', 'petugas_lapangan', 'warga'])->nullable();
            $table->boolean('is_urgent')->default(false);
            $table->boolean('is_pinned')->default(false);
            $table->timestamp('publish_at')->useCurrent();
            $table->timestamp('expire_at')->nullable();
            $table->integer('view_count')->default(0);
            $table->integer('read_count')->default(0);
            $table->string('attachment_url', 500)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->index('created_by');
            $table->index('publish_at');
            $table->index('is_pinned');
        });

        // Announcement reads
        Schema::create('announcement_reads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('announcement_id');
            $table->uuid('user_id');
            $table->timestamp('read_at')->useCurrent();

            $table->foreign('announcement_id')->references('id')->on('announcements')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['announcement_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop in reverse order to avoid foreign key constraints
        Schema::dropIfExists('announcement_reads');
        Schema::dropIfExists('announcements');

        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversations');

        Schema::dropIfExists('user_badges');
        Schema::dropIfExists('badges');
        Schema::dropIfExists('point_transactions');
        Schema::dropIfExists('user_points');
        Schema::dropIfExists('point_rules');

        Schema::dropIfExists('notifications');
        Schema::dropIfExists('notification_templates');

        Schema::dropIfExists('document_history');
        Schema::dropIfExists('document_approvals');
        Schema::dropIfExists('document_attachments');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('document_templates');
        Schema::dropIfExists('document_types');

        Schema::dropIfExists('ticket_ratings');
        Schema::dropIfExists('ticket_supports');
        Schema::dropIfExists('ticket_history');
        Schema::dropIfExists('ticket_comments');
        Schema::dropIfExists('ticket_attachments');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('ticket_categories');

        Schema::dropIfExists('password_resets');
        Schema::dropIfExists('refresh_tokens');
        Schema::dropIfExists('user_preferences');
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('user_profiles');
        Schema::dropIfExists('users');
    }
};
