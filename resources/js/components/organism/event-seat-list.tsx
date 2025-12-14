import EventSeatModal from '@/components/modals/event-seat-modal';
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
import { AttendancePageProps } from '@/pages/organizer/events/show';
import { EventSeatType, EventSectionType } from '@/types';
import { router } from '@inertiajs/react';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface EventSeatListProps extends AttendancePageProps {
    eventSeats?: { data: EventSeatType[] };
    eventSections?: Array<EventSectionType>;
}

export const EventSeatList = (props: EventSeatListProps) => {
    const { event, eventSeats = { data: [] }, eventSections = [] } = props;
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState<EventSeatType | null>(
        null,
    );

    const handleDelete = async (seatId: number) => {
        if (!confirm('Delete this event seat?')) return;
        router.delete(`/dashboard/events/${event.id}/seats/${seatId}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Event seat deleted');
            },
            onError: () => {
                toast.error('Failed to delete event seat');
            },
        });
    };

    const getStatusBadgeColor = (status: string | null | undefined) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'locked':
                return 'bg-yellow-100 text-yellow-800';
            case 'booked':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getSectionName = (sectionId: number | undefined) => {
        return (
            eventSections?.find((s) => s.id === sectionId)?.name || 'Unknown'
        );
    };

    return (
        <>
            <Card className="p-4 shadow-none">
                <div className="mx-auto w-full">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-lg">Event Seats</p>
                            <p className="text-sm text-foreground/50">
                                Records of event seats and seating arrangement
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                onClick={() => {
                                    setSelectedSeat(null);
                                    setModalOpen(true);
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Seat
                            </Button>
                        </div>
                    </div>

                    <Card className="rounded-sm px-2 py-0 shadow-none">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Section</TableHead>
                                    <TableHead>Row</TableHead>
                                    <TableHead>Seat Number</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {eventSeats?.data &&
                                eventSeats.data.length > 0 ? (
                                    eventSeats.data.map((seat) => (
                                        <TableRow key={seat.id}>
                                            <TableCell>
                                                {getSectionName(
                                                    seat.event_section_id,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {seat.row_number}
                                            </TableCell>
                                            <TableCell>
                                                {seat.seat_number}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-block rounded px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(seat.status)}`}
                                                >
                                                    {seat.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setSelectedSeat(
                                                                seat,
                                                            );
                                                            setModalOpen(true);
                                                        }}
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            handleDelete(
                                                                seat.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash className="h-3 w-3 text-red-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center text-foreground/50"
                                        >
                                            No event seats found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </Card>

            {modalOpen && (
                <EventSeatModal
                    event={event}
                    seat={selectedSeat}
                    sections={eventSections || []}
                    isOpen={modalOpen}
                    setIsOpen={setModalOpen}
                />
            )}
        </>
    );
};
