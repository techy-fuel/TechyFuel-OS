<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('message_reactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('message_id')->constrained('messages')->cascadeOnDelete();
            $table->foreignUuid('member_id')->constrained('team_members')->cascadeOnDelete();
            $table->text('emoji');
            $table->timestampTz('created_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();

            $table->unique(['message_id', 'member_id', 'emoji']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message_reactions');
    }
};
