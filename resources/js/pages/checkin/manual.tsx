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
        <div className="w-screen bg-foreground/10">
            <div className="relative mx-auto flex h-screen w-screen flex-col items-center justify-center gap-6 bg-white px-4">
                <div className="flex w-full max-w-xs flex-col gap-4">
                    <h4 className="text-center text-xl font-medium text-black">
                        Input Invitation Code
                    </h4>
                    <Input
                        name="code_invitation"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full text-sm text-black"
                    />
                    <Button
                        disabled={loading}
                        onClick={() => handleGetDataParticipant(code)}
                        variant="default"
                        size="lg"
                        className="rounded-sm bg-primary text-sm text-white dark:bg-primary-foreground"
                    >
                        Konfirmasi
                    </Button>
                </div>

                <Dialog onOpenChange={setShowModal} open={showModal}>
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
                                            <p className="text-xs text-gray-500">
                                                Company Name
                                            </p>
                                            <p className="text-xs font-medium">
                                                {order?.company?.name || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                PIC Name
                                            </p>
                                            <p className="text-xs font-medium">
                                                {order?.order?.user?.name ||
                                                    '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                PIC Email
                                            </p>
                                            <p className="text-xs font-medium break-all">
                                                {order?.order?.user?.email ||
                                                    '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                PIC Phone
                                            </p>
                                            <p className="text-xs font-medium">
                                                {order?.order?.user?.phone ||
                                                    '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Participant
                                            </p>
                                            <p className="text-xs font-medium">
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

                <div className="absolute bottom-0 grid h-[28vh] w-full grid-cols-2 gap-0 bg-white px-3 py-3">
                    <div className="m-auto flex h-full flex-col justify-between gap-2">
                        <p className="text-[10px] text-black">
                            Masukkan kode secara manual jika{' '}
                            <strong>QR Code tidak terbaca.</strong>
                        </p>
                        <Link href="/checkin/scan">
                            <Button
                                className="h-8 w-fit text-xs"
                                size="sm"
                                variant="outline"
                            >
                                Check In QR
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
                        <Link href="/checkin/scan" className="h-full w-full">
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
                        </Link>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-[20vh] left-1/2 hidden w-full max-w-xs -translate-x-1/2 transform px-4 md:flex">
                <Keyboard
                    keyboardRef={(r) => (keyboard.current = r)}
                    layoutName={layoutName}
                    onChangeAll={(inp) => setCode(inp['default'])}
                    onKeyPress={(button) => onKeyPress(button)}
                    display={{
                        '{bksp}': 'backspace',
                        '{enter}': 'enter',
                        '{shift}': 'shift',
                        '{tab}': 'tab',
                    }}
                />
            </div>
        </div>
    );
}
