import DashedLine from '@/components/dashed-line';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function PaymentPage() {
    const [selectedMethod, setSelectedMethod] = useState('qris');

    const methods = [
        { id: 'qris', label: 'QRIS', img: 'https://placehold.co/100' },
        { id: 'gopay', label: 'Gopay', img: 'https://placehold.co/100' },
        { id: 'shopee', label: 'ShopeePay', img: 'https://placehold.co/100' },
    ];

    return (
        <PublicLayout title="Payment">
            <div className="relative flex w-full flex-col items-center justify-center">
                <div className="w-full">
                    <Tabs className="mx-auto flex w-full">
                        <TabsList className="w-full border-b border-[#D9D9D9] bg-transparent py-5">
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
                                <TicketSummaryCard />

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
                                                        className="h-12 w-12 object-contain"
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
                                                Rp517.500
                                            </div>
                                        </div>
                                        <Button className="w-full rounded-lg bg-primary py-5 text-base text-white">
                                            Pay Transaction
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="2">
                            {/* Payment Method Card */}
                        </TabsContent>
                        <TabsContent value="3">
                            {/* E-Ticket Card */}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </PublicLayout>
    );
}

/* --- Ticket Summary Component --- */
function TicketSummaryCard() {
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
                        <LineItem
                            title="Early Bird Pass"
                            right="Rp300.000"
                            sub="Rp150.000 × 2"
                        />

                        <LineItem
                            title="Reguler Pass"
                            right="Rp450.000"
                            sub="Rp150.000 × 3"
                        />
                    </DashedSection>
                    <DashedLine />

                    <DashedSection>
                        <LineItem title="Subtotal" right="Rp450.000" />
                        <LineItem title="Service (5%)" right="Rp22.500" />
                        <LineItem title="Tax (10%)" right="Rp45.000" />
                    </DashedSection>
                    <DashedLine />

                    <div className="flex items-center justify-between pt-1 font-medium">
                        <span>Total Payment</span>
                        <span>Rp517.000</span>
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
