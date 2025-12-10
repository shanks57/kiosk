<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'event_id',
        'status',
        'total_amount',
        'ticket_code',
        'attendance_status',
    ];

    protected static function booted()
    {
        static::creating(function ($order) {
            // Generate unique ticket_code (10 chars alnum)
            if (empty($order->ticket_code)) {
                do {
                    $code = Str::random(10);
                } while (self::where('ticket_code', $code)->exists());
                $order->ticket_code = $code;
            }

            if (! isset($order->attendance_status) || $order->attendance_status === null) {
                $order->attendance_status = 'absent';
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
