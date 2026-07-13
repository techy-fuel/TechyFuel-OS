<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('title')->default('Untitled');
            $table->foreignUuid('project_id')->nullable()->constrained('projects')->cascadeOnDelete();
            $table->foreignUuid('task_id')->nullable()->constrained('tasks')->nullOnDelete();
            $table->foreignUuid('folder_id')->nullable()->constrained('folders')->nullOnDelete();
            $table->foreignUuid('created_by')->nullable()->constrained('team_members')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('team_members')->nullOnDelete();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
        });

        DB::statement("ALTER TABLE documents ADD COLUMN content jsonb DEFAULT '[]'");
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
