import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Link } from '@inertiajs/react';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

export default function ScanPage() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [showScan, setShowScan] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/checkin', { code });
            toast.success(res.data.message || 'Checked in successfully');
            setCode('');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Check-in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-foreground">
            <div className="relative mx-auto h-screen w-full max-w-md bg-black">
                {showScan && (
                    <Scanner
                        onScan={(result) => console.log(result)}
                        onError={(error) => console.log(error)}
                    />
                )}
                <div className="absolute bottom-1/5 left-1/2 flex w-full -translate-x-1/2 -translate-y-[80%] px-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full bg-transparent text-white"
                            >
                                CHECK IN APLI AWARD
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md overflow-hidden rounded-xl p-0">
                            {/* Header Image */}
                            <div className="h-40 w-full overflow-hidden bg-black">
                                <img
                                    src="/images/invitations/section-1.png"
                                    alt="APLI Award Header"
                                    className="h-full w-full object-cover object-top"
                                />
                            </div>

                            <div className="space-y-4 px-6 py-4">
                                {/* Event Title */}
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        APLI Award
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        11-15 December 2025, 12:00
                                    </p>
                                </div>

                                {/* Ticket Info */}
                                <div className="space-y-3">
                                    <h3 className="text-base font-semibold">
                                        Ticket Information
                                    </h3>

                                    <div className="flex gap-4">
                                        <QRCode
                                            size={100}
                                            value="https://google.com"
                                        />

                                        <div className="space-y-1 text-sm">
                                            <div>
                                                <p className="text-gray-500">
                                                    Company Name
                                                </p>
                                                <p className="font-medium">
                                                    PT Bank Mandiri
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">
                                                    PIC Name
                                                </p>
                                                <p className="font-medium">
                                                    Sofia Chen
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">
                                                    PIC Email
                                                </p>
                                                <p className="font-medium break-all">
                                                    Sofia.chen@email.com
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">
                                                    PIC Phone Number
                                                </p>
                                                <p className="font-medium">
                                                    +6287812345678
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">
                                                    Participant
                                                </p>
                                                <p className="font-medium">
                                                    3 Participants
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="grid grid-cols-2 border-t bg-white">
                                <DialogClose asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-full w-full rounded-none border-none px-6 py-4 text-gray-600"
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Link href="/invitation">
                                    <Button className="h-full w-full rounded-none border-none px-6 py-4">
                                        Confirm
                                    </Button>
                                </Link>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="absolute bottom-0 grid h-[20vh] w-full grid-cols-2 bg-white px-6 py-4">
                    <div className="m-auto flex h-full flex-col justify-between gap-3">
                        <p className="text-black text-xs">
                            Masukkan kode secara manual jika{' '}
                            <strong>QR Code tidak terbaca.</strong>
                        </p>
                        <Link href="/checkin/manual">
                            <Button className="w-fit" variant="outline">
                                Check In Manual
                            </Button>
                        </Link>
                        <div className="flex items-center justify-between bg-white">
                            <p className="text-xs font-medium dark:text-secondary">
                                This Ticketing System <br /> Powered by
                            </p>
                            <img
                                className="h-4 w-auto"
                                src="/assets/icon.svg"
                                alt="tron-logo"
                            />
                        </div>
                    </div>
                    <div className="px-6">
                        <Button
                            onClick={() => setShowScan(!showScan)}
                            className="flex h-full w-full flex-col items-center justify-center rounded-none bg-primary dark:bg-primary-foreground"
                        >
                            <p className="text-lg font-medium text-white dark:text-foreground">
                                Scan QR
                            </p>
                            <img
                                className="h-20 w-20"
                                src="/assets/hand-scan.svg"
                                alt="scan-qr"
                            />
                            <ChevronDown size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
