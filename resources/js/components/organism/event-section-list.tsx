import EventSectionModal from '@/components/modals/event-section-modal';
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
import { formatRupiah } from '@/lib/utils';
import { AttendancePageProps } from '@/pages/organizer/events/show';
import { EventSectionType } from '@/types';
import { router } from '@inertiajs/react';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface EventSectionListProps extends AttendancePageProps {
    eventSections?: EventSectionType[];
}

export const EventSectionList = (props: EventSectionListProps) => {
    const { event, eventSections = [] } = props;
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSection, setSelectedSection] =
        useState<EventSectionType | null>(null);

    const handleDelete = async (sectionId: number) => {
        if (!confirm('Delete this event section?')) return;
        router.delete(
            `/dashboard/events/sections/${event.id}/delete/${sectionId}`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Event section deleted');
                },
                onError: () => {
                    toast.error('Failed to delete event section');
                },
            },
        );
    };

    return (
        <>
            <Card className="p-4 shadow-none">
                <div className="mx-auto w-full">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-lg">Event Sections</p>
                            <p className="text-sm text-foreground/50">
                                Records of event sections and pricing
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                    setSelectedSection(null);
                                    setModalOpen(true);
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Section
                            </Button>
                        </div>
                    </div>

                    <Card className="rounded-sm px-2 py-0 shadow-none">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Color</TableHead>
                                    <TableHead>Seats</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {eventSections && eventSections.length > 0 ? (
                                    eventSections.map((section) => (
                                        <TableRow key={section.id}>
                                            <TableCell>
                                                {section.name}
                                            </TableCell>
                                            <TableCell>
                                                Rp
                                                {formatRupiah(
                                                    section.price ?? 0,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-6 w-6 rounded border"
                                                        style={{
                                                            backgroundColor:
                                                                section.color ||
                                                                '#3b82f6',
                                                        }}
                                                    ></div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {section.color}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {section.seats?.length || 0}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            console.log(
                                                                section,
                                                            );
                                                            setSelectedSection(
                                                                section,
                                                            );
                                                            setModalOpen(true);
                                                        }}
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleDelete(
                                                                section.id,
                                                            );
                                                        }}
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
                                            No event sections found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </Card>

            {modalOpen && (
                <EventSectionModal
                    event={event}
                    section={selectedSection}
                    isOpen={modalOpen}
                    setIsOpen={setModalOpen}
                />
            )}
        </>
    );
};
