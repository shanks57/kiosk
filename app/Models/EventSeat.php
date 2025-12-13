<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventSeat extends Model
{
    protected $fillable = [
        'event_section_id',
        'row_number',
        'seat_number',
        'status',
    ];

    /**
     * Get the event section that owns the seat.
     */
    public function eventSection(): BelongsTo
    {
        return $this->belongsTo(EventSection::class);
    }
}
