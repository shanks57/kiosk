<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Delete an order
     */
    public function destroy(Event $event, Order $order)
    {
        $user = Auth::user();
        $organizer = $user->organizer;

        // Verify organizer authorization
        abort_if($event->organizer_id != $organizer?->id, 403);
        abort_if($order->event_id != $event->id, 404);

        // Delete order and all related participants
        $order->delete();

        return response()->json(['message' => 'Order deleted successfully'], 200);
    }
}
