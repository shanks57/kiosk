import { EventCard } from '@/components/molecules/event/event-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import { EventType, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, Search } from 'lucide-react';
import { useState } from 'react';

export default function Welcome({
    canRegister = true,
    nearestEvents,
    featuredEvent,
}: {
    canRegister?: boolean;
    nearestEvents: Array<EventType>;
    featuredEvent: Array<EventType>;
}) {
    const { auth } = usePage<SharedData>().props;
    const [isFocused, setIsFocused] = useState(false);

    return (
        <PublicLayout title="Welcome">
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            {isFocused && (
                <div className="fixed inset-0 z-10 bg-black opacity-50 transition-opacity duration-300 ease-in"></div>
            )}
            <div className="min-h-screen w-full bg-white dark:bg-black/90 text-gray-900 dark:text-gray-500">
                {/* Hero Section */}
                <section className="flex min-h-[374px] flex-col items-center justify-center bg-primary bg-gradient-to-b bg-[url('/images/hero.png')] from-primary to-primary/80 bg-cover bg-[center_35%] pt-28 pb-20 text-white">
                    <div className="mx-auto my-auto max-w-7xl px-6 text-center">
                        <h1 className="mb-4 text-4xl">
                            Discover and book events effortlessly.
                        </h1>
                        <p className="mb-10 text-lg opacity-90">
                            Concerts, conferences, festivals — all in one place
                        </p>
                        <div className="relative z-20 mx-auto max-w-2xl">
                            <Input
                                placeholder="Search event name, category, or venue..."
                                className="h-12 rounded-full bg-white pl-6 text-gray-900"
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            />
                            <Search
                                className="absolute top-3.5 right-4 text-gray-500"
                                size={20}
                            />
                        </div>
                    </div>
                </section>

                {/* Nearest Events */}
                <section className="mx-auto max-w-7xl px-6 py-16">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            The <span className="text-primary">nearest</span>{' '}
                            event
                        </h2>
                        <a
                            href="#"
                            className="hidden text-sm text-primary hover:underline md:inline-block"
                        >
                            See All{' '}
                            <ArrowUpRight
                                size={16}
                                className="ml-1 inline-block"
                            />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                        {/* Example Card */}
                        {nearestEvents.map((data) => (
                            <EventCard key={data.id} data={data} />
                        ))}
                    </div>
                </section>

                {/* Create Event Banner */}
                <div className="flex w-full items-center justify-center py-10">
                    <div className="grid h-64 w-full max-w-7xl grid-cols-4 lg:col-span-3 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/50 to-primary shadow-lg">
                        {/* Left Illustration Placeholder */}
                        <div className="flex col-span-2 lg:col-span-2 items-center justify-center p-6">
                            <div className="bg-opacity-30 h-48 w-48 rounded-xl bg-blue-200"></div>
                        </div>

                        {/* Right Content */}
                        <div className="flex col-span-2 lg:col-span-2 flex-col justify-center space-y-4 p-4 lg:p-10 text-white">
                            <h1 className="text-xl leading-tight lg:text-4xl">
                                Start your own event.
                                <br />
                                and Manage it Right Now.
                            </h1>
                            <Link href="/dashboard/events/create">
                                <Button
                                    variant="secondary"
                                    className="w-fit text-primary"
                                >
                                    Create Event
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Featured Events */}
                <section className="mx-auto max-w-7xl px-6 py-16">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            Featured Event
                        </h2>
                        <a
                            href="#"
                            className="hidden text-sm text-primary hover:underline md:inline-block"
                        >
                            See All{' '}
                            <ArrowUpRight
                                size={16}
                                className="ml-1 inline-block"
                            />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                        {featuredEvent.map((data, i) => (
                            <EventCard key={i} data={data} />
                        ))}
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
