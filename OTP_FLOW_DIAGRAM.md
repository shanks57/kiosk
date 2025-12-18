# OTP Authentication Flow Diagram

## Login Flow

```
┌─────────────────────────────────────────────────────────────┐
│ LOGIN PAGE (/login)                                         │
│ - Email input field                                          │
│ - "Send OTP" button                                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /auth/send-login-otp                                   │
│ - Validate email exists in users table                      │
│ - Generate 6-digit OTP                                      │
│ - Save to otp_codes table (type: 'login')                   │
│ - Send email with OTP                                       │
│ - Redirect to /auth/otp-verify                              │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ OTP VERIFICATION PAGE (/auth/otp-verify)                   │
│ - Display email address                                     │
│ - OTP input field (6 digits)                                │
│ - "Verify OTP" button                                       │
│ - "Resend OTP" button                                       │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /auth/otp-verify                                       │
│ - Validate OTP code format (6 digits)                       │
│ - Check OTP exists and not expired                          │
│ - Check verification attempts < 5                           │
│ - Compare submitted code with stored code                   │
│ - If invalid: increment attempts, show error                │
│ - If valid: mark OTP as verified                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ LOGIN COMPLETION                                             │
│ - Find user by email                                        │
│ - Login user via Auth::login()                              │
│ - Redirect to /dashboard                                    │
└─────────────────────────────────────────────────────────────┘
```

## Registration Flow

```
┌─────────────────────────────────────────────────────────────┐
│ REGISTRATION PAGE (/register)                               │
│ - Email input field                                          │
│ - "Send OTP" button                                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /auth/send-register-otp                                │
│ - Validate email not exists in users table                  │
│ - Generate 6-digit OTP                                      │
│ - Save to otp_codes table (type: 'register')                │
│ - Send email with OTP                                       │
│ - Redirect to /auth/otp-verify                              │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ OTP VERIFICATION PAGE (/auth/otp-verify)                   │
│ - Display email address                                     │
│ - OTP input field (6 digits)                                │
│ - "Verify OTP" button                                       │
│ - "Resend OTP" button                                       │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /auth/otp-verify                                       │
│ - Validate OTP code format (6 digits)                       │
│ - Check OTP exists and not expired                          │
│ - Check verification attempts < 5                           │
│ - Compare submitted code with stored code                   │
│ - If invalid: increment attempts, show error                │
│ - If valid: mark OTP as verified                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ REGISTRATION COMPLETE PAGE                                  │
│ (/auth/register-complete?email=user@example.com)           │
│ - Email (disabled field)                                    │
│ - Name input field                                          │
│ - Password input field                                      │
│ - Confirm Password input field                              │
│ - "Create Account" button                                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ POST /auth/register-complete                                │
│ - Validate email, name, password                            │
│ - Check password confirmation match                         │
│ - Create user in users table                                │
│ - Attach 'user' role to new user                            │
│ - Trigger Registered event (for email verification etc)    │
│ - Login user via Auth::login()                              │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ DASHBOARD                                                    │
│ - Redirect to /dashboard                                    │
│ - User is authenticated and ready to use the app            │
└─────────────────────────────────────────────────────────────┘
```

## Database: OTP Codes Table

```
┌──────────────────────────────────────────────────────────────┐
│ otp_codes                                                    │
├──────────────────────────────────────────────────────────────┤
│ id               INT PRIMARY KEY                             │
│ email            VARCHAR - Email address                     │
│ code             VARCHAR - 6-digit OTP (e.g., "123456")     │
│ type             VARCHAR - 'login' or 'register'             │
│ attempts         INT - Number of verification attempts       │
│ verified         BOOLEAN - Has this OTP been verified?       │
│ expires_at       TIMESTAMP - When OTP expires (10 min)       │
│ created_at       TIMESTAMP - Creation time                   │
│ updated_at       TIMESTAMP - Last update time                │
│                                                               │
│ Indexes:                                                      │
│ - (email, type)   - Find OTP by email and type               │
│ - expires_at      - Find expired OTPs for cleanup            │
└──────────────────────────────────────────────────────────────┘
```

## OTP Code Lifecycle

```
GENERATION
│
├─ Delete existing unverified OTPs for this email/type
│
├─ Generate random 6-digit code
│
├─ Create record in otp_codes table
│  └─ type: 'login' or 'register'
│  └─ attempts: 0
│  └─ verified: false
│  └─ expires_at: now() + 10 minutes
│
├─ Send email with OTP code
│
└─ Redirect user to OTP verification page


VERIFICATION (User enters code)
│
├─ Find OTP record by (email, type, verified=false)
│
├─ Check if OTP is still valid (not expired)
│
├─ Check if attempts < 5
│
├─ Compare submitted code with stored code
│  │
│  ├─ If INVALID:
│  │  ├─ Increment attempts
│  │  └─ Show error: "Invalid OTP code"
│  │
│  └─ If VALID:
│     ├─ Mark OTP as verified: true
│     ├─ Complete login OR redirect to register-complete
│     └─ User is authenticated


CLEANUP
│
├─ When new OTP generated: Delete old unverified ones
│
├─ Optionally: Delete expired OTPs older than certain date
│
└─ OTP stays in DB as record of activity
```
