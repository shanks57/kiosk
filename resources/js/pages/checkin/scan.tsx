import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ScanPage() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/checkin', { code });
            toast.success(res.data.message || 'Checked in successfully');
            setCode('');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Check-in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout>
            <Head title="Check-in Scanner" />

            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-4 text-2xl font-semibold">QR Code Scanner</h1>
                <p className="mb-6 text-sm text-muted-foreground">
                    Use your device camera (not implemented) or paste the
                    scanned code below to check-in a ticket.
                </p>
                <Scanner
                    onScan={(result) => console.log(result)}
                    onError={(error) => console.log(error)}
                />

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            placeholder="Scanned code or ticket id"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading || !code}>
                            {loading ? 'Checking...' : 'Check-in'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCode('')}
                        >
                            Clear
                        </Button>
                    </div>
                </form>
            </div>
        </PublicLayout>
    );
}
