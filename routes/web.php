<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventDashboardController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\OrganizerEventController;
use App\Http\Controllers\ParticipantController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CheckinController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\TicketCategoryController;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', [LandingController::class, 'index'])->name('welcome');

// Event listing and detail routes (public)
Route::get('/events', [EventController::class, 'index'])->name('events.index');
Route::get('/events/{id}', [EventController::class, 'show'])->name('events.show');

// Checkout routes (public)
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/event-checkout', [CheckoutController::class, 'event'])->name('checkout.event');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/{id}', [CheckoutController::class, 'show'])->name('checkout.show');

// Checkin (public pages for scanner and manual code input)

Route::get('/checkin/scan', [CheckinController::class, 'scan'])->name('checkin.scan');
Route::get('/checkin/manual', [CheckinController::class, 'manual'])->name('checkin.manual');
Route::post('/checkin', [CheckinController::class, 'check'])->name('checkin.check');

Route::get('/invitation', [InvitationController::class, 'index'])->name('invitation.index');
Route::get('/invitation/{invitation}', [InvitationController::class, 'show'])->name('invitation.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    // Optional explicit routes protected by auth and role checks
    // Route::get('dashboard/superadmin', [DashboardController::class, 'dashboardSuperadmin'])->name('dashboard.superadmin');
    // Route::get('dashboard/organizer', [DashboardController::class, 'dashboardOrganizer'])->name('dashboard.organizer');
    // Route::get('dashboard/user', [DashboardController::class, 'dashboardUser'])->name('dashboard.user');

    Route::get('/dashboard/events', [EventDashboardController::class, 'index'])->name('dashboard.events');

    // Organizer event management routes
    Route::middleware('role:organizer')->prefix('/dashboard/events')->name('organizer.events.')->group(function () {
        Route::get('/', [OrganizerEventController::class, 'index'])->name('index');
        Route::get('/create', [OrganizerEventController::class, 'create'])->name('create');
        Route::post('/', [OrganizerEventController::class, 'store'])->name('store');
        Route::get('/{event}', [OrganizerEventController::class, 'show'])->name('show');
        Route::get('/{event}/edit', [OrganizerEventController::class, 'edit'])->name('edit');
        Route::put('/{event}', [OrganizerEventController::class, 'update'])->name('update');
        Route::delete('/{event}', [OrganizerEventController::class, 'destroy'])->name('destroy');

        Route::get('/{event}/participants', [ParticipantController::class, 'index'])->name('participants');
        Route::post('/{event}/participants', [ParticipantController::class, 'store'])->name('participants.store');
        Route::delete('/{event}/participants/{id}', [ParticipantController::class, 'destroy'])->name('participants.destroy');
        Route::get('/{event}/participants/export', [ParticipantController::class, 'export'])->name('participants.export');

        // Ticket categories CRUD for an event
        Route::get('/{event}/ticket-categories', [TicketCategoryController::class, 'index'])->name('ticket-categories.index');
        Route::get('/{event}/ticket-categories/create', [TicketCategoryController::class, 'create'])->name('ticket-categories.create');
        Route::post('/{event}/ticket-categories', [TicketCategoryController::class, 'store'])->name('ticket-categories.store');
        Route::get('/{event}/ticket-categories/{category}/edit', [TicketCategoryController::class, 'edit'])->name('ticket-categories.edit');
        Route::put('/{event}/ticket-categories/{category}', [TicketCategoryController::class, 'update'])->name('ticket-categories.update');
        Route::delete('/{event}/ticket-categories/{category}', [TicketCategoryController::class, 'destroy'])->name('ticket-categories.destroy');
    });
});

require __DIR__ . '/settings.php';
