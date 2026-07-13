<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workspace_invites', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
            $table->text('email')->nullable();
            $table->text('token')->unique();
            $table->text('role')->default('member');
            $table->foreignUuid('invited_by')->nullable()->constrained('team_members')->nullOnDelete();
            $table->timestampTz('accepted_at')->nullable();
            $table->timestampTz('expires_at')->nullable();
            $table->timestampTz('created_at')->useCurrent();

            $table->index('token');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workspace_invites');
    }
};
