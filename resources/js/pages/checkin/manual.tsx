import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { OrderItemType } from '@/types';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { ChevronDown } from 'lucide-react';
import { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import Keyboard from 'react-simple-keyboard';

// Instead of the default import, you can also use this:
// import { KeyboardReact as Keyboard } from "react-simple-keyboard"
import 'react-simple-keyboard/build/css/index.css';
import { toast } from 'sonner';

export default function ManualPage() {
    const [layoutName, setLayoutName] = useState('default');
    const keyboard = useRef(null);
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

    const onKeyPress = (button: string) => {
        console.log('Button pressed', button);

        /**
         * If you want to handle the shift and caps lock buttons
         */
        if (button === '{shift}' || button === '{lock}') handleShift();
    };

    const handleShift = () => {
        setLayoutName((prev) => (prev === 'default' ? 'shift' : 'default'));
    };

    // const onChangeInput = (event) => {
    //     const inputVal = event.target.value;

    //     setInputs({
    //         ...inputs,
    //         [inputName]: inputVal,
    //     });

    //     keyboard.current.setInput(inputVal);
    // };

    // const getInputValue = (inputName) => {
    //     return inputs[inputName] || '';
    // };

    return (
        <div className="bg-foreground/10 w-full">
            <div className="relative mx-auto flex h-screen w-full items-center justify-center bg-white">
                <div className="flex flex-col gap-4">
                    <h4 className="font-mediu text-center text-2xl text-black">
                        Input Invitation Code
                    </h4>
                    <Input
                        name="code_invitation"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="text-black w-full"
                    />
                    <Button
                        disabled={loading}
                        onClick={() => handleGetDataParticipant(code)}
                        variant="default"
                        size="lg"
                        className="rounded-sm bg-primary text-white dark:bg-primary-foreground"
                    >
                        Konfirmasi
                    </Button>
                </div>

                <Dialog onOpenChange={setShowModal} open={showModal}>
                    <DialogContent className="max-w-md overflow-hidden rounded-xl p-0">
                        {/* Header Image */}
                        <div className="h-40 w-full overflow-hidden bg-black">
                            <img
                                src={order?.order?.event?.banner || ''}
                                alt={order?.order?.event?.title || ''}
                                className="h-full w-full object-cover object-top"
                            />
                        </div>

                        <div className="space-y-4 px-6 py-4">
                            {/* Event Title */}
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {order?.order?.event?.title || ''}
                                </h2>
                                <p className="text-sm text-gray-600">
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
                            <div className="space-y-3">
                                <h3 className="text-base font-semibold">
                                    Ticket Information
                                </h3>

                                <div className="flex gap-4">
                                    <QRCode
                                        size={100}
                                        value={order?.booking_code || ''}
                                    />

                                    <div className="space-y-1 text-sm">
                                        <div>
                                            <p className="text-gray-500">
                                                Company Name
                                            </p>
                                            <p className="font-medium">
                                                {order?.company?.name || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">
                                                PIC Name
                                            </p>
                                            <p className="font-medium">
                                                {order?.order?.user?.name ||
                                                    '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">
                                                PIC Email
                                            </p>
                                            <p className="font-medium break-all">
                                                {order?.order?.user?.email ||
                                                    '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">
                                                PIC Phone Number
                                            </p>
                                            <p className="font-medium">
                                                {order?.order?.user?.phone ||
                                                    '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">
                                                Participant
                                            </p>
                                            <p className="font-medium">
                                                {order?.participant?.length ||
                                                    '-'}
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

                            <Button
                                onClick={() => handleSubmit(code)}
                                className="h-full w-full rounded-none border-none px-6 py-4"
                            >
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="absolute bottom-0 grid h-[20vh] w-full max-w-md grid-cols-2 bg-white px-6 py-4">
                    <div className="m-auto flex h-full flex-col justify-between gap-3">
                        <p className="text-xs text-black">
                            Masukkan kode secara manual jika{' '}
                            <strong>QR Code tidak terbaca.</strong>
                        </p>
                        <Link href="/checkin/scan">
                            <Button className="w-fit" variant="outline">
                                Check In QR
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
                        <Link href="/checkin/scan">
                            <Button className="flex h-full w-full flex-col items-center justify-center rounded-none bg-primary dark:bg-primary-foreground">
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
                        </Link>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-[10vh] left-1/2 hidden w-3/4 -translate-x-1/2 -translate-y-3/4 transform px-4 md:flex">
                <Keyboard
                    keyboardRef={(r) => (keyboard.current = r)}
                    layoutName={layoutName}
                    onChangeAll={(inp) => setCode(inp['default'])}
                    onKeyPress={(button) => onKeyPress(button)}
                />
            </div>
        </div>
    );
}
