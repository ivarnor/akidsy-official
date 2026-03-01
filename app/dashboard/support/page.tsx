'use client';

import { useState } from 'react';
import { Search, Mail, Copy, CheckCircle2 } from 'lucide-react';
import { FAQAccordion, FAQItem } from '@/src/components/FAQAccordion';

const ALL_FAQS: FAQItem[] = [
    {
        question: "Is Akidsy really ad-free?",
        answer: "Yes! We believe a child's learning environment should be 100% safe. There are no third-party ads, no trackers, and no external links that could lead your child away from our protected space."
    },
    {
        question: "Can I use my account on multiple devices?",
        answer: "Absolutely. One membership covers your whole family. You can log in on your tablet, phone, and laptop so the fun never has to stop, whether you're at home or on the go."
    },
    {
        question: "How often is new content added?",
        answer: "We add fresh coloring books, educational videos, and puzzles every single week! Our library is constantly growing to keep your child engaged and excited to learn."
    },
    {
        question: "How does the 7-day free trial work?",
        answer: "You get full, unlimited access to everything Akidsy offers for 7 days. If you love it, stay subscribed! If not, you can cancel easily through your Parent Dashboard at any time before the trial ends, and you won't be charged."
    }
];

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [copied, setCopied] = useState(false);

    const filteredFaqs = ALL_FAQS.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('support@akidsy.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-navy mb-4">Akidsy Help Center</h1>
                <p className="text-xl text-navy/80 font-medium">How can we help you and your family today?</p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-16">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-navy/40" />
                </div>
                <input
                    type="text"
                    className="w-full pl-16 pr-6 py-5 rounded-full border-4 border-navy shadow-[6px_6px_0px_0px_#1C304A] text-lg font-medium text-navy placeholder:text-navy/40 focus:outline-none focus:ring-4 focus:ring-sunshine/50 transition-shadow"
                    placeholder="Search for answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Quick Guides Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                {/* Parent Dashboard Guide */}
                <div className="bg-white border-4 border-navy rounded-[2rem] p-8 shadow-[6px_6px_0px_0px_#1C304A]">
                    <h2 className="text-2xl font-extrabold text-navy mb-4 flex items-center gap-3">
                        <span className="text-3xl" aria-hidden="true">🛠️</span>
                        Parent Dashboard Guide
                    </h2>
                    <p className="text-navy/80 font-medium leading-relaxed">
                        The Parent Zone is your control center. Access it from the footer or account menu to track your child&apos;s recent activity. You can also toggle content visibility—turn off external video modules or focus entirely on puzzles and coloring books depending on your family&apos;s daily goals.
                    </p>
                </div>

                {/* Cancellation Guide */}
                <div className="bg-sky/20 border-4 border-navy rounded-[2rem] p-8 shadow-[6px_6px_0px_0px_#1C304A]">
                    <h2 className="text-2xl font-extrabold text-navy mb-4 flex items-center gap-3">
                        <span className="text-3xl" aria-hidden="true">💳</span>
                        Manage Subscription
                    </h2>
                    <p className="text-navy/80 font-medium leading-relaxed">
                        We make it easy to stay in control. To manage or cancel your subscription, go to your <strong>Account</strong> page from the footer, verify your parent password to unlock the settings, and select <strong>Manage Subscription</strong> to update your billing preferences via Stripe securely.
                    </p>
                </div>
            </div>

            {/* FAQs */}
            <div className="mb-20">
                <h2 className="text-3xl font-extrabold text-navy mb-8 text-center">Frequently Asked Questions</h2>
                {filteredFaqs.length > 0 ? (
                    <FAQAccordion items={filteredFaqs} />
                ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border-4 border-navy/20 border-dashed">
                        <p className="text-xl text-navy/60 font-bold">No results found for &quot;{searchQuery}&quot;</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-sky underline font-bold"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>

            {/* Contact Support */}
            <div className="bg-navy text-white rounded-[3rem] p-10 md:p-14 text-center border-4 border-navy relative overflow-hidden shadow-[8px_8px_0px_0px_#1C304A]">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-sky/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-sunshine/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/4"></div>

                <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                    <div className="bg-white/10 p-4 rounded-full mb-6">
                        <Mail className="w-10 h-10 text-sunshine" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Still Need Help?</h2>
                    <p className="text-lg md:text-xl text-white/80 font-medium mb-8">
                        Our support team is here for you. We typically respond within 24 hours. Send us an email and we&apos;ll get things sorted out!
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 p-2 rounded-full border-2 border-white/20">
                        <a
                            href="mailto:support@akidsy.com"
                            className="text-xl md:text-2xl font-bold px-6 py-2 hover:text-sunshine transition-colors flex items-center gap-2"
                        >
                            support@akidsy.com
                        </a>
                        <button
                            onClick={handleCopyEmail}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${copied
                                    ? 'bg-sky text-navy border-2 border-transparent'
                                    : 'bg-white text-navy border-2 border-white hover:bg-white/90'
                                }`}
                        >
                            {copied ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5" /> Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5" /> Copy Email
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
