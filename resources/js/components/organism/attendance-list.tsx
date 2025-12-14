import { ParticipantModal } from '@/components/modals/participant-modal';
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
import { cn } from '@/lib/utils';
import { AttendancePageProps } from '@/pages/organizer/events/show';
import { OrderType } from '@/types';
import { Link, router } from '@inertiajs/react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { MessageCircleQuestion, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import ParticipantDetailModal from '../modals/participant-detail-modal';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
export const AttendanceList = (props: AttendancePageProps) => {
    const { event, ticketCategories, participants } = props;

    const [filter, setFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteOrder = async () => {
        if (!selectedOrder) return;
        setIsDeleting(true);
        try {
            router.delete(
                `/dashboard/events/${event.id}/orders/${selectedOrder.id}`,
                {
                    onSuccess: () => {
                        toast.success('Order deleted successfully');
                        setDeleteDialogOpen(false);
                        setSelectedOrder(null);
                    },
                    onError: (errors) => {
                        console.error('Delete error:', errors);
                        toast.error('Failed to delete order');
                    },
                },
            );
        } catch (error) {
            toast.error('Error deleting order');
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleOpenDeleteDialog = (order: OrderType) => {
        setSelectedOrder(order);
        setDeleteDialogOpen(true);
    };

    const columns: ColumnDef<OrderType>[] = [
        {
            accessorKey: 'ticket_code',
            header: 'Event Code',
            cell: ({ row }) => (
                <span>{row.original.ticket_code?.toUpperCase()}</span>
            ),
        },
        {
            accessorKey: 'user.company.name',
            header: 'Company',
        },
        { accessorKey: 'user.name', header: 'PIC' },
        { accessorKey: 'user.email', header: 'Email PIC' },
        {
            accessorKey: 'user.phone',
            header: 'No PIC',
        },
        {
            accessorKey: 'participant_count',
            header: 'Participant',
        },
        {
            accessorKey: 'last_checkin_time',
            header: 'Last Check In',
        },
        {
            accessorKey: 'attendance_status',
            header: 'Status',
            cell: ({ row }) => {
                const v: string | undefined =
                    row.getValue('attendance_status') || undefined;
                return (
                    <span
                        className={cn('rounded-sm px-2 py-1 text-sm', {
                            'bg-primary/80 text-white': v === 'checked-in',
                            'bg-red-500 text-white': v !== 'checked-in',
                        })}
                    >
                        {v}
                    </span>
                );
            },
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: ({ row }) => {
                const data: OrderType = row.original;
                return (
                    <div className="flex gap-3">
                        <ParticipantDetailModal data={data} event={event} />

                        <button
                            onClick={() => handleOpenDeleteDialog(data)}
                            className="text-sm transition-colors hover:text-red-600"
                            title="Delete order"
                        >
                            <Trash size={16} className="text-gray-500" />
                        </button>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: participants.data,
        columns,
        state: { sorting, globalFilter: filter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-4">
            <Card className="w-sm p-4 shadow-none">
                <div className="relative flex items-center gap-4">
                    <img
                        src="/images/presence-ticket.svg"
                        alt="presence"
                        className="mb-2 w-16"
                    />
                    <Link href={`/dashboard/events/${event.id}`}>
                        <h2 className="text-base text-foreground/50">
                            Presence Ticket
                        </h2>
                        <p className="text-foreground/50">
                            <span className="text-2xl text-foreground">
                                1.240
                            </span>{' '}
                            / 1.800
                        </p>
                    </Link>
                    <MessageCircleQuestion
                        size={20}
                        className="absolute top-0 right-0 text-foreground/70"
                    />
                </div>
            </Card>

            <Card className="p-4 shadow-none">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-lg">Attendance Records</p>
                        <p className="text-sm text-foreground/50">
                            Records and displays when each user scans their
                            ticket. It shows who checked in, the time of the
                            scan, and their attendance status.
                        </p>
                    </div>
                    <ParticipantModal
                        eventId={event.id}
                        ticketCategories={ticketCategories}
                    />
                </div>
                <div className="min-h-[60vh] rounded-md border bg-white">
                    {/* Hidden QR renderer used for ticket print/export */}
                    {/* <div
                        ref={qrWrapperRef as any}
                        style={{
                            position: 'absolute',
                            left: -9999,
                            top: -9999,
                            visibility: 'hidden',
                        }}
                    >
                        {printCode ? <QRCode value={printCode} /> : null}
                    </div> */}
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((hg) => (
                                <TableRow key={hg.id}>
                                    {hg.headers.map((h) => (
                                        <TableHead
                                            key={h.id}
                                            className="cursor-pointer select-none"
                                            onClick={h.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                h.column.columnDef.header,
                                                h.getContext(),
                                            )}
                                            {h.column.getIsSorted() === 'asc' &&
                                                ' ▲'}
                                            {h.column.getIsSorted() ===
                                                'desc' && ' ▼'}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Prev
                    </Button>
                    <span>
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </Card>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Delete Order Participant Company
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this order? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="py- grid grid-cols-2 space-y-2">
                            <span className="font-semibold">Ticket Code:</span>
                            <p className="text-sm">
                                {' '}
                                {selectedOrder.ticket_code}
                            </p>
                            <span className="font-semibold">Company:</span>{' '}
                            <p className="text-sm">
                                {selectedOrder.user?.company?.name}
                            </p>
                            <span className="font-semibold">PIC:</span>{' '}
                            <p className="text-sm">
                                {selectedOrder.user?.name}
                            </p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteOrder}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
