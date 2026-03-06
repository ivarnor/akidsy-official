'use client';

import { useState } from 'react';
import { ParentalGateModal } from './ParentalGateModal';

export function AccountManagementClient({ userEmail, isVIP, stripeCustomerId }: { userEmail: string, isVIP: boolean, stripeCustomerId: string | null }) {
    const [loading, setLoading] = useState(false);

    if (isVIP) {
        return (
            <div className="text-sm font-bold text-navy/50 bg-white/50 px-4 py-2 rounded-full">
                Billing Managed Separately
            </div>
        );
    }

    if (!stripeCustomerId) {
        return (
            <a
                href="mailto:support@akidsy.com?subject=Manage%20Subscription%20Request"
                className="bg-gray-100 border-2 border-gray-300 text-gray-700 hover:bg-gray-200 font-bold py-3 px-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all inline-block"
            >
                Contact Support
            </a>
        );
    }

    const handleManageSubscription = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/create-portal-session', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to open billing portal');
            }
            window.location.href = data.url;
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'An unexpected error occurred.');
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleManageSubscription}
            disabled={loading}
            className="bg-white border-2 border-navy text-navy hover:bg-slate-50 font-bold py-3 px-6 rounded-xl shadow-[4px_4px_0px_0px_#1C304A] hover:shadow-[6px_6px_0px_0px_#1C304A] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#1C304A] transition-all disabled:opacity-50"
        >
            {loading ? 'Redirecting...' : 'Manage Subscription'}
        </button>
    );
}
