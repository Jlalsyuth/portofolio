import Link from 'next/link';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 transition-colors py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Modern Portfolio & Showcase
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dibangun dengan Next.js App Router, Tailwind CSS, TypeScript, dan Supabase.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/category/web-app"
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Web App
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/category/mobile-app"
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Mobile App
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/category/ui-ux"
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              UI/UX
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/category/business"
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Business
            </Link>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span>© {currentYear} All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
