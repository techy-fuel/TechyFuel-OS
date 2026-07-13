<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workspaces', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('name');
            $table->text('slug')->nullable()->unique();
            $table->text('logo_url')->nullable();
            $table->text('description')->nullable();
            $table->text('plan')->default('free');
            // FK to team_members(id) added later (200003) once that table exists —
            // the two tables reference each other (circular dependency).
            $table->uuid('owner_id')->nullable();
            $table->timestampTz('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workspaces');
    }
};
