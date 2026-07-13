<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->foreignUuid('client_id')->nullable()->constrained('clients')->nullOnDelete();
            $table->text('name');
            $table->text('file_path');
            $table->bigInteger('file_size')->nullable();
            $table->text('mime_type')->nullable();
            $table->foreignUuid('uploaded_by')->nullable()->constrained('team_members')->nullOnDelete();
            $table->timestampTz('created_at')->useCurrent();
            $table->foreignUuid('task_id')->nullable()->constrained('tasks')->nullOnDelete();
            $table->foreignUuid('folder_id')->nullable()->constrained('folders')->nullOnDelete();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
