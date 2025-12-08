import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Toaster } from '@/components/ui/sonner';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const participants = ['John Doe', 'John Doe 2', 'John Doe 3'];
export default function InvitationDetail() {
    return (
        <div className="flex min-h-screen w-full flex-col bg-foreground/5">
            <Toaster />
            <div className="flex items-center justify-between bg-white p-4">
                <h4 className="text-xs font-medium">
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
                <div className="mx-auto min-h-screen w-full space-y-3">
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
                                <p className="font-medium">PT Bank Mandiri</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    PIC Name
                                </p>
                                <p className="font-medium">Sofia Chen</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    PIC Email
                                </p>
                                <p className="font-medium">
                                    Sofia.chen@email.com
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    PIC Phone Number
                                </p>
                                <p className="font-medium">+6287812345678</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Participant
                                </p>
                                <p className="font-medium">3 Participants</p>
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
                            {participants.map((p, i) => (
                                <label
                                    key={i}
                                    className="flex items-center space-x-3"
                                >
                                    <Checkbox />
                                    <span>{p}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed inset-x-0 right-0 bottom-0 left-0 border-t bg-white p-4">
                <div className="flex items-center justify-between">
                    <Button onClick={() => toast('Not Attend')} variant="ghost">
                        Not Attend
                    </Button>
                    <Button onClick={() => toast('Attend')}>Attend</Button>
                </div>
            </div>
        </div>
    );
}
