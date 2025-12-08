import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TicketCategoryType } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    eventId: number;
    category?: TicketCategoryType | null;
    onSuccess?: () => void;
};

export default function TicketCategoryModal({
    open,
    onOpenChange,
    eventId,
    category,
    onSuccess,
}: Props) {
    const isEdit = !!category;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: category?.name || '',
        price: category?.price ?? '',
        quota: category?.quota ?? '',
    });

    useEffect(() => {
        setData({
            name: category?.name || '',
            price: category?.price ?? '',
            quota: category?.quota ?? '',
        });
    }, [category, setData, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && category) {
            put(
                `/dashboard/events/${eventId}/ticket-categories/${category.id}`,
                {
                    onSuccess: () => {
                        onOpenChange(false);
                        toast('Ticket category updated');
                        reset();
                    },
                    onError: () => {
                        toast('Error updating ticket category');
                    },
                },
            );
        } else {
            post(`/dashboard/events/${eventId}/ticket-categories`, {
                onSuccess: () => {
                    onOpenChange(false);
                    toast('Ticket category created');
                    reset();
                },
                onError: () => {
                    toast('Error creating ticket category');
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit
                            ? 'Edit Ticket Category'
                            : 'Create Ticket Category'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter ticket category name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            type="number"
                            placeholder="Enter ticket category price"
                            id="price"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            required
                        />
                        {errors.price && (
                            <p className="text-sm text-red-600">
                                {errors.price}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="quota">Quota</Label>
                        <Input
                            type="number"
                            placeholder="Enter ticket category quota"
                            id="quota"
                            value={String(data.quota)}
                            onChange={(e) => setData('quota', e.target.value)}
                        />
                        {errors.quota && (
                            <p className="text-sm text-red-600">
                                {errors.quota}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                onOpenChange(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? isEdit
                                    ? 'Updating...'
                                    : 'Creating...'
                                : isEdit
                                  ? 'Update'
                                  : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
