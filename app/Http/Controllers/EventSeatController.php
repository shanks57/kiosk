<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventSeat;
use App\Models\EventSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventSeatController extends Controller
{
    public function index(Event $event)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        abort_if($event->organizer_id != $organizer?->id, 403);

        $seats = $event->seats()->with('eventSection')->paginate(100);

        return Inertia::render('organizer/events/show', [
            'event' => $event,
            'eventSeats' => $seats,
            'eventSections' => $event->sections,
        ]);
    }

    public function store(Request $request, Event $event)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        abort_if($event->organizer_id != $organizer?->id, 403);

        $validated = $request->validate([
            'event_section_id' => 'required|exists:event_sections,id',
            'row_number' => 'required|integer|min:1',
            'seat_number' => 'required|integer|min:1',
            'status' => 'required|in:available,locked,booked',
        ]);

        // Verify section belongs to event
        $section = EventSection::where('id', $validated['event_section_id'])
            ->where('event_id', $event->id)
            ->firstOrFail();

        EventSeat::create($validated);

        return redirect()->back()->with('success', 'Event seat created');
    }

    public function update(Request $request, Event $event, EventSeat $seat)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        abort_if($event->organizer_id != $organizer?->id, 403);

        // Verify seat belongs to event
        $eventSection = EventSection::where('id', $seat->event_section_id)
            ->where('event_id', $event->id)
            ->firstOrFail();

        $validated = $request->validate([
            'event_section_id' => 'required|exists:event_sections,id',
            'row_number' => 'required|integer|min:1',
            'seat_number' => 'required|integer|min:1',
            'status' => 'required|in:available,locked,booked',
        ]);

        // Verify new section belongs to event
        $newSection = EventSection::where('id', $validated['event_section_id'])
            ->where('event_id', $event->id)
            ->firstOrFail();

        $seat->update($validated);

        return redirect()->back()->with('success', 'Event seat updated');
    }

    public function destroy(Event $event, EventSeat $seat)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        abort_if($event->organizer_id != $organizer?->id, 403);

        // Verify seat belongs to event
        $eventSection = EventSection::where('id', $seat->event_section_id)
            ->where('event_id', $event->id)
            ->firstOrFail();

        $seat->delete();

        return redirect()->back()->with('success', 'Event seat deleted');
    }
}
