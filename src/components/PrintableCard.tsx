'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, Eye, Loader2 } from 'lucide-react';

export function PrintableCard({ 
    item, 
    isMember, 
    isVIP,
    subscriptionType
}: { 
    item: any; 
    isMember: boolean; 
    isVIP: boolean;
    subscriptionType: string;
}) {
    const THUMBNAIL_BASE_URL = 'https://hokehjxsejqbhbeugqnt.supabase.co/storage/v1/object/public/thumbnails/';
    const [imageError, setImageError] = useState(false);
    const [actionLoading, setActionLoading] = useState<'view' | 'download' | null>(null);

    // Construct thumbnail URL
    const hasThumb = item.thumbnail_url && item.thumbnail_url.trim() !== '';
    const thumbnailUrl = hasThumb 
        ? item.thumbnail_url.startsWith('http') ? item.thumbnail_url : (THUMBNAIL_BASE_URL + item.thumbnail_url)
        : '/images/akidsy-placeholder.png';

    console.log('Printable Image Source:', thumbnailUrl);

    /**
     * Determines the correct bucket and file path from item.url.
     * item.url can be:
     *   - A plain filename: "Bear Coloring pages.pdf"            -> bucket: 'content'
     *   - A path with prefix: "content/abc123.pdf"               -> bucket: 'content-assets'
     *   - A full public URL: "https://...supabase.co/.../content/abc.pdf"
     */
    function resolveBucketAndPath(): { bucket: string; path: string } {
        const rawUrl = item.url || '';

        // Case 1: Full Supabase public URL
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

        // Case 2: Path-style URL like "content/abc123.pdf" (content-assets bucket)
        if (rawUrl.includes('/') && !rawUrl.startsWith('http')) {
            return { bucket: 'content-assets', path: rawUrl };
        }

        // Case 3: Just a filename like "Bear Coloring pages.pdf" (content bucket)
        return { bucket: 'content', path: rawUrl };
    }

    const handleAction = async (e: React.MouseEvent, mode: 'view' | 'download') => {
        e.preventDefault();
        e.stopPropagation();

        if (actionLoading) return;

        console.log('[PrintableCard] Action:', mode, '| Subscription:', subscriptionType, '| isMember:', isMember, '| isVIP:', isVIP);

        if (!isMember && !isVIP) {
            alert('Access Denied. You need an active subscription to access this content.');
            return;
        }

        setActionLoading(mode);

        try {
            const { bucket, path } = resolveBucketAndPath();
            console.log(`[PrintableCard] Resolved bucket="${bucket}" path="${path}"`);

            // Build the proxy URL which:
            // 1. Verifies auth server-side
            // 2. Fetches PDF from Supabase
            // 3. Re-serves it with Content-Type: application/pdf (critical for iOS)
            const proxyUrl = `/api/pdf-proxy?bucket=${encodeURIComponent(bucket)}&path=${encodeURIComponent(path)}`;
            console.log('[PrintableCard] Proxy URL:', proxyUrl);

            if (mode === 'download') {
                // Force download using <a download> trick
                const link = document.createElement('a');
                link.href = proxyUrl;
                const fileName = path.split('/').pop() || `${item.title}.pdf`;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                // VIEW mode: Use <a target="_blank"> — the most reliable method on iOS.
                // window.open() is frequently blocked by iOS Safari as a popup.
                // The proxy ensures Content-Type: application/pdf so Safari opens
                // the full multi-page PDF viewer, not a single-page PNG preview.
                const a = document.createElement('a');
                a.href = proxyUrl;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (err) {
            console.error('[PrintableCard] Error during action:', err);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="group w-full text-left bg-white border-4 border-navy rounded-[2rem] overflow-hidden shadow-[6px_6px_0px_0px_#1C304A] hover:shadow-[10px_10px_0px_0px_#1C304A] hover:-translate-y-2 transition-all duration-300 flex flex-col active:translate-y-1 active:shadow-none relative">
            <div className="aspect-[4/5] relative overflow-hidden bg-cream border-b-4 border-navy w-full">
                {thumbnailUrl && !imageError ? (
                    <Image
                        src={thumbnailUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        unoptimized={true}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-cream">
                        <Image 
                            src="/images/akidsy-placeholder.png"
                            alt="Akidsy Placeholder"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                
                <div className="absolute top-3 left-3 z-20">
                    <span className="bg-white text-navy text-[10px] md:text-xs font-black px-2.5 py-1 md:py-1.5 rounded-full border-2 border-navy shadow-[2px_2px_0px_0px_#1C304A] uppercase tracking-tighter">
                        {item.category || 'Printables'}
                    </span>
                </div>

                <div className={`absolute inset-0 bg-navy/60 backdrop-blur-[2px] transition-opacity duration-300 z-10 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100`}>
                    <button 
                        onClick={(e) => handleAction(e, 'view')}
                        disabled={!!actionLoading}
                        className="w-40 bg-white text-navy font-bold py-3 rounded-full border-4 border-navy hover:bg-sky hover:text-white transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#1C304A] disabled:opacity-50"
                    >
                        {actionLoading === 'view' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                        View PDF
                    </button>
                    <button 
                        onClick={(e) => handleAction(e, 'download')}
                        disabled={!!actionLoading}
                        className="w-40 bg-sky text-white font-bold py-3 rounded-full border-4 border-navy hover:bg-persimmon transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#1C304A] disabled:opacity-50"
                    >
                        {actionLoading === 'download' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Download className="w-5 h-5" />
                        )}
                        Download
                    </button>
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-center bg-white relative z-20">
                <h3 className="text-lg md:text-xl font-black text-navy line-clamp-2 leading-tight group-hover:text-sky transition-colors">
                    {item.title}
                </h3>
                {actionLoading && (
                    <p className="flex items-center gap-2 text-sm text-sky font-bold mt-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> 
                        {actionLoading === 'view' ? 'Opening...' : 'Downloading...'}
                    </p>
                )}
            </div>
        </div>
    );
}
