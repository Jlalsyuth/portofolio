import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ProjectCategory } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

export const CATEGORY_MAP: Record<string, { label: ProjectCategory; slug: string; description: string }> = {
  'web-app': {
    label: 'Web App',
    slug: 'web-app',
    description: 'Aplikasi web full-stack yang scalable, modern, responsif, dan interaktif.',
  },
  'mobile-app': {
    label: 'Mobile App',
    slug: 'mobile-app',
    description: 'Aplikasi mobile lintas platform (iOS & Android) dengan performa tinggi.',
  },
  'ui-ux': {
    label: 'UI/UX',
    slug: 'ui-ux',
    description: 'Riset desain pengguna, wireframe, prototipe interaktif, dan design system berstandar industri.',
  },
  'business': {
    label: 'Business',
    slug: 'business',
    description: 'Studi kelayakan bisnis, financial model, investor pitch deck, dan strategi produk.',
  },
};

export function getCategoryFromSlug(slug: string): ProjectCategory | null {
  const normalized = slug.toLowerCase();
  return CATEGORY_MAP[normalized]?.label ?? null;
}

export function getSlugFromCategory(category: string): string {
  for (const [slug, data] of Object.entries(CATEGORY_MAP)) {
    if (data.label.toLowerCase() === category.toLowerCase()) {
      return slug;
    }
  }
  return slugify(category);
}
