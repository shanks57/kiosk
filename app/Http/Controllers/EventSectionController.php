<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventSectionController extends Controller
{
    public function store(Request $request, Event $event)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        abort_if($event->organizer_id != $organizer?->id, 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'color' => 'nullable|string|max:7',
        ]);

        $validated['event_id'] = $event->id;

        EventSection::create($validated);

        return redirect()->back()->with('success', 'Event section created');
    }

    public function update(Request $request, Event $event, EventSection $section)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        abort_if($event->organizer_id != $organizer?->id, 403);

        // Verify section belongs to event
        abort_if($section->event_id != $event->id, 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'color' => 'nullable|string|max:7',
        ]);

        $section->update($validated);

        return redirect()->back()->with('success', 'Event section updated');
    }

    public function destroy($eventId, $sectionId)
    {
        $event = Event::findOrFail($eventId);
        $section = EventSection::findOrFail($sectionId);
        $user = Auth::user();
        $organizer = $user->organizer;


        abort_if($event->organizer_id != $organizer?->id, 403);

        // Verify section belongs to event
        abort_if($section->event_id != $event->id, 403);

        $section->delete();

        Event::deleting(function ($event) {
            dd('EVENT DELETED', debug_backtrace());
        });

        return redirect()->back()->with('success', 'Event section deleted');
    }
}
