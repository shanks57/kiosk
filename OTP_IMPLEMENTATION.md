# OTP Authentication Flow Implementation

## Overview

Modified the login and registration flows to use OTP (One-Time Password) authentication via email.

## New Authentication Flow

### Login Flow

1. User enters email on the login page
2. System sends OTP to the registered email address
3. User verifies OTP on the OTP verification page
4. Upon successful verification, user is logged in and redirected to dashboard

### Registration Flow

1. User enters email on the registration page
2. System sends OTP to the provided email address
3. User verifies OTP on the OTP verification page
4. Upon successful verification, user is redirected to registration completion page
5. User fills in name and password to complete registration
6. User is logged in and redirected to dashboard

## Files Created

### Backend

1. **Migration**: `database/migrations/2025_12_17_000000_create_otp_codes_table.php`
    - Creates `otp_codes` table with fields: email, code, type, attempts, verified, expires_at

2. **Model**: `app/Models/OtpCode.php`
    - Handles OTP generation and validation
    - Methods: `generateCode()`, `createForEmail()`, `isExpired()`, `isValid()`, `incrementAttempts()`

3. **Controller**: `app/Http/Controllers/Auth/OtpController.php`
    - Handles OTP sending for login and registration
    - `sendLoginOtp()`: Sends OTP for login
    - `sendRegisterOtp()`: Sends OTP for registration
    - `showVerifyForm()`: Shows OTP verification page
    - `verify()`: Verifies OTP code
    - `resendOtp()`: Resends OTP to user
    - `completeLogin()`: Completes login process after OTP verification

4. **Controller**: `app/Http/Controllers/Auth/RegisterCompleteController.php`
    - Handles registration completion after OTP verification
    - `store()`: Creates new user account with validated data

5. **Mailable**: `app/Mail/SendOtpCode.php`
    - Email notification for OTP codes
    - Uses customizable email template

6. **Email View**: `resources/views/emails/otp-code.blade.php`
    - HTML email template for OTP notification
    - Shows OTP code and expiration time

### Frontend

1. **Pages**: `resources/js/pages/auth/login.tsx`
    - Modified login page to accept only email
    - Sends OTP instead of password-based login

2. **Pages**: `resources/js/pages/auth/register.tsx`
    - Modified registration page to accept only email
    - Sends OTP for email verification

3. **Pages**: `resources/js/pages/auth/otp-verify.tsx`
    - New page for OTP verification
    - Shows OTP input field and resend button
    - Supports 6-digit OTP code

4. **Pages**: `resources/js/pages/auth/register-complete.tsx`
    - New page for completing registration after OTP verification
    - Collects name and password from user

## Routes

```php
// OTP Authentication Routes
POST   /auth/send-login-otp          - Send OTP for login
POST   /auth/send-register-otp       - Send OTP for registration
GET    /auth/otp-verify              - Show OTP verification form
POST   /auth/otp-verify              - Verify OTP code
POST   /auth/otp-resend              - Resend OTP
GET    /auth/register-complete       - Show registration completion form
POST   /auth/register-complete       - Complete registration
```

## Database

OTP codes table with the following fields:

- `id`: Primary key
- `email`: Email address for OTP
- `code`: 6-digit OTP code
- `type`: 'login' or 'register'
- `attempts`: Number of verification attempts
- `verified`: Boolean flag for OTP verification status
- `expires_at`: Expiration timestamp (10 minutes)
- `created_at`, `updated_at`: Timestamps

## OTP Settings

- **Code Length**: 6 digits
- **Expiration**: 10 minutes
- **Max Attempts**: 5 verification attempts
- **Email Delivery**: Uses configured mail driver

## Mail Configuration

Ensure your `.env` file has mail configuration set up:

```
MAIL_MAILER=smtp
MAIL_HOST=your_mail_server
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME="${APP_NAME}"
```

## Setup Instructions

1. **Run Migration**

    ```bash
    php artisan migrate
    ```

2. **Update Mail Configuration** in `.env` if not already configured

3. **Test the Flow**
    - Register: `/register` → Enter email → Verify OTP → Complete registration
    - Login: `/login` → Enter email → Verify OTP → Dashboard

## Security Features

- OTP codes are 6-digit random numbers
- Each OTP expires after 10 minutes
- Maximum 5 verification attempts per OTP
- Old/unverified OTPs are automatically deleted when new OTP is generated
- OTP marked as verified after successful verification to prevent reuse

## Error Handling

- Invalid OTP: Shows error message and allows retry
- Expired OTP: Prompts user to request new OTP
- Email not found (login): Shows error message
- Email already exists (register): Shows error message
- Max attempts exceeded: Shows error and prompts resend

## Notes

- The new authentication flow completely replaces password-based authentication for login and registration
- Users must have valid email addresses to complete login or registration
- OTP delivery depends on configured mail driver
- Consider implementing rate limiting on OTP endpoints in production
