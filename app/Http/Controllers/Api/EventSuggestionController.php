<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventSuggestionController extends Controller
{
    /**
     * Return a small list of event suggestions for the given query.
     *
     * GET /api/events/suggestions?q=keyword
     */
    public function suggestions(Request $request)
    {
        $q = (string) $request->query('q', '');

        if (trim($q) === '') {
            return response()->json([]);
        }

        $limit = (int) $request->query('limit', 10);

        $events = Event::with('venue')
            ->where(function ($builder) use ($q) {
                $like = "%{$q}%";
                $builder->where('title', 'like', $like)
                    ->orWhere('name', 'like', $like)
                    ->orWhere('event_name', 'like', $like)
                    ->orWhereHas('venue', function ($vb) use ($like) {
                        $vb->where('name', 'like', $like);
                    });
            })
            ->orderBy('start_time', 'asc')
            ->limit(max(1, min(50, $limit)))
            ->get([
                'id',
                'title',
                'name',
                'event_name',
                'start_time',
                'venue_id',
            ]);

        $mapped = $events->map(function ($e) {
            return [
                'id' => $e->id,
                'title' => $e->title,
                'name' => $e->name,
                'event_name' => $e->event_name,
                'start_time' => $e->start_time,
                'venue' => $e->venue ? ['name' => $e->venue->name] : null,
            ];
        });

        return response()->json($mapped->values());
    }
}
