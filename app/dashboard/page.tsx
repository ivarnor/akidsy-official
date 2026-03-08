'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/src/utils/supabase/client';
import { PlayCircle, Star, Sparkles, Loader2, Compass, BookOpen } from 'lucide-react';
import { PdfViewerModal } from '@/src/components/PdfViewerModal';
import { VideoPlayerModal } from '@/src/components/VideoPlayerModal';
import DashboardHeader from '@/src/components/DashboardHeader';
import { WelcomePopup } from '@/src/components/WelcomePopup';
import { PrintableCard } from '@/src/components/PrintableCard';
import { getSignedUrl } from '@/src/utils/supabase/storage-actions';

function CategoryItemCard({ item, supabase, onClick }: { item: any; supabase: any; onClick: () => void }) {
  const THUMBNAIL_BASE_URL = 'https://hokehjxsejqbhbeugqnt.supabase.co/storage/v1/object/public/thumbnails/';
  const [imageError, setImageError] = useState(false);
  const hasThumb = item.thumbnail_url && item.thumbnail_url.trim() !== '';
  const thumbnailUrl = hasThumb 
    ? item.thumbnail_url.startsWith('http') ? item.thumbnail_url : (THUMBNAIL_BASE_URL + item.thumbnail_url)
    : '/images/akidsy-placeholder.png';

  useEffect(() => {
    console.log('Image Source:', thumbnailUrl);
  }, [thumbnailUrl]);

  return (
    <button
      onClick={onClick}
      className={`group w-full text-left bg-white border-4 border-navy rounded-[2rem] overflow-hidden shadow-[6px_6px_0px_0px_#1C304A] hover:shadow-[10px_10px_0px_0px_#1C304A] hover:-translate-y-2 transition-all duration-300 flex flex-col active:translate-y-1 active:shadow-none outline-none focus-visible:ring-4 ring-sky ring-offset-2`}
    >
      {/* Thumbnail Area - Book Cover style */}
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

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-white text-navy text-[10px] md:text-xs font-black px-2.5 py-1 md:py-1.5 rounded-full border-2 border-navy shadow-[2px_2px_0px_0px_#1C304A] uppercase tracking-tighter">
            {item.category}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-navy/40 backdrop-blur-[2px] transition-opacity duration-300 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100`}>
          <div className="bg-white/90 p-4 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300 delay-75">
            {item.category === 'Videos' ? (
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
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = searchParams.get('cat') || 'Home';
  const showYearlyWelcome = searchParams.get('welcome') === 'yearly';
  const supabase = createClient();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState<{ url: string | null, title: string }>({ url: null, title: '' });
  const [selectedVideo, setSelectedVideo] = useState<{ url: string | null, title: string }>({ url: null, title: '' });
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isYearlyMember, setIsYearlyMember] = useState(false);
  const [isDownloadingBonus, setIsDownloadingBonus] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState('');

  const handleDownloadBonus = async () => {
    setIsDownloadingBonus(true);
    try {
      // Use server action for consistent logic and bypass
      const signedUrl = await getSignedUrl('bonus content', 'bonus-coloring-world-200.pdf', 60);
      
      if (!signedUrl) {
        console.error('Error generating signed URL');
        alert('Could not generate download link. Please try again later.');
        return;
      }
      
      // Force trigger download
      const link = document.createElement('a');
      link.href = signedUrl;
      link.setAttribute('download', 'bonus-coloring-world-200.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Unexpected error downloading bonus:', err);
    } finally {
      setIsDownloadingBonus(false);
    }
  };

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      supabase.auth.refreshSession();
      // Optional: Clean up session_id from URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('session_id');
      const queryString = newParams.toString();
      router.replace(queryString ? `?${queryString}` : window.location.pathname);
    }

    if (showYearlyWelcome) {
      setIsWelcomeOpen(true);
      // Clean up the URL so it doesn't pop up again on refresh
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('welcome');
      const queryString = newParams.toString();
      router.replace(queryString ? `?${queryString}` : window.location.pathname);
    }
  }, [showYearlyWelcome, searchParams, router, supabase.auth]);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      setAuthLoading(true);

      let { data: { user } } = await supabase.auth.getUser();

      // Fix: If no user, wait 1.5s and check again (cookie landing grace period)
      if (!user) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const secondCheck = await supabase.auth.getUser();
        user = secondCheck.data.user;
      }

      // If still no user, kick to home
      if (!user) {
        router.push('/?message=Please log in to see this content!');
        return;
      }

      setAuthLoading(false);
      setUserEmail(user.email || '');
      let excludedCategories: string[] = [];

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('show_coloring, show_videos, show_puzzles, price_id, is_member')
          .eq('id', user.id)
          .maybeSingle(); // Changed from .single() to .maybeSingle() to gracefully handle 0 rows

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching user profile preferences:', profileError);
        }

        if (profile) {
          setIsMember(profile.is_member === true);
          setSubscriptionType(profile.price_id || 'none');
          if (profile.show_coloring === false) excludedCategories.push('Coloring books');
          if (profile.show_videos === false) excludedCategories.push('Videos');
          if (profile.show_puzzles === false) excludedCategories.push('Puzzles');
          if (profile.price_id === 'price_1T6xwUC1HhLD0dXEgMU4i54M') {
            setIsYearlyMember(true);
          }
        }
      } catch (err) {
        console.error('Unexpected error fetching profile details:', err);
      }

      let query = supabase.from('content').select('*').order('created_at', { ascending: false });

      if (excludedCategories.length > 0 && user.email !== 'ivarnor@gmail.com') {
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
  }, [currentCategory, supabase, router]);

  const getCategoryDetails = (cat: string) => {
    switch (cat) {
      case 'Coloring books': return { title: "🎨 Let's Color!", icon: <Star className="w-8 h-8 text-sunshine fill-sunshine" /> };
      case 'eBooks': return { title: "📚 Story Time!", textIcon: "📚" };
      case 'Puzzles': return { title: "🧩 Brain Teasers!", textIcon: "🧩" };
      case 'Videos': return { title: "🎬 Movie Magic!", icon: <PlayCircle className="w-8 h-8 text-persimmon" /> };
      case 'Home': return { title: "Discover New Stuffs", icon: <Compass className="w-8 h-8 text-sky" /> };
      case 'Printables': return { title: "🖨️ Printables", icon: <BookOpen className="w-8 h-8 text-sky" /> };
      default: return { title: cat, icon: <Star className="w-8 h-8 text-sunshine fill-sunshine" /> };
    }
  };

  const catDetails = getCategoryDetails(currentCategory);

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-sky animate-spin" />
        <p className="font-bold text-navy/60 text-center">
          Verifying your explorer status...<br />
          <span className="text-sm opacity-50 font-medium">Just a second!</span>
        </p>
      </div>
    );
  }

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

      {/* Yearly Member Perks - Only visible to Yearly Members */}
      {(isYearlyMember || userEmail === 'ivarnor@gmail.com') && currentCategory === 'Home' && (
        <div className="bg-gradient-to-br from-sunshine to-[#FFAE00] border-4 border-navy rounded-[3rem] p-8 mt-12 shadow-[10px_10px_0px_0px_#1C304A] relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 bg-white text-navy px-4 py-2 rounded-full border-2 border-navy font-black text-sm uppercase tracking-widest shadow-[2px_2px_0px_0px_#1C304A]">
                <Star className="w-4 h-4 fill-navy text-navy" />
                Yearly Member Perks
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-navy leading-tight">
                Bonus Coloring World
              </h2>
              <p className="text-xl text-navy/90 font-bold max-w-lg">
                Thank you for being a Yearly Member! Download your exclusive massive coloring book bundle today.
              </p>
              
              <button 
                onClick={handleDownloadBonus}
                disabled={isDownloadingBonus}
                className="mt-6 flex items-center justify-center gap-3 bg-navy text-white text-lg font-black px-8 py-4 rounded-full border-4 border-navy hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1C304A] hover:bg-sky transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group w-full md:w-auto"
              >
                {isDownloadingBonus ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> 
                    Preparing Download...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
                    Download 200-Page Bonus
                  </>
                )}
              </button>
            </div>
            
            <div className="w-full md:w-[350px] relative aspect-square bg-white border-4 border-navy rounded-3xl shadow-[6px_6px_0px_0px_#1C304A] flex items-center justify-center -rotate-3 overflow-hidden group">
              {/* Replace the bg-cream with an icon if true image is unavailable, until then we simulate a high quality cover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky/20 to-persimmon/20" />
              <div className="z-10 text-center p-6 space-y-4">
                <Sparkles className="w-16 h-16 text-persimmon fill-persimmon mx-auto group-hover:scale-110 transition-transform duration-500" />
                <div className="font-black text-3xl text-navy uppercase tracking-tight">200 Pages</div>
                <div className="font-bold text-xl text-sky">Of Fun!</div>
              </div>
              
              {/* Badge */}
              <div className="absolute -top-4 -right-4 bg-persimmon text-white text-sm font-black px-4 py-4 rounded-full border-4 border-navy shadow-[4px_4px_0px_0px_#1C304A] rotate-12 flex items-center justify-center w-24 h-24 text-center leading-tight">
                Bonus<br/>Edition!
              </div>
            </div>
          </div>
        </div>
      )}

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
            {items.map((item) => {
              if (item.category === 'Printables') {
                return (
                  <PrintableCard 
                    key={item.id} 
                    item={item} 
                    isMember={isMember} 
                    isVIP={userEmail === 'ivarnor@gmail.com'} 
                    subscriptionType={subscriptionType} 
                  />
                );
              }

              return (
                <CategoryItemCard
                  key={item.id}
                  item={item}
                  supabase={supabase}
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
                        setSelectedVideo({ url: item.url, title: item.title });
                      } else {
                        window.open(item.url, '_blank');
                      }
                    }
                  }}
                />
              );
            })}
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

      <WelcomePopup
        show={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
      />

      <PdfViewerModal
        url={selectedPdf.url}
        title={selectedPdf.title}
        onClose={() => setSelectedPdf({ url: null, title: '' })}
      />

      {selectedVideo.url && (
        <VideoPlayerModal
          url={selectedVideo.url}
          title={selectedVideo.title}
          onClose={() => setSelectedVideo({ url: null, title: '' })}
        />
      )}
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
