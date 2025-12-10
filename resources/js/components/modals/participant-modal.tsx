import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TicketCategoryType } from '@/types';
import { DialogClose, DialogTrigger } from '@radix-ui/react-dialog';
import axios from 'axios';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

interface ParticipantModalProps {
    eventId: number;
    ticketCategories: TicketCategoryType[];
    onSuccess?: () => void;
}

export function ParticipantModal({
    eventId,
    ticketCategories,
    onSuccess,
}: ParticipantModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        ticket_category_id: '',
        company_name: '',
        company_logo: null as File | null,
    });
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData((prev) => ({ ...prev, ticket_category_id: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file =
            e.target.files && e.target.files[0] ? e.target.files[0] : null;
        setFormData((prev) => ({ ...prev, company_logo: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Build multipart form data when file is present
            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('email', formData.email);
            payload.append('phone', formData.phone || '');
            payload.append('ticket_category_id', formData.ticket_category_id);
            if (formData.company_name)
                payload.append('company_name', formData.company_name);
            if (formData.company_logo)
                payload.append('company_logo', formData.company_logo);

            await axios.post(
                `/dashboard/events/${eventId}/participants`,
                payload,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                },
            );

            setFormData({
                name: '',
                email: '',
                phone: '',
                ticket_category_id: '',
                company_name: '',
                company_logo: null,
            });
            if (fileInputRef.current) fileInputRef.current.value = '';
            toast('Participant added');
            setModalOpen(false);
            onSuccess?.();
        } catch (err: any) {
            const msg =
                err.response?.data?.message || 'Failed to add participant';
            setError(msg);
            toast(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog onOpenChange={(open) => setModalOpen(open)}>
            <DialogTrigger asChild>
                <Button>Add Participant</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Participant</DialogTitle>
                    <DialogDescription>
                        Add a new participant to this event manually.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-md bg-red-100 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Enter participant name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company_name">Company Name</Label>
                        <Input
                            id="company_name"
                            name="company_name"
                            placeholder="Enter company name (optional)"
                            value={formData.company_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter participant email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Enter phone number (optional)"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ticket_category">
                            Ticket Category *
                        </Label>
                        <Select
                            value={formData.ticket_category_id}
                            onValueChange={handleCategoryChange}
                        >
                            <SelectTrigger id="ticket_category">
                                <SelectValue placeholder="Select a ticket category" />
                            </SelectTrigger>
                            <SelectContent>
                                {ticketCategories.map((cat) => (
                                    <SelectItem
                                        key={cat.id}
                                        value={cat.id.toString()}
                                    >
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company_logo">
                            Company Image (optional)
                        </Label>
                        <input
                            ref={fileInputRef}
                            id="company_logo"
                            name="company_logo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Participant'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
