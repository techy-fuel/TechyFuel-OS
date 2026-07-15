<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->foreignUuid('client_id')->nullable()->constrained('clients')->nullOnDelete();
            $table->text('category');
            $table->text('description');
            $table->decimal('amount', 10, 2);
            // No DB-level CURRENT_DATE default (syntax isn't portable
            // across Postgres/MySQL/MariaDB) — ExpenseController defaults
            // it to today() in application code instead.
            $table->date('date')->nullable();
            $table->text('receipt_url')->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('team_members')->nullOnDelete();
            $table->timestampTz('created_at')->useCurrent();
            $table->text('currency')->default('PKR');
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
