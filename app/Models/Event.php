<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'organizer_id',
        'title',
        'description',
        'start_time',
        'end_time',
        'banner',
    ];

    public function organizer()
    {
        return $this->belongsTo(Organizer::class);
    }

    public function venue()
    {
        return $this->hasOne(EventVenue::class);
    }

    public function sections()
    {
        return $this->hasMany(EventSection::class);
    }

    public function seats()
    {
        return $this->hasManyThrough(
            EventSeat::class,
            EventSection::class,
            'event_id',
            'event_section_id'
        );
    }

    public function orders()
    {
        return $this->hasMany(\App\Models\Order::class);
    }

    public function ticketCategories()
    {
        return $this->hasMany(TicketCategory::class);
    }
}
