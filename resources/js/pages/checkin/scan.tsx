import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { OrderItemType } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import dayjs from 'dayjs';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

export default function ScanPage() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [order, setOrder] = useState<OrderItemType | null>(null);

    const handleSubmit = async (ticketCode: string) => {
        setLoading(true);
        try {
            // const res = await axios.post('/checkin', { code: ticketCode });
            // setOrder(res.data.item);
            // setCode('');

            // toast.success(JSON.stringify(res.data));
            setShowModal(false);
            setTimeout(() => {
                router.visit(`/invitation/${code}`);
            }, 500);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Check-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGetDataParticipant = async (code: string) => {
        setLoading(true);
        try {
            const res = await axios.get(`/checkin/${code}/participant`);
            setOrder(res.data.item);
            toast.success(JSON.stringify(res.data));
            setShowModal(true);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Check-in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-screen items-center justify-center bg-foreground">
            <div
                className={cn(loading && 'fixed inset-0 z-[100] bg-black/50')}
            />
            <div className="relative h-screen w-screen bg-black">
                <Scanner
                    paused={loading || showModal}
                    onScan={(result) => {
                        handleGetDataParticipant(result[0].rawValue);
                        setCode(result[0].rawValue);
                    }}
                    onError={(error) => toast(error?.toString())}
                />
                <div className="absolute bottom-1/3 left-1/2 z-10 flex w-full -translate-x-1/2 px-4">
                    <Dialog onOpenChange={setShowModal} open={showModal}>
                        {/* <DialogTrigger asChild>
                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full bg-transparent text-xs text-white"
                            >
                                CHECK IN APLI AWARD
                            </Button>
                        </DialogTrigger> */}
                        <DialogContent className="max-w-sm overflow-hidden rounded-xl p-0">
                            {/* Header Image */}
                            <div className="h-32 w-full overflow-hidden bg-black">
                                <img
                                    src={order?.order?.event?.banner || ''}
                                    alt={order?.order?.event?.title || ''}
                                    className="h-full w-full object-cover object-top"
                                />
                            </div>

                            <div className="space-y-3 px-4 py-3">
                                {/* Event Title */}
                                <div>
                                    <h2 className="text-base font-semibold">
                                        {order?.order?.event?.title || ''}
                                    </h2>
                                    <p className="text-xs text-gray-600">
                                        {dayjs(
                                            order?.order?.event?.start_time,
                                        ).format('DD MMM YYYY (ddd)')}{' '}
                                        ~{' '}
                                        {dayjs(
                                            order?.order?.event?.end_time,
                                        ).format('DD MMM YYYY (ddd)')}
                                    </p>
                                </div>

                                {/* Ticket Info */}
                                <div className="space-y-2">
                                    <h3 className="text-sm font-semibold">
                                        Ticket Information
                                    </h3>

                                    <div className="flex gap-3">
                                        <QRCode
                                            size={80}
                                            value={order?.booking_code || ''}
                                        />

                                        <div className="space-y-1 text-xs">
                                            <div>
                                                <p className="text-gray-500">
                                                    Company Name
                                                </p>
                                                <p className="text-xs font-medium">
                                                    {order?.company?.name ||
                                                        '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">
                                                    PIC Name
                                                </p>
                                                <p className="text-xs font-medium">
                                                    {order?.order?.user?.name ||
                                                        '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">
                                                    PIC Email
                                                </p>
                                                <p className="text-xs font-medium break-all">
                                                    {order?.order?.user
                                                        ?.email || '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">
                                                    PIC Phone
                                                </p>
                                                <p className="text-xs font-medium">
                                                    {order?.order?.user
                                                        ?.phone || '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">
                                                    Participant
                                                </p>
                                                <p className="text-xs font-medium">
                                                    {order?.participant
                                                        ?.length || '-'}
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
                                        size="sm"
                                        className="h-full w-full rounded-none border-none px-4 py-3 text-xs text-gray-600"
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button
                                    onClick={() => handleSubmit(code)}
                                    size="sm"
                                    className="h-full w-full rounded-none border-none px-4 py-3 text-xs"
                                >
                                    Confirm
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="absolute bottom-0 grid h-[20vh] w-full grid-cols-2 gap-0 bg-white px-3 py-3">
                    <div className="m-auto flex h-full flex-col justify-between gap-2">
                        <p className="text-[10px] text-black">
                            Masukkan kode secara manual jika{' '}
                            <strong>QR Code tidak terbaca.</strong>
                        </p>
                        <Link href="/checkin/manual">
                            <Button
                                className="h-8 w-fit text-xs"
                                size="sm"
                                variant="outline"
                            >
                                Check In Manual
                            </Button>
                        </Link>
                        <div className="flex items-center justify-between gap-1 bg-white">
                            <p className="text-[9px] font-medium dark:text-secondary">
                                This Ticketing System <br /> Powered by
                            </p>
                            <img
                                className="h-3 w-auto"
                                src="/assets/icon.svg"
                                alt="tron-logo"
                            />
                        </div>
                    </div>
                    <div className="px-2">
                        <Button className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-none bg-primary dark:bg-primary-foreground">
                            <p className="text-sm font-medium text-white dark:text-foreground">
                                Scan QR
                            </p>
                            <img
                                className="h-12 w-12"
                                src="/assets/hand-scan.svg"
                                alt="scan-qr"
                            />
                            <ChevronDown size={14} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
