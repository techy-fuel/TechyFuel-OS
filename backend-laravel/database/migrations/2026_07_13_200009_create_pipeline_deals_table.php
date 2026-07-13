<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pipeline_deals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('client_id')->nullable()->constrained('clients')->nullOnDelete();
            $table->text('title');
            $table->decimal('value', 10, 2)->default(0);
            $table->text('stage')->default('lead');
            $table->integer('probability')->default(0);
            $table->date('expected_close')->nullable();
            $table->foreignUuid('assigned_to')->nullable()->constrained('team_members')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();
        });

        DB::statement('ALTER TABLE pipeline_deals ADD CONSTRAINT pipeline_deals_probability_check CHECK (probability >= 0 AND probability <= 100)');
    }

    public function down(): void
    {
        Schema::dropIfExists('pipeline_deals');
    }
};
