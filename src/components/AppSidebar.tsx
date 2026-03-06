'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    Sparkles,
    Home,
    Tv,
    Palette,
    BookOpen,
    Puzzle,
    GraduationCap,
    LifeBuoy,
    Lock,
    ChevronDown,
    X,
    PanelLeft,
    Menu
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    useSidebar
} from "@/src/components/ui/sidebar"

export function AppSidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const categoryParams = searchParams.get('cat');
    const { setOpenMobile, state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";

    const [isColoringOpen, setIsColoringOpen] = useState(false);

    // Close sidebar on route change on mobile and halt any videos locally
    useEffect(() => {
        const stopAllVideos = () => {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                video.pause();
                video.src = '';
                video.load();
                video.remove();
            });
        };
        stopAllVideos();
        setOpenMobile(false);
    }, [pathname, searchParams, setOpenMobile]);

    // Keep coloring open if we are in a coloring sub-route or cat=Coloring
    useEffect(() => {
        if (pathname.includes('/dashboard/coloring') || categoryParams === 'Coloring') {
            setIsColoringOpen(true);
        }
    }, [pathname, categoryParams]);

    const isActive = (path: string, cat?: string) => {
        if (cat) {
            return pathname === '/dashboard' && categoryParams === cat;
        }
        if (path === '/dashboard') {
            return pathname === '/dashboard' && !categoryParams;
        }
        return pathname.startsWith(path);
    };



    const navItemClasses = "flex items-center w-full px-4 py-3 rounded-2xl font-bold transition-all border-2";
    const getLinkClasses = (active: boolean) =>
        active
            ? `${navItemClasses} bg-sky/20 text-sky-800 border-sky/30 shadow-[2px_2px_0px_0px_rgba(56,189,248,0.2)]`
            : `${navItemClasses} text-navy border-transparent hover:bg-slate-100 hover:border-slate-200`;

    const subNavItemClasses = "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all border-2";
    const getSubLinkClasses = (active: boolean) =>
        active
            ? `${subNavItemClasses} bg-sky/20 text-sky-800 border-sky/30 shadow-[2px_2px_0px_0px_rgba(56,189,248,0.2)]`
            : `${subNavItemClasses} text-navy/80 border-transparent hover:bg-slate-100 hover:text-navy hover:border-slate-200`;

    return (
        <Sidebar variant="sidebar" collapsible="icon" className="border-r-4 border-navy shadow-[4px_0_0_0_#1C304A] !z-[9999]">
            <SidebarHeader className="h-16 px-4 flex flex-row items-center justify-between shrink-0 border-b-2 border-slate-100 bg-white overflow-hidden">
                <div className="flex items-center gap-2 overflow-hidden">
                    <Link href="/dashboard" className="text-2xl font-bold text-navy flex items-center gap-2 shrink-0" onClick={() => setOpenMobile(false)}>
                        <Sparkles className="w-8 h-8 text-sunshine fill-sunshine" />
                        <span className={isCollapsed ? "hidden" : ""}>Akidsy</span>
                    </Link>
                </div>
            </SidebarHeader>

            <SidebarContent className="p-3 space-y-2 no-scrollbar bg-white overflow-hidden">
                <Link
                    href="/dashboard"
                    className={getLinkClasses(isActive('/dashboard'))}
                    title="Home"
                >
                    <div className="flex items-center gap-3 shrink-0">
                        <Home className="w-6 h-6 shrink-0" />
                        <span className={isCollapsed ? "hidden" : ""}>Home</span>
                    </div>
                </Link>

                {/* Coloring Books (Collapsible) */}
                <div className="space-y-1">
                    <button
                        onClick={() => state !== "collapsed" ? setIsColoringOpen(!isColoringOpen) : toggleSidebar()}
                        className={`${getLinkClasses(categoryParams === 'Coloring' || pathname.includes('/dashboard/coloring'))} ${isCollapsed ? "mb-0" : ""} mb-2`}
                        title="Coloring Books"
                    >
                        <div className="flex items-center gap-3 shrink-0">
                            <Palette className="w-6 h-6 shrink-0" />
                            <span className={isCollapsed ? "hidden" : ""}>Coloring Books</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? "hidden" : ""} ${isColoringOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`overflow-hidden transition-all duration-200 ease-in-out pl-4 pr-2 space-y-1 ${isCollapsed ? "hidden" : ""} ${isColoringOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <Link
                            href="/dashboard/coloring/animals"
                            className={getSubLinkClasses(pathname === '/dashboard/coloring/animals')}
                        >
                            <span className="text-xl leading-none">🦁</span> Animals
                        </Link>
                        <Link
                            href="/dashboard/coloring/space"
                            className={getSubLinkClasses(pathname === '/dashboard/coloring/space')}
                        >
                            <span className="text-xl leading-none">🚀</span> Space
                        </Link>
                        <Link
                            href="/dashboard/coloring/vehicles"
                            className={getSubLinkClasses(pathname === '/dashboard/coloring/vehicles')}
                        >
                            <span className="text-xl leading-none">🚗</span> Vehicles
                        </Link>
                    </div>
                </div>

                <Link
                    href="/dashboard?cat=Videos"
                    className={getLinkClasses(isActive('/dashboard', 'Videos'))}
                    title="Videos"
                >
                    <div className="flex items-center gap-3 shrink-0">
                        <Tv className="w-6 h-6 shrink-0" />
                        <span className={isCollapsed ? "hidden" : ""}>Videos</span>
                    </div>
                </Link>

                <Link
                    href="/dashboard?cat=Puzzles"
                    className={getLinkClasses(isActive('/dashboard', 'Puzzles'))}
                    title="Puzzles"
                >
                    <div className="flex items-center gap-3 shrink-0">
                        <Puzzle className="w-6 h-6 shrink-0" />
                        <span className={isCollapsed ? "hidden" : ""}>Puzzles</span>
                    </div>
                </Link>

                <Link
                    href="/dashboard?cat=Ebooks"
                    className={getLinkClasses(isActive('/dashboard', 'Ebooks'))}
                    title="Ebooks"
                >
                    <div className="flex items-center gap-3 shrink-0">
                        <BookOpen className="w-6 h-6 shrink-0" />
                        <span className={isCollapsed ? "hidden" : ""}>Ebooks</span>
                    </div>
                </Link>

                <Link
                    href="/dashboard?cat=Education"
                    className={getLinkClasses(isActive('/dashboard', 'Education'))}
                    title="Education"
                >
                    <div className="flex items-center gap-3 shrink-0">
                        <GraduationCap className="w-6 h-6 shrink-0" />
                        <span className={isCollapsed ? "hidden" : ""}>Education</span>
                    </div>
                </Link>

                <div className={`pt-4 mt-4 border-t-2 border-slate-100 ${isCollapsed ? "hidden" : ""}`}>
                    <Link
                        href="/dashboard/support"
                        className={getLinkClasses(isActive('/dashboard/support'))}
                        title="Support"
                    >
                        <div className="flex items-center gap-3 shrink-0">
                            <LifeBuoy className="w-6 h-6 shrink-0" />
                            <span className={isCollapsed ? "hidden" : ""}>Support</span>
                        </div>
                    </Link>
                </div>
            </SidebarContent>

            <SidebarFooter className="p-3 border-t-2 border-slate-100 shrink-0 bg-white overflow-hidden">
                <Link
                    href="/dashboard/parent"
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold transition-all border-2 border-navy/10 text-navy hover:bg-slate-100 hover:border-navy/30 ${pathname.startsWith('/dashboard/parent') ? 'bg-slate-100 border-navy/30 shadow-inner' : ''}`}
                    title="Parent Zone"
                >
                    <Lock className="w-6 h-6 shrink-0 text-navy/70" />
                    <span className={isCollapsed ? "hidden" : ""}>Parent Zone</span>
                </Link>
            </SidebarFooter>
        </Sidebar>
    );
}
