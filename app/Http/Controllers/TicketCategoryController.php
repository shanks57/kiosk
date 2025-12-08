<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\TicketCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TicketCategoryController extends Controller
{

    public function store(Request $request, Event $event)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quota' => 'nullable|integer|min:0',
        ]);

        $validated['event_id'] = $event->id;

        TicketCategory::create($validated);

        return redirect()->back()->with('success', 'Ticket category created');
    }

    public function update(Request $request, Event $event, TicketCategory $category)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quota' => 'nullable|integer|min:0',
        ]);

        $category->update($validated);

        return redirect()->back()->with('success', 'Ticket category updated');
    }

    public function destroy(Event $event, TicketCategory $category)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        $category->delete();

        return redirect()->route('organizer.events.ticket-categories.index', $event)->with('success', 'Ticket category deleted');
    }
}
