'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
    question: string;
    answer: string;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4">
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                    <div
                        key={index}
                        className="border-4 border-navy rounded-[2rem] overflow-hidden shadow-[6px_6px_0px_0px_#1C304A] bg-white transition-all duration-300"
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className="w-full flex justify-between items-center p-6 md:p-8 bg-sky text-navy hover:bg-sky/90 transition-colors text-left"
                            aria-expanded={isOpen}
                        >
                            <h3 className="font-extrabold text-xl md:text-2xl pr-8">{item.question}</h3>
                            <div className={`flex-shrink-0 bg-white border-2 border-navy rounded-full p-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                <ChevronDown className="w-6 h-6 text-navy" />
                            </div>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="p-6 md:p-8 text-lg md:text-xl text-navy/80 font-medium leading-relaxed bg-white">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
