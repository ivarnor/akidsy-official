'use client';

import Link from 'next/link';
import { Sparkles, Menu, LogOut } from 'lucide-react';

interface MobileHeaderProps {
    onOpenSidebar: () => void;
}

export default function MobileHeader({ onOpenSidebar }: MobileHeaderProps) {
    return (
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b-4 border-navy shadow-[0_4px_0_0_#1C304A]">
            <div className="px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onOpenSidebar}
                        className="p-2 -ml-2 text-navy hover:bg-slate-100 rounded-full transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Logo */}
                    <Link href="/dashboard" className="text-xl font-bold text-navy flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-sunshine fill-sunshine" />
                        <span>Akidsy</span>
                    </Link>
                </div>

                {/* Exit Button - Optional on mobile, but keeping consistent with original header */}
                <Link
                    href="/"
                    className="p-2 text-navy hover:bg-slate-100 rounded-full transition-colors"
                    aria-label="Exit dashboard"
                >
                    <LogOut className="w-5 h-5" />
                </Link>
            </div>
        </header>
    );
}
