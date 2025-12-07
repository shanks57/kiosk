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
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TicketCategoryType } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Events', href: '/dashboard/events' },
    { title: 'Ticket Categories', href: '#' },
];

export default function Index({
    event,
    categories,
}: {
    event: any;
    categories: TicketCategoryType[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ticket Categories - ${event.title || ''}`} />

            <div className="mx-auto max-w-4xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/events">
                            <Button variant="ghost">
                                <ArrowLeft />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-semibold">
                            Ticket Categories
                        </h1>
                    </div>
                    <Link
                        href={`/dashboard/events/${event.id}/ticket-categories/create`}
                    >
                        <Button>Create Category</Button>
                    </Link>
                </div>

                <Card className="p-4">
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
                            {categories.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell>
                                        Rp{Number(c.price).toLocaleString()}
                                    </TableCell>
                                    <TableCell>{c.quota ?? '-'}</TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/dashboard/events/${event.id}/ticket-categories/${c.id}/edit`}
                                        >
                                            <Button size="sm" variant="ghost">
                                                Edit
                                            </Button>
                                        </Link>
                                        <form
                                            method="post"
                                            action={`/dashboard/events/${event.id}/ticket-categories/${c.id}`}
                                            className="inline-block"
                                        >
                                            <input
                                                type="hidden"
                                                name="_method"
                                                value="delete"
                                            />
                                            <Button
                                                type="submit"
                                                size="sm"
                                                variant="destructive"
                                                className="ml-2"
                                            >
                                                Delete
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </AppLayout>
    );
}
