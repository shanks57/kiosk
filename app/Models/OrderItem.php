<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'event_seat_id',
        'ticket_category_id',
        'price',
        'event_date',
        'company_id',
        'booking_code',
        'status',
    ];

    protected $casts = [
        'event_date' => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function ($item) {
            if (empty($item->booking_code)) {
                $item->booking_code = Str::random(10);
            }

            if (! isset($item->status) || $item->status === null) {
                if ($item->order && $item->order->status) {
                    $item->status = $item->order->status;
                } else {
                    $item->status = null;
                }
            }
        });
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function seat()
    {
        return $this->belongsTo(EventSeat::class, 'event_seat_id');
    }

    public function category()
    {
        return $this->belongsTo(TicketCategory::class, 'ticket_category_id');
    }

    public function participant()
    {
        return $this->hasMany(Participant::class, 'order_item_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
