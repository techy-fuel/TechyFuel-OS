<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('recipient_id')->nullable()->constrained('team_members')->cascadeOnDelete();
            $table->text('type');
            $table->text('title');
            $table->text('body')->nullable();
            $table->text('link_screen')->nullable();
            $table->uuid('link_id')->nullable();
            $table->boolean('read')->default(false);
            $table->timestampTz('created_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();

            $table->index('recipient_id');
        });

        DB::statement('CREATE INDEX notifications_read_idx ON notifications ("read") WHERE NOT "read"');
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
