<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\TicketCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Display a listing of the events.
     */
    public function index(Request $request)
    {
        $id = $request->input('event_id');
        $event = Event::find($id);
        $ticketCategories = TicketCategory::whereHas('event', function ($eventQuery) use ($id) {
            $eventQuery->where('id', '=', $id);
        })->with(['event.organizer.user', 'event.venue', 'event.sections'])->get();

        return Inertia::render('checkout/form', [
            'ticketCategories' => $ticketCategories,
            'filters' => $request->only(['q']),
            'event' => $event,
        ]);
    }

    public function event(Request $request)
    {

        $id = $request->input('event_id');
        $ticket = $request->input('tickets');

        return redirect()->route('checkout.index', [
            'event_id' => $id,
            'tickets' => $ticket,
        ]);
    }

    /**
     * Display the specified event.
     */
    public function show($id)
    {
        $event = Event::with(['organizer.user', 'venue', 'sections.seats'])->find($id);

        $ticketCategories = TicketCategory::where('event_id', $id)->get();

        return Inertia::render('event/detail', [
            'event' => $event,
            'ticketCategories' => $ticketCategories,
        ]);
    }
}
