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
    X
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const categoryParams = searchParams.get('cat');

    const [isColoringOpen, setIsColoringOpen] = useState(false);

    // Close sidebar on route change on mobile
    useEffect(() => {
        onClose();
    }, [pathname, searchParams, onClose]);

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
        // Strict match for Home so it doesn't stay highlighted when on other /dashboard routes
        if (path === '/dashboard') {
            return pathname === '/dashboard' && !categoryParams;
        }
        return pathname.startsWith(path);
    };

    const navItemClasses = "flex items-center justify-between w-full px-4 py-3 rounded-2xl font-bold transition-all border-2";
    const getLinkClasses = (active: boolean) =>
        active
            ? `${navItemClasses} bg-sky/20 text-sky-800 border-sky/30 shadow-[2px_2px_0px_0px_rgba(56,189,248,0.2)]`
            : `${navItemClasses} text-navy border-transparent hover:bg-slate-100 hover:border-slate-200`;

    const subNavItemClasses = "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all border-2";
    const getSubLinkClasses = (active: boolean) =>
        active
            ? `${subNavItemClasses} bg-sky/20 text-sky-800 border-sky/30 shadow-[2px_2px_0px_0px_rgba(56,189,248,0.2)]`
            : `${subNavItemClasses} text-navy/80 border-transparent hover:bg-slate-100 hover:text-navy hover:border-slate-200`;

    const SidebarContent = () => (
        <div className="h-full flex flex-col bg-white">
            {/* Header/Logo */}
            <div className="h-20 px-6 flex items-center justify-between shrink-0 border-b-2 border-slate-100">
                <Link href="/dashboard" className="text-2xl font-bold text-navy flex items-center gap-2" onClick={onClose}>
                    <Sparkles className="w-8 h-8 text-sunshine fill-sunshine" />
                    <span>Akidsy</span>
                </Link>
                {/* Mobile close button */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-navy hover:bg-slate-100 rounded-full transition-colors"
                    aria-label="Close menu"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                <Link
                    href="/dashboard"
                    className={getLinkClasses(isActive('/dashboard'))}
                >
                    <div className="flex items-center gap-3">
                        <Home className="w-5 h-5" />
                        <span>Home</span>
                    </div>
                </Link>

                {/* Coloring Books (Collapsible) */}
                <div className="space-y-1">
                    <button
                        onClick={() => setIsColoringOpen(!isColoringOpen)}
                        className={`${getLinkClasses(categoryParams === 'Coloring' || pathname.includes('/dashboard/coloring'))} ${isColoringOpen ? 'mb-2' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <Palette className="w-5 h-5" />
                            <span>Coloring Books</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isColoringOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <div className={`overflow-hidden transition-all duration-200 ease-in-out pl-4 pr-2 space-y-1 ${isColoringOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
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
                >
                    <div className="flex items-center gap-3">
                        <Tv className="w-5 h-5" />
                        <span>Videos</span>
                    </div>
                </Link>

                <Link
                    href="/dashboard?cat=Puzzles"
                    className={getLinkClasses(isActive('/dashboard', 'Puzzles'))}
                >
                    <div className="flex items-center gap-3">
                        <Puzzle className="w-5 h-5" />
                        <span>Puzzles</span>
                    </div>
                </Link>

                <Link
                    href="/dashboard?cat=Ebooks"
                    className={getLinkClasses(isActive('/dashboard', 'Ebooks'))}
                >
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5" />
                        <span>Ebooks</span>
                    </div>
                </Link>

                <Link
                    href="/dashboard?cat=Education"
                    className={getLinkClasses(isActive('/dashboard', 'Education'))}
                >
                    <div className="flex items-center gap-3">
                        <GraduationCap className="w-5 h-5" />
                        <span>Education</span>
                    </div>
                </Link>

                <div className="pt-4 mt-4 border-t-2 border-slate-100">
                    <Link
                        href="/dashboard/support"
                        className={getLinkClasses(isActive('/dashboard/support'))}
                    >
                        <div className="flex items-center gap-3">
                            <LifeBuoy className="w-5 h-5" />
                            <span>Support</span>
                        </div>
                    </Link>
                </div>
            </nav>

            {/* Footer / Parent Zone */}
            <div className="p-4 border-t-2 border-slate-100 shrink-0">
                <Link
                    href="/dashboard/parent"
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold transition-all border-2 border-navy/10 text-navy hover:bg-slate-100 hover:border-navy/30 ${pathname.startsWith('/dashboard/parent') ? 'bg-slate-100 border-navy/30 shadow-inner' : ''}`}
                >
                    <Lock className="w-5 h-5 text-navy/70" />
                    <span>Parent Zone</span>
                </Link>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar (Fixed) */}
            <div className="hidden lg:block fixed inset-y-0 left-0 z-40 w-[280px] bg-white border-r-4 border-navy shadow-[4px_0_0_0_#1C304A]">
                <SidebarContent />
            </div>

            {/* Mobile Drawer Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-navy/50 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Mobile Drawer Content */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-4/5 max-w-[320px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <SidebarContent />
            </div>
        </>
    );
}
