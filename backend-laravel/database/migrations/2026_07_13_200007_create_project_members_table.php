<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_members', function (Blueprint $table) {
            $table->foreignUuid('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignUuid('member_id')->constrained('team_members')->cascadeOnDelete();
            $table->text('role')->default('member');
            $table->foreignUuid('workspace_id')->constrained('workspaces')->cascadeOnDelete();

            $table->primary(['project_id', 'member_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_members');
    }
};
