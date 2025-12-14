import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, EventType, PaginationType } from '@/types';
import { Head, Link } from '@inertiajs/react';
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
import { Eye, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Events',
        href: '/dashboard/events',
    },
];

export default function EventsPage(props: {
    events: PaginationType<EventType>;
}) {
    const { events } = props;
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filter, setFilter] = useState('');

    const handleDelete = (id: number) => {
        // axios
        //     .delete('/dashboard/events/' + id)
        //     .then(() => {
        //         toast('Event deleted');
        //     })
        //     .catch((error) => {
        //         toast(error.response.data.message);
        //     });
    };

    const columns: ColumnDef<EventType>[] = [
        { accessorKey: 'id', header: 'Event Code' },
        { accessorKey: 'title', header: 'Event Name' },
        { accessorKey: 'organizer.company_name', header: 'PIC' },
        { accessorKey: 'organizer.contact_email', header: 'Email' },
        { accessorKey: 'organizer.contact_phone', header: 'No PIC' },
        {
            accessorKey: 'paid_orders_count',
            header: 'Participant',
            cell: ({ row }) => {
                const v: number = row.getValue('paid_orders_count');
                return (
                    <span className="flex w-full justify-center text-center text-sm">
                        {v}
                    </span>
                );
            },
        },
        {
            accessorKey: 'end_time',
            header: 'Last Check In',
            cell: ({ row }) => (
                <span className="text-sm">
                    -
                    {/* {dayjs(row.getValue('end_time')).format('DD MMMM YYYY')} */}
                </span>
            ),
        },

        {
            accessorKey: 'action',
            header: 'Action',
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2">
                        <Link href={`/dashboard/events/${row.original.id}`}>
                            <span className="text-sm">
                                <Eye size={16} className="text-gray-500" />
                            </span>
                        </Link>
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
                                    <DialogTitle>Delete Event?</DialogTitle>
                                    <DialogDescription>
                                        Are you sure delete event{' '}
                                        {row.original.title} ?
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
                                            handleDelete(row.original.id)
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
        data: events.data || [],
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Organizer Dashboard" />
            <div className="w-full space-y-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Events</h1>
                    <Link href="/dashboard/events/create">
                        <Button className="rounded-sm">Create Event</Button>
                    </Link>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="all" className="border-b p-0">
                    <TabsList className="bg-transparent p-0">
                        <TabsTrigger value="all">All Event</TabsTrigger>
                        <TabsTrigger value="ongoing">On Going</TabsTrigger>
                        <TabsTrigger value="past">Past Event</TabsTrigger>
                        <TabsTrigger value="draft">Draft</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Search */}
                {/* <Input
                    placeholder="Search event..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="max-w-xs"
                /> */}

                {/* Table */}
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
            </div>
        </AppLayout>
    );
}
