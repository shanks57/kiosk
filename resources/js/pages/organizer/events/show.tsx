import { AttendanceList } from '@/components/organism/attendance-list';
import { EventForm } from '@/components/organism/event-form';
import { EventSeatList } from '@/components/organism/event-seat-list';
import { EventSectionList } from '@/components/organism/event-section-list';
import { TicketCategoryList } from '@/components/organism/ticket-category-list';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import {
    BreadcrumbItem,
    EventSeatType,
    EventSectionType,
    EventType,
    OrderType,
    PaginationType,
    TicketCategoryType,
} from '@/types';
import { Head } from '@inertiajs/react';
import { TabsContent } from '@radix-ui/react-tabs';
import dayjs from 'dayjs';
import { Calendar, PhoneCall } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Events',
        href: '/dashboard/events',
    },
];

export type AttendancePageProps = {
    event: EventType;
    ticketCategories: TicketCategoryType[];
    participants: PaginationType<OrderType>;
    eventSeats?: { data: EventSeatType[] };
    eventSections?: EventSectionType[];
};

export default function AttendancePage(props: AttendancePageProps) {
    const { event, ticketCategories, participants, eventSections } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Organizer Dashboard" />
            <div className="space-y-4 p-6">
                <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-foreground/50">
                        {`${dayjs(event.start_time).format('DD')} - ${dayjs(event.end_time).format('DD MMMM YYYY')} ${dayjs(event.start_time).format('HH:mm')} - ${dayjs(event.end_time).format('HH:mm')} WIB`}
                    </p>
                    <span className="flex items-center gap-2 rounded-sm bg-primary/5 px-2 text-primary">
                        <Calendar size={16} />
                        {`${Math.ceil(Math.abs(dayjs(event.start_time).diff(dayjs(), 'day')))}`}{' '}
                        Days Left
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/30"></span>
                    <p className="text-foreground/50">
                        Jl. Afrika Asia Selatan 45, Jakarta
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-medium">{event.title}</h1>
                    <Button size="sm" variant="outline">
                        <PhoneCall className="mr-1 h-4 w-4" />
                        Blast Whatsapp
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="attendance" className="p-0">
                    <TabsList className="flex w-full justify-start rounded-none border-b-2 bg-transparent p-0">
                        <TabsTrigger value="attendance">Attendance</TabsTrigger>
                        <TabsTrigger value="event">Event Detail</TabsTrigger>
                        <TabsTrigger value="sections">Sections</TabsTrigger>
                        <TabsTrigger value="tickets">Tickets</TabsTrigger>
                        <TabsTrigger value="seats">Seats</TabsTrigger>
                    </TabsList>
                    <TabsContent value="attendance">
                        <AttendanceList {...props} />
                    </TabsContent>
                    <TabsContent value="event">
                        <EventForm {...props} />
                    </TabsContent>
                    <TabsContent value="sections">
                        <EventSectionList {...props} />
                    </TabsContent>
                    <TabsContent value="tickets">
                        <TicketCategoryList {...props} />
                    </TabsContent>
                    <TabsContent value="seats">
                        <EventSeatList {...props} />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
