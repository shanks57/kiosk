import DashedLine from '@/components/dashed-line';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import { EventType, SharedData, TicketCategoryType } from '@/types';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Calendar, ChevronDown, ChevronRight, Download } from 'lucide-react';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

export default function PaymentPage(
    props: SharedData & {
        ticketCategories: TicketCategoryType[];
        event: EventType;
    },
) {
    const { event, auth } = props;
    const [selectedMethod, setSelectedMethod] = useState('qris');
    const [tabValue, setTabValue] = useState('1');

    // Parse query params for `event_id` and `tickets[...]`
    const query =
        typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search)
            : new URLSearchParams();
    const eventId = query.get('event_id');

    const tickets: Record<string, number> = {};
    for (const [key, value] of query.entries()) {
        const m = key.match(/^tickets\[(.+)\]$/);
        if (m) {
            const ticketKey = m[1];
            tickets[ticketKey] = Number(value) || 0;
        }
    }

    // ticketCategories comes from the controller (paginated). Try to find categories for the event.
    const ticketCategories = props.ticketCategories || [];
    const eventCategories = eventId
        ? ticketCategories.filter(
              (tc: any) => String(tc.event_id) === String(eventId),
          )
        : [];

    // Helper: find category by a short key (e.g., 'early' -> 'Early')
    const findCategoryByKey = (key: string) => {
        const q = key.toLowerCase();
        return (
            eventCategories.find((c: any) =>
                String(c.name).toLowerCase().includes(q),
            ) ||
            eventCategories[0] ||
            null
        );
    };

    // Build items array for rendering
    const items = Object.entries(tickets)
        .filter(([, cnt]) => cnt > 0)
        .map(([k, cnt]) => {
            const category = findCategoryByKey(k);
            const price = category ? Number(category.price) : 0;
            const name = category ? category.name : k;
            return {
                key: k,
                name,
                count: cnt,
                price,
                subtotal: price * cnt,
            };
        });

    const subtotal = items.reduce((s, it) => s + it.subtotal, 0);
    const service = subtotal * 0.05;
    const tax = subtotal * 0.1;
    const total = subtotal + service + tax;

    const methods = [
        {
            id: 'qris',
            label: 'QRIS',
            img: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/QRIS_Logo.svg',
        },
        {
            id: 'gopay',
            label: 'Gopay',
            img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/1200px-Gopay_logo.svg.png',
        },
        {
            id: 'shopee',
            label: 'ShopeePay',
            img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjC8J0HHOLKSppss14Im84sOJ5D-qB0LAKsxZ8esss0VNs2LJhNYR4S9KCDV7q-U332uEe9BlF1E7rzW6tqvrZfGiivxobhls2I2E9dWgok7LzdJuNOp_s-h4RmUvc4ENhs-RZ9hVEgrPkK9DUlTvhzOFY-WW0CYEAI_xgSFRjmLLYf77QOxNC5yg/w320-h141/ShopeePay%20Logo%20-%20%20(Koleksilogo.com).png',
        },
    ];

    const handlePayment = () => {
        toast.success('Payment successful!');
        setTabValue('2');
    };

    const handlePaid = () => {
        console.log(tickets, 'TICKETS');
        const ticketIds = Object.entries(tickets).map(
            ([ticketName, ticketCount]) => ({
                ticket_category_id: ticketCategories.find(
                    (tc) => tc.name === ticketName,
                )?.id,
                count: ticketCount,
            }),
        );
        axios
            .post(`/checkout/${eventId}/register`, {
                name: auth.user.name,
                email: auth.user.email,
                ticket_category_id: ticketIds[0].ticket_category_id,
            })
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message);
                    toast.success('Payment successful!');
                    setTabValue('3');
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            });
    };

    return (
        <PublicLayout title="Payment">
            <div className="relative flex w-full flex-col items-center justify-center">
                <div className="w-full">
                    <Tabs
                        value={tabValue}
                        defaultValue="1"
                        className="mx-auto flex w-full"
                    >
                        <TabsList className="w-full overflow-scroll border-b border-[#D9D9D9] bg-transparent py-5 pl-44 md:overflow-hidden md:pl-0">
                            <TabsTrigger
                                value="1"
                                className="group data-[state=active]:border-0"
                            >
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                                    1
                                </span>
                                <span className="font-normal text-black">
                                    Ticket Confirmation
                                </span>
                                <ChevronRight />
                            </TabsTrigger>
                            <TabsTrigger
                                value="2"
                                className="group data-[state=active]:border-0"
                            >
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                                    2
                                </span>
                                <span className="font-medium text-black">
                                    Ticket Confirmation
                                </span>
                                <ChevronRight />
                            </TabsTrigger>
                            <TabsTrigger
                                value="3"
                                className="group data-[state=active]:border-0"
                            >
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                                    3
                                </span>
                                <span className="font-medium text-black">
                                    Ticket Confirmation
                                </span>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="1">
                            <div className="mx-auto mt-6 w-full max-w-lg space-y-6">
                                {/* Stepper */}

                                {/* Ticket Confirmation Card */}
                                <TicketSummaryCard
                                    items={items}
                                    subtotal={subtotal}
                                    service={service}
                                    tax={tax}
                                    total={total}
                                />

                                {/* Payment Method Card */}
                                <Card className="rounded-lg border py-4 shadow-none">
                                    <CardContent className="flex flex-col space-y-4 px-4">
                                        <p className="text-base font-medium">
                                            Choose Your Payment Methods
                                        </p>

                                        <div className="grid grid-cols-3 gap-3">
                                            {methods.map((m) => (
                                                <button
                                                    key={m.id}
                                                    onClick={() =>
                                                        setSelectedMethod(m.id)
                                                    }
                                                    className={cn(
                                                        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all',
                                                        selectedMethod === m.id
                                                            ? 'border-2 border-primary bg-blue-50'
                                                            : 'hover:bg-gray-50',
                                                    )}
                                                >
                                                    <img
                                                        src={m.img}
                                                        className="h-10 object-contain"
                                                    />
                                                </button>
                                            ))}
                                        </div>

                                        <button className="mx-auto mt-2 flex items-center gap-2 text-center text-sm text-primary">
                                            See 3 other payment methods{' '}
                                            <ChevronDown size={16} />
                                        </button>
                                    </CardContent>
                                </Card>

                                {/* Total Payment Bar */}
                                <Card className="rounded-lg border p-0 shadow-none">
                                    <CardContent className="flex flex-col items-center justify-between space-y-4 px-3 py-4">
                                        <div className="flex w-full items-center justify-between">
                                            <div className="text-base font-medium">
                                                Total Payment
                                            </div>
                                            <div className="text-xl font-semibold">
                                                {new Intl.NumberFormat(
                                                    'id-ID',
                                                    {
                                                        style: 'currency',
                                                        currency: 'IDR',
                                                        maximumFractionDigits: 0,
                                                    },
                                                ).format(total)}
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handlePayment}
                                            disabled={total <= 0}
                                            className="w-full rounded-lg bg-primary py-5 text-base text-white"
                                        >
                                            Pay Transaction
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="2">
                            <div className="mx-auto w-full max-w-lg py-8">
                                <Card className="overflow-hidden rounded-lg border p-0 shadow-none">
                                    <CardContent className="p-4">
                                        {/* Header */}
                                        <div className="rounded-md border border-primary/50 bg-primary/10 py-4 text-center">
                                            <p className="text-sm text-gray-700">
                                                Please finish your payment in
                                            </p>
                                            <p className="text-xl font-semibold text-primary">
                                                23 : 24 : 52
                                            </p>
                                        </div>

                                        {/* Info */}
                                        <div className="px-6 py-4 text-center">
                                            <p className="leading-tight font-medium">
                                                {event.title}
                                            </p>

                                            <p className="mt-3 flex items-center justify-center gap-2">
                                                <Calendar size={16} />
                                                {`${dayjs(event.start_time).format('DD')} - ${dayjs(event.end_time).format('DD MMMM YYYY, HH:mm')} WIB`}
                                            </p>
                                        </div>

                                        {/* QR Code */}
                                        <div className="flex justify-center py-4">
                                            <div className="rounded-lg bg-white p-2">
                                                <QRCode
                                                    value={
                                                        'https://kawanlelah.com/my-tickets/ETICKET1234567890'
                                                    }
                                                    size={220}
                                                />
                                            </div>
                                        </div>

                                        {/* Total Payment */}
                                        <div className="mx-auto flex max-w-sm justify-between px-6 pt-2 pb-4 text-lg">
                                            <span>Total Payment</span>
                                            <span className="font-semibold">
                                                {total.toLocaleString('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                    maximumFractionDigits: 0,
                                                })}
                                            </span>
                                        </div>

                                        {/* Download */}
                                        <div className="flex justify-center pb-4">
                                            <Button
                                                variant="outline"
                                                className="rounded-lg"
                                            >
                                                <Download /> Download QR Code
                                            </Button>
                                        </div>

                                        {/* Confirm Button */}
                                        <Button
                                            onClick={() => handlePaid()}
                                            className="w-full rounded-sm bg-primary py-5 text-sm text-white"
                                        >
                                            Already made a payment? Confirm
                                            here!
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="3">
                            <div className="mx-auto w-full max-w-lg py-8">
                                <Card className="overflow-hidden rounded-lg border-0 border-none p-0 shadow-none">
                                    <CardContent className="relative rounded-lg border p-0">
                                        <div className="absolute top-[33%] -left-3 z-10 h-6 w-6 rounded-full border border-gray-200 bg-white" />
                                        <div className="absolute top-[33%] -right-3 z-10 h-6 w-6 rounded-full border border-gray-200 bg-white" />

                                        <div className="absolute top-[22%] -left-3 z-10 h-6 w-6 rounded-full border border-gray-200 bg-white" />
                                        <div className="absolute top-[22%] -right-3 z-10 h-6 w-6 rounded-full border border-gray-200 bg-white" />
                                        {/* Title */}
                                        <div className="space-y-4 p-6">
                                            <div className="space-y-2">
                                                <h1 className="text-xl leading-tight font-medium">
                                                    {event.title}
                                                </h1>
                                                <p className="mt-2 text-base text-foreground/40">
                                                    Kode Pemesanan :{' '}
                                                    <span className="font-medium">
                                                        #12512-126
                                                    </span>
                                                </p>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar size={16} />
                                                    {`${dayjs(event.start_time).format('DD')} - ${dayjs(event.end_time).format('DD MMMM YYYY')} ${dayjs(event.start_time).format('HH:mm')} - ${dayjs(event.end_time).format('HH:mm')} WIB`}
                                                </div>
                                            </div>

                                            {/* Event time */}

                                            <div className="border-t-dashed-custom border-t"></div>

                                            {/* Guest */}
                                            <div className="flex justify-between py-2">
                                                <span className="text-gray-500">
                                                    Guest
                                                </span>
                                                <span className="font-medium">
                                                    {auth.user.name}
                                                </span>
                                            </div>

                                            <div className="border-t-dashed-custom border-t"></div>

                                            {/* QR */}
                                            <div className="flex justify-center py-4">
                                                <div className="rounded-lg bg-white p-2">
                                                    <QRCode
                                                        value="TRON-TICKET-ETICKET-123456"
                                                        size={220}
                                                    />
                                                </div>
                                            </div>

                                            <p className="text-center text-gray-400">
                                                Dicetak :{' '}
                                                {dayjs().format(
                                                    'DD MMMM YYYY, HH:mm',
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex gap-2 border-t p-4">
                                            <Link href="/dashboard">
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    size="lg"
                                                >
                                                    <Download />
                                                    Add to Calendar
                                                </Button>
                                            </Link>
                                            <Button
                                                className="w-full"
                                                size="lg"
                                            >
                                                <Download />
                                                Download Ticket
                                            </Button>
                                        </div>
                                    </CardContent>

                                    {/* Footer buttons */}
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </PublicLayout>
    );
}

