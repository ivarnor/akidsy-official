'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { getSubCategories, SubCategory } from '@/src/config/categories';

export interface CategoryPillsProps {
  categorySlug: string;
  activeSubCategory?: string | null;
  onSelectSubCategory?: (subCategorySlug: string) => void;
  className?: string;
}

export function CategoryPills({
  categorySlug,
  activeSubCategory,
  onSelectSubCategory,
  className = '',
}: CategoryPillsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const subCategories = getSubCategories(categorySlug);

  // If there are no sub-categories for this section, do not render empty filter
  if (!subCategories || subCategories.length === 0) {
    return null;
  }

  // Determine current active subcategory from prop or URL
  const urlSub = searchParams.get('sub');
  const currentActive =
    activeSubCategory !== undefined
      ? activeSubCategory || 'All'
      : urlSub || 'All';

  const isAllActive =
    !currentActive ||
    currentActive.toLowerCase() === 'all' ||
    currentActive.trim() === '';

  const handlePillClick = (slug: string) => {
    // Notify parent callback if provided
    if (onSelectSubCategory) {
      onSelectSubCategory(slug);
    }

    // Update query parameters in the URL
    const newParams = new URLSearchParams(searchParams.toString());
    if (slug === 'All') {
      newParams.delete('sub');
    } else {
      newParams.set('sub', slug);
    }

    const query = newParams.toString();
    const targetUrl = query ? `${pathname}?${query}` : pathname;
    router.replace(targetUrl, { scroll: false });
  };

  return (
    <div
      className={`relative w-full ${className}`}
      role="region"
      aria-label="Sub-category filters"
    >
      <div
        className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 touch-pan-x [-webkit-overflow-scrolling:touch]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Default 'All' Pill */}
        <button
          type="button"
          onClick={() => handlePillClick('All')}
          aria-pressed={isAllActive}
          className={`shrink-0 rounded-full px-5 py-2 font-bold text-sm tracking-wide transition-all duration-200 cursor-pointer select-none active:scale-95 flex items-center gap-1.5 ${
            isAllActive
              ? 'bg-navy text-white border-2 border-navy shadow-[2px_2px_0px_0px_#1C304A] -translate-y-0.5'
              : 'bg-white text-navy/80 hover:text-navy border-2 border-navy/20 hover:border-navy hover:bg-sky/20 hover:-translate-y-0.5'
          }`}
        >
          <span>🌟</span>
          <span>All</span>
        </button>

        {/* Dynamic Sub-Category Pills */}
        {subCategories.map((sub: SubCategory) => {
          const isActive =
            !isAllActive &&
            currentActive.toLowerCase() === sub.slug.toLowerCase();

          return (
            <button
              key={sub.slug}
              type="button"
              onClick={() => handlePillClick(sub.slug)}
              aria-pressed={isActive}
              className={`shrink-0 rounded-full px-5 py-2 font-bold text-sm tracking-wide transition-all duration-200 cursor-pointer select-none active:scale-95 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-navy text-white border-2 border-navy shadow-[2px_2px_0px_0px_#1C304A] -translate-y-0.5'
                  : 'bg-white text-navy/80 hover:text-navy border-2 border-navy/20 hover:border-navy hover:bg-sky/20 hover:-translate-y-0.5'
              }`}
            >
              <span className="text-base leading-none">{sub.emoji}</span>
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryPills;
