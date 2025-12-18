import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPSlot } from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface OtpVerifyProps {
    email: string;
    type: 'login' | 'register';
    errors?: Record<string, string>;
}

export default function OtpVerify({
    email,
    type,
}: OtpVerifyProps & SharedData) {
    const { errors } = usePage().props;
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post('/auth/otp-verify', {
            email,
            code,
            type,
        });
    };

    const handleResend = () => {
        router.post('/auth/otp-resend', {
            email,
            type,
        });
    };

    return (
        <AuthLayout
            title={type === 'login' ? 'Enter Code' : 'Verify Registration OTP'}
            description={`Check your email, we already sent code to ${email}`}
        >
            <Head
                title={
                    type === 'login' ? 'Verify Login' : 'Verify Registration'
                }
            />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <InputOTP
                            id="code"
                            type="text"
                            name="code"
                            value={code}
                            onChange={(e) => setCode(e)}
                            maxLength={6}
                            autoFocus
                            required
                            disabled={isSubmitting}
                            className="mx-auto flex justify-center text-center font-mono text-2xl tracking-widest"
                        >
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTP>

                        <InputError message={errors?.code} />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || code.length !== 6}
                    >
                        {isSubmitting && <Spinner />}
                        Verify
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    <p className="mb-3">Didn't receive the code?</p>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleResend}
                        disabled={isSubmitting}
                        className="w-fit"
                    >
                        Resend OTP
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