/* --- Ticket Summary Component --- */
function TicketSummaryCard({
    items,
    subtotal,
    service,
    tax,
    total,
}: {
    items: any[];
    subtotal: number;
    service: number;
    tax: number;
    total: number;
}) {
    const fmt = (v: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(v);

    return (
        <div className="relative overflow-hidden">
            {/* Punch Holes */}
            <div className="absolute top-12 -left-3 z-10 h-6 w-6 rounded-full border border-gray-200 bg-white" />
            <div className="absolute top-12 -right-3 z-10 h-6 w-6 rounded-full border border-gray-200 bg-white" />

            {/* Main Card */}
            <Card className="relative overflow-hidden rounded-lg border py-4 shadow-none">
                <CardContent className="space-y-4">
                    <p className="text-xl font-medium">
                        Your Ticket Confirmation
                    </p>

                    <DashedSection>
                        <DashedLine />

                        {items.length === 0 ? (
                            <p className="py-4 text-center text-sm text-gray-500">
                                No tickets selected.
                            </p>
                        ) : (
                            items.map((it) => (
                                <LineItem
                                    key={it.key}
                                    title={it.name}
                                    right={fmt(it.subtotal)}
                                    sub={`${fmt(it.price)} × ${it.count}`}
                                />
                            ))
                        )}
                    </DashedSection>
                    <DashedLine />

                    <DashedSection>
                        <LineItem title="Subtotal" right={fmt(subtotal)} />
                        <LineItem title="Service (5%)" right={fmt(service)} />
                        <LineItem title="Tax (10%)" right={fmt(tax)} />
                    </DashedSection>
                    <DashedLine />

                    <div className="flex items-center justify-between pt-1 font-medium">
                        <span>Total Payment</span>
                        <span>{fmt(total)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

/* --- Sub Components --- */
function LineItem({
    title,
    right,
    sub,
}: {
    title: string;
    right: string;
    sub?: string;
}) {
    return (
        <div className="flex items-start justify-between py-1 text-sm">
            <div>
                <p className="text-base font-medium">{title}</p>
                {sub && <p className="font-normal text-[#B4B4B4]">{sub}</p>}
            </div>
            <p className="text-base font-normal">{right}</p>
        </div>
    );
}

function DashedSection({ children }: { children: React.ReactNode }) {
    return <div className="space-y-2 border-gray-300 py-2">{children}</div>;
}
