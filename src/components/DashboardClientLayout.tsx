'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';

export default function DashboardClientLayout({
    children,
    footer
}: {
    children: React.ReactNode;
    footer: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex font-sans bg-cream">
            {/* Sidebar Component handles its own desktop fixed & mobile drawer logic */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Wrapper - Needs to leave space for left sidebar on desktop */}
            <div className="flex-1 flex flex-col min-h-screen transition-all lg:ml-[280px]">

                {/* Mobile Header (Hidden on Desktop) */}
                <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

                {/* Dashboard Main Content Area */}
                <main className="flex-1 p-6 md:p-8 lg:p-10 bg-slate-50 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                {/* Dynamic Footer rendered server-side */}
                {footer}
            </div>
        </div>
    );
}
