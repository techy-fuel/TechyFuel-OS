<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
            $table->foreignUuid('member_id')->constrained('team_members')->cascadeOnDelete();
            $table->text('label');
            $table->text('email');
            $table->text('imap_host');
            $table->integer('imap_port')->default(993);
            $table->text('smtp_host');
            $table->integer('smtp_port')->default(465);
            $table->text('from_name')->nullable();
            $table->text('encrypted_password');
            $table->text('password_iv');
            $table->text('password_tag');
            $table->timestampTz('created_at')->useCurrent();

            $table->index('member_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_accounts');
    }
};
