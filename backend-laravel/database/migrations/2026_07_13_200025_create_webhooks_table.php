<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('webhooks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('name');
            $table->text('url');
            $table->text('secret')->nullable();
            $table->boolean('enabled')->default(true);
            $table->timestampTz('last_triggered_at')->nullable();
            $table->integer('last_status')->nullable();
            $table->timestampTz('created_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();

            if (DB::getDriverName() !== 'pgsql') {
                $table->json('events')->nullable();
            }
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE webhooks ADD COLUMN events text[] DEFAULT '{}'");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('webhooks');
    }
};
