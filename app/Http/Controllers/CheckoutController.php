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
        $query = TicketCategory::query()
            ->with(['event.organizer.user', 'event.venue', 'event.sections'])
            ->when($request->input('q'), function ($q, $qstr) {
                $q->whereHas('event', function ($eventQuery) use ($qstr) {
                    $eventQuery->where('title', 'like', '%' . $qstr . '%');
                });
            });

        $ticketCategories = $query->orderBy('event.start_time', 'asc')->paginate(12)->withQueryString();

        return Inertia::render('checkout/form', [
            'ticketCategories' => $ticketCategories,
            'filters' => $request->only(['q']),
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
