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
        Schema::table('percakapan', function (Blueprint $table) {
            $table->string('context_type')->nullable()->after('user_id_2');
            $table->uuid('context_id')->nullable()->after('context_type');
            
            $table->index(['context_type', 'context_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('percakapan', function (Blueprint $table) {
            $table->dropIndex(['percakapan_context_type_context_id_index']);
            $table->dropColumn(['context_type', 'context_id']);
        });
    }
};
