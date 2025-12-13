<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    /** @use HasFactory<\Database\Factories\ParticipantFactory> */
    use HasFactory;

    protected $fillable = [
        'order_item_id',
        'event_id',
        'event_date',
        'user_id',
        'seat_id',
        'company_id',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'datetime',
        ];
    }

    /**
     * Get the order item this participant belongs to.
     */
    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }

    /**
     * Get the event for this participant.
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the user (participant person) for this entry.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the seat assigned to this participant.
     */
    public function seat()
    {
        return $this->belongsTo(EventSeat::class, 'seat_id');
    }

    /**
     * Get the company for this participant.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
