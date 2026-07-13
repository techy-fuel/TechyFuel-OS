<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('name');
            $table->text('email');
            $table->text('role')->default('member');
            $table->text('avatar_url')->nullable();
            $table->text('department')->nullable();
            $table->text('status')->default('active');
            $table->timestampTz('joined_at')->nullable()->useCurrent();
            $table->timestampTz('created_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
            $table->text('access_level')->default('member')->nullable();

            $table->unique(['email', 'workspace_id'], 'team_members_email_workspace_idx');
        });

        // Partial unique index (user_id, workspace_id) WHERE user_id IS NOT NULL —
        // matches Supabase migration 020, not expressible via the fluent builder.
        DB::statement('CREATE UNIQUE INDEX team_members_user_workspace_idx ON team_members (user_id, workspace_id) WHERE user_id IS NOT NULL');
    }

    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};
