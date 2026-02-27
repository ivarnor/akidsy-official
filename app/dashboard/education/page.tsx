import { GraduationCap, BookOpen, Calculator, Globe, Beaker } from 'lucide-react';

export default function EducationPage() {
  const subjects = [
    { name: 'Math Magic', icon: Calculator, color: 'bg-sky' },
    { name: 'Science Fun', icon: Beaker, color: 'bg-sunshine' },
    { name: 'Reading Time', icon: BookOpen, color: 'bg-persimmon' },
    { name: 'World Explorer', icon: Globe, color: 'bg-sky' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-navy flex items-center gap-4">
        <GraduationCap className="w-10 h-10 text-persimmon" />
        Education Center
      </h1>
      <p className="text-xl text-navy/80 font-medium max-w-2xl">
        Learn new skills with our structured educational resources!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {subjects.map((subject, i) => (
          <div key={i} className="bg-white border-4 border-navy rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_#1C304A] hover:-translate-y-2 transition-transform cursor-pointer group flex flex-col">
            <div className={`aspect-square ${subject.color}/20 flex items-center justify-center relative p-8`}>
              <div className={`w-full h-full border-4 border-navy rounded-full flex items-center justify-center ${subject.color} shadow-[4px_4px_0px_0px_#1C304A]`}>
                <subject.icon className={`w-16 h-16 ${subject.color === 'bg-persimmon' ? 'text-white' : 'text-navy'} group-hover:scale-110 transition-transform`} />
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between items-center text-center">
              <h3 className="text-xl font-bold text-navy mb-2">{subject.name}</h3>
              <p className="text-navy/70 font-medium mb-4">Start learning today!</p>
              <button className={`w-full ${subject.color} ${subject.color === 'bg-persimmon' ? 'text-white' : 'text-navy'} font-bold py-3 rounded-full border-4 border-navy hover:opacity-90 transition-colors flex items-center justify-center gap-2`}>
                Start Lesson
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
