import { EventCard } from '@/components/molecules/event/event-card';
import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import { EventType, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Array<EventType>>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const debounceRef = useRef<number | null>(null);
    const fetchControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        // clear previous timer
        if (debounceRef.current) {
            window.clearTimeout(debounceRef.current);
        }

        if (!query || query.trim().length === 0) {
            setSuggestions([]);
            setIsLoadingSuggestions(false);
            return;
        }

        setIsLoadingSuggestions(true);

        debounceRef.current = window.setTimeout(async () => {
            // abort previous fetch
            if (fetchControllerRef.current) {
                fetchControllerRef.current.abort();
            }
            fetchControllerRef.current = new AbortController();
            try {
                const res = await fetch(
                    `/api/events/suggestions?q=${encodeURIComponent(query)}`,
                    { signal: fetchControllerRef.current.signal },
                );

                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await res.json();
                if (Array.isArray(data)) {
                    setSuggestions(data.slice(0, 6));
                } else {
                    // fallback to local filtering
                    const combined = [...nearestEvents, ...featuredEvent];
                    const normalized = query.toLowerCase();
                    const filtered = combined
                        .filter((ev) => {
                            const label =
                                (ev as any).title ||
                                (ev as any).name ||
                                (ev as any).event_name ||
                                ((ev as any).venue && (ev as any).venue.name) ||
                                '';
                            return label.toLowerCase().includes(normalized);
                        })
                        .filter(
                            (v, i, a) =>
                                a.findIndex((x) => x.id === v.id) === i,
                        )
                        .slice(0, 6);
                    setSuggestions(filtered);
                }
            } catch (e: any) {
                if (e.name === 'AbortError') {
                    return;
                }
                // fallback to local filtering on error
                const combined = [...nearestEvents, ...featuredEvent];
                const normalized = query.toLowerCase();
                const filtered = combined
                    .filter((ev) => {
                        const label =
                            (ev as any).title ||
                            (ev as any).name ||
                            (ev as any).event_name ||
                            ((ev as any).venue && (ev as any).venue.name) ||
                            '';
                        return label.toLowerCase().includes(normalized);
                    })
                    .filter(
                        (v, i, a) => a.findIndex((x) => x.id === v.id) === i,
                    )
                    .slice(0, 6);
                setSuggestions(filtered);
            } finally {
                setIsLoadingSuggestions(false);
            }
        }, 300);

        return () => {
            if (debounceRef.current) {
                window.clearTimeout(debounceRef.current);
            }
            if (fetchControllerRef.current) {
                fetchControllerRef.current.abort();
            }
        };
    }, [query, nearestEvents, featuredEvent]);

    return (
        <PublicLayout title="Welcome">
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="relative min-h-screen w-full bg-white text-gray-900 dark:bg-black/90 dark:text-gray-500">
                {/* Hero Section */}
                {isFocused && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50"
                        onMouseDown={() => setIsFocused(false)}
                    />
                )}

                {/* ================= HERO ================= */}
                <section className="flex min-h-[374px] flex-col items-center justify-center bg-primary bg-[url('/images/hero.png')] bg-cover bg-[center_35%] pt-28 pb-20 text-white">
                    <div className="mx-auto my-auto max-w-7xl px-6 text-center">
                        <h1 className="mb-4 text-4xl">
                            Discover and book events effortlessly.
                        </h1>
                        <p className="mb-10 text-lg opacity-90">
                            Concerts, conferences, festivals — all in one place
                        </p>

                        {/* ================= SEARCH ================= */}
                        <div className="relative isolate z-50 mx-auto max-w-xl">
                            <Input
                                value={query}
                                placeholder="Search event name, category, or venue..."
                                className="h-12 rounded-full bg-white pr-12 pl-6 text-gray-900 shadow-lg"
                                onFocus={() => setIsFocused(true)}
                                onChange={(e) => setQuery(e.target.value)}
                            />

                            <Search
                                className="absolute top-3.5 right-4 text-gray-500"
                                size={20}
                            />

                            {isFocused && suggestions.length > 0 && (
                                <div className="absolute right-0 left-0 z-50 mt-2 w-full rounded-lg bg-white shadow-lg dark:bg-gray-800">
                                    <ul className="max-h-64 overflow-auto text-left">
                                        {suggestions.map((item) => {
                                            const label =
                                                (item as any).title ||
                                                (item as any).name ||
                                                (item as any).event_name ||
                                                ((item as any).venue &&
                                                    (item as any).venue.name) ||
                                                'Untitled Event';
                                            return (
                                                <li
                                                    key={item.id}
                                                    className="border-b last:border-b-0"
                                                >
                                                    <a
                                                        href={`/events/${item.id}`}
                                                        onMouseDown={() => {
                                                            // ensure navigation happens before blur hides suggestions
                                                            window.location.href = `/events/${item.id}`;
                                                        }}
                                                        className="block w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="truncate">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                    {label}
                                                                </div>
                                                                {((item as any)
                                                                    .start_time ||
                                                                    (
                                                                        item as any
                                                                    )
                                                                        .venue) && (
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {((
                                                                            item as any
                                                                        )
                                                                            .start_time &&
                                                                            new Date(
                                                                                (
                                                                                    item as any
                                                                                ).start_time,
                                                                            ).toLocaleString()) ||
                                                                            ((
                                                                                item as any
                                                                            )
                                                                                .venue &&
                                                                                (
                                                                                    item as any
                                                                                )
                                                                                    .venue
                                                                                    .name)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="ml-4 text-xs text-primary">
                                                                View
                                                            </div>
                                                        </div>
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl overflow-hidden lg:overflow-visible px-6 py-16">
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
                    <Carousel>
                        <CarouselContent showOverflow>
                            {nearestEvents.map((data) => (
                                <CarouselItem
                                    className="rounded-lg md:basis-1/3 lg:basis-1/5"
                                    key={data.id}
                                >
                                    <EventCard data={data} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </section>

                {/* Create Event Banner */}
                <div className="flex w-full items-center justify-center px-6 py-10">
                    <div className="grid h-64 w-full max-w-7xl grid-cols-4 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/50 to-primary shadow-lg lg:col-span-3 dark:from-primary-foreground/50 dark:to-primary-foreground">
                        {/* Left Illustration Placeholder */}
                        <div className="col-span-2 flex items-center justify-center p-6 lg:col-span-2">
                            <div className="bg-opacity-30 h-48 w-48 rounded-xl bg-blue-200"></div>
                        </div>

                        {/* Right Content */}
                        <div className="col-span-2 flex flex-col justify-center space-y-4 p-4 text-white lg:col-span-2 lg:p-10">
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
                <section className="mx-auto max-w-7xl overflow-hidden lg:overflow-visible px-6 py-16">
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

                    <Carousel>
                        <CarouselContent showOverflow>
                            {nearestEvents.map((data) => (
                                <CarouselItem
                                    className="rounded-lg md:basis-1/3 lg:basis-1/5"
                                    key={data.id}
                                >
                                    <EventCard data={data} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </section>
            </div>
        </PublicLayout>
    );
}
