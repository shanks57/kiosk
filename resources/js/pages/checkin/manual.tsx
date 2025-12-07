import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ManualPage() {
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
            <Head title="Manual Check-in" />

            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-4 text-2xl font-semibold">Manual Check-in</h1>
                <p className="mb-6 text-sm text-muted-foreground">
                    Enter the ticket code or ID manually to perform check-in.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            placeholder="Ticket code or ID"
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
