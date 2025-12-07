<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    /**
     * Store a new participant for an event.
     */
    public function store(Request $request, Event $event)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'ticket_category_id' => 'required|exists:ticket_categories,id',
        ]);

        $user = Auth::user();
        $organizer = $user->organizer;

        // Verify organizer owns this event
        if ($event->organizer_id !== $organizer->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        // Create or find user by email
        $participant = User::firstOrCreate(
            ['email' => $validated['email']],
            [
                'name' => $validated['name'],
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Create order
        $order = Order::create([
            'user_id' => $participant->id,
            'event_id' => $event->id,
            'status' => 'paid',
            'total_amount' => 0,
        ]);

        // Create order item
        OrderItem::create([
            'order_id' => $order->id,
            'ticket_category_id' => $validated['ticket_category_id'],
            'price' => 0,
        ]);

        return response()->json([
            'message' => 'Participant added successfully',
            'participant' => $participant,
        ], 201);
    }

    /**
     * Display participants for an event.
     */
    public function index(Event $event)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        $participants = OrderItem::whereHas('order', function ($q) use ($event) {
            $q->where('event_id', $event->id);
        })
            ->with(['order.user', 'seat', 'category'])
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('organizer/participants/index', [
            'event' => $event,
            'participants' => $participants,
        ]);
    }

    public function destroy($eventId, $id)
    {

        $participant = OrderItem::where('id', $id)->firstOrFail();
        $order = $participant->order;
        $order->delete();
        $participant->delete();

        return response()->json([
            'message' => 'Participant deleted successfully',
        ], 200);
    }

    /**
     * Export participants list.
     */
    public function export(Event $event)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        $participants = OrderItem::whereHas('order', function ($q) use ($event) {
            $q->where('event_id', $event->id);
        })
            ->with(['order.user', 'seat', 'category'])
            ->get();

        // Generate CSV
        $csv = "Name,Email,Phone,Ticket Category,Seat,Order Date\n";
        foreach ($participants as $participant) {
            $csv .= sprintf(
                '"%s","%s","%s","%s","%s","%s"' . "\n",
                $participant->order->user->name ?? 'N/A',
                $participant->order->user->email ?? 'N/A',
                'N/A',
                $participant->category->name ?? 'N/A',
                $participant->seat ? sprintf('%s-%s', $participant->seat->row_number, $participant->seat->seat_number) : 'N/A',
                $participant->created_at->format('Y-m-d H:i')
            );
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="participants-' . $event->id . '.csv"');
    }
}
