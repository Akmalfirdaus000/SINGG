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
        // 8. FORUM & COMMUNITY
        // ============================================================

        // Forum categories
        Schema::create('forum_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->string('icon', 50)->nullable();
            $table->string('color', 20)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Forum posts
        Schema::create('forum_posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('post_number', 50)->unique();
            $table->uuid('user_id');
            $table->uuid('category_id');
            $table->string('title');
            $table->text('content');
            $table->enum('post_type', ['discussion', 'question', 'suggestion', 'announcement', 'poll'])->default('discussion');
            $table->enum('status', ['draft', 'published', 'archived', 'locked'])->default('published');
            $table->json('poll_options')->nullable();
            $table->timestamp('poll_expires_at')->nullable();
            $table->boolean('poll_allow_multiple')->default(false);
            $table->integer('view_count')->default(0);
            $table->integer('like_count')->default(0);
            $table->integer('comment_count')->default(0);
            $table->integer('share_count')->default(0);
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->json('tags')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('forum_categories');
            $table->index('user_id');
            $table->index('category_id');
            $table->index('status');
            $table->index('created_at');
            $table->index('is_pinned');
            $table->fullText(['title', 'content']);
        });

        // Forum comments
        Schema::create('forum_comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('post_id');
            $table->uuid('user_id');
            $table->uuid('parent_id')->nullable();
            $table->text('content');
            $table->integer('like_count')->default(0);
            $table->boolean('is_answer')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('post_id')->references('id')->on('forum_posts')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('parent_id')->references('id')->on('forum_comments')->onDelete('cascade');
            $table->index('post_id');
            $table->index('user_id');
            $table->index('parent_id');
        });

        // Forum post likes
        Schema::create('forum_post_likes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('post_id');
            $table->uuid('user_id');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('post_id')->references('id')->on('forum_posts')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['post_id', 'user_id']);
            $table->index('post_id');
            $table->index('user_id');
        });

        // Forum comment likes
        Schema::create('forum_comment_likes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('comment_id');
            $table->uuid('user_id');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('comment_id')->references('id')->on('forum_comments')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['comment_id', 'user_id']);
        });

        // Forum poll votes
        Schema::create('forum_poll_votes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('post_id');
            $table->uuid('user_id');
            $table->integer('option_index');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('post_id')->references('id')->on('forum_posts')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['post_id', 'user_id']);
        });

        // ============================================================
        // 9. EVENTS
        // ============================================================

        // Events
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('event_number', 50)->unique();
            $table->uuid('created_by');
            $table->string('title');
            $table->text('description');
            $table->enum('event_type', ['gotong_royong', 'rapat', 'sosialisasi', 'pelatihan', 'lainnya']);
            $table->enum('status', ['upcoming', 'ongoing', 'completed', 'cancelled'])->default('upcoming');
            $table->timestamp('start_date');
            $table->timestamp('end_date')->nullable();
            $table->string('location_name', 255)->nullable();
            $table->text('location_address')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->boolean('requires_registration')->default(false);
            $table->integer('max_participants')->nullable();
            $table->timestamp('registration_deadline')->nullable();
            $table->string('cover_image_url', 500)->nullable();
            $table->integer('view_count')->default(0);
            $table->integer('participant_count')->default(0);
            $table->integer('interested_count')->default(0);
            $table->json('tags')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->index('created_by');
            $table->index('status');
            $table->index('start_date');
            $table->index('event_type');
        });

        // Event registrations
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('event_id');
            $table->uuid('user_id');
            $table->string('status', 50)->default('registered');
            $table->text('notes')->nullable();
            $table->string('qr_code', 255)->nullable();
            $table->timestamp('registered_at')->useCurrent();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('attended_at')->nullable();

            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['event_id', 'user_id']);
            $table->index('event_id');
            $table->index('user_id');
            $table->index('status');
        });

        // Event interests
        Schema::create('event_interests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('event_id');
            $table->uuid('user_id');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['event_id', 'user_id']);
        });

        // ============================================================
        // 10. AUDIT LOGS & ANALYTICS
        // ============================================================

        // Audit logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->enum('action', ['create', 'read', 'update', 'delete', 'login', 'logout', 'download', 'upload', 'approve', 'reject']);
            $table->string('entity_type', 100)->nullable();
            $table->uuid('entity_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->index('user_id');
            $table->index('action');
            $table->index(['entity_type', 'entity_id']);
            $table->index('created_at');
        });

        // Analytics events
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->string('session_id', 255)->nullable();
            $table->string('event_name', 255);
            $table->json('event_properties')->nullable();
            $table->string('page_url', 500)->nullable();
            $table->string('referrer_url', 500)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->index('user_id');
            $table->index('event_name');
            $table->index('session_id');
            $table->index('created_at');
        });

        // ============================================================
        // 11. SYSTEM CONFIGURATION
        // ============================================================

        // System settings
        Schema::create('system_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('setting_key')->unique();
            $table->text('setting_value');
            $table->string('value_type', 50)->default('string');
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false);
            $table->boolean('is_encrypted')->default(false);
            $table->timestamps();
        });

        // Feature flags
        Schema::create('feature_flags', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_enabled')->default(false);
            $table->json('enabled_for_roles')->nullable();
            $table->timestamps();
        });

        // Report schedules
        Schema::create('report_schedules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('report_type', 100);
            $table->string('schedule', 100); // Cron expression
            $table->json('recipients');
            $table->string('format', 20)->default('pdf');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_run_at')->nullable();
            $table->timestamp('next_run_at')->nullable();
            $table->timestamps();
        });

        // Report cache
        Schema::create('report_cache', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('report_type', 100);
            $table->string('report_key', 255);
            $table->string('file_url', 500)->nullable();
            $table->json('data')->nullable();
            $table->timestamp('expires_at');
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['report_type', 'report_key']);
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_cache');
        Schema::dropIfExists('report_schedules');
        Schema::dropIfExists('feature_flags');
        Schema::dropIfExists('system_settings');

        Schema::dropIfExists('analytics_events');
        Schema::dropIfExists('audit_logs');

        Schema::dropIfExists('event_interests');
        Schema::dropIfExists('event_registrations');
        Schema::dropIfExists('events');

        Schema::dropIfExists('forum_poll_votes');
        Schema::dropIfExists('forum_comment_likes');
        Schema::dropIfExists('forum_post_likes');
        Schema::dropIfExists('forum_comments');
        Schema::dropIfExists('forum_posts');
        Schema::dropIfExists('forum_categories');
    }
};
