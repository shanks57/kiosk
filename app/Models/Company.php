<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'company_logo',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
