<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('client_id')->nullable()->constrained('clients')->cascadeOnDelete();
            $table->text('title');
            $table->text('caption')->nullable();
            $table->text('platform');
            $table->text('status')->default('draft');
            $table->timestampTz('scheduled_at')->nullable();
            $table->timestampTz('published_at')->nullable();
            $table->foreignUuid('assigned_to')->nullable()->constrained('team_members')->nullOnDelete();
            $table->foreignUuid('created_by')->nullable()->constrained('team_members')->nullOnDelete();
            $table->timestampTz('created_at')->useCurrent();
            $table->timestampTz('updated_at')->useCurrent();
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();

            if (DB::getDriverName() !== 'pgsql') {
                $table->json('media_urls')->nullable();
                $table->json('tags')->nullable();
            }
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE content_posts ADD COLUMN media_urls text[]');
            DB::statement('ALTER TABLE content_posts ADD COLUMN tags text[]');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('content_posts');
    }
};
