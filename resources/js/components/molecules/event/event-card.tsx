import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { EventType } from '@/types';
import dayjs from 'dayjs';

export const EventCard = (props: { data: EventType }) => {
    const { title, banner, start_time, end_time, sections, organizer, id } =
        props.data;

    return (
        <Card className="cursor-pointer gap-0 overflow-hidden rounded-xl py-0 transition hover:shadow-lg">
            <a href={`/events/${id}`}>
                <img
                    src={
                        banner ||
                        'https://via.placeholder.com/400x200?text=No+Image+Available'
                    }
                    alt={title || 'event banner'}
                    className="h-40 w-full object-cover"
                />
                <CardContent className="p-3.5">
                    <h3 className="mb-1 line-clamp-2 text-lg font-medium">
                        {title}
                    </h3>
                    <p className="mb-2 text-sm">
                        {dayjs(start_time).format('DD MMM YYYY (ddd)')} ~{' '}
                        {dayjs(end_time).format('DD MMM YYYY (ddd)')}
                    </p>
                    {sections && sections.length > 0 ? (
                        <p className="mb-2 text-sm text-gray-400">
                            Starting from Rp
                            {sections[0].price?.toLocaleString()}
                        </p>
                    ) : (
                        <p className="mb-2 text-sm text-gray-400">FREE</p>
                    )}
                    <CardFooter className="flex items-center gap-3 border-t px-0 pt-4">
                        <img
                            src={
                                organizer?.user?.avatar ||
                                'https://placehold.co/40?text=No+Logo'
                            }
                            alt="organizer-logo"
                            className="h-6 w-6 rounded-full object-cover"
                        />
                        <p className="text-sm">
                            {organizer?.company_name || 'Moka Event Organizer'}
                        </p>
                    </CardFooter>
                </CardContent>
            </a>
        </Card>
    );
};
