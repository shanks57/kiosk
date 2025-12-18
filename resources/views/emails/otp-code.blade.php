<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
        <h2 style="color: #333; margin-top: 0;">{{ $type === 'login' ? 'Login Verification' : 'Registration Verification' }}</h2>

        <p style="color: #666; font-size: 14px;">
            {{ $type === 'login' ? 'Your login verification code is:' : 'Your registration verification code is:' }}
        </p>

        <div style="background-color: #fff; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0;">
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff; margin: 0;">
                {{ $code }}
            </p>
        </div>

        <p style="color: #666; font-size: 14px;">
            This code will expire at {{ $expiresAt }}.
        </p>

        <p style="color: #666; font-size: 14px;">
            If you did not request this code, please ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <p style="color: #999; font-size: 12px; text-align: center;">
            © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </p>
    </div>
</div>