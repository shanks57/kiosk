import { TicketCard } from '@/components/molecules/ticket/ticket-card';
import { TicketSelector } from '@/components/molecules/ticket/ticket-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PublicLayout from '@/layouts/public-layout';
import { formatRupiah } from '@/lib/utils';
import { EventType, TicketCategoryType } from '@/types';
import { Head, router } from '@inertiajs/react';
import dayjs from 'dayjs';

import { Calendar, Info, MapPin } from 'lucide-react';
import { useState } from 'react';

type EventDetailProps = {
    event: EventType;
    ticketCategories: TicketCategoryType[];
};

export default function EventDetail(props: EventDetailProps) {
    const { event, ticketCategories } = props;
    const [tickets, setTickets] = useState(
        Object.fromEntries(ticketCategories.map((tc) => [tc.name, 0])),
    );

    const handleChange = (type: keyof typeof tickets, value: number) => {
        setTickets((prev: typeof tickets) => ({
            ...prev,
            [type]: Math.max(0, prev[type] + value),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post('/event-checkout', {
            event_id: event.id,
            tickets,
        });
    };

    return (
        <PublicLayout>
            <Head title="Event Detail">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="relative h-[300px] w-full overflow-hidden">
                <img
                    src={
                        event.banner ||
                        'https://placehold.co/600x300?text=Event+Banner'
                    }
                    className="h-full w-full scale-110 object-cover blur-sm"
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-3">
                {/* LEFT: EVENT DETAILS */}
                <div className="lg:col-span-2">
                    <div className="p-6">
                        <h1 className="mb-2 text-2xl font-medium">
                            {event.title}
                        </h1>
                        <p className="mb-4 text-lg font-normal">
                            Indonesia's Largest User Experience Conference
                        </p>

                        <div className="space-y-2 text-base text-[#1E1E1E]">
                            <p className="flex items-center gap-2">
                                <Calendar size={16} />{' '}
                                {`${dayjs(event.start_time).format('DD')} - ${dayjs(event.end_time).format('DD MMMM YYYY, HH:mm')} WIB`}
                            </p>
                            <p className="flex items-center gap-2">
                                <MapPin size={16} /> Jakarta Convention Center,
                                Jakarta Selatan
                            </p>
                            <p className="flex items-center gap-2">
                                <Info size={16} /> Tech · Conference · UI/UX
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="desc" className="w-full p-6 pt-0">
                        <TabsList className="mb-4 flex w-full justify-start border-b bg-transparent p-0">
                            <TabsTrigger className="text-base" value="desc">
                                Event Description
                            </TabsTrigger>
                            <TabsTrigger className="text-base" value="agenda">
                                Agenda & Rundown
                            </TabsTrigger>
                            <TabsTrigger className="text-base" value="speakers">
                                Speakers
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value="desc"
                            className="flex w-full flex-col space-y-4 leading-relaxed"
                        >
                            <p>
                                Rich Brian is bringing his WHERE IS MY
                                HEAD? Tour to stages across Asia and beyond this
                                November and December! The six-date run will
                                kick off in Jakarta before heading to Taipei,
                                Singapore, Hong Kong, Manila and Honolulu.
                            </p>
                            <p>
                                The tour follows the release of Rich Brian’s
                                latest album WHERE IS MY HEAD? on August 15th -
                                his first full-length album since 2019 -
                                promising an unforgettable experience of fresh
                                music, fan favourites and connection with
                                audiences worldwide.
                            </p>
                            <p>
                                As part of the highly anticipated tour, Rich
                                Brian will perform live in Singapore on 3
                                December 2025 at The Theatre at Mediacorp.
                            </p>
                            <p>
                                Written and largely self-produced, WHERE IS MY
                                HEAD? showcases Brian’s pursuit of greater
                                artistic control and authenticity. Across 15
                                tracks, the album explores themes of heartbreak
                                and healing, ambition and alienation, memory and
                                self-reinvention. Featuring collaborations with
                                Toro y Moi, Charlotte Day Wilson, DAISY WORLD,
                                Ski Mask The Slump God, Kurtis Wells and
                                redveil, Brian reflects on the fallout of a
                                long-term relationship, the guilt of missing key
                                family milestones and his ongoing search for
                                identity while navigating life between cultures
                                and expectations
                            </p>
                            <Button
                                variant="ghost"
                                className="mx-auto cursor-pointer rounded-full text-primary"
                            >
                                Read More
                            </Button>
                        </TabsContent>

                        <TabsContent value="agenda">
                            Agenda goes here...
                        </TabsContent>
                        <TabsContent value="speakers">
                            Speakers go here...
                        </TabsContent>
                    </Tabs>

                    <div className="p-6">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <Info size={18} /> Ticket Information
                        </h2>

                        {/* Ticket Card */}
                        <div className="space-y-4">
                            <TicketCard
                                title="Regular Pass"
                                price="Rp150.000"
                            />
                            <TicketCard
                                title="Early Bird Pass"
                                price="Rp250.000"
                            />
                            <TicketCard
                                title="VIP Experience Pass"
                                price="Rp450.000"
                            />
                        </div>
                    </div>
                </div>
                {/* RIGHT: TICKET PURCHASE */}

                <div className="space-y-4">
                    {/* Punch Holes */}

                    <Card className="relative z-50 -mt-55 overflow-hidden rounded-xl border-none p-0 shadow-none">
                        <div className="absolute top-[42%] -left-3 z-60 h-6 w-6 rounded-full border border-gray-200 bg-white" />
                        <div className="absolute top-[42%] -right-3 z-60 h-6 w-6 rounded-full border border-gray-200 bg-white" />
                        <CardContent className="p-0">
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 border"
                            >
                                {/* Event Preview */}
                                <div className="h-45 w-full overflow-hidden rounded-t-lg">
                                    <img
                                        src={
                                            event.banner ||
                                            'https://placehold.co/600x300?text=Event+Banner'
                                        }
                                        alt="event-banner"
                                        className="h-45 w-full object-cover"
                                    />
                                </div>

                                <p className="mb-2 px-4 text-xl font-medium text-[#1E1E1E]">
                                    {event.title}
                                </p>
                                <p className="flex items-center gap-2 px-4 text-[#1E1E1E]">
                                    <Calendar size={14} />
                                    {`${dayjs(event.start_time).format('DD')} - ${dayjs(event.end_time).format('DD MMMM YYYY, HH:mm')} WIB`}
                                </p>

                                <div className="border-t-dashed-custom border-t px-2">
                                    <p className="mb-3 px-2 pt-4 font-medium">
                                        Ticket Options
                                    </p>
                                    {ticketCategories?.map((tc) => (
                                        <TicketSelector
                                            key={tc.name}
                                            title={tc.name || ''}
                                            price={formatRupiah(tc.price || 0)}
                                            count={
                                                tickets[tc.name as string] || 0
                                            }
                                            inc={() =>
                                                handleChange(
                                                    tc.name as string,
                                                    1,
                                                )
                                            }
                                            dec={() =>
                                                handleChange(
                                                    tc.name as string,
                                                    -1,
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                                <div className="p-2 pt-0">
                                    <Button
                                        type="submit"
                                        className="w-full cursor-pointer bg-primary py-6 text-lg text-white hover:bg-primary/90"
                                    >
                                        Checkout Ticket
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    );
}
