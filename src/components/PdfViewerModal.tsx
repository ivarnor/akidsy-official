'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Printer, X, Sparkles, ExternalLink } from 'lucide-react';

/**
 * Determines the correct bucket and file path from a raw URL string.
 * Handles:
 *   - Plain filenames: "Bear Coloring pages.pdf" → bucket: 'content'
 *   - Path-style: "content/abc123.pdf"            → bucket: 'content-assets'
 *   - Full public URLs: "https://...supabase.co/storage/v1/object/public/content/..."
 */
function resolveBucketAndPath(rawUrl: string): { bucket: string; path: string } {
    if (!rawUrl) return { bucket: 'content', path: rawUrl };

    // Full Supabase public URL
    if (rawUrl.startsWith('http') && rawUrl.includes('/storage/v1/object/public/')) {
        try {
            const urlObj = new URL(rawUrl);
            const afterPublic = urlObj.pathname.split('/storage/v1/object/public/')[1] || '';
            const slashIdx = afterPublic.indexOf('/');
            if (slashIdx > -1) {
                return {
                    bucket: afterPublic.substring(0, slashIdx),
                    path: afterPublic.substring(slashIdx + 1).split('?')[0],
                };
            }
        } catch (_) { /* fall through */ }
    }

    // Path-style URL like "content/abc123.pdf" (content-assets bucket)
    if (rawUrl.includes('/') && !rawUrl.startsWith('http')) {
        return { bucket: 'content-assets', path: rawUrl };
    }

    // Plain filename like "Bear Coloring pages.pdf" (content bucket)
    return { bucket: 'content', path: rawUrl };
}

function isIOS(): boolean {
    if (typeof navigator === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function PdfViewerModal({
    url,
    onClose,
    title
}: {
    url: string | null;
    onClose: () => void;
    title: string;
}) {
    const [proxyUrl, setProxyUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [iosMode, setIosMode] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (!url) {
            setProxyUrl(null);
            return;
        }

        const ios = isIOS();
        setIosMode(ios);
        setLoading(true);
        setError(null);
        setProxyUrl(null);

        const { bucket, path } = resolveBucketAndPath(url);
        console.log(`[PdfViewerModal] bucket="${bucket}" path="${path}" isIOS=${ios}`);

        // Build the proxy URL — the proxy serves the PDF with Content-Type: application/pdf
        // which is critical for Safari to open the full multi-page viewer.
        const pUrl = `/api/pdf-proxy?bucket=${encodeURIComponent(bucket)}&path=${encodeURIComponent(path)}`;

        if (ios) {
            // On iOS, iframes don't render PDFs. Instead, open directly in new tab.
            // We open it immediately and skip loading the iframe entirely.
            const a = document.createElement('a');
            a.href = pUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            a.remove();
            setLoading(false);
            // Close the modal since the PDF is opening in the browser tab
            onClose();
        } else {
            // Desktop/Android: use iframe with the proxy URL (Content-Type header ensures correct rendering)
            setProxyUrl(pUrl);
            setLoading(false);
        }
    }, [url]);

    const handlePrint = () => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.print();
        }
    };

    const handleOpenInNewTab = () => {
        if (proxyUrl) {
            const a = document.createElement('a');
            a.href = proxyUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    };

    if (!url) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-navy/80 backdrop-blur-sm transition-opacity">
            <div className="bg-cream w-full max-w-5xl h-full max-h-[90vh] rounded-[2rem] border-4 border-navy shadow-[10px_10px_0px_0px_#1C304A] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header Navbar */}
                <div className="bg-white border-b-4 border-navy p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-sky p-2 rounded-xl border-2 border-navy shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-navy truncate">
                            {title || "Coloring Book"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {/* Open in new tab button */}
                        {proxyUrl && !loading && !error && (
                            <button
                                onClick={handleOpenInNewTab}
                                className="bg-sky text-white font-black text-sm md:text-base px-4 md:px-6 py-2.5 rounded-xl border-4 border-navy hover:bg-sky/90 transition-transform hover:scale-105 active:scale-95 shadow-[4px_4px_0px_0px_#1C304A] flex items-center gap-2"
                                title="Open in new tab"
                            >
                                <ExternalLink className="w-5 h-5" />
                                <span className="hidden md:inline">Open Full</span>
                            </button>
                        )}

                        {/* Print button - desktop only */}
                        {proxyUrl && !loading && !error && (
                            <button
                                onClick={handlePrint}
                                className="bg-persimmon text-white font-black text-sm md:text-base px-4 md:px-6 py-2.5 rounded-xl border-4 border-navy hover:bg-persimmon/90 transition-transform hover:scale-105 active:scale-95 shadow-[4px_4px_0px_0px_#1C304A] flex items-center gap-2"
                            >
                                <Printer className="w-5 h-5" />
                                <span className="hidden md:inline">Print This Page</span>
                                <span className="md:hidden">Print</span>
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="bg-white hover:bg-slate-100 text-navy p-2.5 rounded-xl border-4 border-navy transition-all hover:scale-105 active:scale-95 ml-2"
                            aria-label="Close Viewer"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Viewer Body */}
                <div className="flex-1 bg-slate-200 relative overflow-hidden flex flex-col">
                    {loading && (
                        <div className="absolute inset-0 z-10 bg-cream flex flex-col items-center justify-center">
                            <Loader2 className="w-16 h-16 text-sky animate-spin mb-4" />
                            <p className="text-navy font-bold text-lg animate-pulse">Magically loading your pages...</p>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 z-10 bg-cream flex flex-col items-center justify-center p-6 text-center">
                            <div className="bg-red-100 p-4 rounded-full border-4 border-red-500 mb-4">
                                <X className="w-12 h-12 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-black text-navy mb-2">Oops! Something went wrong.</h3>
                            <p className="text-navy/70 font-semibold mb-6">{error}</p>
                            <button
                                onClick={onClose}
                                className="bg-navy text-white font-bold px-8 py-3 rounded-xl border-4 border-navy hover:bg-navy/90"
                            >
                                Go Back
                            </button>
                        </div>
                    )}

                    {proxyUrl && !loading && !error && (
                        <iframe
                            ref={iframeRef}
                            src={proxyUrl}
                            title="PDF Viewer"
                            className="w-full h-full border-none"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
