<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_notes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('client_id')->constrained('clients')->cascadeOnDelete();
            $table->foreignUuid('project_id')->nullable()->constrained('projects')->cascadeOnDelete();
            $table->text('content');
            $table->foreignUuid('created_by')->nullable()->constrained('team_members')->nullOnDelete();
            $table->timestampTz('created_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();

            $table->index('client_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('client_notes');
    }
};
