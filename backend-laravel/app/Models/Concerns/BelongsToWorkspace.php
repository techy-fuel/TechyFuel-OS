<?php

namespace App\Models\Concerns;

use App\Services\WorkspaceContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Stands in for Postgres RLS's `workspace_id = current_workspace_id()`
 * check on every workspace-scoped table: auto-fills workspace_id from the
 * request's active workspace on create, and scopes every query to it so a
 * signed-in user can never see another workspace's rows, wherever this
 * trait is used from a model.
 */
trait BelongsToWorkspace
{
    public static function bootBelongsToWorkspace(): void
    {
        static::addGlobalScope('workspace', function (Builder $builder) {
            $workspaceId = app(WorkspaceContext::class)->workspaceId();
            if ($workspaceId) {
                $builder->where($builder->getModel()->getTable().'.workspace_id', $workspaceId);
            }
        });

        static::creating(function (Model $model) {
            if (empty($model->workspace_id)) {
                $model->workspace_id = app(WorkspaceContext::class)->requireWorkspace();
            }
        });
    }
}
