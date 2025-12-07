import { EventCard } from '@/components/molecules/event/event-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import { EventType, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
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
            <div className="min-h-screen w-full bg-white text-gray-900">
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
                <section className="mx-auto max-w-7xl px-6 py-10">
                    <div className="flex items-center justify-between rounded-2xl bg-primary p-10 text-white shadow-lg">
                        <div>
                            <h2 className="mb-3 text-2xl font-semibold">
                                Start your own event.
                                <br />
                                and Manage it Right Now.
                            </h2>
                            <Button className="bg-white text-primary hover:bg-gray-100">
                                Create Event
                            </Button>
                        </div>
                        <img
                            src="/banner-guy.png"
                            alt="banner"
                            className="hidden w-48 md:block"
                        />
                    </div>
                </section>

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
