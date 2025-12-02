<?php

use App\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Event listing and detail routes (public)
Route::get('/events', [EventController::class, 'index'])->name('events.index');
Route::get('/events/{id}', [EventController::class, 'show'])->name('events.show');

// Checkout routes (public)
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::get('/checkout/{id}', [CheckoutController::class, 'show'])->name('checkout.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user();

        if ($user && method_exists($user, 'hasRole')) {
            if ($user->hasRole('superadmin')) {
                return Inertia::render('dashboards/SuperAdminDashboard');
            }

            if ($user->hasRole('organizer')) {
                return Inertia::render('dashboards/OrganizerDashboard');
            }
        }
        // default to end user dashboard
        return Inertia::render('dashboards/UserDashboard');
    })->name('dashboard');

    // Optional explicit routes protected by auth and role checks
    Route::get('dashboard/superadmin', function () {
        return Inertia::render('dashboards/SuperAdminDashboard');
    })->middleware([\App\Http\Middleware\RequireRole::class . ':superadmin'])->name('dashboard.superadmin');

    Route::get('dashboard/organizer', function () {
        return Inertia::render('dashboards/OrganizerDashboard');
    })->middleware([\App\Http\Middleware\RequireRole::class . ':organizer'])->name('dashboard.organizer');

    Route::get('dashboard/user', function () {
        $user = Auth::user();
        abort_unless($user, 403);
        return Inertia::render('dashboards/UserDashboard');
    })->name('dashboard.user');
});

require __DIR__ . '/settings.php';
