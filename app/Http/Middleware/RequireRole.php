<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RequireRole
{
    /**
     * Handle an incoming request.
     * Accepts a pipe-separated list of roles (e.g. 'superadmin|organizer')
     */
    public function handle(Request $request, Closure $next, $roles = null)
    {
        if (! $roles) {
            return $next($request);
        }

        $roles = is_array($roles) ? $roles : explode('|', $roles);
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        foreach ($roles as $role) {
            if ($user->roles()->where('name', trim($role))->exists()) {
                return $next($request);
            }
        }

        abort(403, 'Unauthorized: Required role not found');
    }
}
