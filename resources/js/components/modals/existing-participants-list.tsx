import { ParticipantType } from '@/types';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';

interface ExistingParticipantsListProps {
    participants: ParticipantType[];
    eventId: number;
    onDelete: (participantId: number) => Promise<void>;
}

export function ExistingParticipantsList({
    participants,
    eventId,
    onDelete,
}: ExistingParticipantsListProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedParticipant, setSelectedParticipant] =
        useState<ParticipantType | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDeleteParticipant() {
        if (!selectedParticipant) return;
        setIsDeleting(true);
        try {
            await onDelete(selectedParticipant.id);
            setDeleteDialogOpen(false);
            setSelectedParticipant(null);
        } finally {
            setIsDeleting(false);
        }
    }

    if (participants.length === 0) {
        return (
            <p className="py-4 text-center text-sm text-muted-foreground">
                No participants yet
            </p>
        );
    }

    return (
        <>
            <div className="border-t-dashed-custom space-y-3 pt-3">
                {participants.map((participant) => (
                    <div
                        key={participant.id}
                        className="justify-betwee flex items-start"
                    >
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <p className="font-medium">
                                {participant.user?.name}
                            </p>
                            <p className="text-sm break-all text-muted-foreground">
                                {participant.user?.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {participant.user?.phone}
                            </p>
                            {/* {participant.eventSeat && (
                                <p className="text-xs text-muted-foreground">
                                    Seat: {participant.eventSeat.code}
                                </p>
                            )} */}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedParticipant(participant);
                                setDeleteDialogOpen(true);
                            }}
                            className="ml-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                            <Trash2 size={18} />
                        </Button>
                    </div>
                ))}
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Participant</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            <span className="font-medium">
                                {selectedParticipant?.user?.name}
                            </span>
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDeleteDialogOpen(false);
                                setSelectedParticipant(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteParticipant}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
