<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckinController extends Controller
{
    /**
     * Show QR scanner page (public)
     */
    public function scan()
    {
        return Inertia::render('checkin/scan');
    }

    /**
     * Show manual code input page (public)
     */
    public function manual()
    {
        return Inertia::render('checkin/manual');
    }

    public function participant($code)
    {

        $item = OrderItem::where('booking_code', $code)
            ->with(['order.event', 'order.user', 'seat', 'category', 'company', 'participant'])
            ->first();

        return response()->json(['item' => $item]);
    }

    /**
     * Process check-in by code (POST)
     * Accepts 'code' parameter. This controller will attempt to
     * find an OrderItem by id matching numeric codes. If found,
     * it returns success JSON. (Customize logic to your project's
     * real QR/code format as needed.)
     */
    public function check(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $code = $request->input('code');

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

        $item->attendance_status = 'checked-in';
        $item->save();

        return redirect()->back()->with(['message' => 'Check-in successful', 'item' => $item]);
    }
}
