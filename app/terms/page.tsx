'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react';

export default function TermsPage() {
    const [isKidFriendly, setIsKidFriendly] = useState(false);

    return (
        <div className="min-h-screen bg-cream font-sans flex flex-col">
            {/* Navigation */}
            <nav className="p-6 flex justify-between items-center max-w-7xl w-full mx-auto">
                <Link href="/" className="text-3xl font-bold text-navy flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <Sparkles className="w-8 h-8 text-sunshine fill-sunshine" />
                    Akidsy
                </Link>
                <Link
                    href="/"
                    className="flex items-center gap-2 text-navy font-bold hover:text-sky transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Home
                </Link>
            </nav>

            <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12">
                <div className="bg-white border-4 border-navy rounded-[3rem] p-8 md:p-12 shadow-[8px_8px_0px_0px_#1C304A]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b-4 border-navy/10">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-navy">
                            Terms of Service
                        </h1>

                        {/* Kid-Friendly Toggle */}
                        <button
                            onClick={() => setIsKidFriendly(!isKidFriendly)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full border-4 border-navy font-bold transition-all shadow-[4px_4px_0px_0px_#1C304A] hover:-translate-y-1 active:translate-y-0 ${isKidFriendly ? 'bg-sunshine text-navy' : 'bg-sky text-navy'
                                }`}
                        >
                            {isKidFriendly ? (
                                <><ToggleRight className="w-6 h-6" /> Kids Version ON</>
                            ) : (
                                <><ToggleLeft className="w-6 h-6" /> Show Kid-Friendly Version</>
                            )}
                        </button>
                    </div>

                    {isKidFriendly ? (
                        /* For the Creative Explorers Content */
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="inline-block bg-sunshine text-navy font-bold px-6 py-2 rounded-full border-4 border-navy mb-4 shadow-[4px_4px_0px_0px_#1C304A] rotate-[-2deg]">
                                For the Creative Explorers 🚀
                            </div>

                            <section className="bg-cream p-8 rounded-3xl border-4 border-navy shadow-[4px_4px_0px_0px_#1C304A]">
                                <h2 className="text-3xl font-bold text-sky mb-4 flex items-center gap-3">
                                    <Heart className="w-8 h-8 fill-sky" /> Be Kind
                                </h2>
                                <p className="text-xl text-navy/80 font-medium">
                                    This is a happy place for creating and learning. Treat our videos, books, and other explorers with kindness and respect!
                                </p>
                            </section>

                            <section className="bg-cream p-8 rounded-3xl border-4 border-navy shadow-[4px_4px_0px_0px_#1C304A]">
                                <h2 className="text-3xl font-bold text-persimmon mb-4 flex items-center gap-3">
                                    <ShieldCheck className="w-8 h-8 fill-persimmon" /> Parents are Bosses
                                </h2>
                                <p className="text-xl text-navy/80 font-medium">
                                    Always ask your grown-up before clicking buttons, creating accounts, or changing any of your dashboard settings.
                                </p>
                            </section>
                        </div>
                    ) : (
                        /* For the Grown-Ups Content */
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="inline-block bg-sky text-navy font-bold px-6 py-2 rounded-full border-4 border-navy mb-4 shadow-[4px_4px_0px_0px_#1C304A] rotate-[2deg]">
                                For the Grown-Ups 💼
                            </div>

                            <section>
                                <h2 className="text-2xl font-bold text-persimmon mb-4">Membership</h2>
                                <p className="text-lg text-navy/80 leading-relaxed">
                                    Akidsy is a subscription service. By signing up for a 7-day trial, you agree that Stripe will securely store your card and charge the monthly (or yearly) fee after the trial ends unless canceled. All payments are processed entirely by Stripe; we do not store your raw payment details.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-sky mb-4">Cancellation</h2>
                                <p className="text-lg text-navy/80 leading-relaxed">
                                    You can cancel anytime directly through your member dashboard. There are no "gotchas" or hidden commitments. Once canceled, you will retail access until the end of your billing cycle.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-sunshine mb-4">Usage</h2>
                                <p className="text-lg text-navy/80 leading-relaxed">
                                    All videos, ebooks, and printables provided by Akidsy are strictly for personal, non-commercial use. Don't resell our treasures! Redistributing our curriculum is strictly prohibited.
                                </p>
                            </section>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-navy text-white mt-auto py-8">
                <div className="max-w-7xl mx-auto px-6 text-center text-white/50 text-sm font-bold">
                    © {new Date().getFullYear()} Akidsy. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
