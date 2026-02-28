'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Printer, X, Sparkles } from 'lucide-react';

export function PdfViewerModal({
    url,
    onClose,
    title
}: {
    url: string | null;
    onClose: () => void;
    title: string;
}) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (!url) {
            setBlobUrl(null);
            return;
        }

        let isMounted = true;
        setLoading(true);
        setError(null);

        async function fetchPdf() {
            try {
                // Fetch the PDF as a blob to create a secure local object URL
                // This hides the true Supabase URL from the DOM and prevents CORS issues when printing
                const response = await fetch(url as string);
                if (!response.ok) throw new Error('Failed to load PDF securely.');

                const blob = await response.blob();

                if (isMounted) {
                    const objectUrl = URL.createObjectURL(blob);
                    // Append #toolbar=0&navpanes=0 to hide default browser PDF controls
                    setBlobUrl(objectUrl + '#toolbar=0&navpanes=0');
                    setLoading(false);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err.message || 'Error pulling the document.');
                    setLoading(false);
                }
            }
        }

        fetchPdf();

        return () => {
            isMounted = false;
            // Cleanup the blob URL when unmounting or changing URLs
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl.split('#')[0]);
            }
        };
    }, [url]);

    const handlePrint = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.print();
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
                        {/* Only show print button if the PDF is successfully loaded */}
                        {blobUrl && !loading && !error && (
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

                    {blobUrl && (
                        <iframe
                            ref={iframeRef}
                            src={blobUrl}
                            title="PDF Viewer"
                            className={`w-full h-full border-none transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
