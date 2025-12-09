export default function PublicFooter() {
    return (
        <footer className="mt-10 border-t py-10 text-center text-sm text-gray-500">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-3 flex items-center justify-center gap-2 text-sm">
                    <a className="text-primary hover:underline" href="/events">
                        Browse Events
                    </a>
                    <span className="mx-2">•</span>
                    <a className="hover:underline" href="/about">
                        About
                    </a>
                    <span className="mx-2">•</span>
                    <a className="hover:underline" href="/help">
                        Help
                    </a>
                    <span className="mx-2">•</span>
                    <a className="hover:underline" href="/checkin/scan">
                        Scan Ticket
                    </a>
                    <span className="mx-2">•</span>
                    <a className="hover:underline" href="/invitation">
                        Invitation
                    </a>
                    <span className="mx-2">•</span>
                    <a className="hover:underline" href="/lottery">
                        Lottery
                    </a>
                </div>
                <div>
                    © {new Date().getFullYear()} TRONticket. All rights
                    reserved.
                </div>
            </div>
        </footer>
    );
}
