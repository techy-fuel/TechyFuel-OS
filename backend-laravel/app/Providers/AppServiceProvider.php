<?php

namespace App\Providers;

use App\Services\WorkspaceContext;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(WorkspaceContext::class);
    }

    /**
     * Bootstrap any application services.
     *
     * These three gates stand in for the three role tiers that Supabase's
     * RLS policies (migrations 017/018/019) checked on every table:
     *   - 'staff'   any active team_members role in the workspace — the
     *               baseline requirement for Clients/Projects/Tasks/Files/
     *               Content/chat/automations/etc.
     *   - 'admin'   owner or admin only — Team management, Workspace
     *               settings, Integrations (webhooks).
     *   - 'finance' owner or admin only — Invoices, Expenses.
     * (admin/finance were separate RLS policies but had identical checks;
     * kept as two gates so call sites read as intent, not just "role check".)
     */
    public function boot(): void
    {
        Gate::define('staff', fn () => app(WorkspaceContext::class)->role() !== null);
        Gate::define('admin', fn () => app(WorkspaceContext::class)->isOwnerOrAdmin());
        Gate::define('finance', fn () => app(WorkspaceContext::class)->isOwnerOrAdmin());
    }
}
