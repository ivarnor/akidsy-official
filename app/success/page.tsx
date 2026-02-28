'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Sparkles, PlayCircle } from 'lucide-react';

export default function SuccessPage() {
    const router = useRouter();

    useEffect(() => {
        // Trigger a burst of celebration when the page loads
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-sky font-sans relative overflow-hidden px-4 pt-12 pb-20">
            {/* Header Content */}
            <div className="max-w-4xl w-full flex flex-col items-center text-center relative z-10 mb-12">
                <div className="text-3xl font-bold text-navy flex items-center gap-2 mb-8">
                    <Sparkles className="w-8 h-8 text-sunshine fill-sunshine" />
                    Akidsy
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold text-navy mb-6 leading-tight max-w-3xl">
                    Success! You are now a member of Akidsy! 🎨
                </h1>

                <p className="text-xl md:text-2xl text-navy/80 font-medium">
                    We&apos;re so excited to have you onboard. Check out the welcome video below to get started!
                </p>
            </div>

            {/* Responsive Video Placeholder */}
            <div className="w-full max-w-3xl aspect-video bg-navy rounded-3xl border-4 border-navy shadow-[8px_8px_0px_0px_#1C304A] relative overflow-hidden mb-12 flex items-center justify-center group z-10">
                <Image
                    src="https://picsum.photos/1280/720?random=10"
                    alt="Welcome Video Thumbnail"
                    fill
                    className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <PlayCircle className="w-24 h-24 text-white drop-shadow-lg group-hover:scale-110 transition-transform cursor-pointer" />
                    <span className="text-white font-bold text-xl mt-4 drop-shadow-md">Watch Welcome Video</span>
                </div>
            </div>

            {/* Dashboard Redirect Button */}
            <div className="z-10 text-center w-full">
                <Link
                    href="/dashboard"
                    className="inline-flex bg-persimmon text-white font-bold text-2xl px-12 py-5 rounded-full border-4 border-navy hover:bg-persimmon/90 transition-transform hover:scale-105 active:scale-95 shadow-[6px_6px_0px_0px_#1C304A] items-center justify-center gap-3 w-full max-w-sm mx-auto"
                >
                    Go to my Dashboard <Sparkles className="w-6 h-6" />
                </Link>
            </div>
        </div>
    );
}
