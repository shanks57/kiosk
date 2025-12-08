import TicketCategoryModal from '@/components/modals/ticket-category-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatRupiah } from '@/lib/utils';
import { AttendancePageProps } from '@/pages/organizer/events/show';
import { TicketCategoryType } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const TicketCategoryList = (props: AttendancePageProps) => {
    const { event, ticketCategories } = props;
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] =
        useState<TicketCategoryType | null>(null);
    return (
        <Card className="p-4 shadow-none">
            <div className="mx-auto w-full">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-lg">Ticket Categories</p>
                        <p className="text-sm text-foreground/50">
                            Records of ticket categories
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            onClick={() => {
                                setSelectedCategory(null);
                                setModalOpen(true);
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Button>
                    </div>
                </div>

                <Card className="rounded-sm px-2 py-0 shadow-none">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Quota</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ticketCategories.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell>
                                        Rp
                                        {formatRupiah(c.price ?? 0)}
                                    </TableCell>
                                    <TableCell>{c.quota ?? '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    setSelectedCategory(c);
                                                    setModalOpen(true);
                                                }}
                                            >
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={async () => {
                                                    if (
                                                        !confirm(
                                                            'Delete this ticket category?',
                                                        )
                                                    )
                                                        return;
                                                    try {
                                                        await axios.delete(
                                                            `/dashboard/events/${event.id}/ticket-categories/${c.id}`,
                                                        );
                                                        toast.success(
                                                            'Category deleted',
                                                        );
                                                        router.reload();
                                                    } catch (err: any) {
                                                        toast.error(
                                                            err.response?.data
                                                                ?.message ||
                                                                'Delete failed',
                                                        );
                                                    }
                                                }}
                                            >
                                                <Trash className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                <TicketCategoryModal
                    open={modalOpen}
                    onOpenChange={(v) => {
                        setModalOpen(v);
                        setSelectedCategory(null);
                    }}
                    eventId={event.id as number}
                    category={selectedCategory}
                />
            </div>
        </Card>
    );
};
