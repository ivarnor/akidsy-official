'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/src/utils/supabase/client';
import { Palette, Sparkles, Loader2, ArrowLeft, BookOpen } from 'lucide-react';
import { PdfViewerModal } from '@/src/components/PdfViewerModal';

export default function SubcategoryContent({ slug }: { slug: string }) {
    const supabase = createClient();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPdf, setSelectedPdf] = useState<{ url: string | null, title: string }>({ url: null, title: '' });

    // Format slug for display (e.g. "space" -> "Space", "animals" -> "Animals")
    const displayTitle = slug.charAt(0).toUpperCase() + slug.slice(1);

    useEffect(() => {
        async function fetchContent() {
            setLoading(true);

            const { data, error } = await supabase
                .from('content')
                .select('*')
                .eq('category', 'Coloring books')
                .eq('sub_category', slug)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setItems(data);
            } else {
                console.error('Error fetching subcategory content:', error);
                setItems([]);
            }
            setLoading(false);
        }

        fetchContent();
    }, [slug, supabase]);

    return (
        <div className="space-y-8 pb-20">
            {/* Back Button */}
            <div className="pt-4">
                <Link
                    href="/dashboard?cat=Coloring"
                    className="inline-flex items-center gap-2 text-navy font-bold hover:text-sky transition-colors bg-white px-4 py-2 rounded-full border-2 border-navy shadow-[2px_2px_0px_0px_#1C304A] hover:shadow-[4px_4px_0px_0px_#1C304A] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0px_0px_0px_0px_#1C304A]"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to All Coloring Books
                </Link>
            </div>

            <div className="flex items-center gap-4 border-b-4 border-navy/10 pb-6 mb-8 mt-4">
                <div className="bg-sky/20 p-4 rounded-3xl border-4 border-sky">
                    <Palette className="w-10 h-10 text-sky fill-sky/20" />
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold text-navy capitalize drop-shadow-sm">
                        {displayTitle} Coloring
                    </h1>
                    <p className="text-lg text-navy/70 font-semibold mt-1">
                        Explore all our wonderful {slug} coloring pages!
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-12 h-12 text-sky animate-spin" />
                    <p className="font-bold text-navy/60">Scouting the area for {slug} treasures...</p>
                </div>
            ) : items.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (item.url) {
                                    fetch('/api/content/view', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ id: item.id })
                                    }).catch(console.error);

                                    setSelectedPdf({ url: item.url, title: item.title });
                                }
                            }}
                            className="group w-full text-left bg-white border-4 border-navy rounded-[2rem] overflow-hidden shadow-[6px_6px_0px_0px_#1C304A] hover:shadow-[10px_10px_0px_0px_#1C304A] hover:-translate-y-2 transition-all duration-300 flex flex-col active:translate-y-1 active:shadow-none outline-none focus-visible:ring-4 ring-sky ring-offset-2"
                        >
                            {/* Thumbnail Area */}
                            <div className="aspect-[4/5] relative overflow-hidden bg-cream w-full border-b-4 border-navy">
                                {item.thumbnail_url ? (
                                    <Image
                                        src={item.thumbnail_url}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        referrerPolicy="no-referrer"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-sky/10">
                                        <Sparkles className="w-12 h-12 text-sky/30" />
                                    </div>
                                )}

                                {/* Overlay Icon */}
                                <div className="absolute inset-0 bg-navy/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                                    <div className="bg-white/90 p-4 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300 delay-75">
                                        <BookOpen className="w-10 h-10 text-sky" />
                                    </div>
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="p-4 flex-1 flex flex-col justify-center bg-white relative z-20">
                                <h3 className="text-lg md:text-xl font-black text-navy line-clamp-2 leading-tight group-hover:text-sky transition-colors">
                                    {item.title}
                                </h3>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="bg-white border-4 border-navy rounded-[3rem] p-16 text-center shadow-[8px_8px_0px_0px_#1C304A] max-w-2xl mx-auto">
                    <div className="bg-cream w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-navy">
                        <Sparkles className="w-12 h-12 text-sunshine fill-sunshine" />
                    </div>
                    <h3 className="text-3xl font-black text-navy mb-4 italic">
                        New Content Coming Soon!
                    </h3>
                    <p className="text-xl text-navy/70 font-bold leading-relaxed">
                        Our explorers are finding new {displayTitle} treasures! Check back soon for amazing items.
                    </p>
                </div>
            )}

            {/* PDF View Modal */}
            <PdfViewerModal
                url={selectedPdf.url}
                title={selectedPdf.title}
                onClose={() => setSelectedPdf({ url: null, title: '' })}
            />
        </div>
    );
}
