<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Organizer;
use App\Models\TicketCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrganizerEventController extends Controller
{
    /**
     * Display a listing of the organizer's events.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $organizer = $user->organizer;
        abort_if(!$organizer, 403, 'User is not an organizer');

        $events = Event::where('organizer_id', $organizer->id)
            ->with(['sections', 'venue', 'organizer.user'])
            ->withCount([
                'orders',
                'orders as paid_orders_count' => function ($q) {
                    $q->whereHas('payment', function ($q2) {
                        $q2->where('status', 'paid');
                    });
                },
            ])
            ->orderBy('start_time', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('organizer/events/index', [
            'events' => $events,
        ]);
    }

    /**
     * Show the form for creating a new event.
     */
    public function create()
    {
        return Inertia::render('organizer/events/create', [
            'event' => null,
        ]);
    }

    /**
     * Store a newly created event in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        abort_if(!$organizer, 403, 'User is not an organizer');

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'start_time' => 'required|date_format:Y-m-d\TH:i',
            'end_time' => 'required|date_format:Y-m-d\TH:i|after:start_time',
            'banner' => 'nullable|url',
        ]);

        $event = Event::create([
            'organizer_id' => $organizer->id,
            ...$validated,
        ]);

        return redirect()->route('organizer.events.show', $event)->with('success', 'Event created successfully');
    }

    /**
     * Display the specified event.
     */
    public function show($eventId)
    {
        $user = Auth::user();
        $organizer = $user->organizer;
        $event = Event::with([
            'venue',
            'sections.seats',
            'organizer.user',
            'ticketCategories',
        ])->where('id', $eventId)->firstOrFail();

        abort_if($event->organizer_id != $organizer?->id, 403);

        $event->load(['venue', 'sections.seats', 'organizer.user', 'ticketCategories']);
        $ticketCategories = TicketCategory::where('event_id', $event->id)->get();

        $eventSeats = $event->seats()->with('eventSection')->paginate(100);

        $participants = Order::where('event_id', $event->id)
            ->with([
                'user.company',
                'items.seat',
                'items.participant.user',
                'items.participant.seat.eventSection',
                'items.company',
            ])
            ->paginate(100)
            ->withQueryString()
            ->through(function ($order) {
                $order->participant_count = $order->items->sum(function ($item) {
                    return $item->participant->count();
                });
                return $order;
            });


        return Inertia::render('organizer/events/show', [
            'event' => $event,
            'ticketCategories' => $ticketCategories,
            'participants' => $participants,
            'eventSeats' => $eventSeats,
            'eventSections' => $event->sections,
        ]);
    }

    /**
     * Show the form for editing the specified event.
     */
    public function edit($eventId)
    {
        $user = Auth::user();
        $organizer = $user->organizer;
        $event = Event::where('id', $eventId)->firstOrFail();

        abort_if($event->organizer_id != $organizer?->id, 403);

        $event->load(['venue', 'sections']);

        return Inertia::render('organizer/events/edit', [
            'event' => $event,
        ]);
    }

    /**
     * Update the specified event in storage.
     */
    public function update(Request $request, $eventId)
    {
        $user = $request->user();
        $organizer = $user->organizer;

        $event = Event::where('id', $eventId)->firstOrFail();

        abort_if($event->organizer_id != $organizer?->id, 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'start_time' => 'required|date_format:Y-m-d\TH:i',
            'end_time' => 'required|date_format:Y-m-d\TH:i|after:start_time',
            'banner' => 'nullable|url',
        ]);

        $event->update($validated);

        return redirect()->route('organizer.events.show', $event)->with('success', 'Event updated successfully');
    }

    /**
     * Remove the specified event from storage.
     */
    public function destroy($eventId)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        $event = Event::where('id', $eventId)->firstOrFail();

        abort_if($event->organizer_id != $organizer?->id, 403);

        $event->delete();

        return redirect()->route('organizer.events.index')->with('success', 'Event deleted successfully');
    }
}
