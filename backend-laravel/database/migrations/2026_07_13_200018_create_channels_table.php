<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('channels', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('name');
            $table->text('type')->default('channel');
            $table->foreignUuid('project_id')->nullable()->constrained('projects')->cascadeOnDelete();
            $table->text('description')->nullable();
            $table->boolean('is_private')->default(false);
            $table->foreignUuid('created_by')->nullable()->constrained('team_members')->nullOnDelete();
            $table->timestampTz('created_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('channels');
    }
};
