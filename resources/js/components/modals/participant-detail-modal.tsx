import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { EventType, OrderType } from '@/types';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
    const handleDownloadTicket = async (
        orderItemIndex: number,
        orderItem: any,
    ) => {
        try {
            setDownloadingIndex(orderItemIndex);

            // Create a temporary container with simple, compatible CSS
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.width = '210mm';
            container.style.minHeight = '297mm';
            container.style.padding = '20px';
            container.style.backgroundColor = '#ffffff';
            container.style.fontFamily = 'Arial, sans-serif';
            container.style.color = '#000000';

            // Create ticket HTML with inline styles only (no Tailwind)
            const ticketHTML = document.createElement('div');
            ticketHTML.style.textAlign = 'center';
            ticketHTML.style.padding = '20px';

            // Title
            const title = document.createElement('h1');
            title.textContent = event.title || 'Event Ticket';
            title.style.margin = '20px 0';
            title.style.color = '#333333';
            title.style.fontSize = '24px';
            title.style.fontWeight = 'bold';
            ticketHTML.appendChild(title);

            // Subtitle
            const subtitle = document.createElement('h2');
            subtitle.textContent = 'Ticket';
            subtitle.style.margin = '10px 0';
            subtitle.style.color = '#666666';
            subtitle.style.fontSize = '18px';
            ticketHTML.appendChild(subtitle);

            // QR Code wrapper
            const qrSection = document.createElement('div');
            qrSection.style.margin = '30px 0';
            qrSection.style.display = 'flex';
            qrSection.style.justifyContent = 'center';
            qrSection.style.padding = '10px';
            qrSection.style.backgroundColor = '#ffffff';
            qrSection.id = 'qr-wrapper';

            // Create a canvas-based QR code to avoid SVG color issues
            const qrCanvas = document.createElement('canvas');
            qrCanvas.width = 200;
            qrCanvas.height = 200;
            qrCanvas.style.border = '1px solid #ccc';

            // Use a simple approach: convert booking code to QR using canvas
            // Import QRCode library already available via react-qr-code
            try {
                // Get the existing QR code image from the page and render it to canvas
                const existingQR = document.querySelector(
                    'svg[data-testid="qrcode"]',
                );
                if (existingQR) {
                    // Convert SVG to image data URL using canvas
                    const svgString = new XMLSerializer().serializeToString(
                        existingQR,
                    );
                    // Replace oklch colors with simple hex colors
                    const cleanedSvg = svgString
                        .replace(/oklch\([^)]+\)/g, '#000000')
                        .replace(/color:\s*currentColor/g, 'color: #000000');

                    const svg = new Blob([cleanedSvg], {
                        type: 'image/svg+xml',
                    });
                    const url = URL.createObjectURL(svg);
                    const img = document.createElement('img');
                    img.src = url;
                    img.style.width = '200px';
                    img.style.height = '200px';
                    img.onload = () => {
                        URL.revokeObjectURL(url);
                    };
                    qrSection.appendChild(img);
                } else {
                    // Fallback: display a text placeholder
                    const placeholder = document.createElement('div');
                    placeholder.textContent = 'QR Code';
                    placeholder.style.width = '200px';
                    placeholder.style.height = '200px';
                    placeholder.style.display = 'flex';
                    placeholder.style.alignItems = 'center';
                    placeholder.style.justifyContent = 'center';
                    placeholder.style.backgroundColor = '#f0f0f0';
                    placeholder.style.border = '1px solid #ccc';
                    placeholder.style.color = '#999';
                    qrSection.appendChild(placeholder);
                }
            } catch (e) {
                console.warn('QR code render error:', e);
                const placeholder = document.createElement('div');
                placeholder.textContent = 'QR Code';
                placeholder.style.width = '200px';
                placeholder.style.height = '200px';
                placeholder.style.display = 'flex';
                placeholder.style.alignItems = 'center';
                placeholder.style.justifyContent = 'center';
                placeholder.style.backgroundColor = '#f0f0f0';
                placeholder.style.border = '1px solid #ccc';
                qrSection.appendChild(placeholder);
            }

            ticketHTML.appendChild(qrSection);

            // Booking code section
            const codeSection = document.createElement('div');
            codeSection.style.margin = '30px 0';
            codeSection.style.borderTop = '1px solid #cccccc';
            codeSection.style.paddingTop = '20px';

            const codeLabel = document.createElement('p');
            codeLabel.textContent = 'Booking Code:';
            codeLabel.style.margin = '10px 0';
            codeLabel.style.fontSize = '16px';
            codeLabel.style.fontWeight = 'bold';
            codeSection.appendChild(codeLabel);

            const codeValue = document.createElement('p');
            codeValue.textContent =
                orderItem.booking_code?.toUpperCase() || 'N/A';
            codeValue.style.margin = '10px 0';
            codeValue.style.fontSize = '28px';
            codeValue.style.fontWeight = 'bold';
            codeValue.style.letterSpacing = '2px';
            codeValue.style.color = '#0066cc';
            codeSection.appendChild(codeValue);

            ticketHTML.appendChild(codeSection);

            // Details section
            const detailsSection = document.createElement('div');
            detailsSection.style.margin = '30px 0';
            detailsSection.style.textAlign = 'left';
            detailsSection.style.padding = '20px';
            detailsSection.style.backgroundColor = '#f5f5f5';
            detailsSection.style.borderRadius = '5px';

            const eventDetail = document.createElement('p');
            eventDetail.innerHTML = `<strong>Event:</strong> ${event.title || 'N/A'}`;
            eventDetail.style.margin = '10px 0';
            detailsSection.appendChild(eventDetail);

            const dateDetail = document.createElement('p');
            dateDetail.innerHTML = `<strong>Booking Date:</strong> ${new Date().toLocaleDateString()}`;
            dateDetail.style.margin = '10px 0';
            detailsSection.appendChild(dateDetail);

            const noteDetail = document.createElement('p');
            noteDetail.textContent =
                'Please scan this QR code at the venue entrance.';
            noteDetail.style.margin = '10px 0';
            noteDetail.style.color = '#666666';
            noteDetail.style.fontSize = '12px';
            detailsSection.appendChild(noteDetail);

            ticketHTML.appendChild(detailsSection);
            container.appendChild(ticketHTML);
            document.body.appendChild(container);

            // Convert to canvas and then to PDF
            const canvas = await html2canvas(container, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
                allowTaint: true,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pdfWidth - 20; // 10mm margin on each side
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

            // Download the PDF
            pdf.save(
                `ticket-${orderItem.booking_code?.toLowerCase() || 'download'}.pdf`,
            );

            // Clean up
            document.body.removeChild(container);
            toast.success('Ticket downloaded successfully');
        } catch (error: any) {
            console.error('Download error:', error);
            toast.error('Failed to download ticket');
        } finally {
            setDownloadingIndex(null);
        }
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
                                                handleDownloadTicket(
                                                    index,
                                                    orderItem,
                                                )
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
