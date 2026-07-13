<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AdCampaignController;
use App\Http\Controllers\ApprovalRequestController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\AutomationRuleController;
use App\Http\Controllers\CallSessionController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\ChannelMemberController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ClientInviteController;
use App\Http\Controllers\ClientNoteController;
use App\Http\Controllers\ContentPostController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EmailAccountController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\FxRatesController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MessageReactionController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PipelineDealController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskTemplateController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\TeamMembershipController;
use App\Http\Controllers\TimeEntryController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\WorkspaceInviteController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);
Route::get('/fx-rates', [FxRatesController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    Route::get('/workspaces', [WorkspaceController::class, 'index']);
    Route::post('/workspaces', [WorkspaceController::class, 'store']);
    Route::patch('/workspaces', [WorkspaceController::class, 'update']);
    Route::post('/workspaces/switch', [WorkspaceController::class, 'switch']);

    Route::apiResource('clients', ClientController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('pipeline-deals', PipelineDealController::class);
    Route::apiResource('content-posts', ContentPostController::class);
    Route::apiResource('ad-campaigns', AdCampaignController::class);
    Route::apiResource('expenses', ExpenseController::class);
    Route::apiResource('folders', FolderController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::apiResource('files', FileController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::apiResource('documents', DocumentController::class);
    Route::apiResource('channels', ChannelController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::apiResource('automation-rules', AutomationRuleController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::apiResource('task-templates', TaskTemplateController::class)->only(['index', 'store', 'destroy']);
    Route::apiResource('webhooks', WebhookController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::apiResource('team-members', TeamMemberController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::apiResource('email-accounts', EmailAccountController::class)->only(['index', 'store', 'destroy']);
    Route::apiResource('teams', TeamController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::apiResource('workspace-invites', WorkspaceInviteController::class)->only(['index', 'store', 'destroy']);

    Route::post('/task-templates/{taskTemplate}/apply', [TaskTemplateController::class, 'apply']);

    Route::post('/teams/{team}/memberships', [TeamMembershipController::class, 'store']);
    Route::delete('/teams/{team}/memberships/{memberId}', [TeamMembershipController::class, 'destroy']);

    Route::get('/channels/{channel}/messages', [MessageController::class, 'index']);
    Route::post('/channels/{channel}/messages', [MessageController::class, 'store']);
    Route::get('/channels/{channel}/messages/pinned', [MessageController::class, 'pinned']);
    Route::get('/messages/search', [MessageController::class, 'search']);
    Route::patch('/messages/{message}/pin', [MessageController::class, 'pin']);
    Route::delete('/messages/{message}', [MessageController::class, 'destroy']);
    Route::post('/messages/{message}/reactions', [MessageReactionController::class, 'store']);
    Route::delete('/messages/{message}/reactions/{reaction}', [MessageReactionController::class, 'destroy']);

    Route::get('/channels/{channel}/members', [ChannelMemberController::class, 'index']);
    Route::post('/channels/{channel}/members', [ChannelMemberController::class, 'store']);
    Route::delete('/channels/{channel}/members/{memberId}', [ChannelMemberController::class, 'destroy']);
    Route::post('/channels/{channel}/members/{memberId}/mark-read', [ChannelMemberController::class, 'markRead']);

    Route::post('/call-sessions', [CallSessionController::class, 'store']);
    Route::post('/call-sessions/{callSession}/end', [CallSessionController::class, 'end']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllRead']);
    Route::patch('/notifications/{notification}', [NotificationController::class, 'update']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

    Route::get('/tasks/{task}/time-entries', [TimeEntryController::class, 'index']);
    Route::post('/tasks/{task}/time-entries/start', [TimeEntryController::class, 'start']);
    Route::post('/time-entries/{timeEntry}/stop', [TimeEntryController::class, 'stop']);

    Route::get('/approval-requests', [ApprovalRequestController::class, 'index']);
    Route::post('/approval-requests', [ApprovalRequestController::class, 'store']);
    Route::get('/tasks/{taskId}/approval-requests/pending', [ApprovalRequestController::class, 'pendingForTask']);
    Route::get('/tasks/{taskId}/approval-requests/latest', [ApprovalRequestController::class, 'latestForTask']);
    Route::post('/approval-requests/{approvalRequest}/resolve', [ApprovalRequestController::class, 'resolve']);

    Route::get('/clients/{client}/notes', [ClientNoteController::class, 'index']);
    Route::post('/clients/{client}/notes', [ClientNoteController::class, 'store']);
    Route::get('/clients/{client}/invite', [ClientInviteController::class, 'show']);
    Route::post('/clients/{client}/invites', [ClientInviteController::class, 'store']);

    Route::post('/webhooks/{webhook}/fire', [WebhookController::class, 'fire']);

    Route::get('/activity-log', [ActivityLogController::class, 'index']);
});
