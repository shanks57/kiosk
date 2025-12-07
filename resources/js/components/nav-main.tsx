import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { NavGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Fragment } from 'react/jsx-runtime';

type NavMainProps = {
    menus: NavGroup[];
};

export function NavMain(props: NavMainProps) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            {props.menus.map((menu) => (
                <Fragment key={menu.title}>
                    <SidebarGroupLabel>{menu.title}</SidebarGroupLabel>
                    <SidebarMenu>
                        {menu.items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={page.url.startsWith(
                                        resolveUrl(item.href),
                                    )}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </Fragment>
            ))}
        </SidebarGroup>
    );
}
