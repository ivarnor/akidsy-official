import { PlayCircle } from 'lucide-react';

export default function VideosPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-navy flex items-center gap-4">
        <PlayCircle className="w-10 h-10 text-sky" />
        Fun Videos
      </h1>
      <p className="text-xl text-navy/80 font-medium max-w-2xl">
        Watch and learn with our exciting collection of educational videos!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white border-4 border-navy rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_#1C304A] transition-transform group">
            <div className="aspect-video bg-black relative">
              <video
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                playsInline
                crossOrigin="anonymous"
                controlsList="nodownload"
                onError={(e) => {
                  const target = e.target as HTMLVideoElement;
                  alert(`Video Error Code: ${target.error?.code || 'Unknown'}`);
                }}
              >
                <source
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/sample-${i}.mp4`}
                  type="video/mp4"
                />
              </video>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-navy mb-2">Awesome Video {i}</h3>
              <p className="text-navy/70 font-medium">Learn something new today!</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
