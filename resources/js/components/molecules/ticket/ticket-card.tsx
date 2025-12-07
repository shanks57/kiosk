import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageCircleQuestion } from "lucide-react";

export const TicketCard = ({
    title,
    price,
}: {
    title: string;
    price: string;
}) => {
    return (
        <div className="relative overflow-hidden">
            <div className="absolute top-[20%] -left-3 z-60 h-6 w-6 rounded-full border border-gray-200 bg-white" />
            <div className="absolute top-[20%] -right-3 z-60 h-6 w-6 rounded-full border border-gray-200 bg-white" />
            <div className="rounded-md border px-6 py-4">
                <div className="mb-2 flex justify-between text-xl font-medium">
                    <div className="flex items-center gap-4">
                        {title}
                        <Tooltip>
                            <TooltipTrigger>
                                <MessageCircleQuestion className="h-4 w-4 text-gray-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs">
                                    This ticket includes access to the event and
                                    all its activities.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <span>{price}</span>
                </div>
                <div className="border-t-dashed-custom space-y-2 py-4">
                    <p className="text-base font-medium">
                        Syarat dan Ketentuan
                    </p>
                    <p className="">
                        The tour follows the release of Rich Brian’s latest
                        album WHERE IS MY HEAD? on August 15th - his first
                        full-length album since 2019 - promising an
                        unforgettable experience of fresh music, fan favourites
                        and connection with audiences worldwide.
                    </p>
                </div>
            </div>
        </div>
    );
};
