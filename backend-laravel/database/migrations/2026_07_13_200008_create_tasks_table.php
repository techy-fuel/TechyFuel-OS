<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->nullable()->constrained('projects')->cascadeOnDelete();
            $table->foreignUuid('client_id')->nullable()->constrained('clients')->nullOnDelete();
            $table->text('title');
            $table->text('description')->nullable();
            $table->text('status')->default('todo');
            $table->text('priority')->default('medium');
            $table->foreignUuid('assigned_to')->nullable()->constrained('team_members')->nullOnDelete();
            $table->date('due_date')->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('team_members')->nullOnDelete();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrent();
            $table->boolean('requires_approval')->default(false);
            $table->text('approval_status')->nullable();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
            $table->boolean('is_recurring')->default(false);
            $table->text('recurrence_interval')->nullable();
            $table->date('next_run_date')->nullable();

            $table->index('client_id');
        });

        DB::statement('ALTER TABLE tasks ADD COLUMN tags text[]');
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
