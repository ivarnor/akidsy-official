'use client';

import { useState } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { Sparkles, Loader2, Lock, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6 font-sans text-navy">
            <div className="max-w-md w-full">
                <header className="flex flex-col items-center gap-4 mb-12 text-center">
                    <div className="bg-sunshine p-4 rounded-3xl border-4 border-navy shadow-[6px_6px_0px_0px_#1C304A]">
                        <KeyRound className="w-10 h-10 text-navy fill-navy" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Set New Password</h1>
                        <p className="font-bold text-navy/60 mt-2">
                            Enter your new password below
                        </p>
                    </div>
                </header>

                <main className="bg-white border-4 border-navy rounded-[2.5rem] p-8 shadow-[10px_10px_0px_0px_#1C304A]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="font-extrabold text-lg flex items-center gap-2">
                                <Lock className="w-5 h-5 text-sky" /> New Password
                            </label>
                            <input
                                required
                                type="password"
                                placeholder="••••••••"
                                className="w-full p-4 rounded-2xl border-4 border-navy bg-cream focus:outline-none focus:ring-4 focus:ring-sunshine/50 transition-all font-bold placeholder:text-navy/20"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="font-extrabold text-lg flex items-center gap-2">
                                <Lock className="w-5 h-5 text-persimmon" /> Confirm Password
                            </label>
                            <input
                                required
                                type="password"
                                placeholder="••••••••"
                                className="w-full p-4 rounded-2xl border-4 border-navy bg-cream focus:outline-none focus:ring-4 focus:ring-sunshine/50 transition-all font-bold placeholder:text-navy/20"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border-2 border-red-500 text-red-600 p-4 rounded-xl font-bold text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border-2 border-green-500 text-green-700 p-4 rounded-xl font-bold text-sm text-center">
                                Success! Your password has been updated. Redirecting to login...
                            </div>
                        )}

                        <div className="flex flex-col gap-4 pt-4">
                            <button
                                disabled={loading || success}
                                type="submit"
                                className="w-full bg-sky text-white font-black text-2xl py-5 rounded-2xl border-4 border-navy hover:bg-sky/90 transition-all active:scale-95 shadow-[4px_4px_0px_0px_#1C304A] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                ) : (
                                    <>
                                        Update Password
                                        <Sparkles className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </main>

                <footer className="mt-12 text-center opacity-30 font-black text-xs uppercase tracking-widest">
                    Akidsy • Creative Explorer Club
                </footer>
            </div>
        </div>
    );
}
