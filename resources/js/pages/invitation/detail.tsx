import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Toaster } from '@/components/ui/sonner';
import { OrderItemType } from '@/types';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function InvitationDetail(props: {
    item: OrderItemType;
    code: string;
}) {
    const { item, code } = props;
    const { order } = item;
    const [selectedParticipants, setSelectedParticipants] = useState<number[]>(
        [],
    );
    const [loading, setLoading] = useState(false);

    const toggleParticipant = (id: number) => {
        setSelectedParticipants((prev) =>
            prev.includes(id)
                ? prev.filter((pid) => pid !== id)
                : [...prev, id],
        );
    };

    const handleSubmitAttendance = async (status: 'attend' | 'not_attend') => {
        if (selectedParticipants.length === 0) {
            toast.error('Please select at least one participant');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`/invitation/${code}/attendance`, {
                status,
                participant_ids: selectedParticipants,
                order_item_id: item.id,
            });

            toast.success(
                status === 'attend'
                    ? 'Participants marked as attending'
                    : 'Participants marked as not attending',
            );
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Failed to submit attendance',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-foreground/5 dark:bg-primary">
            <Toaster />
            <div className="flex items-center justify-between bg-white p-4">
                <h4 className="text-xs font-medium dark:text-secondary">
                    This Ticketing System <br /> Powered by
                </h4>
                <Link href="/">
                    <img
                        className="h-5 w-auto"
                        src="/assets/icon.svg"
                        alt="tron-logo"
                    />
                </Link>
            </div>
            <div className="mx-auto w-full max-w-md flex-col gap-y-4 pb-18">
                <div className="mx-auto min-h-screen w-full space-y-3 dark:text-secondary">
                    {/* Header */}

                    {/* Company Info */}
                    <div className="bg-white">
                        <div className="flex items-center gap-3 border-b p-4 text-xl font-medium">
                            <Link href="/invitation">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                            <span>Participant Confirmation</span>
                        </div>
                        <div className="space-y-4 p-4">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Company Name
                                </p>
                                <p className="font-medium">
                                    {item.company?.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    PIC Name
                                </p>
                                <p className="font-medium">
                                    {order?.user?.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    PIC Email
                                </p>
                                <p className="font-medium">
                                    {order?.user?.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    PIC Phone Number
                                </p>
                                <p className="font-medium">
                                    {order?.user?.phone}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Participant
                                </p>
                                <p className="font-medium">
                                    {item.participant?.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Participant List */}
                    <div className="h-full min-h-[500px] space-y-3 bg-white p-5">
                        <div>
                            <p className="font-medium">Participant Details</p>
                            <p className="text-sm text-gray-500">
                                Select participant that will attend at the event
                            </p>
                        </div>

                        <div className="space-y-4">
                            {item.participant?.map((p) => (
                                <label
                                    key={p.id}
                                    htmlFor={`participant-${p.id}`}
                                    className="flex cursor-pointer items-center space-x-3"
                                >
                                    <Checkbox
                                        id={`participant-${p.id}`}
                                        checked={selectedParticipants.includes(
                                            p.id,
                                        )}
                                        onCheckedChange={() =>
                                            toggleParticipant(p.id)
                                        }
                                    />
                                    <span>{p.user?.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed inset-x-0 bottom-0 border-t bg-white p-4">
                <div className="flex items-center justify-between">
                    <Button
                        disabled={loading}
                        onClick={() => handleSubmitAttendance('not_attend')}
                        variant="ghost"
                        className="dark:text-secondary dark:hover:bg-primary"
                    >
                        Not Attend
                    </Button>

                    <Button
                        disabled={loading}
                        onClick={() => handleSubmitAttendance('attend')}
                    >
                        Attend
                    </Button>
                </div>
            </div>
        </div>
    );
}
