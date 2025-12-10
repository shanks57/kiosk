import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { NavGroup, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CalendarDays,
    CreditCard,
    LayoutGrid,
    Settings,
    Shield,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const baseMainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Events',
        href: dashboard().url + '/events',
        icon: CalendarDays,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const page = usePage();
    const roles = (page.props as any).auth?.roles ?? [];
    const mainNavItems: NavGroup[] = [
        {
            title: 'All Events',
            items: baseMainNavItems,
        },
    ];

    if (roles.includes('superadmin')) {
        mainNavItems.push({
            title: 'Master',
            items: [
                ...baseMainNavItems,
                {
                    title: 'Organizer',
                    href: '/dashboard/organizer',
                    icon: BookOpen,
                },
            ],
        });
    }

    if (roles.includes('organizer')) {
        mainNavItems.push({
            title: 'Organization',
            items: [
                {
                    title: 'General',
                    href: '/dashboard/organizer/general',
                    icon: Settings,
                },
                {
                    title: 'People',
                    href: '/dashboard/organizer/people',
                    icon: Users,
                },
                {
                    title: 'Security',
                    href: '/dashboard/organizer/security',
                    icon: Shield,
                },
                {
                    title: 'Billing',
                    href: '/dashboard/organizer/billing',
                    icon: CreditCard,
                },
            ],
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain menus={mainNavItems} />
            </SidebarContent>

            {/* <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter> */}
        </Sidebar>
    );
}
