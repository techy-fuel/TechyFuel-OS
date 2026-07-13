<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('name');
            $table->text('company')->nullable();
            $table->text('email')->nullable();
            $table->text('phone')->nullable();
            $table->text('website')->nullable();
            $table->text('status')->default('active');
            $table->text('avatar_url')->nullable();
            $table->text('industry')->nullable();
            $table->decimal('monthly_value', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrent();
            $table->foreignUuid('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
