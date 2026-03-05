'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, X, Download, Star, Heart } from 'lucide-react';

interface WelcomePopupProps {
    show: boolean;
    onClose: () => void;
}

export function WelcomePopup({ show, onClose }: WelcomePopupProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            // Trigger confetti burst
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

            const randomInRange = (min: number, max: number) => {
                return Math.random() * (max - min) + min;
            };

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                // Since they are on the dashboard, we shoot from the corners
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
        } else {
            setIsVisible(false);
        }
    }, [show]);

    if (!show) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-cream w-full max-w-lg rounded-[3rem] border-4 border-navy shadow-[12px_12px_0px_0px_#1C304A] p-8 md:p-12 relative overflow-hidden transform transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}`}>

                {/* Decorative Elements */}
                <Star className="absolute -top-4 -left-4 w-12 h-12 text-sunshine fill-sunshine rotate-12" />
                <Heart className="absolute -bottom-4 -right-4 w-12 h-12 text-persimmon fill-persimmon -rotate-12" />
                <Sparkles className="absolute top-8 right-8 w-8 h-8 text-sky animate-pulse" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-navy/5 text-navy transition-colors z-20"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center relative z-10 flex flex-col items-center">
                    <div className="bg-sunshine p-5 rounded-3xl border-4 border-navy shadow-[4px_4px_0px_0px_#1C304A] mb-8 animate-bounce">
                        <Star className="w-12 h-12 text-navy fill-white" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black text-navy mb-4 leading-tight">
                        Welcome to the <br />
                        <span className="text-persimmon underline decoration-navy decoration-4 underline-offset-4">Yearly Club!</span> 🚀
                    </h2>

                    <p className="text-xl text-navy/80 font-bold mb-8 italic">
                        You&apos;re officially a VIP Explorer! We&apos;ve prepared a special gift just for you.
                    </p>

                    <div className="bg-white border-4 border-navy rounded-3xl p-6 shadow-[6px_6px_0px_0px_#1C304A] w-full mb-10 group hover:-translate-y-1 transition-transform">
                        <div className="flex items-center gap-4 text-left">
                            <div className="bg-sky/20 p-3 rounded-xl border-2 border-navy">
                                <Download className="w-8 h-8 text-navy" />
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-navy">Bonus Explorer Pack</h3>
                                <p className="text-sm font-bold text-navy/60">50+ Premium Printables & Stickers</p>
                            </div>
                        </div>

                        <a
                            href="https://db.hokehjxsejqbhbeugqnt.supabase.co/storage/v1/object/public/videos/README.pdf?t=placeholder"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 flex items-center justify-center gap-2 w-full bg-persimmon text-white font-black py-4 rounded-2xl border-4 border-navy hover:bg-persimmon/90 shadow-[4px_4px_0px_0px_#1C304A] active:translate-y-0.5 active:shadow-none transition-all"
                        >
                            Download Bonus PDF <Download className="w-5 h-5" />
                        </a>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-navy/60 font-black hover:text-navy transition-colors underline decoration-2 underline-offset-4"
                    >
                        Skip for now, let&apos;s explore!
                    </button>
                </div>
            </div>
        </div>
    );
}
