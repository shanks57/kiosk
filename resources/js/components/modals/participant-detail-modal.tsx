import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { generateTicketHtml } from '@/lib/utils';
import { EventType, OrderItemType, OrderType } from '@/types';
import axios from 'axios';
import dayjs from 'dayjs';
import { ArrowLeft, Download, Eye, Ticket } from 'lucide-react';
import { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { AddNewParticipantsForm } from './add-new-participants-form';
import { ExistingParticipantsList } from './existing-participants-list';
import { ParticipantInfoSection } from './participant-info-section';

type ParticipantDetailModalPropsType = {
    data: OrderType;
    event: EventType;
};

interface NewParticipant {
    name: string;
    email: string;
    phone: string;
    seatId: number | null;
}

export default function ParticipantDetailModal(
    props: ParticipantDetailModalPropsType,
) {
    const { data, event } = props;
    const [printCode, setPrintCode] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const qrWrapperRef = useRef<HTMLDivElement | null>(null);

    // New participant form state (per OrderItem)
    const [newParticipants, setNewParticipants] = useState<
        Record<number, NewParticipant[]>
    >({});
    const [submitting, setSubmitting] = useState(false);
    const [downloadingIndex, setDownloadingIndex] = useState<number | null>(
        null,
    );

    // Get all available seats (excluding those already assigned)
    const getAvailableSeats = () => {
        const allSeats: Array<{
            id: number;
            code: string;
            section_id: number;
            section_name: string;
        }> = [];
        const assignedSeatIds = new Set<number>();

        // Collect all assigned seat IDs
        data.items?.forEach((item) => {
            item.participant?.forEach((p) => {
                if (p.seat?.id) {
                    assignedSeatIds.add(p.seat.id);
                }
            });
        });

        // Get all available seats from event sections
        event.sections?.forEach((section) => {
            section.seats?.forEach((seat) => {
                if (
                    seat.status === 'available' &&
                    !assignedSeatIds.has(seat.id)
                ) {
                    allSeats.push({
                        id: seat.id,
                        code: `${section.name} - Row ${seat.row_number} Seat ${seat.seat_number}`,
                        section_id: section.id,
                        section_name: section.name || '',
                    });
                }
            });
        });

        return allSeats;
    };

    // Handle participant deletion
    const handleDeleteParticipant = async (participantId: number) => {
        try {
            await axios.delete(
                `/dashboard/events/${event.id}/participants/${participantId}`,
            );
            toast.success('Participant deleted successfully');
            // Reload page to refresh data
            window.location.reload();
        } catch (error: any) {
            const msg =
                error.response?.data?.message || 'Failed to delete participant';
            toast.error(msg);
        }
    };

    // Handle ticket PDF download
    const handleDownloadTicket = async (item: OrderItemType) => {
        const code = item.booking_code || '';
        setPrintCode(code);

        requestAnimationFrame(() => {
            const wrapper = qrWrapperRef.current;
            if (!wrapper) return;

            const svg = wrapper.querySelector('svg');
            if (!svg) {
                toast('QR belum siap, coba lagi');
                return;
            }

            const svgHtml = new XMLSerializer().serializeToString(svg);

            const html = generateTicketHtml({
                code,
                eventTitle: event.title || '',
                eventDate: dayjs(item.event_date).format('dddd, DD MMMM YYYY'),
                svgHtml,
                participants: item.participant || [],
            });

            const w = window.open('', '_blank');
            if (!w) {
                toast('Popup diblokir browser');
                return;
            }

            w.document.open();
            w.document.write(html);
            w.document.close();

            w.onload = () => {
                w.print();
            };

            setPrintCode(null);
        });
    };

    // Handle new participants submission
    const handleSubmitParticipants = async (
        orderItemId: number,
        participants: NewParticipant[],
    ) => {
        if (participants.length === 0) {
            toast.error('Add at least one participant');
            return;
        }

        const allFilled = participants.every(
            (p) =>
                p.name.trim() &&
                p.email.trim() &&
                p.phone.trim() &&
                p.seatId !== null,
        );

        if (!allFilled) {
            toast.error('Please fill all participant fields');
            return;
        }

        setSubmitting(true);
        try {
            // Submit each participant
            for (const participant of participants) {
                await axios.post(
                    `/dashboard/events/${event.id}/order-items/${orderItemId}/participants`,
                    {
                        name: participant.name,
                        email: participant.email,
                        phone: participant.phone,
                        seat_id: participant.seatId,
                        user_id: data.user_id,
                        event_id: event.id,
                    },
                );
            }
            toast.success('Participants added successfully');
            // Clear the form
            setNewParticipants((prev) => ({
                ...prev,
                [orderItemId]: [],
            }));
            // Reload page or fetch updated data
            window.location.reload();
        } catch (error: any) {
            const msg =
                error.response?.data?.message || 'Failed to add participants';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Sheet>
                <SheetTrigger asChild>
                    <span className="text-sm">
                        <Eye size={16} className="text-gray-500" />
                    </span>
                </SheetTrigger>
                <SheetContent className="!max-w-4xl gap-0 space-y-0">
                    <div className="w-full border-b p-2">
                        <Button variant="ghost">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                        </Button>
                    </div>
                    <div
                        ref={qrWrapperRef as any}
                        style={{
                            position: 'absolute',
                            left: -9999,
                            top: -9999,
                            visibility: 'hidden',
                        }}
                    >
                        {printCode ? <QRCode value={printCode} /> : null}
                    </div>
                    <div className="grid h-full lg:grid-cols-2">
                        {/* Left Section - Participant Information */}
                        <div className="h-full border p-6">
                            <SheetTitle className="mb-4 text-lg font-semibold">
                                Participant Information
                            </SheetTitle>
                            <ParticipantInfoSection
                                key={refreshKey}
                                company={data.user?.company}
                                picName={data.user?.name}
                                picEmail={data.user?.email}
                                picPhone={data.user?.phone}
                                userId={data.user?.id}
                                companyId={data.user?.company?.id}
                                onUpdate={() =>
                                    setRefreshKey((prev) => prev + 1)
                                }
                            />
                        </div>

                        {/* Right Section - Ticket Information */}
                        <div className="h-[calc(100vh-50px)] overflow-y-scroll">
                            <div className="flex cursor-pointer items-center justify-start gap-1 border-b p-2 text-sm text-primary">
                                <Ticket /> Ticket
                            </div>
                            {data.items?.map((orderItem, index) => (
                                <div className="p-4" key={index}>
                                    <div className="flex justify-between">
                                        <h3 className="mb-2 text-lg font-medium">
                                            DAY {index + 1}
                                        </h3>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleDownloadTicket(orderItem)
                                            }
                                            disabled={
                                                downloadingIndex === index
                                            }
                                            className="gap-2"
                                        >
                                            <Download size={16} />
                                            {downloadingIndex === index
                                                ? 'Downloading...'
                                                : 'Download PDF'}
                                        </Button>
                                    </div>

                                    <div className="h-full space-y-3 rounded-md border p-4">
                                        <h3 className="text-lg font-medium">
                                            Ticket Information
                                        </h3>

                                        {/* QR Code */}
                                        <div className="flex gap-4">
                                            <div className="flex h-40 w-40 items-center justify-center rounded-md bg-gray-200">
                                                <QRCode
                                                    value={
                                                        orderItem.booking_code ||
                                                        ''
                                                    }
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-sm text-foreground">
                                                    Ticket Code
                                                </span>
                                                <span className="text-xl font-medium">
                                                    {orderItem?.booking_code?.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Existing Participants */}
                                        <div>
                                            <h4 className="mb-3 font-medium">
                                                Seat Information
                                            </h4>
                                            <ExistingParticipantsList
                                                participants={
                                                    orderItem.participant || []
                                                }
                                                eventId={event.id}
                                                onDelete={
                                                    handleDeleteParticipant
                                                }
                                            />
                                        </div>

                                        {/* New Participants Form */}
                                        <div className="border-t-dashed-custom"></div>
                                        {data.user?.id && (
                                            <AddNewParticipantsForm
                                                orderItemId={orderItem.id}
                                                eventId={event.id}
                                                userId={data.user.id}
                                                availableSeats={getAvailableSeats()}
                                                newParticipants={
                                                    newParticipants
                                                }
                                                onUpdateParticipants={(
                                                    oiId,
                                                    parts,
                                                ) =>
                                                    setNewParticipants(
                                                        (prev) => ({
                                                            ...prev,
                                                            [oiId]: parts,
                                                        }),
                                                    )
                                                }
                                                submitting={submitting}
                                                onSubmit={
                                                    handleSubmitParticipants
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
