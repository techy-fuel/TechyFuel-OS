<?php

namespace App\Http\Middleware;

use App\Services\WorkspaceContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureWorkspaceContext
{
    public function handle(Request $request, Closure $next): Response
    {
        app(WorkspaceContext::class)->resolveFor($request->user());

        return $next($request);
    }
}
