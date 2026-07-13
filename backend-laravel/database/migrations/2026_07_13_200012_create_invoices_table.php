<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('client_id')->nullable()->constrained('clients')->nullOnDelete();
            $table->foreignUuid('project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->text('invoice_no')->unique();
            $table->text('status')->default('draft');
            $table->decimal('amount', 10, 2);
            $table->decimal('tax', 10, 2)->default(0);
            $table->date('due_date')->nullable();
            $table->timestampTz('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrent();
            $table->text('currency')->default('PKR');
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
            $table->boolean('is_recurring')->default(false);
            $table->text('recurrence_interval')->nullable();
            $table->date('next_run_date')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
