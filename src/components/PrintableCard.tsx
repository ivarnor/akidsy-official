'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/src/utils/supabase/client';
import { Download, Eye, Loader2, Sparkles } from 'lucide-react';
import { getSignedUrl } from '@/src/utils/supabase/storage-actions';

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
    const supabase = createClient();
    const THUMBNAIL_BASE_URL = 'https://hokehjxsejqbhbeugqnt.supabase.co/storage/v1/object/public/thumbnails/';
    const [imageError, setImageError] = useState(false);
    const [actionLoading, setActionLoading] = useState<'view' | 'download' | null>(null);

    // 1. Construct the Public URL using the base path + filename
    const hasThumb = item.thumbnail_url && item.thumbnail_url.trim() !== '';
    const thumbnailUrl = hasThumb 
        ? item.thumbnail_url.startsWith('http') ? item.thumbnail_url : (THUMBNAIL_BASE_URL + item.thumbnail_url)
        : '/images/akidsy-placeholder.png';

    // 4. Add console.log for debugging
    console.log('Image Source:', thumbnailUrl);

    const handleAction = async (e: React.MouseEvent, mode: 'view' | 'download') => {
        e.preventDefault();
        e.stopPropagation();

        if (actionLoading) return;

        console.log("Action Mode:", mode);
        console.log("User Subscription Status:", subscriptionType);
        console.log("Is Member:", isMember, "Is VIP:", isVIP);

        if (!isMember && !isVIP) {
            alert('Access Denied. You need an active subscription to access this content.');
            return;
        }

        setActionLoading(mode);

        try {
            // Use server action for consistent logic and bypass
            const signedUrl = await getSignedUrl('content', item.url, 60);

            if (!signedUrl) {
                console.error('Error creating signed URL');
                alert('Access Denied or File Not Found. Could not generate secure link.');
                return;
            }

            if (mode === 'download') {
                // Trigger download natively
                const link = document.createElement('a');
                link.href = signedUrl;
                const fileName = item.url.split('/').pop() || `${item.title}.pdf`;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                // View action
                window.open(signedUrl, '_blank');
            }
        } catch (err) {
            console.error('Error during action process:', err);
            alert('An unexpected error occurred.');
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
                        {actionLoading === 'view' ? 'Opening...' : 'Fetching...'}
                    </p>
                )}
            </div>
        </div>
    );
}
