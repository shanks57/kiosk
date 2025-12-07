import TicketCategoryModal from '@/components/modals/ticket-category-modal';
import { AttendanceList } from '@/components/organism/attendance-list';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils';
import {
    BreadcrumbItem,
    EventType,
    PaginationType,
    ParticipantType,
    TicketCategoryType,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { TabsContent } from '@radix-ui/react-tabs';
import axios from 'axios';
import dayjs from 'dayjs';
import { Calendar, Edit, PhoneCall, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
    participants: PaginationType<ParticipantType>;
};

export default function AttendancePage(props: AttendancePageProps) {
    const { event, ticketCategories, participants } = props;
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] =
        useState<TicketCategoryType | null>(null);
    console.log(ticketCategories);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Organizer Dashboard" />
            <div className="space-y-4 p-6">
                <div className="flex items-center gap-3">
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
                    <h1 className="text-2xl font-medium">APLI Award</h1>
                    <Button size="sm" variant="outline">
                        <PhoneCall className="mr-1 h-4 w-4" />
                        Blast Whatsapp
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="attendance" className="border-b p-0">
                    <TabsList className="bg-transparent p-0">
                        <TabsTrigger value="attendance">Attendance</TabsTrigger>
                        <TabsTrigger value="event">Event Detail</TabsTrigger>
                        <TabsTrigger value="tickets">Tickets</TabsTrigger>
                    </TabsList>
                    <TabsContent value="attendance">
                        <AttendanceList {...props} />
                    </TabsContent>
                    <TabsContent value="tickets">
                        <div className="mx-auto px-2">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-medium">
                                        Ticket Categories
                                    </h2>
                                    <p className='text-sm text-foreground/50'>
                                        Ticket categories are used to define the
                                        price and quota of tickets for the
                                        event.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedCategory(null);
                                            setModalOpen(true);
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Category
                                    </Button>
                                </div>
                            </div>

                            <Card className="rounded-sm px-2 py-0 shadow-none">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Quota</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ticketCategories.map((c) => (
                                            <TableRow key={c.id}>
                                                <TableCell>{c.name}</TableCell>
                                                <TableCell>
                                                    Rp
                                                    {formatRupiah(c.price ?? 0)}
                                                </TableCell>
                                                <TableCell>
                                                    {c.quota ?? '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                setSelectedCategory(
                                                                    c,
                                                                );
                                                                setModalOpen(
                                                                    true,
                                                                );
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={async () => {
                                                                if (
                                                                    !confirm(
                                                                        'Delete this ticket category?',
                                                                    )
                                                                )
                                                                    return;
                                                                try {
                                                                    await axios.delete(
                                                                        `/dashboard/events/${event.id}/ticket-categories/${c.id}`,
                                                                    );
                                                                    toast.success(
                                                                        'Category deleted',
                                                                    );
                                                                    router.reload();
                                                                } catch (err: any) {
                                                                    toast.error(
                                                                        err
                                                                            .response
                                                                            ?.data
                                                                            ?.message ||
                                                                            'Delete failed',
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>

                            <TicketCategoryModal
                                open={modalOpen}
                                onOpenChange={(v) => setModalOpen(v)}
                                eventId={event.id as number}
                                category={selectedCategory}
                                // onSuccess={() => router.reload()}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
