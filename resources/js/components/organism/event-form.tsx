import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AttendancePageProps } from '@/pages/organizer/events/show';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Card } from '../ui/card';

export const EventForm = (props: AttendancePageProps) => {
    const { event } = props;
    const { data, setData, put, processing, errors } = useForm({
        title: event.title || '',
        description: event.description || '',
        start_time: event.start_time || '',
        end_time: event.end_time || '',
        banner: event.banner || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/events/${event.id}`, {
            onSuccess: () => {
                toast('Event updated');
            },
            onError: () => {
                toast('Error updating event');
            },
        });
    };
    return (
        <Card className="p-4 shadow-none">
            <div className="mx-auto w-full">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-lg">Update Event</p>
                        <p className="text-sm text-foreground/50">
                            Update event information
                        </p>
                    </div>
                </div>
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
                            {processing ? 'Updating...' : 'Update Event'}
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
        </Card>
    );
};
