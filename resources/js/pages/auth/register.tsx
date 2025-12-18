import { login } from '@/routes';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        router.post(
            '/auth/send-register-otp',
            { email },
            {
                onError: (errors) => {
                    setErrors(errors as Record<string, string>);
                    setIsSubmitting(false);
                },
            },
        );
    };

    return (
        <AuthLayout title="Daftar Akun Baru" description="">
            <Head title="Register" />
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="Enter email"
                            disabled={isSubmitting}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 w-full"
                        tabIndex={2}
                        disabled={isSubmitting}
                        data-test="register-user-button"
                    >
                        {isSubmitting && <Spinner />}
                        Send OTP
                    </Button>
                </div>

                <div className="text-center text-sm">
                    Sudah punya akun?{' '}
                    <TextLink
                        className="text-primary dark:text-primary-foreground"
                        href={login()}
                        tabIndex={3}
                    >
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
