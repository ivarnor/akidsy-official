'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';

export default function CheckoutSuccessPage() {
    const router = useRouter();

    useEffect(() => {
        // 2-second delay to allow Webhook and Supabase session to 'handshake'
        const timer = setTimeout(() => {
            router.push('/dashboard');
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
            <div className="bg-white border-4 border-navy rounded-[3rem] p-8 md:p-12 text-center shadow-[12px_12px_0px_0px_#1C304A] max-w-md w-full relative overflow-hidden">
                {/* Decorative elements */}
                <Sparkles className="absolute top-4 right-4 w-8 h-8 text-sunshine fill-sunshine opacity-30 animate-pulse" />
                <Sparkles className="absolute bottom-4 left-4 w-6 h-6 text-sky fill-sky opacity-30 animate-pulse delay-75" />

                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <Loader2 className="w-16 h-16 text-sky animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-navy rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-black text-navy mb-4">
                    Woot! Success! 🎉
                </h1>

                <p className="text-xl text-navy/70 font-bold mb-2">
                    Verifying your membership...
                </p>

                <p className="text-sm text-navy/50 font-medium italic">
                    Just pinning your badge to your backpack! 🎒
                </p>

                <div className="mt-8 pt-8 border-t-2 border-navy/5">
                    <p className="text-xs text-navy/30 font-bold uppercase tracking-widest">
                        Gearing up for adventure...
                    </p>
                </div>
            </div>
        </div>
    );
}
