<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('name');
            $table->text('description')->nullable();
            $table->timestampTz('created_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
        });

        DB::statement("ALTER TABLE task_templates ADD COLUMN tasks jsonb DEFAULT '[]'");
    }

    public function down(): void
    {
        Schema::dropIfExists('task_templates');
    }
};
