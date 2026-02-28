'use client';

import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
                            Privacy Policy
                        </h1>
                    </div>

                    {/* Kid-Friendly Summary Box */}
                    <div className="bg-sunshine/20 border-4 border-sunshine rounded-3xl p-8 mb-16 relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 text-sunshine opacity-30 transform -rotate-12">
                            <ShieldCheck className="w-32 h-32 fill-current" />
                        </div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-sunshine text-navy font-bold px-4 py-1.5 rounded-full border-2 border-navy mb-6 text-sm uppercase tracking-wide">
                                <Sparkles className="w-4 h-4 fill-navy" />
                                Kid-Friendly Summary
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-navy flex items-center gap-2 mb-2">
                                        <ShieldCheck className="w-6 h-6 text-sky fill-sky" /> Safety First
                                    </h3>
                                    <p className="text-navy/80 font-medium text-lg">
                                        We don't have chat rooms or public profiles, so you're totally safe here! Only you and your grown-up can see what you are making and watching.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-navy flex items-center gap-2 mb-2">
                                        <Heart className="w-6 h-6 text-persimmon fill-persimmon" /> Secret Identity
                                    </h3>
                                    <p className="text-navy/80 font-medium text-lg">
                                        We don't share your secrets or activities with anyone else on the internet. Your creative projects are yours alone!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Full Legal Text */}
                    <div className="space-y-12">
                        <div className="inline-block bg-sky text-navy font-bold px-6 py-2 rounded-full border-4 border-navy mb-2 shadow-[4px_4px_0px_0px_#1C304A] rotate-[2deg]">
                            Full Legal Text ⚖️
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                                1. Data Collection & Usage
                            </h2>
                            <p className="text-lg text-navy/80 leading-relaxed mb-4">
                                Akidsy is fiercely dedicated to preserving a safe, educational space. We do not sell your personal data. We collect only the absolute minimum information required to operate our service: your parent/guardian email address (managed securely via Supabase Auth) and necessary payment correlation details (processed safely through our compliance partner, Stripe).
                            </p>
                            <p className="text-lg text-navy/80 leading-relaxed">
                                We utilize cookies and local storage tokens strictly to maintain your active login session and authorize access to your dashboard content.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                                2. COPPA Compliance (Children's Privacy)
                            </h2>
                            <p className="text-lg text-navy/80 leading-relaxed">
                                Protecting the privacy of young children is immensely important to us. In strict compliance with the Children's Online Privacy Protection Act (COPPA), Akidsy does not knowingly collect, maintain, or solicit any personally identifiable information from children under the age of 13 without the explicit consent of their parent or legal guardian. Subscriptions must be created and managed by an adult.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-navy mb-4 flex items-center gap-2">
                                3. User Data Rights
                            </h2>
                            <p className="text-lg text-navy/80 leading-relaxed">
                                As a user, you maintain complete control over your data footprint on Akidsy. You have the right to request a full overview of any data tied to your account, and the right to request immediate deletion of your account and all associated personal data from our systems. If you wish to execute a data deletion request, you may contact our support team, and the request will be processed immediately.
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
