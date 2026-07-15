<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('automation_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('name');
            $table->boolean('enabled')->default(true);
            $table->text('trigger_type');
            $table->text('action_type');
            $table->integer('run_count')->default(0);
            $table->timestampTz('last_run_at')->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('team_members')->nullOnDelete();
            $table->timestampTz('created_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();

            $table->index('enabled');
            $table->json('trigger_config')->nullable();
            $table->json('action_config')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('automation_rules');
    }
};
