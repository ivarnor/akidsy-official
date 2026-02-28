'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/src/utils/supabase/client';
import { PlayCircle, Star, Sparkles, Loader2, Compass, BookOpen } from 'lucide-react';
import { PdfViewerModal } from '@/src/components/PdfViewerModal';

function DashboardContent() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('cat') || 'Home';
  const supabase = createClient();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState<{ url: string | null, title: string }>({ url: null, title: '' });

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      let query = supabase.from('content').select('*').order('created_at', { ascending: false });

      if (currentCategory !== 'Home') {
        query = query.eq('category', currentCategory);
      } else {
        query = query.limit(4);
      }

      const { data, error } = await query;

      if (!error && data) {
        setItems(data);
      } else {
        console.error('Error fetching content:', error);
        setItems([]);
      }
      setLoading(false);
    }

    fetchContent();
  }, [currentCategory, supabase]);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Banner */}
      <div className="bg-sky border-4 border-navy rounded-[3rem] p-8 md:p-16 shadow-[10px_10px_0px_0px_#1C304A] relative overflow-hidden text-navy">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-navy/20 mb-6 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-sunshine fill-sunshine" />
            Active Explorer Status: Expert
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-sm">
            Welcome Back, Explorer! 🌟
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-2xl opacity-90">
            {currentCategory === 'Home'
              ? "Ready for a new adventure today? We've found some fresh treasures just for you!"
              : `Showing everything in ${currentCategory}. Let's dive in!`}
          </p>
        </div>
        {/* Decorative Stars */}
        <Star className="absolute -top-4 -right-4 w-32 h-32 text-sunshine fill-sunshine opacity-30 rotate-12" />
        <Star className="absolute bottom-8 right-24 w-16 h-16 text-persimmon fill-persimmon opacity-20 -rotate-12" />
      </div>

      {/* Content Grid */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-navy flex items-center gap-3">
            {currentCategory === 'Home' ? (
              <><Compass className="w-8 h-8 text-sky" /> Discover New Stuffs</>
            ) : (
              <><Star className="w-8 h-8 text-sunshine fill-sunshine" /> {currentCategory}</>
            )}
          </h2>
          {currentCategory === 'Home' && items.length > 0 && (
            <span className="bg-navy text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest border-2 border-navy shadow-[2px_2px_0px_0px_#1C304A]">
              Latest Picks
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-sky animate-spin" />
            <p className="font-bold text-navy/60">Scouting the area for treasures...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((item) => (
              <div
                key={item.id}
                className="group bg-white border-4 border-navy rounded-[2.5rem] overflow-hidden shadow-[8px_8px_0px_0px_#1C304A] hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail Area */}
                <div className="aspect-video relative overflow-hidden bg-cream border-b-4 border-navy">
                  {item.thumbnail_url ? (
                    <Image
                      src={item.thumbnail_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-sky/10">
                      <Sparkles className="w-12 h-12 text-sky/30" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-navy text-xs font-black px-3 py-1.5 rounded-full border-2 border-navy shadow-[2px_2px_0px_0px_#1C304A] uppercase tracking-tighter">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-navy mb-2 line-clamp-1">{item.title}</h3>
                  <p className="text-navy/70 font-bold mb-6 line-clamp-2 text-sm leading-relaxed">
                    {item.description || "Grab your map and start exploring this amazing content!"}
                  </p>

                  <div className="mt-auto">
                    <button
                      onClick={async () => {
                        if (item.url) {
                          try {
                            // Track view without blocking navigation
                            fetch('/api/content/view', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: item.id })
                            }).catch(console.error);
                          } catch (e) { }

                          if (item.category === 'Coloring books') {
                            setSelectedPdf({ url: item.url, title: item.title });
                          } else {
                            window.open(item.url, '_blank');
                          }
                        }
                      }}
                      className="w-full bg-sunshine text-navy font-black text-xl py-4 rounded-2xl border-4 border-navy shadow-[4px_4px_0px_0px_#1C304A] hover:bg-sunshine/90 transition-all active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 group/btn"
                    >
                      {item.category === 'Videos' ? (
                        <><PlayCircle className="w-6 h-6 group-hover/btn:scale-110 transition-transform" /> Play Now</>
                      ) : (
                        <><BookOpen className="w-6 h-6 group-hover/btn:scale-110 transition-transform" /> Open Now</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border-4 border-navy rounded-[3rem] p-16 text-center shadow-[8px_8px_0px_0px_#1C304A] max-w-2xl mx-auto">
            <div className="bg-cream w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-navy">
              <Sparkles className="w-12 h-12 text-sunshine fill-sunshine" />
            </div>
            <h3 className="text-3xl font-black text-navy mb-4 italic">
              Coming Soon!
            </h3>
            <p className="text-xl text-navy/70 font-bold leading-relaxed">
              Our explorers are finding new treasures! Check back soon for amazing items in {currentCategory}.
            </p>
          </div>
        )}
      </div>

      <PdfViewerModal
        url={selectedPdf.url}
        title={selectedPdf.title}
        onClose={() => setSelectedPdf({ url: null, title: '' })}
      />
    </div>
  );
}

export default function DashboardHome() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-sky animate-spin" />
        <p className="font-bold text-navy/60">Gearing up for adventure...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
