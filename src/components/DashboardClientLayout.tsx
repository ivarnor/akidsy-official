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
        <div className="min-h-screen flex font-sans bg-cream overflow-x-hidden">
            {/* Sidebar Component handles its own desktop fixed & mobile drawer logic */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Wrapper - Flex container for side-by-side layout */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0 transition-all">

                {/* Mobile Header (Hidden on Desktop) */}
                <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

                {/* Dashboard Main Content Area */}
                <main className="flex-1 p-6 md:p-8 lg:p-10 bg-slate-50 relative z-10 w-full">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>

                {/* Dynamic Footer rendered server-side */}
                {footer}
            </div>
        </div>
    );
}
