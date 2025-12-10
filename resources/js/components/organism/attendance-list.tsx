import { ParticipantModal } from '@/components/modals/participant-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AttendancePageProps } from '@/pages/organizer/events/show';
import { ParticipantType } from '@/types';
import { Link } from '@inertiajs/react';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
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
import axios from 'axios';
import dayjs from 'dayjs';
import {
    ArrowLeft,
    Eye,
    MessageCircleQuestion,
    Ticket,
    Trash,
} from 'lucide-react';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
export const AttendanceList = (props: AttendancePageProps) => {
    console.log(props);
    const { event, ticketCategories, participants } = props;
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filter, setFilter] = useState('');

    const [seats, setSeats] = useState([
        { id: 1, value: '2C' },
        { id: 2, value: '2C' },
    ]);

    const addSeat = () => {
        const newId = seats.length ? seats[seats.length - 1].id + 1 : 1;
        setSeats([...seats, { id: newId, value: '' }]);
    };

    const updateSeat = (id: number, value: string) => {
        setSeats(seats.map((s) => (s.id === id ? { ...s, value } : s)));
    };

    const removeSeat = (id: number) => {
        setSeats(seats.filter((s) => s.id !== id));
    };

    const handleDelete = (id: number) => {
        axios
            .delete('/dashboard/events/' + event.id + '/participants/' + id)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                toast(error.response.data.message);
            });
    };

    const columns: ColumnDef<ParticipantType>[] = [
        {
            accessorKey: 'booking_code',
            header: 'Event Code',
            cell: ({ row }) => row.id,
        },
        {
            accessorKey: 'order.user.company',
            header: 'Company',
            cell: ({ row }) => {
                const v: string | undefined =
                    row.getValue('order.user.company') || undefined;
                return <span className="text-sm">{v || 'N/A'}</span>;
            },
        },
        { accessorKey: 'order.user.name', header: 'PIC' },
        { accessorKey: 'order.user.email', header: 'Email PIC' },
        {
            accessorKey: 'order.user.phone',
            header: 'No PIC',
            cell: ({ row }) => {
                const v: string | undefined =
                    row.getValue('order.user.phone') || undefined;
                return <span className="text-sm">{v || 'N/A'}</span>;
            },
        },
        {
            accessorKey: 'participant',
            header: 'Participant',
            cell: ({ row }) => {
                const v: string | undefined =
                    row.getValue('participant') || undefined;
                return <span className="text-sm">{v || 'N/A'}</span>;
            },
        },
        {
            accessorKey: 'date',
            header: 'Last Check In',
            cell: ({ row }) => {
                const v: string | undefined = row.getValue('date') || undefined;
                return (
                    <span className="text-sm">
                        {v ? dayjs(v).format('YYYY-MM-DD') : 'N/A'}
                    </span>
                );
            },
        },
        {
            accessorKey: 'order.attendance_status',
            header: 'Status',
            cell: ({ row }) => {
                const value = row.original.order.attendance_status;
                return (
                    <span
                        className={
                            value !== 'absent'
                                ? 'rounded bg-blue-100 px-2 py-1 text-xs text-blue-600'
                                : 'rounded bg-red-100 px-2 py-1 text-xs text-red-600'
                        }
                    >
                        {value || 'Absence'}
                    </span>
                );
            },
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: ({ row }) => {
                const v: string = row.getValue('status');
                const data = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <span className="text-sm">
                                    <Eye size={16} className="text-gray-500" />
                                </span>
                            </SheetTrigger>
                            <SheetContent className="!max-w-2xl gap-0 space-y-0">
                                <div className="w-full border-b p-2">
                                    <Button variant="ghost">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="grid h-full grid-cols-2">
                                    {/* Left Section - Participant Information */}
                                    <div className="h-full border p-6">
                                        <SheetTitle className="mb-4 text-lg font-semibold">
                                            Participant Information
                                        </SheetTitle>
                                        {/* <h2 className="mb-4 text-lg font-semibold">
                                            Participant Information
                                        </h2> */}
                                        <div className="text-sm">
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-sm">
                                                    <Label>Company Name</Label>
                                                    <span className="font-medium">
                                                        {
                                                            data.order.user
                                                                ?.company?.name
                                                        }
                                                    </span>
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between text-sm">
                                                    <Label>PIC Name</Label>
                                                    <span className="font-medium">
                                                        {data.order.user?.name}
                                                    </span>
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between text-sm">
                                                    <Label>PIC Email</Label>
                                                    <span className="font-medium">
                                                        {data.order.user?.email}
                                                    </span>
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between text-sm">
                                                    <Label>
                                                        PIC Phone Number
                                                    </Label>
                                                    <span className="font-medium">
                                                        {/* {data.order.user} */}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section - Ticket Information */}
                                    <div className="h-full">
                                        <div className="flex cursor-pointer items-center justify-start gap-1 border-b p-2 text-sm text-primary">
                                            <Ticket /> Ticket
                                        </div>
                                        <div className="p-2">
                                            <div className="h-full space-y-6 rounded-md border p-4">
                                                <h3 className="text-lg font-medium">
                                                    Ticket Information
                                                </h3>

                                                {/* QR Placeholder */}
                                                <div className="flex gap-4">
                                                    <div className="flex h-40 w-40 items-center justify-center rounded-md bg-gray-200">
                                                        <QRCode
                                                            value={
                                                                data.order
                                                                    ?.ticket_code ||
                                                                ''
                                                            }
                                                        />
                                                    </div>
                                                    <span className="text-base font-medium">
                                                        {
                                                            data?.order
                                                                ?.ticket_code
                                                        }
                                                    </span>
                                                </div>

                                                <div className="border-t-dashed-custom"></div>
                                                {/* Seat Information */}
                                                <div>
                                                    <h4 className="mb-3 font-medium">
                                                        Seat Information
                                                    </h4>
                                                    <div>
                                                        <Label className="">
                                                            Participant Name
                                                        </Label>
                                                        <Input />
                                                    </div>
                                                    <div>
                                                        <Label className="">
                                                            Phone Number
                                                        </Label>
                                                        <Input />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <Label className="">
                                                            Seat Information
                                                        </Label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                type="text"
                                                                className="w-24 py-1"
                                                                // value={
                                                                //     seat.value
                                                                // }
                                                                // onChange={(e) =>
                                                                //     updateSeat(
                                                                //         seat.id,
                                                                //         e.target
                                                                //             .value,
                                                                //     )
                                                                // }
                                                            />
                                                            <Trash
                                                                className="h-5 w-5 cursor-pointer text-foreground/50"
                                                                // onClick={() =>
                                                                //     removeSeat(
                                                                //         seat.id,
                                                                //     )
                                                                // }
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* <div className="space-y-2">
                                                        {seats.map(
                                                            (seat, index) => (
                                                                <div
                                                                    key={
                                                                        seat.id
                                                                    }
                                                                    className="flex items-center justify-between"
                                                                >
                                                                    <Label className="w-20">
                                                                        Seat{' '}
                                                                        {index +
                                                                            1}
                                                                    </Label>
                                                                    <div className="flex items-center gap-2">
                                                                        <Input
                                                                            type="text"
                                                                            className="w-24 py-1"
                                                                            value={
                                                                                seat.value
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                updateSeat(
                                                                                    seat.id,
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                        <Trash
                                                                            className="h-5 w-5 cursor-pointer text-foreground/50"
                                                                            onClick={() =>
                                                                                removeSeat(
                                                                                    seat.id,
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div> */}

                                                    <div className="flex justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="mt-2 text-right text-primary"
                                                            onClick={addSeat}
                                                        >
                                                            + Add Participant
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                        <Dialog>
                            <DialogTrigger asChild>
                                <span className="text-sm">
                                    <Trash
                                        size={16}
                                        className="text-gray-500"
                                    />
                                </span>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Delete Participant?
                                    </DialogTitle>
                                    <DialogDescription>
                                        Are you sure delete participant{' '}
                                        {row.original.order?.user?.name} ?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="flex justify-end gap-2 p-2">
                                    <DialogClose asChild>
                                        <Button type="button" variant="default">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        onClick={() =>
                                            handleDelete(row.original.order_id)
                                        }
                                        type="button"
                                        variant="ghost"
                                    >
                                        Delete
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
        </div>
    );
};
