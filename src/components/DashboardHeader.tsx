'use client';

import Link from 'next/link';
import { Sparkles, Home, PlayCircle, Palette, BookOpen, Puzzle, GraduationCap, LogOut, ChevronDown } from 'lucide-react';

export default function DashboardHeader() {
    return (
        <header className="sticky top-0 z-50 bg-white border-b-4 border-navy shadow-[0_4px_0_0_#1C304A]">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
                {/* Logo */}
                <Link href="/dashboard" className="text-2xl md:text-3xl font-bold text-navy flex items-center gap-2 shrink-0">
                    <Sparkles className="w-8 h-8 text-sunshine fill-sunshine" />
                    <span className="hidden sm:inline">Akidsy</span>
                </Link>

                {/* Categories Desktop */}
                <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center overflow-x-auto pb-1 px-4 no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none]">
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy hover:bg-sky transition-colors whitespace-nowrap border-2 border-transparent hover:border-navy">
                        <Home className="w-5 h-5" /> Home
                    </Link>
                    <Link href="/dashboard?cat=Videos" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy hover:bg-sunshine transition-colors whitespace-nowrap border-2 border-transparent hover:border-navy">
                        <PlayCircle className="w-5 h-5" /> Videos
                    </Link>

                    {/* Categories Dropdown Container */}
                    <div className="relative group flex items-center">
                        <Link href="/dashboard?cat=Coloring" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy hover:bg-persimmon hover:text-white transition-colors whitespace-nowrap border-2 border-transparent hover:border-navy">
                            <Palette className="w-5 h-5" /> Coloring <ChevronDown className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform" />
                        </Link>

                        {/* Dropdown Menu */}
                        <div className="absolute top-[120%] left-1/2 -translate-x-1/2 w-48 bg-white border-4 border-navy rounded-2xl shadow-[4px_4px_0px_0px_#1C304A] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 flex flex-col overflow-hidden">
                            <Link href="/dashboard/coloring/animals" className="px-4 py-3 font-bold text-navy hover:bg-sky transition-colors border-b-2 border-slate-100 flex items-center gap-2">
                                🦁 Animals
                            </Link>
                            <Link href="/dashboard/coloring/space" className="px-4 py-3 font-bold text-navy hover:bg-sunshine transition-colors border-b-2 border-slate-100 flex items-center gap-2">
                                🚀 Space
                            </Link>
                            <Link href="/dashboard/coloring/vehicles" className="px-4 py-3 font-bold text-navy hover:bg-persimmon hover:text-white transition-colors flex items-center gap-2">
                                🚗 Vehicles
                            </Link>
                        </div>
                    </div>

                    <Link href="/dashboard?cat=Ebooks" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy hover:bg-sky transition-colors whitespace-nowrap border-2 border-transparent hover:border-navy">
                        <BookOpen className="w-5 h-5" /> Ebooks
                    </Link>
                    <Link href="/dashboard?cat=Puzzles" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy hover:bg-sunshine transition-colors whitespace-nowrap border-2 border-transparent hover:border-navy">
                        <Puzzle className="w-5 h-5" /> Puzzles
                    </Link>
                    <Link href="/dashboard?cat=Education" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy hover:bg-persimmon hover:text-white transition-colors whitespace-nowrap border-2 border-transparent hover:border-navy">
                        <GraduationCap className="w-5 h-5" /> Education
                    </Link>
                </nav>

                <div className="flex items-center gap-4 shrink-0">
                    <Link
                        href="/dashboard/support"
                        className="hidden md:flex items-center gap-2 font-bold text-navy hover:text-sky transition-colors px-2"
                    >
                        Support
                    </Link>
                    <Link
                        href="/"
                        className="px-6 py-2 rounded-full border-4 border-navy bg-cream font-bold text-navy hover:bg-sky transition-colors flex items-center gap-2 shadow-[2px_2px_0px_0px_#1C304A] active:translate-y-0.5 active:shadow-none"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="hidden xl:inline">Exit</span>
                    </Link>
                </div>
            </div>

            {/* Categories Mobile Scroll */}
            <nav className="lg:hidden flex border-t-2 border-navy/10 items-center gap-2 overflow-x-auto p-3 no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none]">
                <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy bg-white border-2 border-navy whitespace-nowrap">
                    <Home className="w-4 h-4" /> Home
                </Link>
                <Link href="/dashboard?cat=Videos" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy bg-white border-2 border-navy whitespace-nowrap">
                    <PlayCircle className="w-4 h-4" /> Videos
                </Link>
                <Link href="/dashboard?cat=Coloring" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy bg-white border-2 border-navy whitespace-nowrap hidden">
                    <Palette className="w-4 h-4" /> Coloring
                </Link>
                {/* Mobile Direct Links instead of dropdown */}
                <Link href="/dashboard?cat=Coloring" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy bg-persimmon/10 border-2 border-navy whitespace-nowrap">
                    🎨 All Coloring
                </Link>
                <Link href="/dashboard/coloring/animals" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy bg-sky/20 border-2 border-navy whitespace-nowrap">
                    🦁 Animals
                </Link>
                <Link href="/dashboard/coloring/space" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy bg-sunshine/20 border-2 border-navy whitespace-nowrap">
                    🚀 Space
                </Link>
                <Link href="/dashboard/coloring/vehicles" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy bg-persimmon/20 border-2 border-navy whitespace-nowrap">
                    🚗 Vehicles
                </Link>

                <Link href="/dashboard?cat=Ebooks" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy bg-white border-2 border-navy whitespace-nowrap">
                    <BookOpen className="w-4 h-4" /> Ebooks
                </Link>
                <Link href="/dashboard?cat=Puzzles" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy bg-white border-2 border-navy whitespace-nowrap">
                    <Puzzle className="w-4 h-4" /> Puzzles
                </Link>
                <Link href="/dashboard?cat=Education" className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-navy bg-white border-2 border-navy whitespace-nowrap">
                    <GraduationCap className="w-4 h-4" /> Education
                </Link>
            </nav>
        </header>
    );
}
