<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('time_entries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('task_id')->constrained('tasks')->cascadeOnDelete();
            $table->foreignUuid('member_id')->nullable()->constrained('team_members')->nullOnDelete();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
            $table->timestampTz('started_at')->useCurrent();
            $table->timestampTz('ended_at')->nullable();
            $table->integer('duration_seconds')->nullable();
            $table->timestampTz('created_at')->useCurrent();

            $table->index('task_id');
            $table->index('member_id');
            $table->index('workspace_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('time_entries');
    }
};
