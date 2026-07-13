<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_versions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('document_id')->constrained('documents')->cascadeOnDelete();
            $table->text('title')->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('team_members')->nullOnDelete();
            $table->timestampTz('created_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
        });

        DB::statement("ALTER TABLE document_versions ADD COLUMN content jsonb DEFAULT '[]'");
    }

    public function down(): void
    {
        Schema::dropIfExists('document_versions');
    }
};
