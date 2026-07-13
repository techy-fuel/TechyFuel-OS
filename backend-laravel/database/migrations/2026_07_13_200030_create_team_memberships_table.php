<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_memberships', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('team_id')->constrained('teams')->cascadeOnDelete();
            $table->foreignUuid('member_id')->constrained('team_members')->cascadeOnDelete();
            $table->text('role')->default('member');
            $table->timestampTz('joined_at')->useCurrent();

            $table->unique(['team_id', 'member_id']);
            $table->index('member_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_memberships');
    }
};
