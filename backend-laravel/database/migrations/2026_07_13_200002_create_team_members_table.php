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

            // MySQL/MariaDB already treat NULL as distinct in a plain unique
            // index (multiple NULL user_id rows are allowed), which is
            // exactly the "WHERE user_id IS NOT NULL" behaviour Postgres
            // needs a partial index for — so a plain unique index here is
            // sufficient on that driver.
            if (DB::getDriverName() !== 'pgsql') {
                $table->unique(['user_id', 'workspace_id'], 'team_members_user_workspace_idx');
            }
        });

        // Postgres has no NULL-is-distinct plain unique option across the
        // whole column set the way MySQL does, so it needs a real partial
        // index — matches Supabase migration 020, not expressible via the
        // fluent builder.
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('CREATE UNIQUE INDEX team_members_user_workspace_idx ON team_members (user_id, workspace_id) WHERE user_id IS NOT NULL');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};
