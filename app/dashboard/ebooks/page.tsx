import { BookOpen, Book } from 'lucide-react';

export default function EbooksPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-navy flex items-center gap-4">
        <BookOpen className="w-10 h-10 text-sky" />
        Ebooks
      </h1>
      <p className="text-xl text-navy/80 font-medium max-w-2xl">
        Read amazing stories and learn new things!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white border-4 border-navy rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_#1C304A] hover:-translate-y-2 transition-transform cursor-pointer group flex flex-col">
            <div className="aspect-[3/4] bg-sky/20 flex items-center justify-center relative p-8">
              <div className="w-full h-full border-4 border-navy rounded-xl flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_#1C304A]">
                <Book className="w-16 h-16 text-sky group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-navy mb-2">Story Book {i}</h3>
                <p className="text-navy/70 font-medium mb-4">A fun adventure awaits!</p>
              </div>
              <button className="w-full bg-sky text-navy font-bold py-3 rounded-full border-4 border-navy hover:bg-sky/80 transition-colors flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" /> Read Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
