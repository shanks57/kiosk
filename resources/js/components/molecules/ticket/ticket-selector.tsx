import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { MessageCircleQuestion, Minus, Plus } from 'lucide-react';

export const TicketSelector = ({
    title,
    price,
    count,
    inc,
    dec,
}: {
    title: string;
    price: string;
    count: number;
    inc: () => void;
    dec: () => void;
}) => {
    return (
        <div className="flex items-center justify-between rounded-md px-3 py-3 hover:bg-primary/10">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <p className="font-medium">{title}</p>
                    <Tooltip>
                        <TooltipTrigger>
                            <MessageCircleQuestion className="h-4 w-4 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">
                                This ticket includes access to the event and all
                                its activities.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <p className="">Rp{price}</p>
            </div>
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={dec}
                    className="h-8 w-8 rounded-sm"
                >
                    <Minus size={16} />
                </Button>
                <span>{count}</span>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={inc}
                    className="h-8 w-8 rounded-sm"
                >
                    <Plus size={16} />
                </Button>
            </div>
        </div>
    );
};
