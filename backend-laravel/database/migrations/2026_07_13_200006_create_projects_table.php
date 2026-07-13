<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('client_id')->nullable()->constrained('clients')->nullOnDelete();
            $table->text('name');
            $table->text('description')->nullable();
            $table->text('status')->default('active');
            $table->text('priority')->default('medium');
            $table->date('start_date')->nullable();
            $table->date('due_date')->nullable();
            $table->decimal('budget', 10, 2)->nullable();
            $table->decimal('spent', 10, 2)->default(0);
            $table->integer('progress')->default(0);
            $table->foreignUuid('created_by')->nullable()->constrained('team_members')->nullOnDelete();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
            $table->text('currency')->default('PKR');
        });

        DB::statement('ALTER TABLE projects ADD CONSTRAINT projects_progress_check CHECK (progress >= 0 AND progress <= 100)');
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
