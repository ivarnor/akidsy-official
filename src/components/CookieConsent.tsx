'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, X } from 'lucide-react';

export function CookieConsent() {
    const [hasAccepted, setHasAccepted] = useState(true); // Default true to prevent hydration flash
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Check localStorage once the component mounts
        const consent = localStorage.getItem('akidsy_cookie_consent');
        if (!consent) {
            setHasAccepted(false);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('akidsy_cookie_consent', 'true');
        setHasAccepted(true);
    };

    // Don't render anything until mounted to prevent SSR hydration mismatch,
    // and don't render if they've already accepted
    if (!isMounted || hasAccepted) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100%-2rem)] animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-sky border-4 border-navy rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_#1C304A] relative">
                <button
                    onClick={handleAccept}
                    className="absolute top-4 right-4 text-navy hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-6 h-6 text-sunshine fill-sunshine" />
                    <h3 className="font-bold text-navy text-xl">Quick Question!</h3>
                </div>

                <p className="text-navy font-medium mb-5 leading-tight">
                    We use cookies to keep your treasure safe and your account logged in. By using Akidsy, you agree to our{' '}
                    <Link href="/privacy" className="underline font-bold hover:text-white transition-colors">
                        Privacy Policy
                    </Link>.
                </p>

                <div className="flex justify-end">
                    <button
                        onClick={handleAccept}
                        className="bg-sunshine text-navy font-black px-6 py-2.5 rounded-full border-4 border-navy hover:bg-sunshine/80 transition-transform hover:-translate-y-1 active:translate-y-0 shadow-[4px_4px_0px_0px_#1C304A]"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
}
