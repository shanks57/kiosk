import { OrderItemType } from '@/types';
import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(
    url1: NonNullable<InertiaLinkProps['href']>,
    url2: NonNullable<InertiaLinkProps['href']>,
) {
    return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function formatRupiah(value: number | string): string {
    if (value === null || value === undefined) return '0';

    const number = typeof value === 'string' ? parseInt(value, 10) : value;

    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const escapeHtml = (unsafe: string) => {
    return unsafe
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
};

type TicketTemplateParams = {
    code: string;
    eventTitle: string;
    eventDate: string;
    svgHtml: string;
    participants: OrderItemType['participant'];
};

export const generateTicketHtml = ({
    code,
    eventTitle,
    eventDate,
    svgHtml,
    participants = [],
}: TicketTemplateParams) => {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Ticket ${escapeHtml(code)}</title>

<style>
@page { size: 176mm 250mm; margin: 0; }
body {
    margin: 0;
    background: #f2f2f2;
    font-family: Arial, Helvetica, sans-serif;
}
.ticket-wrapper {
    width: 176mm;
    height: 250mm;
    display: flex;
    align-items: center;
    justify-content: center;
}
.ticket {
    width: 160mm;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    border: 1px solid #ddd;
}
.header { text-align: center; }
.event-title { font-size: 20px; font-weight: bold; margin: 0; }
.event-date { font-size: 12px; color: #555; }
.qr-section { display: flex; justify-content: center; margin: 18px 0; }
.qr { width: 280px; height: 280px; }
.info { border-top: 1px dashed #ccc; padding-top: 14px; }
.ticket-code {
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    letter-spacing: 2px;
    margin-bottom: 12px;
}
.participant {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px dashed #ccc;
    font-size: 13px;
}
.info-row strong {
    display: inline-block;
    width: 80px;
}
.footer {
    margin-top: 18px;
    border-top: 1px solid #eee;
    padding-top: 10px;
    font-size: 11px;
    color: #666;
    text-align: center;
}
</style>
</head>

<body>
<div class="ticket-wrapper">
<div class="ticket">

<div class="header">
<h1 class="event-title">${escapeHtml(eventTitle)}</h1>
<div class="event-date">${escapeHtml(eventDate)}</div>
</div>

<div class="qr-section">
<div class="qr">${svgHtml}</div>
</div>

<div class="info">
<div class="ticket-code">${escapeHtml(code)}</div>

${(participants || [])
    .map(
        (p, i) => `
<div class="participant">
    <div><strong>Participant ${i + 1}</strong></div>
    <div class="info-row"><strong>Name:</strong> ${escapeHtml(p.user?.name || '-')}</div>
    <div class="info-row"><strong>Email:</strong> ${escapeHtml(p.user?.email || '-')}</div>
    <div class="info-row"><strong>Phone:</strong> ${escapeHtml(p.user?.phone || '-')}</div>
    <div class="info-row"><strong>Seat:</strong> ${escapeHtml(p.seat?.seat_number?.toString() || '-')}</div>
</div>
`,
    )
    .join('')}
</div>

<div class="footer">
Please show this ticket at the entrance.<br />
QR Code is valid for one-time entry only.
</div>

</div>
</div>
</body>
</html>
`;
};
