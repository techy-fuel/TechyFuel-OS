<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('call_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('channel_id')->nullable()->constrained('channels')->cascadeOnDelete();
            $table->text('type')->default('video');
            $table->text('room_name');
            $table->foreignUuid('started_by')->nullable()->constrained('team_members')->nullOnDelete();
            $table->timestampTz('started_at')->useCurrent();
            $table->timestampTz('ended_at')->nullable();
            $table->text('recording_url')->nullable();
            $table->integer('participant_count')->default(0);
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();

            $table->index('channel_id');

            // MySQL/MariaDB have no partial-index syntax — a plain index
            // on ended_at still helps the "is anyone on an active call"
            // query, just without Postgres's "only index the NULL rows"
            // optimization.
            if (DB::getDriverName() !== 'pgsql') {
                $table->index('ended_at', 'call_sessions_active_idx');
            }
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('CREATE INDEX call_sessions_active_idx ON call_sessions (ended_at) WHERE ended_at IS NULL');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('call_sessions');
    }
};
