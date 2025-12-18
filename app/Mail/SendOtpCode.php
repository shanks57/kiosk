<?php

namespace App\Mail;

use App\Models\OtpCode;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendOtpCode extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public OtpCode $otpCode) {}

    public function envelope(): Envelope
    {
        $subject = $this->otpCode->type === 'login' ? 'Your Login OTP Code' : 'Your Registration OTP Code';

        return new Envelope(
            subject: $subject,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.otp-code',
            with: [
                'code' => $this->otpCode->code,
                'type' => $this->otpCode->type,
                'expiresAt' => $this->otpCode->expires_at->format('Y-m-d H:i:s'),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
