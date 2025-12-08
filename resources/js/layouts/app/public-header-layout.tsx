import { Button } from '@/components/ui/button';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export default function PublicHeaderLayout({}: PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[];
}>) {
    const { auth } = usePage<SharedData>().props;
    return (
        <>
            <header className="z-50 w-full border-b border-gray-200 bg-white dark:bg-slate-300">
                <div className="bg-primary dark:bg-black/90">
                    <nav className="mx-auto flex max-w-7xl items-center justify-end gap-8 px-6 py-3">
                        <Link
                            href="/events"
                            className="text-sm text-white transition hover:text-secondary"
                        >
                            Browse Events
                        </Link>
                        <a
                            href="/about"
                            className="text-sm text-white transition hover:text-secondary"
                        >
                            About
                        </a>
                        <a
                            href="/help"
                            className="text-sm text-white transition hover:text-secondary"
                        >
                            Help
                        </a>
                    </nav>
                </div>
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-2 text-xl font-semibold">
                        <Link href="/">
                            <img src="/assets/logo.svg" alt="tron-logo" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        {!auth.user ? (
                            <>
                                <Link href="/register">
                                    <Button className='dark:text-gray-700 dark:hover:bg-primary' variant="ghost">Daftar</Button>
                                </Link>
                                <Link href="/login">
                                    <Button className="bg-primary text-white hover:bg-primary/90 dark:bg-primary-foreground">
                                        Masuk
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <Link href="/dashboard">
                                <Button className="bg-primary text-white hover:bg-primary/90 dark:bg-primary-foreground">
                                    Dashboard
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}
