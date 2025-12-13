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
        <div className="flex min-h-screen w-full flex-col bg-black">
            <Toaster />

            <div className="flex items-center justify-between bg-white p-4 dark:bg-primary">
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
            <div className="mx-auto flex max-w-md flex-col gap-y-4 pb-10">
                {items.map((item, i) => (
                    <img
                        key={i}
                        src={item.src}
                        alt={item.name}
                        className="w-full"
                    />
                ))}
            </div>
            <div className="fixed inset-x-0 right-0 bottom-0 left-0 bg-white p-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold dark:text-secondary">
                        Make a reservation
                    </h4>
                    <Link href={`/invitation/${code}/detail`}>
                        <Button>Reserve Now</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
