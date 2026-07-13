<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('approval_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('task_id')->constrained('tasks')->cascadeOnDelete();
            $table->foreignUuid('requested_by')->nullable()->constrained('team_members')->nullOnDelete();
            $table->foreignUuid('approver_id')->nullable()->constrained('team_members')->nullOnDelete();
            $table->text('status')->default('pending');
            $table->text('comment')->nullable();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('resolved_at')->nullable();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();

            $table->index('task_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('approval_requests');
    }
};
