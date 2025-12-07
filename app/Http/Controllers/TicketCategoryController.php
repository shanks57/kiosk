<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\TicketCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TicketCategoryController extends Controller
{
    public function index(Event $event)
    {
        $user = Auth::user();
        $organizer = $user->organizer;
        abort_if($event->organizer_id !== $organizer?->id, 403);

        $categories = TicketCategory::where('event_id', $event->id)->get();

        return Inertia::render('organizer/events/ticket-categories/index', [
            'event' => $event,
            'categories' => $categories,
        ]);
    }

    public function create(Event $event)
    {
        $user = Auth::user();
        $organizer = $user->organizer;
        abort_if($event->organizer_id !== $organizer?->id, 403);

        return Inertia::render('organizer/events/ticket-categories/create', [
            'event' => $event,
        ]);
    }

    public function store(Request $request, Event $event)
    {
        $user = Auth::user();
        $organizer = $user->organizer;
        abort_if($event->organizer_id !== $organizer?->id, 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quota' => 'nullable|integer|min:0',
        ]);

        $validated['event_id'] = $event->id;

        TicketCategory::create($validated);

        return redirect()->route('organizer.events.ticket-categories.index', $event)->with('success', 'Ticket category created');
    }

    public function edit(Event $event, TicketCategory $category)
    {
        $user = Auth::user();
        $organizer = $user->organizer;
        abort_if($event->organizer_id !== $organizer?->id, 403);
        abort_if($category->event_id !== $event->id, 404);

        return Inertia::render('organizer/events/ticket-categories/edit', [
            'event' => $event,
            'category' => $category,
        ]);
    }

    public function update(Request $request, Event $event, TicketCategory $category)
    {
        $user = Auth::user();
        $organizer = $user->organizer;
        abort_if($event->organizer_id !== $organizer?->id, 403);
        abort_if($category->event_id !== $event->id, 404);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quota' => 'nullable|integer|min:0',
        ]);

        $category->update($validated);

        return redirect()->route('organizer.events.ticket-categories.index', $event)->with('success', 'Ticket category updated');
    }

    public function destroy(Event $event, TicketCategory $category)
    {
        $user = Auth::user();
        $organizer = $user->organizer;
        abort_if($event->organizer_id !== $organizer?->id, 403);
        abort_if($category->event_id !== $event->id, 404);

        $category->delete();

        return redirect()->route('organizer.events.ticket-categories.index', $event)->with('success', 'Ticket category deleted');
    }
}
