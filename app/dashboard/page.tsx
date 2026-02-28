'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/src/utils/supabase/client';
import { PlayCircle, Star, Sparkles, Loader2, Compass, BookOpen } from 'lucide-react';
import { PdfViewerModal } from '@/src/components/PdfViewerModal';
import { VideoPlayerModal } from '@/src/components/VideoPlayerModal';

function DashboardContent() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('cat') || 'Home';
  const supabase = createClient();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState<{ url: string | null, title: string }>({ url: null, title: '' });
  const [selectedVideo, setSelectedVideo] = useState<{ url: string | null, title: string }>({ url: null, title: '' });
  const [fetchingSecureUrl, setFetchingSecureUrl] = useState<string | null>(null); // Track ID of item fetching URL

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      let excludedCategories: string[] = [];

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('show_coloring, show_videos, show_puzzles')
          .eq('id', user.id)
          .single();

        if (profile) {
          if (profile.show_coloring === false) excludedCategories.push('Coloring books');
          if (profile.show_videos === false) excludedCategories.push('Videos');
          if (profile.show_puzzles === false) excludedCategories.push('Puzzles');
        }
      }

      let query = supabase.from('content').select('*').order('created_at', { ascending: false });

      if (excludedCategories.length > 0) {
        query = query.not('category', 'in', `(${excludedCategories.map(c => `"${c}"`).join(',')})`);
      }

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

  const getCategoryDetails = (cat: string) => {
    switch (cat) {
      case 'Coloring books': return { title: "🎨 Let's Color!", icon: <Star className="w-8 h-8 text-sunshine fill-sunshine" /> };
      case 'eBooks': return { title: "📚 Story Time!", textIcon: "📚" };
      case 'Puzzles': return { title: "🧩 Brain Teasers!", textIcon: "🧩" };
      case 'Videos': return { title: "🎬 Movie Magic!", icon: <PlayCircle className="w-8 h-8 text-persimmon" /> };
      case 'Home': return { title: "Discover New Stuffs", icon: <Compass className="w-8 h-8 text-sky" /> };
      default: return { title: cat, icon: <Star className="w-8 h-8 text-sunshine fill-sunshine" /> };
    }
  };

  const catDetails = getCategoryDetails(currentCategory);

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
            {catDetails.icon}
            {catDetails.textIcon && <span className="text-3xl">{catDetails.textIcon}</span>}
            {catDetails.title}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {items.map((item) => (
              <button
                key={item.id}
                disabled={fetchingSecureUrl === item.id}
                onClick={async () => {
                  if (item.url) {
                    try {
                      fetch('/api/content/view', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: item.id })
                      }).catch(console.error);
                    } catch (e) { }

                    if (item.category === 'Coloring books') {
                      setSelectedPdf({ url: item.url, title: item.title });
                    } else if (item.category === 'Videos') {
                      // Videos are stored in a private bucket, we must generate a signed URL
                      setFetchingSecureUrl(item.id);
                      try {
                        const { data, error } = await supabase.storage
                          .from('videos')
                          .createSignedUrl(item.url, 3600); // 1 Hour secure link

                        if (error) {
                          console.error("Error generating signed URL", error);
                          alert("Sorry, we couldn't load this video right now.");
                        } else if (data) {
                          setSelectedVideo({ url: data.signedUrl, title: item.title });
                        }
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setFetchingSecureUrl(null);
                      }
                    } else {
                      window.open(item.url, '_blank');
                    }
                  }
                }}
                className={`group w-full text-left bg-white border-4 border-navy rounded-[2rem] overflow-hidden shadow-[6px_6px_0px_0px_#1C304A] hover:shadow-[10px_10px_0px_0px_#1C304A] hover:-translate-y-2 transition-all duration-300 flex flex-col active:translate-y-1 active:shadow-none outline-none focus-visible:ring-4 ring-sky ring-offset-2 ${fetchingSecureUrl === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {/* Thumbnail Area - Book Cover style */}
                <div className="aspect-[4/5] relative overflow-hidden bg-cream border-b-4 border-navy w-full">
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

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="bg-white text-navy text-[10px] md:text-xs font-black px-2.5 py-1 md:py-1.5 rounded-full border-2 border-navy shadow-[2px_2px_0px_0px_#1C304A] uppercase tracking-tighter">
                      {item.category}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-navy/40 backdrop-blur-[2px] transition-opacity duration-300 z-10 flex items-center justify-center ${fetchingSecureUrl === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="bg-white/90 p-4 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300 delay-75">
                      {fetchingSecureUrl === item.id ? (
                        <Loader2 className="w-10 h-10 text-sky animate-spin" />
                      ) : item.category === 'Videos' ? (
                        <PlayCircle className="w-10 h-10 text-persimmon" />
                      ) : (
                        <BookOpen className="w-10 h-10 text-sky" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-4 flex-1 flex flex-col justify-center bg-white relative z-20">
                  <h3 className="text-lg md:text-xl font-black text-navy line-clamp-2 leading-tight group-hover:text-sky transition-colors">{item.title}</h3>
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

      <VideoPlayerModal
        url={selectedVideo.url}
        title={selectedVideo.title}
        onClose={() => setSelectedVideo({ url: null, title: '' })}
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
