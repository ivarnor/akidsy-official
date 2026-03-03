'use client';

import { AppSidebar } from './AppSidebar';
import DashboardHeader from './MobileHeader';
import { SidebarProvider } from "@/src/components/ui/sidebar"

export default function DashboardClientLayout({
    children,
    footer
}: {
    children: React.ReactNode;
    footer: React.ReactNode;
}) {
    return (
        <SidebarProvider defaultOpen={true}>
            <div className="min-h-screen flex w-full font-sans bg-cream overflow-x-hidden">
                <AppSidebar />

                {/* Main Content Wrapper - Flex container for side-by-side layout */}
                <div className="flex-1 flex flex-col min-h-screen min-w-0 flex-shrink-0 transition-all duration-300 ease-in-out">
                    {/* Persistent Dashboard Header with Sidebar Trigger */}
                    <DashboardHeader />

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
        </SidebarProvider>
    );
}
