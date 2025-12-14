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
import { EventSectionType, EventType } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface EventSectionModalProps {
    event: EventType;
    section?: EventSectionType | null;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function EventSectionModal({
    event,
    section,
    isOpen,
    setIsOpen,
}: EventSectionModalProps) {
    const [formData, setFormData] = useState({
        name: section?.name || '',
        price: section?.price || '',
        color: section?.color || '#3b82f6',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (section) {
                // Update existing section
                router.put(
                    `/dashboard/events/${event.id}/sections/${section.id}`,
                    formData,
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            toast.success('Event section updated successfully');
                            setIsOpen(false);
                            router.reload();
                        },
                    },
                );
            } else {
                // Create new section
                router.post(
                    `/dashboard/events/${event.id}/sections`,
                    formData,
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            toast.success('Event section created successfully');
                            setIsOpen(false);
                            router.reload();
                        },
                    },
                );
            }
        } catch (error: any) {
            const message =
                error.response?.data?.message || 'Failed to save event section';
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
                        {section
                            ? 'Edit Event Section'
                            : 'Create Event Section'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Section Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            placeholder="e.g. VIP, Regular, Economy"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    price: parseFloat(e.target.value) || '',
                                })
                            }
                            placeholder="e.g. 100000"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="color">Section Color</Label>
                        <div className="flex gap-2">
                            <Input
                                id="color"
                                type="color"
                                value={formData.color}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        color: e.target.value,
                                    })
                                }
                                className="h-10 w-20 cursor-pointer"
                            />
                            <Input
                                type="text"
                                value={formData.color}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        color: e.target.value,
                                    })
                                }
                                placeholder="#3b82f6"
                                className="flex-1"
                            />
                        </div>
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
                                : section
                                  ? 'Update Section'
                                  : 'Create Section'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
