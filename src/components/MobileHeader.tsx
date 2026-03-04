'use client';

import Link from 'next/link';
import { Sparkles, LogOut } from 'lucide-react';
import { SidebarTrigger } from "@/src/components/ui/sidebar"

export default function DashboardHeader() {
    return (
        <header className="sticky top-0 z-30 bg-white border-b-4 border-navy shadow-[0_4px_0_0_#1C304A] w-full">
            <div className="px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <SidebarTrigger
                        className="-ml-2 text-navy relative z-[100] pointer-events-auto"
                        onClick={() => console.log('Sidebar Toggled')}
                    />

                    {/* Logo - Hidden on md+ because AppSidebar has it */}
                    <Link href="/dashboard" className="md:hidden text-xl font-bold text-navy flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-sunshine fill-sunshine" />
                        <span>Akidsy</span>
                    </Link>
                </div>

                {/* Exit Button */}
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
