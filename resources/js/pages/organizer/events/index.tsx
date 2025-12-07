import { Button } from '@/components/ui/button';
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
import { Eye, Trash } from 'lucide-react';
import { useState } from 'react';

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

    const columns: ColumnDef<EventType>[] = [
        { accessorKey: 'id', header: 'Event Code' },
        { accessorKey: 'title', header: 'Event Name' },
        { accessorKey: 'organizer.company_name', header: 'PIC' },
        { accessorKey: 'organizer.contact_email', header: 'Email' },
        { accessorKey: 'organizer.contact_phone', header: 'No PIC' },
        { accessorKey: 'participant', header: 'Participant' },
        { accessorKey: 'date', header: 'Last Check In' },
        {
            accessorKey: '',
            header: 'Status',
            cell: ({ row }) => {
                const v: string = row.getValue('status');
                return (
                    <span
                        className={
                            v === 'Check-In'
                                ? 'rounded bg-blue-100 px-2 py-1 text-xs text-blue-600'
                                : 'rounded bg-red-100 px-2 py-1 text-xs text-red-600'
                        }
                    >
                        {v || "Absence"}
                    </span>
                );
            },
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: ({ row }) => {
                const v: string = row.getValue('status');
                return (
                    <div className="flex items-center gap-2">
                        <Link href={`/dashboard/events/${row.original.id}`}>
                            <span className="text-sm">
                                <Eye size={16} className="text-gray-500" />
                            </span>
                        </Link>
                        <span className="text-sm">
                            <Trash size={16} className="text-gray-500" />
                        </span>
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
