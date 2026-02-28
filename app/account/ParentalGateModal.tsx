'use client';

import { useState } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { X, AlertTriangle, Lock, Loader2 } from 'lucide-react';

interface ParentalGateModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
}

export function ParentalGateModal({ isOpen, onClose, userEmail }: ParentalGateModalProps) {
    const supabase = createClient();
    const [step, setStep] = useState<'retention' | 'password'>('retention');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleVerifyAndRedirect = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Re-authenticate the user with their password to verify it's the adult
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: userEmail,
                password: password,
            });

            if (authError) {
                setError('Incorrect password. Please try again.');
                setLoading(false);
                return;
            }

            // If correct, generate the Stripe Portal URL
            const res = await fetch('/api/create-portal-session', {
                method: 'POST',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to open billing portal');
            }

            // Redirect the user to Stripe
            window.location.href = data.url;

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                        <Lock className="w-5 h-5 text-persimmon" />
                        Parental Verification
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-navy transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6">
                    {step === 'retention' ? (
                        <div className="space-y-6 text-center">
                            <div className="bg-persimmon/10 text-persimmon p-4 rounded-xl flex items-start gap-3 text-left">
                                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                                <p className="font-semibold text-sm leading-relaxed">
                                    Wait! If you cancel now, your child will lose access to <strong className="font-bold">500+ coloring books</strong> and new weekly videos.
                                </p>
                            </div>
                            <p className="text-navy/70 font-medium">Are you sure you want to manage your billing and potentially lose these benefits?</p>

                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    onClick={() => setStep('password')}
                                    className="w-full bg-slate-100 text-navy/70 hover:bg-slate-200 hover:text-navy font-bold py-3 rounded-xl transition-colors"
                                >
                                    Proceed to Manage Billing
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-navy text-white font-bold py-3 rounded-xl shadow-md hover:bg-navy/90 transition-transform active:scale-95"
                                >
                                    Nevermind, Keep Access
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleVerifyAndRedirect} className="space-y-6">
                            <div className="text-center">
                                <p className="text-navy/80 font-medium mb-1">Please enter your password to continue to the billing portal.</p>
                                <p className="text-sm text-navy/50">{userEmail}</p>
                            </div>

                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Your Password"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-persimmon focus:border-transparent text-navy"
                                />
                                {error && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading || !password}
                                    className="w-full bg-persimmon text-white font-bold py-3 rounded-xl shadow-md hover:bg-persimmon/90 transition-transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Billing Portal'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep('retention')}
                                    className="text-navy/60 hover:text-navy font-semibold text-sm py-2"
                                    disabled={loading}
                                >
                                    Go Back
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
