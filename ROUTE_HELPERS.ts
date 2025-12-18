// Add these route helpers to your TypeScript routes file (e.g., resources/js/routes.ts or resources/js/routes/index.ts)

export function authSendLoginOtp(): string {
    return route('auth.send-login-otp');
}

export function authSendRegisterOtp(): string {
    return route('auth.send-register-otp');
}

export function authOtpVerify(): string {
    return route('auth.otp-verify');
}

export function authOtpResend(): string {
    return route('auth.otp-resend');
}

export function authRegisterComplete(email: string): string {
    return route('auth.register-complete', { email });
}
