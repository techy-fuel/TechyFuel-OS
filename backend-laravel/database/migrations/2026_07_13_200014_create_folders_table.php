<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('folders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('name');
            $table->foreignUuid('project_id')->nullable()->constrained('projects')->cascadeOnDelete();
            $table->uuid('parent_id')->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('team_members')->nullOnDelete();
            $table->timestampTz('created_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
        });

        // Self-referencing FK must be added after the table (and its primary
        // key) fully exists — Postgres can't resolve it inline within the
        // same CREATE TABLE statement.
        Schema::table('folders', function (Blueprint $table) {
            $table->foreign('parent_id')->references('id')->on('folders')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('folders');
    }
};
