import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Code2, 
  Smartphone, 
  Palette, 
  Briefcase, 
  ArrowLeft, 
  Layers, 
  FolderSearch 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { FALLBACK_PROJECTS } from '@/lib/data';
import { Project } from '@/lib/types';
import { CATEGORY_MAP, getCategoryFromSlug } from '@/lib/utils';
import { ProjectCard } from '@/components/ProjectCard';

export const revalidate = 0;

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

async function getCategoryProjects(categoryLabel: string): Promise<Project[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('category', categoryLabel)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Fallback
      return FALLBACK_PROJECTS.filter(
        (p) => p.category.toLowerCase() === categoryLabel.toLowerCase()
      );
    }
    return data as Project[];
  } catch {
    return FALLBACK_PROJECTS.filter(
      (p) => p.category.toLowerCase() === categoryLabel.toLowerCase()
    );
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryData = CATEGORY_MAP[params.slug];
  if (!categoryData) {
    notFound();
  }

  const projects = await getCategoryProjects(categoryData.label);

  const icons: Record<string, any> = {
    'web-app': Code2,
    'mobile-app': Smartphone,
    'ui-ux': Palette,
    'business': Briefcase,
  };

  const Icon = icons[params.slug] || Layers;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back button & Breadcrumb */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Category Header Banner */}
      <div className="relative p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-900/60 dark:to-indigo-950/20 shadow-sm overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-xs">
            <Icon className="w-3.5 h-3.5" />
            Kategori Portofolio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {categoryData.label}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {categoryData.description}
          </p>
        </div>

        {/* Ambient Decorative Icon */}
        <div className="absolute right-4 bottom-4 sm:right-8 sm:bottom-6 text-slate-200/60 dark:text-slate-800/40 pointer-events-none">
          <Icon className="w-32 h-32 sm:w-48 sm:h-48 stroke-1" />
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {Object.entries(CATEGORY_MAP).map(([slug, item]) => {
          const isActive = slug === params.slug;
          return (
            <Link
              key={slug}
              href={`/category/${slug}`}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
          <FolderSearch className="w-12 h-12 text-slate-400 mx-auto stroke-1" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Belum ada proyek dalam kategori ini
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Proyek baru untuk kategori {categoryData.label} akan segera ditambahkan atau dapat Anda input melalui dashboard Admin.
          </p>
        </div>
      )}
    </div>
  );
}
