import { Puzzle, Play } from 'lucide-react';

export default function PuzzlesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-navy flex items-center gap-4">
        <Puzzle className="w-10 h-10 text-sunshine" />
        Puzzles
      </h1>
      <p className="text-xl text-navy/80 font-medium max-w-2xl">
        Challenge your brain with these fun interactive puzzles!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white border-4 border-navy rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_#1C304A] hover:-translate-y-2 transition-transform cursor-pointer group flex flex-col">
            <div className="aspect-square bg-sunshine/20 flex items-center justify-center relative p-8">
              <div className="w-full h-full border-4 border-navy rounded-xl flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_#1C304A] grid grid-cols-2 grid-rows-2 gap-2 p-2">
                <div className="bg-sky rounded-lg border-2 border-navy"></div>
                <div className="bg-persimmon rounded-lg border-2 border-navy"></div>
                <div className="bg-sunshine rounded-lg border-2 border-navy"></div>
                <div className="bg-cream rounded-lg border-2 border-navy flex items-center justify-center">
                  <Puzzle className="w-8 h-8 text-navy opacity-50" />
                </div>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-navy mb-2">Puzzle Challenge {i}</h3>
                <p className="text-navy/70 font-medium mb-4">Can you solve it?</p>
              </div>
              <button className="w-full bg-sunshine text-navy font-bold py-3 rounded-full border-4 border-navy hover:bg-sunshine/80 transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Play Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
