import { Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface NewParticipant {
    name: string;
    email: string;
    phone: string;
    seatId: number | null;
    seat?: { id: number; code: string };
}

interface AddNewParticipantsFormProps {
    orderItemId: number;
    eventId: number;
    userId: number;
    availableSeats: Array<{
        id: number;
        code: string;
        section_id?: number;
        section_name?: string;
    }>;
    newParticipants: Record<number, NewParticipant[]>;
    onUpdateParticipants: (
        orderItemId: number,
        participants: NewParticipant[],
    ) => void;
    submitting: boolean;
    onSubmit: (
        orderItemId: number,
        participants: NewParticipant[],
    ) => Promise<void>;
}

export function AddNewParticipantsForm({
    orderItemId,
    eventId,
    userId,
    availableSeats,
    newParticipants,
    onUpdateParticipants,
    submitting,
    onSubmit,
}: AddNewParticipantsFormProps) {
    const participants = newParticipants[orderItemId] || [];

    function addNewParticipantForm() {
        onUpdateParticipants(orderItemId, [
            ...participants,
            { name: '', email: '', phone: '', seatId: null },
        ]);
    }

    function updateNewParticipant(
        index: number,
        field: keyof NewParticipant,
        value: string | number | null,
    ) {
        const updated = [...participants];
        if (field === 'seatId' && typeof value === 'number') {
            const seat = availableSeats.find((s) => s.id === value);
            updated[index] = { ...updated[index], seatId: value, seat };
        } else if (field !== 'seatId') {
            updated[index] = { ...updated[index], [field]: value };
        }
        onUpdateParticipants(orderItemId, updated);
    }

    function removeNewParticipant(index: number) {
        onUpdateParticipants(
            orderItemId,
            participants.filter((_, i) => i !== index),
        );
    }

    async function handleSubmitParticipants() {
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

        // Validate that selected seats are still available
        const unavailableSeats = participants.filter(
            (p) => !availableSeats.some((s) => s.id === p.seatId),
        );

        if (unavailableSeats.length > 0) {
            const seatCodes = unavailableSeats
                .map((p) => `"${p.name}"`)
                .join(', ');
            toast.error(
                `Seat(s) for ${seatCodes} are no longer available. Please select different seats.`,
            );
            return;
        }

        try {
            await onSubmit(orderItemId, participants);
        } catch (error) {
            console.error('Error submitting participants:', error);
        }
    }

    return (
        <div className="space-y-4">
            {participants.map((participant, index) => (
                <div key={index} className="space-y-3 rounded-lg">
                    <div className="mb-4 flex items-start justify-between">
                        <Label className="font-medium">
                            Participant {index + 1}
                        </Label>
                    </div>

                    <div className="grid gap-3">
                        <div className="grid gap-1">
                            <Label className="text-sm font-medium">
                                Participant Name{' '}
                            </Label>
                            <Input
                                type="text"
                                placeholder="Full name"
                                value={participant.name}
                                onChange={(e) =>
                                    updateNewParticipant(
                                        index,
                                        'name',
                                        e.target.value,
                                    )
                                }
                                disabled={submitting}
                            />
                        </div>

                        <div className="grid gap-1">
                            <Label className="text-sm font-medium">
                                Participant Email
                            </Label>
                            <Input
                                type="email"
                                placeholder="Email address"
                                value={participant.email}
                                onChange={(e) =>
                                    updateNewParticipant(
                                        index,
                                        'email',
                                        e.target.value,
                                    )
                                }
                                disabled={submitting}
                            />
                        </div>

                        <div className="grid gap-1">
                            <Label className="text-sm font-medium">
                                Participant Phone
                            </Label>
                            <Input
                                type="tel"
                                placeholder="Phone number"
                                value={participant.phone}
                                onChange={(e) =>
                                    updateNewParticipant(
                                        index,
                                        'phone',
                                        e.target.value,
                                    )
                                }
                                disabled={submitting}
                            />
                        </div>

                        <div className="grid grid-cols-3 items-center gap-1">
                            <Label className="text-sm font-medium">
                                Seat Information
                            </Label>
                            <div className="flex items-center gap-1 col-span-2 justify-end">
                                <select
                                    value={participant.seatId || ''}
                                    onChange={(e) => {
                                        const value = e.target.value
                                            ? parseInt(e.target.value)
                                            : null;
                                        updateNewParticipant(
                                            index,
                                            'seatId',
                                            value,
                                        );
                                    }}
                                    disabled={submitting}
                                    className="rounded-xs w-fit border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select seat</option>
                                    {availableSeats.map((seat) => (
                                        <option key={seat.id} value={seat.id}>
                                            {seat.code}
                                        </option>
                                    ))}
                                </select>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeNewParticipant(index)}
                                >
                                    <Trash size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex flex-row-reverse justify-between">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    onClick={addNewParticipantForm}
                    disabled={submitting}
                >
                    <Plus size={16} />
                    Add New Participants
                </Button>
                {participants.length > 0 && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSubmitParticipants}
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : `Save`}
                    </Button>
                )}
            </div>
        </div>
    );
}
