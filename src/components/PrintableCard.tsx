'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/src/utils/supabase/client';
import { Download, Loader2, Sparkles } from 'lucide-react';

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
    const [isDownloading, setIsDownloading] = useState(false);

    // 1. Construct the Public URL using the base path + filename
    const hasThumb = item.thumbnail_url && item.thumbnail_url.trim() !== '';
    const thumbnailUrl = hasThumb 
        ? item.thumbnail_url.startsWith('http') ? item.thumbnail_url : (THUMBNAIL_BASE_URL + item.thumbnail_url)
        : '/images/akidsy-placeholder.png';

    // 4. Add console.log for debugging
    console.log('Image Source:', thumbnailUrl);

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // 4. Debugging Log
        console.log("User Subscription Status:", subscriptionType);
        console.log("Is Member:", isMember, "Is VIP:", isVIP);

        // 1. Expanded Access Control (isVIP corresponds to ivarnor@gmail.com bypass)
        if (!isMember && !isVIP) {
            alert('Access Denied. You need an active subscription to access this content.');
            return;
        }

        setIsDownloading(true);

        try {
            // 3. Fix 'Access Denied' on Download trigger
            const { data, error } = await supabase.storage
                .from('content')
                .createSignedUrl(item.url, 60, {
                    download: true,
                });

            if (error || !data?.signedUrl) {
                console.error('Error creating signed URL:', error);
                alert('Access Denied or File Not Found. Could not generate download link.');
                return;
            }

            // Trigger download natively
            const link = document.createElement('a');
            link.href = data.signedUrl;
            const fileName = item.url.split('/').pop() || `${item.title}.pdf`;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error during download process:', err);
            alert('An unexpected error occurred.');
        } finally {
            setIsDownloading(false);
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

                <div className={`absolute inset-0 bg-navy/40 backdrop-blur-[2px] transition-opacity duration-300 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100`}>
                    <div className="bg-white/90 p-4 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300 delay-75">
                        <Download className="w-10 h-10 text-sky" />
                    </div>
                </div>

                <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="absolute inset-0 z-30 w-full h-full cursor-pointer opacity-0"
                    aria-label={`Download ${item.title}`}
                />
            </div>

            <div className="p-4 flex-1 flex flex-col justify-center bg-white relative z-20 pointer-events-none">
                <h3 className="text-lg md:text-xl font-black text-navy line-clamp-2 leading-tight group-hover:text-sky transition-colors">
                    {item.title}
                </h3>
                {isDownloading && (
                    <p className="flex items-center gap-2 text-sm text-sky font-bold mt-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Fetching...
                    </p>
                )}
            </div>
        </div>
    );
}
