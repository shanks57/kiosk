import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { OrderItemType } from '@/types';
import { Link } from '@inertiajs/react';

const items = [
    {
        name: 'Banner',
        href: '#',
        src: '/images/invitations/section-1.png',
    },
    {
        name: 'Rundown',
        href: '#',
        src: '/images/invitations/section-2.png',
    },
    {
        name: 'Venue',
        href: '#',
        src: '/images/invitations/section-3.png',
    },
    {
        name: 'Day1',
        href: '#',
        src: '/images/invitations/section-4.png',
    },
    {
        name: 'Day2',
        href: '#',
        src: '/images/invitations/section-5.png',
    },
    {
        name: 'Day3',
        href: '#',
        src: '/images/invitations/section-6.png',
    },
    {
        name: 'Terms & Conditions',
        href: '#',
        src: '/images/invitations/section-7.png',
    },
];

export default function Invitation(props: {
    item: OrderItemType;
    code: string;
}) {
    const { code, item } = props;
    return (
        <div className="flex min-h-screen w-screen flex-col bg-black">
            <Toaster />

            <div className="flex items-center justify-between bg-white p-3 dark:bg-primary">
                <h4 className="text-[10px] font-medium dark:text-secondary">
                    This Ticketing System <br /> Powered by
                </h4>
                <Link href="/">
                    <img
                        className="h-4 w-auto"
                        src="/assets/icon.svg"
                        alt="tron-logo"
                    />
                </Link>
            </div>
            <div className="flex flex-col gap-y-0 overflow-y-auto pb-24">
                {items.map((item, i) => (
                    <img
                        key={i}
                        src={item.src}
                        alt={item.name}
                        className="h-auto w-full"
                    />
                ))}
            </div>
            <div className="fixed inset-x-0 bottom-0 bg-white p-4 dark:bg-primary">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold dark:text-secondary">
                        Make a reservation
                    </h4>
                    <Link href={`/invitation/${code}/detail`}>
                        <Button size="sm">Reserve Now</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
