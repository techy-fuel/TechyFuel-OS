<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_log', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('actor_id')->nullable()->constrained('team_members')->nullOnDelete();
            $table->text('actor_name')->nullable();
            $table->text('action');
            $table->text('entity_type');
            $table->uuid('entity_id')->nullable();
            $table->text('entity_name')->nullable();
            $table->timestampTz('created_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();

            $table->index('entity_type');
            $table->json('meta')->nullable();
        });

        DB::statement('CREATE INDEX activity_log_created_idx ON activity_log (created_at DESC)');
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_log');
    }
};
