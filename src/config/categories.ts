export interface SubCategory {
  slug: string;
  label: string;
  emoji: string;
}

export interface CategoryConfig {
  slug: string;
  label: string;
  icon: string;
  subCategories: SubCategory[];
  aliases?: string[];
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: 'coloring-books',
    label: 'Coloring Books',
    icon: 'Palette',
    aliases: ['coloring books', 'coloring', 'coloring-book', 'colorings'],
    subCategories: [
      { slug: 'animals', label: 'Animals', emoji: '🦁' },
      { slug: 'space', label: 'Space', emoji: '🚀' },
      { slug: 'vehicles', label: 'Vehicles', emoji: '🚗' },
      { slug: 'dinosaurs', label: 'Dinosaurs', emoji: '🦖' },
    ],
  },
  {
    slug: 'videos',
    label: 'Videos',
    icon: 'Tv',
    aliases: ['videos', 'video'],
    subCategories: [
      { slug: 'stories', label: 'Stories', emoji: '🎬' },
      { slug: 'songs', label: 'Songs & Music', emoji: '🎵' },
      { slug: 'adventures', label: 'Adventures', emoji: '🧭' },
      { slug: 'learning', label: 'Learning', emoji: '🧠' },
    ],
  },
  {
    slug: 'ebooks',
    label: 'Ebooks',
    icon: 'BookOpen',
    aliases: ['ebooks', 'ebook', 'e-books', 'books'],
    subCategories: [
      { slug: 'bedtime', label: 'Bedtime Stories', emoji: '🌙' },
      { slug: 'fairy-tales', label: 'Fairy Tales', emoji: '🏰' },
      { slug: 'adventure', label: 'Adventure', emoji: '🗺️' },
      { slug: 'nature', label: 'Nature & Animals', emoji: '🐾' },
    ],
  },
  {
    slug: 'puzzles',
    label: 'Puzzles',
    icon: 'Puzzle',
    aliases: ['puzzles', 'puzzle', 'brain-teasers'],
    subCategories: [
      { slug: 'mazes', label: 'Mazes', emoji: '🌀' },
      { slug: 'word-search', label: 'Word Search', emoji: '🔍' },
      { slug: 'crosswords', label: 'Crosswords', emoji: '✏️' },
      { slug: 'spot-difference', label: 'Spot the Difference', emoji: '👀' },
    ],
  },
  {
    slug: 'education',
    label: 'Education',
    icon: 'GraduationCap',
    aliases: ['education', 'educational', 'learning-hub'],
    subCategories: [
      { slug: 'math', label: 'Math Fun', emoji: '🔢' },
      { slug: 'reading', label: 'Reading & ABCs', emoji: '🔤' },
      { slug: 'science', label: 'Science', emoji: '🔬' },
      { slug: 'writing', label: 'Writing', emoji: '✍️' },
    ],
  },
];

/**
 * Return all defined primary categories.
 */
export function getAllCategories(): CategoryConfig[] {
  return CATEGORIES;
}

/**
 * Normalizes any category string (slug, label, or alias) and returns the canonical CategoryConfig.
 */
export function getCategory(categorySlugOrLabel: string): CategoryConfig | undefined {
  if (!categorySlugOrLabel) return undefined;
  const normalized = categorySlugOrLabel.toLowerCase().trim();
  const slugified = normalized.replace(/\s+/g, '-').replace(/_/g, '-');

  return CATEGORIES.find(
    (c) =>
      c.slug === normalized ||
      c.slug === slugified ||
      c.label.toLowerCase() === normalized ||
      (c.aliases &&
        c.aliases.some(
          (alias) =>
            alias.toLowerCase() === normalized ||
            alias.toLowerCase() === slugified
        ))
  );
}

/**
 * Return sub-categories for a category slug or alias.
 */
export function getSubCategories(categorySlug: string): SubCategory[] {
  const category = getCategory(categorySlug);
  return category ? category.subCategories : [];
}

/**
 * Check if the given category slug or alias is recognized.
 */
export function isValidCategory(categorySlug: string): boolean {
  return !!getCategory(categorySlug);
}
