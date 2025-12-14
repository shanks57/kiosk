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
import { FileImage, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

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
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);

    // FILE

    function handleFile(file: File) {
        if (!file.type.startsWith('image/')) return;

        setFile(file);
        setPreview(URL.createObjectURL(file));
        setFormData((prev) => ({ ...prev, company_logo: file }));
        // onChange(file);
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFile(droppedFile);
    }

    function removeFile() {
        setFile(null);
        setPreview(null);
        setFormData((prev) => ({ ...prev, company_logo: null }));
        // onChange(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

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
        <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
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

                <form onSubmit={handleSubmit} className="space-y-4 overflow-auto h-[500px]">
                    {error && (
                        <div className="rounded-sm bg-red-100 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="company_name">Company *</Label>
                        <Input
                            required
                            id="company_name"
                            name="company_name"
                            placeholder="Enter company name"
                            value={formData.company_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">PIC Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Enter PIC name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">PIC Email *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter PIC email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">PIC Phone Number</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Enter PIC phone number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* <div className="space-y-2">
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
                    </div> */}

                    <div className="space-y-2">
                        <Label htmlFor="company_logo">
                            Company Image
                        </Label>
                        {/* <input
                            ref={fileInputRef}
                            id="company_logo"
                            name="company_logo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                        /> */}
                        {!file ? (
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragging(true);
                                }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={onDrop}
                                className={`flex items-center justify-center gap-4 rounded-xs border bg-gray-50 px-6 py-8 transition ${dragging ? 'border-primary bg-primary/5' : 'border-gray-200'} `}
                            >
                                <Button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="gap-2"
                                >
                                    <Upload size={18} />
                                    Browse file
                                </Button>

                                <span className="text-sm text-muted-foreground">
                                    or drag and drop
                                </span>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) =>
                                        e.target.files &&
                                        handleFile(e.target.files[0])
                                    }
                                />
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-xl border">
                                {/* Preview */}
                                <div className="flex justify-center bg-gray-100 p-6">
                                    <img
                                        src={preview!}
                                        alt="Preview"
                                        className="h-32 w-32 object-contain"
                                    />
                                </div>

                                {/* File info */}
                                <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <FileImage className="text-muted-foreground" />
                                        <div className="text-sm">
                                            <p className="font-medium">
                                                {file.name}
                                            </p>
                                            <p className="text-muted-foreground">
                                                {(
                                                    file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(1)}{' '}
                                                MB
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="text-muted-foreground hover:text-red-500"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
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
