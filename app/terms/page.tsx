'use client';

import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, ArrowLeft, BookOpen, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
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
                    <div className="mb-12 pb-8 border-b-4 border-navy/10">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-navy">
                            Terms of Service
                        </h1>
                    </div>

                    {/* Kid-Friendly Summary Box */}
                    <div className="bg-sky/20 border-4 border-sky rounded-3xl p-8 mb-16 relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 text-sky opacity-20 transform rotate-12">
                            <Heart className="w-32 h-32 fill-current" />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-sky text-white font-bold px-4 py-1.5 rounded-full border-2 border-navy mb-6 text-sm uppercase tracking-wide">
                                <Sparkles className="w-4 h-4 fill-white" />
                                Kid-Friendly Summary
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-navy flex items-center gap-2 mb-2">
                                        <Heart className="w-6 h-6 text-sky fill-sky" /> Be Kind
                                    </h3>
                                    <p className="text-navy/80 font-medium text-lg">
                                        This is a happy place for creating and learning. Treat our videos, coloring books, and other explorers with kindness and respect!
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-navy flex items-center gap-2 mb-2">
                                        <ShieldCheck className="w-6 h-6 text-persimmon fill-persimmon" /> Parents are Bosses
                                    </h3>
                                    <p className="text-navy/80 font-medium text-lg">
                                        Always ask your grown-up before clicking buttons, creating accounts, or changing any of your dashboard settings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Full Legal Text */}
                    <div className="space-y-12">
                        <div className="inline-block bg-sunshine text-navy font-bold px-6 py-2 rounded-full border-4 border-navy mb-2 shadow-[4px_4px_0px_0px_#1C304A] rotate-[-2deg]">
                            Full Legal Text ⚖️
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                                1. Subscription Terms & Payments
                            </h2>
                            <p className="text-lg text-navy/80 leading-relaxed mb-4">
                                Akidsy operates as a recurring subscription service. By signing up for our 7-day free trial, you authorize us (via our secure payment processor, Stripe) to securely store your payment information. Once your 7-day trial concludes, your chosen payment method will be automatically charged the agreed-upon monthly or yearly fee.
                            </p>
                            <p className="text-lg text-navy/80 leading-relaxed">
                                You hold the right to cancel your subscription at any time directly through your member dashboard. Upon cancellation, your access will remain active until the end of your current billing cycle. No hidden fees or "gotchas."
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                                2. Intellectual Property
                            </h2>
                            <p className="text-lg text-navy/80 leading-relaxed">
                                All content provided within the Akidsy platform, including but not limited to educational videos, printable coloring books, interactive ebooks, and puzzles, is the exclusive intellectual property of Akidsy. Your membership grants you a limited, non-exclusive, non-transferable license to access this content for personal, non-commercial use only. You may not claim ownership of, alter, or resell our creative materials.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                                3. User Conduct & Restrictions
                            </h2>
                            <p className="text-lg text-navy/80 leading-relaxed">
                                We protect our community and our creators. You agree not to engage in unauthorized data scraping, reverse-engineering, or bulk downloading of Akidsy content. Sharing your account credentials or illegally redistributing member exclusives, videos, or printables on public forums or personal networks is strictly prohibited and will result in the immediate termination of your account without a refund.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                                4. Limitation of Liability
                            </h2>
                            <p className="text-lg text-navy/80 leading-relaxed">
                                Akidsy provides educational tools and entertainment "as is". While we strive for absolute accuracy and positive experiences, we cannot be held liable for indirect results stemming from the use of our services. Or, as we like to say: we provide the coloring books, but we are not responsible if your kid gets crayon on the carpet!
                            </p>
                        </section>
                    </div>
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
