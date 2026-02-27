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
          <div key={i} className="bg-white border-4 border-navy rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_#1C304A] hover:-translate-y-2 transition-transform cursor-pointer group">
            <div className="aspect-video bg-sky/20 flex items-center justify-center relative">
              <PlayCircle className="w-16 h-16 text-sky group-hover:scale-110 transition-transform" />
              <div className="absolute bottom-4 right-4 bg-navy text-white text-xs font-bold px-2 py-1 rounded-full">
                5:30
              </div>
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
