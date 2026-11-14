import * as React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  LogOut, 
  Home, 
  FolderPlus, 
  UserCircle2, 
  Layers, 
  ExternalLink 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b12] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Admin Sub-bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                ADMIN PORTAL
              </div>
              <span className="hidden sm:inline-block text-xs text-slate-400">|</span>
              <span className="hidden sm:inline-block text-xs text-slate-600 dark:text-slate-300 font-medium">
                {user?.email || 'Administrator Session'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                Lihat Situs Publik <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Keluar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
