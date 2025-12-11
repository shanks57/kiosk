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

        $item = Order::with(['user.company', 'event'])->where('ticket_code', $code)->first();
        if (! $item) {
            return redirect()->back()->with(['message' => 'Invalid code or not found']);
        }

        $item->attendance_status = 'checked-in';
        $item->save();

        // // Basic handling: if numeric, treat as order_item id
        // if (is_numeric($code)) {
        //     $item = OrderItem::find(intval($code));
        //     if (! $item) {
        //         return response()->json(['message' => 'Ticket not found'], 404);
        //     }

        //     // If your OrderItem has a check-in column, update it here.
        //     // Example: $item->checked_in_at = now(); $item->save();

        //     return response()->json(['message' => 'Check-in successful', 'item_id' => $item->id]);
        // }

        // // Otherwise, attempt other matching strategies
        // $item = OrderItem::where('ticket_code', $code)->first();
        // if (! $item) {
        //     return response()->json(['message' => 'Invalid code or not found'], 404);
        // }

        // $item->attendance_status = 'checked-in';
        // $item->save();

        return redirect()->back()->with(['message' => 'Check-in successful', 'item' => $item]);
    }
}
