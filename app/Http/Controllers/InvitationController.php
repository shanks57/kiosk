<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\TicketCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvitationController extends Controller
{
    /**
     * Display a listing of the events.
     */
    public function index($code)
    {
        $query = OrderItem::where('booking_code', $code)
            ->with(['order.event', 'order.user', 'seat', 'category', 'company', 'participant'])
            ->first();
        if (! $query) {
            return redirect()->back()->with(['message' => 'Ticket not found']);
        }
        return Inertia::render('invitation/index', [
            'item' => $query,
            'code' => $code
        ]);
    }

    /**
     * Display the specified event.
     */
    public function show($code)
    {
        $query = OrderItem::where('booking_code', $code)
            ->with(['order.event', 'order.user', 'seat', 'category', 'company', 'participant.user'])
            ->first();
        if (! $query) {
            return redirect()->back()->with(['message' => 'Ticket not found']);
        }
        return Inertia::render('invitation/detail', [
            'item' => $query,
            'code' => $code

        ]);
    }

    public function attendance(Request $request, $code)
    {
        // dd($code);
        // $request->validate([
        //     'code' => 'required|string',
        // ]);

        // $code = $request->input('code');

        $item = OrderItem::where('booking_code', $code)
            ->with('order')
            ->first();
        if (! $item) {
            return redirect()->back()->with(['message' => 'Invalid code or not found']);
        }

        $order = Order::find($item->order_id);
        if (! $order) {
            return redirect()->back()->with(['message' => 'Order not found']);
        }

        $order->last_checkin_time = now();
        $order->attendance_status = 'checked-in';
        $order->save();

        $item->status = 'checked-in';
        $item->save();

        return redirect()->back()->with(['message' => 'Check-in successful', 'item' => $item]);
    }
}
