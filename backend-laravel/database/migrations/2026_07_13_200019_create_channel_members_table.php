<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('channel_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('channel_id')->constrained('channels')->cascadeOnDelete();
            $table->foreignUuid('member_id')->constrained('team_members')->cascadeOnDelete();
            $table->timestampTz('joined_at')->useCurrent();
            $table->timestampTz('last_read_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();

            $table->unique(['channel_id', 'member_id']);
            $table->index('member_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('channel_members');
    }
};
