<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_campaigns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('client_id')->nullable()->constrained('clients')->cascadeOnDelete();
            $table->text('name');
            $table->text('platform')->default('meta');
            $table->text('status')->default('active');
            $table->decimal('budget_daily', 10, 2)->nullable();
            $table->decimal('budget_total', 10, 2)->nullable();
            $table->decimal('spent', 10, 2)->default(0);
            $table->bigInteger('impressions')->default(0);
            $table->bigInteger('clicks')->default(0);
            $table->bigInteger('conversions')->default(0);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_campaigns');
    }
};
