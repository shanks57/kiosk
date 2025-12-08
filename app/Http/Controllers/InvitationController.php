<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\TicketCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvitationController extends Controller
{
    /**
     * Display a listing of the events.
     */
    public function index(Request $request)
    {
        return Inertia::render('invitation/index');
    }

    /**
     * Display the specified event.
     */
    public function show($id)
    {
        return Inertia::render('invitation/detail');
    }
}
