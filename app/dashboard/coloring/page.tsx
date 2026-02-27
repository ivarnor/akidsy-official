import { Palette, Download } from 'lucide-react';

export default function ColoringPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-navy flex items-center gap-4">
        <Palette className="w-10 h-10 text-sunshine" />
        Coloring Books
      </h1>
      <p className="text-xl text-navy/80 font-medium max-w-2xl">
        Download and print these fun coloring pages!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white border-4 border-navy rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_#1C304A] hover:-translate-y-2 transition-transform cursor-pointer group flex flex-col">
            <div className="aspect-[3/4] bg-sunshine/20 flex items-center justify-center relative p-8">
              <div className="w-full h-full border-4 border-dashed border-navy/30 rounded-xl flex items-center justify-center">
                <Palette className="w-16 h-16 text-sunshine group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-navy mb-2">Coloring Page {i}</h3>
                <p className="text-navy/70 font-medium mb-4">Print and color!</p>
              </div>
              <button className="w-full bg-persimmon text-white font-bold py-3 rounded-full border-4 border-navy hover:bg-persimmon/90 transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
