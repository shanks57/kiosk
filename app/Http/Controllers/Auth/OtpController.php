<?php

namespace App\Http\Controllers\Auth;

use App\Mail\SendOtpCode;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class OtpController extends Controller
{
    public function sendLoginOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $email = $request->email;

        // Create OTP
        $otpCode = OtpCode::createForEmail($email, 'login');

        // Send OTP via email
        Mail::to($email)->send(new SendOtpCode($otpCode));

        return redirect()->route('auth.otp-verify', ['email' => $email, 'type' => 'login']);
    }

    public function sendRegisterOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
        ]);

        $email = $request->email;

        // Create OTP
        $otpCode = OtpCode::createForEmail($email, 'register');

        // Send OTP via email
        Mail::to($email)->send(new SendOtpCode($otpCode));

        return redirect()->route('auth.otp-verify', ['email' => $email, 'type' => 'register']);
    }

    public function showVerifyForm(Request $request)
    {
        $email = $request->query('email');
        $type = $request->query('type', 'login');

        if (!$email) {
            return redirect()->route('login');
        }

        return Inertia::render('auth/otp-verify', [
            'email' => $email,
            'type' => $type,
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'type' => 'required|in:login,register',
        ]);

        $otpCode = OtpCode::where('email', $request->email)
            ->where('type', $request->type)
            ->where('verified', false)
            ->latest()
            ->first();

        if (!$otpCode) {
            return back()->withErrors(['code' => 'OTP not found or already used.']);
        }

        if (!$otpCode->isValid()) {
            return back()->withErrors(['code' => 'OTP is expired or invalid.']);
        }

        if ($otpCode->code !== $request->code) {
            $otpCode->incrementAttempts();
            return back()->withErrors(['code' => 'Invalid OTP code.']);
        }

        // Mark OTP as verified
        $otpCode->update(['verified' => true]);

        if ($request->type === 'login') {
            return $this->completeLogin($request->email);
        } else {
            // Redirect to complete registration
            return redirect()->route('auth.register-complete', ['email' => $request->email]);
        }
    }

    private function completeLogin(string $email)
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return redirect()->route('login')->withErrors(['email' => 'User not found.']);
        }

        Auth::login($user);

        return redirect()->intended(route('dashboard'));
    }

    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'type' => 'required|in:login,register',
        ]);

        $type = $request->type;
        $email = $request->email;

        // Create new OTP
        $otpCode = OtpCode::createForEmail($email, $type);

        // Send OTP via email
        Mail::to($email)->send(new SendOtpCode($otpCode));

        return back()->with('status', 'OTP resent successfully.');
    }
}
