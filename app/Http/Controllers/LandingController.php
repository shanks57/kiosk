<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index()
    {
        $nearestEvents = Event::with('organizer.user')
            ->orderBy('start_time', 'asc')
            ->get();
        $featuredEvent = Event::with('organizer.user')->get();
        return Inertia::render('welcome', [
            'nearestEvents' => $nearestEvents,
            'featuredEvent' => $featuredEvent,
        ]);
    }

    /**
     * Returns the SuperAdmin dashboard view
     *
     * @return \Inertia\Response
     */
    public function dashboardSuperadmin()
    {
        return Inertia::render('dashboards/SuperAdminDashboard');
    }

    public function dashboardOrganizer()
    {
        return Inertia::render('dashboards/organizer');
    }

    public function dashboardUser()
    {
        $user = Auth::user();
        abort_unless($user, 403);
        return Inertia::render('dashboards/UserDashboard');
    }
}
