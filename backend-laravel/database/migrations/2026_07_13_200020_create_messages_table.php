<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('channel_id')->constrained('channels')->cascadeOnDelete();
            $table->foreignUuid('sender_id')->nullable()->constrained('team_members')->nullOnDelete();
            $table->text('content')->nullable();
            $table->uuid('thread_parent_id')->nullable();
            $table->boolean('pinned')->default(false);
            $table->text('file_url')->nullable();
            $table->text('file_name')->nullable();
            $table->bigInteger('file_size')->nullable();
            $table->text('file_type')->nullable();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();

            $table->index('channel_id');
            $table->index('thread_parent_id');
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->foreign('thread_parent_id')->references('id')->on('messages')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
