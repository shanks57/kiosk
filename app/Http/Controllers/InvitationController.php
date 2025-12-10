<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Order;
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
        $query = Order::where('ticket_code', '=', $request->input('code'))->first();
        if (! $query) {
            return redirect()->back()->with(['message' => 'Ticket not found']);
        }
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
