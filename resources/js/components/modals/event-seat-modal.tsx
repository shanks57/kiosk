import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EventSeatType, EventSectionType, EventType } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

interface EventSeatModalProps {
    event: EventType;
    seat?: EventSeatType | null;
    sections: Array<EventSectionType>;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function EventSeatModal({
    event,
    seat,
    sections,
    isOpen,
    setIsOpen,
}: EventSeatModalProps) {
    const [formData, setFormData] = useState({
        event_section_id: seat?.event_section_id || '',
        row_number: seat?.row_number || '',
        seat_number: seat?.seat_number || '',
        status: seat?.status || 'available',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (seat) {
                // Update existing seat
                await axios.put(
                    `/dashboard/events/${event.id}/seats/${seat.id}`,
                    formData,
                );
                toast.success('Event seat updated successfully');
            } else {
                // Create new seat
                await axios.post(
                    `/dashboard/events/${event.id}/seats`,
                    formData,
                );
                toast.success('Event seat created successfully');
            }

            setIsOpen(false);
            router.reload();
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Failed to save event seat';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {seat ? 'Edit Event Seat' : 'Create Event Seat'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="section">Event Section</Label>
                        <select
                            id="section"
                            value={formData.event_section_id}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    event_section_id: parseInt(e.target.value),
                                })
                            }
                            required
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Select section</option>
                            {sections?.map((section) => (
                                <option key={section.id} value={section.id}>
                                    {section.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="row">Row Number</Label>
                        <Input
                            id="row"
                            type="number"
                            min="1"
                            value={formData.row_number}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    row_number: parseInt(e.target.value) || '',
                                })
                            }
                            placeholder="e.g. 1"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="seat">Seat Number</Label>
                        <Input
                            id="seat"
                            type="number"
                            min="1"
                            value={formData.seat_number}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    seat_number: parseInt(e.target.value) || '',
                                })
                            }
                            placeholder="e.g. 1"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            value={formData.status}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    status: e.target.value,
                                })
                            }
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="available">Available</option>
                            <option value="locked">Locked</option>
                            <option value="booked">Booked</option>
                        </select>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading
                                ? 'Saving...'
                                : seat
                                  ? 'Update Seat'
                                  : 'Create Seat'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
