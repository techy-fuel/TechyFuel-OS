<?php

use App\Http\Controllers\AdCampaignController;
use App\Http\Controllers\ApprovalRequestController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\AutomationRuleController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ClientInviteController;
use App\Http\Controllers\ClientNoteController;
use App\Http\Controllers\ContentPostController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EmailAccountController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MessageReactionController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PipelineDealController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskTemplateController;
use App\Http\Controllers\TeamMemberController;
use App\Http\Controllers\TimeEntryController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/workspaces', [WorkspaceController::class, 'index']);
    Route::post('/workspaces', [WorkspaceController::class, 'store']);
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

    Route::get('/channels/{channel}/messages', [MessageController::class, 'index']);
    Route::post('/channels/{channel}/messages', [MessageController::class, 'store']);
    Route::delete('/messages/{message}', [MessageController::class, 'destroy']);
    Route::post('/messages/{message}/reactions', [MessageReactionController::class, 'store']);
    Route::delete('/messages/{message}/reactions/{reaction}', [MessageReactionController::class, 'destroy']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{notification}', [NotificationController::class, 'update']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

    Route::get('/tasks/{task}/time-entries', [TimeEntryController::class, 'index']);
    Route::post('/tasks/{task}/time-entries/start', [TimeEntryController::class, 'start']);
    Route::post('/time-entries/{timeEntry}/stop', [TimeEntryController::class, 'stop']);

    Route::get('/approval-requests', [ApprovalRequestController::class, 'index']);
    Route::post('/approval-requests/{approvalRequest}/resolve', [ApprovalRequestController::class, 'resolve']);

    Route::get('/clients/{client}/notes', [ClientNoteController::class, 'index']);
    Route::post('/clients/{client}/notes', [ClientNoteController::class, 'store']);
    Route::post('/clients/{client}/invites', [ClientInviteController::class, 'store']);
});
