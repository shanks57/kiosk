<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OtpCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'code',
        'type',
        'attempts',
        'verified',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'verified' => 'boolean',
        ];
    }

    public static function generateCode(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    public static function createForEmail(string $email, string $type = 'login'): self
    {
        // Delete any existing unverified codes for this email
        static::where('email', $email)
            ->where('type', $type)
            ->where('verified', false)
            ->delete();

        return static::create([
            'email' => $email,
            'code' => static::generateCode(),
            'type' => $type,
            'attempts' => 0,
            'verified' => false,
            'expires_at' => now()->addMinutes(10),
        ]);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isValid(): bool
    {
        return !$this->isExpired() && !$this->verified && $this->attempts < 5;
    }

    public function incrementAttempts(): void
    {
        $this->increment('attempts');
    }
}
