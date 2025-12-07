import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Events', href: '/dashboard/events' },
    { title: 'Ticket Categories', href: '#' },
    { title: 'Create', href: '#' },
];

export default function Create({ event }: { event: any }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        quota: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/dashboard/events/${event.id}/ticket-categories`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Ticket Category" />
            <div className="mx-auto max-w-2xl p-4">
                <h1 className="mb-4 text-2xl font-semibold">
                    Create Ticket Category
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">
                            Name
                        </label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Price
                        </label>
                        <Input
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                        />
                        {errors.price && (
                            <p className="text-sm text-red-600">
                                {errors.price}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Quota
                        </label>
                        <Input
                            value={data.quota}
                            onChange={(e) => setData('quota', e.target.value)}
                        />
                        {errors.quota && (
                            <p className="text-sm text-red-600">
                                {errors.quota}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => history.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
