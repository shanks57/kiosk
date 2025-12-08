import { EventCard } from '@/components/molecules/event/event-card';
import PublicHeaderLayout from '@/layouts/app/public-header-layout';
import { EventType, PaginationType } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';

export default function Events(props: { events: PaginationType<EventType> }) {
    const { events } = props;
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <PublicHeaderLayout />

            <div className="min-h-screen w-full bg-white dark:bg-black/90 text-gray-900">
                {/* Hero Section */}

                {/* Nearest Events */}
                <section className="mx-auto max-w-7xl px-6 py-16 bg-white dark:bg-black/90 text-gray-900 dark:text-gray-500">
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
                        {events.data.map((event) => (
                            <EventCard key={event.id} data={event} />
                        ))}
                    </div>
                </section>

                {/* Featured Events */}
                <section className="mx-auto max-w-7xl px-6 py-16 bg-white dark:bg-black/90 text-gray-900 dark:text-gray-500">
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
                        {events.data.map((event) => (
                            <EventCard key={event.id} data={event} />
                        ))}
                    </div>
                </section>

                <footer className="mt-10 border-t py-10 text-center text-sm text-gray-500">
                    © 2025 TRONticket. All rights reserved.
                </footer>
            </div>
        </>
    );
}
