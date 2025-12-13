import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface RoleType {
    id: number;
    name: string;
    created_at?: string | null;
    updated_at?: string | null;
    // [key: string]: unknown;
}

export interface OrganizerType {
    id: number;
    user_id?: number;
    company_name?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    user?: UserType | null;
    events?: EventType[];
    // [key: string]: unknown;
}

export interface EventVenueType {
    id: number;
    event_id?: number;
    venue_name?: string | null;
    capacity?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    event?: EventType | null;
    // [key: string]: unknown;
}

export interface EventSectionType {
    id: number;
    event_id?: number;
    name?: string | null;
    price?: number | null;
    color?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    seats?: EventSeatType[];
    // [key: string]: unknown;
}

export interface EventSeatType {
    id: number;
    event_section_id?: number;
    row_number?: string | number | null;
    seat_number?: string | number | null;
    status?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    // [key: string]: unknown;
}

export interface TicketCategoryType {
    id: number;
    event_id?: number;
    name?: string | null;
    price?: number | null;
    quota?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    orderItems?: OrderItemType[];
    // [key: string]: unknown;
}

export interface OrderItemType {
    id: number;
    order_id?: number;
    event_seat_id?: number;
    ticket_category_id?: number;
    booking_code?: string | null;
    event_date?: string | null;
    price?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    order? : OrderType | null;
    seat?: EventSeatType | null;
    category?: TicketCategoryType | null;
    participant?: ParticipantType[];
    company?: CompanyType | null;
    // [key: string]: unknown;
}

export interface PaymentType {
    id: number;
    order_id?: number;
    provider?: string | null;
    payment_code?: string | null;
    transaction_id?: string | null;
    status?: string | null;
    amount?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    // [key: string]: unknown;
}

export interface OrderType {
    id: number;
    user_id?: number;
    event_id?: number;
    status?: string | null;
    total_amount?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    ticket_code?: string;

    attendance_status?: string | null;
    items?: OrderItemType[];
    payment?: PaymentType | null;
    user?: UserType | null;
    event?: EventType | null;
    // [key: string]: unknown;
}

export interface EventType {
    id: number;
    organizer_id?: number;
    title?: string | null;
    description?: string | null;
    start_time?: string | null;
    end_time?: string | null;
    banner?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    organizer?: OrganizerType | null;
    venue?: EventVenueType | null;
    sections?: EventSectionType[];
    ticketCategories?: TicketCategoryType[];
    // [key: string]: unknown;
}

export interface CompanyType {
    id: number;
    user_id?: number;
    name?: string | null;
    company_logo?: string;
    user?: UserType | null;
    events?: EventType[];
}

export interface Auth {
    user: UserType;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface UserType {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    email_verified_at?: string | null;
    two_factor_enabled?: boolean;
    created_at?: string | null;
    updated_at?: string | null;
    roles?: (string | RoleType)[];
    organizer?: OrganizerType | null;
    company?: CompanyType | null;

    // [key: string]: unknown; // This allows for additional properties...
}

export type ParticipantType = {
    id: number;
    order_item_id: number;
    event_id: number;
    event_date: string;
    user_id: number;
    seat_id?: number | null;
    user?: UserType;
    order_item?: OrderItemType;
    seat?: EventSeatType;
    company_id?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
};

export type PaginationType<T> = {
    current_page: number;
    data: Array<T>;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};
