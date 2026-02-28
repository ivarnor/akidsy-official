import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, PlayCircle, BookOpen, Puzzle, GraduationCap, Palette, CheckCircle2, Star, ShieldCheck, Heart, AlertCircle } from 'lucide-react';
import { CheckoutButton } from '@/src/components/CheckoutButton';
import { createClient } from '@/src/utils/supabase/server';

export default async function SalesPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolveSearchParams = await searchParams;
  const message = resolveSearchParams?.message as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col bg-cream font-sans relative">
      {/* Banner Message (Always visible but changes text based on param) */}
      <div className="bg-persimmon text-white text-center p-4 font-bold border-b-4 border-navy flex justify-center items-center gap-2">
        <AlertCircle className="w-6 h-6" />
        {message ? decodeURIComponent(message) : "⚠️ Please join the club to see this content!"}
      </div>

      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl w-full mx-auto">
        <div className="text-3xl font-bold text-navy flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-sunshine fill-sunshine" />
          Akidsy
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-12 pb-20 max-w-6xl mx-auto">
        <div className="inline-block bg-sunshine text-navy font-bold px-6 py-2 rounded-full border-4 border-navy mb-8 shadow-[4px_4px_0px_0px_#1C304A] rotate-[-2deg]">
          The #1 Educational Platform for Kids 🚀
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-navy mb-8 leading-tight max-w-4xl">
          Unlock Your Child&apos;s Potential <br />
          <span className="text-sky relative inline-block">
            Through Play!
            <svg className="absolute w-full h-4 -bottom-2 left-0 text-sunshine" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 10 Q 50 20 100 10" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-navy/80 mb-12 max-w-3xl font-medium">
          Give your kids a safe, ad-free world where learning feels like a game. Join thousands of parents who trust Akidsy for early childhood development.
        </p>

        {/* Video Placeholder */}
        <div className="w-full max-w-4xl aspect-video bg-navy rounded-3xl border-4 border-navy shadow-[8px_8px_0px_0px_#1C304A] relative overflow-hidden mb-12 flex items-center justify-center group cursor-pointer">
          <Image
            src="https://picsum.photos/1280/720?random=1"
            alt="Video Thumbnail"
            fill
            className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <PlayCircle className="w-24 h-24 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
            <span className="text-white font-bold text-xl mt-4 drop-shadow-md">Watch How It Works</span>
          </div>
        </div>

        <a
          href="#pricing-section"
          className="bg-persimmon text-white font-bold text-2xl px-12 py-5 rounded-full border-4 border-navy hover:bg-persimmon/90 transition-transform hover:scale-105 active:scale-95 shadow-[6px_6px_0px_0px_#1C304A] flex items-center gap-3"
        >
          Start Your Free Trial <Sparkles className="w-6 h-6" />
        </a>
        <p className="mt-4 text-navy/60 font-medium">Cancel anytime. No commitment.</p>
      </header>

      {/* Problem / Solution Section */}
      <section className="bg-white py-24 border-y-4 border-navy">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative h-[400px] rounded-3xl border-4 border-navy shadow-[8px_8px_0px_0px_#1C304A] overflow-hidden">
            <Image
              src="https://picsum.photos/800/800?random=2"
              alt="Happy child learning"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -right-6 bg-sunshine p-6 rounded-full border-4 border-navy shadow-[4px_4px_0px_0px_#1C304A]">
              <Heart className="w-12 h-12 text-navy fill-navy" />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-extrabold text-navy mb-6">
              Screen Time You Can Actually <span className="text-persimmon underline decoration-wavy decoration-sunshine">Feel Good</span> About.
            </h2>
            <p className="text-xl text-navy/80 mb-8 leading-relaxed">
              We know how hard it is to find quality, educational content that kids actually want to engage with. YouTube is full of ads, and most apps are just mindless games.
            </p>
            <p className="text-xl text-navy/80 mb-8 leading-relaxed">
              Akidsy was built by educators and parents to provide a 100% safe, ad-free environment where every video, puzzle, and book is designed to boost cognitive development.
            </p>
            <ul className="space-y-4">
              {[
                '100% Ad-Free & Kid-Safe',
                'Curated by Early Education Experts',
                'New Content Added Weekly',
                'Works on All Devices'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-lg font-bold text-navy">
                  <CheckCircle2 className="w-6 h-6 text-sky fill-sky/20" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-navy mb-6">Everything Your Child Needs to Thrive</h2>
          <p className="text-xl text-navy/80 mb-16 max-w-2xl mx-auto">One membership gives you unlimited access to our entire library of educational resources.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: PlayCircle, title: 'Educational Videos', desc: 'Engaging shows that teach math, science, and social skills.', color: 'bg-sky' },
              { icon: Palette, title: 'Coloring Books', desc: 'Printable pages to develop fine motor skills and creativity.', color: 'bg-sunshine' },
              { icon: BookOpen, title: 'Interactive Ebooks', desc: 'Read-along stories that build early literacy and vocabulary.', color: 'bg-persimmon' },
              { icon: Puzzle, title: 'Brain Puzzles', desc: 'Fun games that enhance problem-solving and logic.', color: 'bg-sky' },
              { icon: GraduationCap, title: 'Structured Learning', desc: 'Step-by-step curriculums for different age groups.', color: 'bg-sunshine' },
              { icon: ShieldCheck, title: 'Parent Dashboard', desc: 'Track progress and control what your child sees.', color: 'bg-persimmon' },
            ].map((feature, i) => (
              <div
                key={i}
                className={`bg-white border-4 border-navy rounded-3xl p-8 flex flex-col items-start text-left shadow-[6px_6px_0px_0px_#1C304A] hover:-translate-y-2 transition-transform`}
              >
                <div className={`${feature.color} p-4 rounded-2xl border-4 border-navy mb-6`}>
                  <feature.icon className={`w-10 h-10 ${feature.color === 'bg-persimmon' ? 'text-white' : 'text-navy'}`} />
                </div>
                <h3 className="font-bold text-2xl text-navy mb-3">{feature.title}</h3>
                <p className="text-navy/70 font-medium text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery / Sneak Peek */}
      <section className="py-24 bg-sky border-y-4 border-navy overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-navy mb-4">A Sneak Peek Inside</h2>
            <p className="text-xl text-navy/90 font-medium">See what your kids will be exploring!</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[3, 4, 5, 6].map((num, i) => (
              <div key={i} className={`relative aspect-square rounded-3xl border-4 border-navy shadow-[6px_6px_0px_0px_#1C304A] overflow-hidden ${i % 2 === 0 ? 'md:translate-y-8' : ''}`}>
                <Image
                  src={`https://picsum.photos/600/600?random=${num}`}
                  alt="App preview"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-24 bg-white border-y-4 border-navy scroll-mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-navy mb-4">Invest in Your Child&apos;s Future</h2>
          <p className="text-xl text-navy/80 mb-12 max-w-2xl mx-auto font-medium">Simple, transparent pricing. Cancel anytime.</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Monthly Plan */}
            <div className="bg-white border-4 border-navy rounded-[3rem] p-8 md:p-12 shadow-[8px_8px_0px_0px_#1C304A] relative hover:-translate-y-2 transition-transform flex flex-col h-full">
              <div className="mb-8 mt-4">
                <h3 className="text-3xl font-extrabold text-navy mb-2">Monthly Explorer</h3>
                <div className="flex items-end justify-center gap-1 mb-4">
                  <span className="text-6xl font-black text-navy">$27</span>
                  <span className="text-xl text-navy/60 font-bold mb-2">/month</span>
                </div>
              </div>

              <ul className="space-y-4 text-left mb-10 mx-auto flex-1">
                {[
                  'Unlimited access to all videos',
                  'Downloadable coloring books',
                  'Interactive ebooks & puzzles',
                  'New content added weekly',
                  'Ad-free, 100% safe environment',
                  'Cancel anytime guarantee'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg font-bold text-navy">
                    <CheckCircle2 className="w-6 h-6 text-sky fill-sky/20 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <CheckoutButton
                priceId="price_1T5VJBC1HhLD0dXEcjcrAEKX"
                userEmail={user?.email}
                className="w-full bg-white text-navy font-black text-xl py-5 rounded-3xl border-4 border-navy hover:bg-sky/20 transition-transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-1 leading-none"
              >
                <div className="flex items-center gap-2">
                  Start 7-Day Free Trial <Sparkles className="w-5 h-5" />
                </div>
              </CheckoutButton>
            </div>

            {/* Yearly Plan */}
            <div className="bg-cream border-4 border-navy rounded-[3rem] p-8 md:p-12 shadow-[12px_12px_0px_0px_#1C304A] relative hover:-translate-y-2 transition-transform flex flex-col h-full">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-sunshine text-navy font-bold px-8 py-2 rounded-full border-4 border-navy shadow-[4px_4px_0px_0px_#1C304A] whitespace-nowrap">
                Save $54! Best Value
              </div>

              <div className="mb-8 mt-4">
                <h3 className="text-3xl font-extrabold text-navy mb-2">Yearly Explorer</h3>
                <div className="flex items-end justify-center gap-1 mb-4">
                  <span className="text-6xl font-black text-navy">$270</span>
                  <span className="text-xl text-navy/60 font-bold mb-2">/year</span>
                </div>
              </div>

              <ul className="space-y-4 text-left mb-10 mx-auto flex-1">
                {[
                  'Everything in Monthly',
                  'Bonus Printables Package',
                  'Early access to new features',
                  'Priority parent support'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg font-bold text-navy">
                    <CheckCircle2 className="w-6 h-6 text-persimmon fill-persimmon/20 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <CheckoutButton
                priceId="price_1T5VOmC1HhLD0dXEWdW2id7G"
                userEmail={user?.email}
                className="w-full bg-persimmon text-white font-black text-2xl py-6 rounded-3xl border-4 border-navy hover:bg-persimmon/90 transition-transform hover:scale-105 active:scale-95 shadow-[6px_6px_0px_0px_#1C304A] flex flex-col items-center justify-center gap-1 leading-none"
              >
                <div className="flex items-center gap-2">
                  Start 7-Day Free Trial <Sparkles className="w-6 h-6" />
                </div>
              </CheckoutButton>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-navy mb-16">Loved by Parents & Kids</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', role: 'Mom of 2', text: 'Finally, an app I don\'t have to feel guilty about! My 4-year-old has learned so much about space and animals.' },
              { name: 'David T.', role: 'Dad & Teacher', text: 'As an educator, I\'m incredibly impressed by the curriculum structure. It\'s fun, but the learning is very real.' },
              { name: 'Jessica L.', role: 'Mom of 1', text: 'The printable coloring books alone are worth the membership. We spend hours every weekend doing the activities.' }
            ].map((review, i) => (
              <div key={i} className="bg-white border-4 border-navy rounded-3xl p-8 shadow-[6px_6px_0px_0px_#1C304A] relative">
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-6 h-6 text-sunshine fill-sunshine" />
                  ))}
                </div>
                <p className="text-lg text-navy/80 font-medium mb-6 italic">&quot;{review.text}&quot;</p>
                <div className="font-bold text-navy text-xl">{review.name}</div>
                <div className="text-sky font-bold">{review.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-sunshine border-t-4 border-navy text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-extrabold text-navy mb-8">Ready to Start the Adventure?</h2>
          <p className="text-2xl text-navy/80 font-medium mb-12">
            Join the Creative Explorer Club today and get instant access to hundreds of educational activities.
          </p>
          <a
            href="#pricing-section"
            className="inline-flex bg-persimmon text-white font-bold text-3xl px-16 py-6 rounded-full border-4 border-navy hover:bg-persimmon/90 transition-transform hover:scale-105 active:scale-95 shadow-[8px_8px_0px_0px_#1C304A] items-center gap-4"
          >
            Start 7-Day Free Trial <Sparkles className="w-8 h-8" />
          </a>
          <p className="mt-6 text-navy font-bold text-lg">7-Day Free Trial • Cancel Anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-12 border-t-4 border-navy">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-sunshine fill-sunshine" />
            Akidsy
          </div>
          <div className="flex gap-6 font-medium text-white/70">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            <Link href="/login" className="hover:text-white transition-colors">Member Login</Link>
          </div>
          <div className="text-white/50 text-sm">
            © {new Date().getFullYear()} Akidsy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
