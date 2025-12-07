import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type EventType } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Events', href: '/dashboard/events' },
    { title: 'Participants', href: '#' },
];

export default function ParticipantsIndex({
    event,
    participants,
}: {
    event: EventType;
    participants: any;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Participants - ${event.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Participants - {event.title}
                    </h1>
                    <a
                        href={`/dashboard/events/${event.id}/participants/export`}
                    >
                        <Button variant="outline">Export CSV</Button>
                    </a>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">Name</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">
                                    Ticket Category
                                </th>
                                <th className="px-6 py-3 text-left">Seat</th>
                                <th className="px-6 py-3 text-left">
                                    Order Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants?.data?.map((participant: any) => (
                                <tr
                                    key={participant.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {participant.order?.user?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {participant.order?.user?.email ||
                                            'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {participant.category?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {participant.seat
                                            ? `${participant.seat.row_number}-${participant.seat.seat_number}`
                                            : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {participant.created_at}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {participants?.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Page {participants?.current_page} of{' '}
                            {participants?.last_page}
                        </span>
                        <div className="flex gap-2">
                            {participants?.prev_page_url && (
                                <Link href={participants.prev_page_url}>
                                    <Button variant="outline">Prev</Button>
                                </Link>
                            )}
                            {participants?.next_page_url && (
                                <Link href={participants.next_page_url}>
                                    <Button variant="outline">Next</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
