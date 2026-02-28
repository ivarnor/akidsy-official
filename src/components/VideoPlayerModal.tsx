'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { X, PlayCircle, Loader2 } from 'lucide-react';

interface VideoPlayerModalProps {
    url: string | null;
    title: string;
    onClose: () => void;
    onNext?: () => void;
    hasNext?: boolean;
}

export function VideoPlayerModal({ url, title, onClose, onNext, hasNext }: VideoPlayerModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<any>(null);
    const [isEnded, setIsEnded] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!url || !videoRef.current) return;

        setIsEnded(false);
        setLoading(true);

        // Initialize Video.js player
        const player = videojs(videoRef.current, {
            controls: true,
            autoplay: 'muted', // Auto-play muted to bypass browser policies
            preload: 'auto',
            fluid: true,
            responsive: true,
            playbackRates: [0.5, 1, 1.5, 2],
            controlBar: {
                children: [
                    'playToggle',
                    'volumePanel',
                    'currentTimeDisplay',
                    'timeDivider',
                    'durationDisplay',
                    'progressControl',
                    'playbackRateMenuButton',
                    'fullscreenToggle',
                ],
            }
        });

        playerRef.current = player;

        player.on('ready', () => {
            setLoading(false);
            // Attempt to play unmuted if possible, otherwise rely on autoplay: 'muted'
            const playPromise = player.play();
            if (playPromise !== undefined) {
                playPromise.catch((error: any) => {
                    console.log("Autoplay unmuted blocked by browser, falling back to muted autoplay.", error);
                });
            }
        });

        player.on('ended', () => {
            setIsEnded(true);
        });

        player.src({ src: url, type: 'video/mp4' });

        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, [url]);

    if (!url) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity">
            <div className="w-full max-w-6xl h-full md:h-auto md:max-h-[90vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-300">

                {/* Header Navbar */}
                <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                    <h2 className="text-xl md:text-3xl font-black text-white drop-shadow-md truncate pr-4">
                        {title || "Watching Video"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
                        aria-label="Close Player"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>

                {/* Video Container */}
                <div className="flex-1 w-full bg-black relative flex items-center justify-center overflow-hidden rounded-none md:rounded-[2rem] shadow-2xl mt-16 md:mt-0" onContextMenu={(e) => e.preventDefault()}>

                    {loading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black">
                            <Loader2 className="w-16 h-16 text-sky animate-spin mb-4" />
                        </div>
                    )}

                    <div data-vjs-player className="w-full h-full relative">
                        <video
                            ref={videoRef}
                            className="video-js vjs-big-play-centered vjs-theme-city"
                            playsInline
                        />
                    </div>

                    {/* Next Video Overlay */}
                    {isEnded && hasNext && onNext && (
                        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                            <h3 className="text-3xl md:text-5xl font-black text-white mb-8 text-center px-4 leading-tight">
                                Great job watching! ✨<br /> Ready for the next adventure?
                            </h3>
                            <button
                                onClick={() => {
                                    setIsEnded(false);
                                    onNext();
                                }}
                                className="bg-sunshine text-navy font-black text-2xl md:text-4xl px-10 py-6 rounded-full border-4 border-navy shadow-[8px_8px_0px_0px_#1C304A] hover:bg-sunshine/90 hover:scale-105 active:translate-y-1 active:shadow-none transition-all flex items-center gap-4 group"
                            >
                                <span>Next Video</span>
                                <PlayCircle className="w-10 h-10 group-hover:block transition-transform group-hover:translate-x-2" />
                            </button>
                            <button
                                onClick={onClose}
                                className="mt-8 text-white/70 font-bold text-lg hover:text-white underline decoration-2 underline-offset-4"
                            >
                                Back to Library
                            </button>
                        </div>
                    )}
                    {/* End State if no next video */}
                    {isEnded && !hasNext && (
                        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                            <h3 className="text-3xl md:text-5xl font-black text-white mb-8 text-center px-4 leading-tight">
                                You finished it! 🌟
                            </h3>
                            <button
                                onClick={onClose}
                                className="bg-sky text-white font-black text-2xl px-10 py-6 rounded-full border-4 border-navy shadow-[8px_8px_0px_0px_#1C304A] hover:bg-sky/90 hover:scale-105 active:translate-y-1 active:shadow-none transition-all"
                            >
                                Return to Library
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* Custom CSS for Video.js overrides to fit the brand */}
            <style jsx global>{`
                .video-js {
                    width: 100% !important;
                    height: 100% !important;
                    font-family: inherit;
                }
                .video-js .vjs-big-play-button {
                    background-color: var(--color-sunshine, #FFD166) !important;
                    color: var(--color-navy, #1C304A) !important;
                    border: 4px solid var(--color-navy, #1C304A) !important;
                    border-radius: 50% !important;
                    width: 100px !important;
                    height: 100px !important;
                    line-height: 90px !important;
                    font-size: 4em !important;
                    box-shadow: 6px 6px 0px 0px #1C304A !important;
                    transform: translate(-50%, -50%) !important;
                    transition: all 0.2s ease !important;
                }
                .video-js:hover .vjs-big-play-button {
                    background-color: #FFC033 !important;
                    transform: translate(-50%, -52%) scale(1.05) !important;
                }
                .vjs-control-bar {
                    background-color: rgba(28, 48, 74, 0.9) !important;
                    height: 4em !important;
                    padding: 0 10px !important;
                }
                .vjs-button > .vjs-icon-placeholder:before {
                    font-size: 2.5em !important;
                    line-height: 1.5 !important;
                }
                 .video-js .vjs-play-progress {
                    background-color: var(--color-sunshine, #FFD166) !important;
                }
                .video-js .vjs-slider {
                    background-color: rgba(255,255,255,0.3) !important;
                }
                 .video-js .vjs-load-progress {
                     background: rgba(255,255,255,0.5) !important;
                 }
            `}</style>
        </div>
    );
}
