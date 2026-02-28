'use client';

import { useState } from 'react';
import { ParentalGateModal } from './ParentalGateModal';

export function AccountManagementClient({ userEmail, isVIP }: { userEmail: string, isVIP: boolean }) {
    const [isGateOpen, setIsGateOpen] = useState(false);

    if (isVIP) {
        return (
            <div className="text-sm font-bold text-navy/50 bg-white/50 px-4 py-2 rounded-full">
                Billing Managed Separately
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsGateOpen(true)}
                className="bg-white border-2 border-navy text-navy hover:bg-slate-50 font-bold py-3 px-6 rounded-xl shadow-[4px_4px_0px_0px_#1C304A] hover:shadow-[6px_6px_0px_0px_#1C304A] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_0px_#1C304A] transition-all"
            >
                Manage Subscription / Cancel
            </button>

            <ParentalGateModal
                isOpen={isGateOpen}
                onClose={() => setIsGateOpen(false)}
                userEmail={userEmail}
            />
        </>
    );
}
