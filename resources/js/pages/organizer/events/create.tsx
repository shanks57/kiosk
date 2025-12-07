import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Events', href: '/dashboard/events' },
    { title: 'Create Event', href: '/dashboard/events/create' },
];

export default function CreateEvent() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        banner: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/events');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Event" />
            <div className="mx-auto max-w-2xl rounded-xl p-4">
                <h1 className="mb-6 text-2xl font-bold">Create New Event</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">
                            Event Title
                        </label>
                        <Input
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Enter event title"
                            className="mt-1"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Enter event description"
                            rows={4}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium">
                                Start Date & Time
                            </label>
                            <Input
                                type="datetime-local"
                                value={data.start_time}
                                onChange={(e) =>
                                    setData('start_time', e.target.value)
                                }
                                className="mt-1"
                                pattern="^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$"
                            />
                            {errors.start_time && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.start_time}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                End Date & Time
                            </label>
                            <Input
                                type="datetime-local"
                                value={data.end_time}
                                onChange={(e) =>
                                    setData('end_time', e.target.value)
                                }
                                className="mt-1"
                                pattern="^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$"
                            />
                            {errors.end_time && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.end_time}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">
                            Banner URL
                        </label>
                        <Input
                            value={data.banner}
                            onChange={(e) => setData('banner', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="mt-1"
                        />
                        {errors.banner && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.banner}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Event'}
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
