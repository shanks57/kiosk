import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { MessageCircleQuestion, QrCode as QrCodeIcon } from 'lucide-react';
import QRCode from 'react-qr-code';

export const TicketCard = ({
    title,
    price,
    qrCode,
    description = `The tour follows the release of Rich Brian’s latest
                            album WHERE IS MY HEAD? on August 15th - his first
                            full-length album since 2019 - promising an
                            unforgettable experience of fresh music, fan
                            favourites and connection with audiences worldwide.`,
}: {
    title: string;
    price: string;
    description?: string;
    qrCode?: string;
}) => {
    return (
        <div className="relative overflow-hidden">
            <div className="absolute top-[20%] -left-3 z-60 h-6 w-6 rounded-full border border-gray-200 bg-white" />
            <div className="absolute top-[20%] -right-3 z-60 h-6 w-6 rounded-full border border-gray-200 bg-white" />
            <div className="rounded-md border px-6 py-4">
                <div className="mb-2 flex justify-between text-xl font-medium">
                    <div className="flex items-center gap-4">
                        {title}
                        {!qrCode ? (
                            <Tooltip>
                                <TooltipTrigger>
                                    <MessageCircleQuestion className="h-4 w-4 text-gray-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs">
                                        This ticket includes access to the event
                                        and all its activities.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <QrCodeIcon className="h-4 w-4 text-gray-500" />
                                </DialogTrigger>
                                <DialogContent className='w-fit'>
                                    <DialogTitle>QR Code</DialogTitle>
                                    <QRCode value={qrCode} size={200} />
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                    <span>{price}</span>
                </div>
                <div className="border-t-dashed-custom space-y-2 py-4">
                    {description && (
                        <p className="text-base font-medium">
                            Syarat dan Ketentuan
                        </p>
                    )}
                    {description && (
                        <p className="max-h-[130px] overflow-y-auto">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
