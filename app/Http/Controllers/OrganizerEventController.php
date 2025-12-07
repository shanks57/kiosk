<?php

namespace App\Http\Controllers;

use App\Models\Event;
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
    public function show(Event $event)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        abort_if($event->organizer_id !== $organizer?->id, 403);

        $event->load(['venue', 'sections.seats', 'organizer.user', 'ticketCategories']);
        $ticketCategories = TicketCategory::where('event_id', $event->id)->get();

        $participants = OrderItem::whereHas('order', function ($q) use ($event) {
            $q->where('event_id', $event->id);
        })
            ->with(['order.user', 'seat', 'category'])
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('organizer/events/show', [
            'event' => $event,
            'ticketCategories' => $ticketCategories,
            'participants' => $participants,
        ]);
    }

    /**
     * Show the form for editing the specified event.
     */
    public function edit(Event $event)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        abort_if($event->organizer_id !== $organizer?->id, 403);

        $event->load(['venue', 'sections']);

        return Inertia::render('organizer/events/edit', [
            'event' => $event,
        ]);
    }

    /**
     * Update the specified event in storage.
     */
    public function update(Request $request, Event $event)
    {
        $user = $request->user();
        $organizer = $user->organizer;

        abort_if($event->organizer_id !== $organizer?->id, 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'start_time' => 'required|date_format:Y-m-d H:i',
            'end_time' => 'required|date_format:Y-m-d H:i|after:start_time',
            'banner' => 'nullable|url',
        ]);

        $event->update($validated);

        return redirect()->route('organizer.events.show', $event)->with('success', 'Event updated successfully');
    }

    /**
     * Remove the specified event from storage.
     */
    public function destroy(Event $event)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        abort_if($event->organizer_id !== $organizer?->id, 403);

        $event->delete();

        return redirect()->route('organizer.events.index')->with('success', 'Event deleted successfully');
    }
}
