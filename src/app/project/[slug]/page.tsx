import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Calendar, 
  Layers, 
  FileCode2, 
  Sparkles,
  Share2,
  Globe
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { FALLBACK_PROJECTS } from '@/lib/data';
import { Project } from '@/lib/types';
import { getSlugFromCategory, formatExternalUrl } from '@/lib/utils';
import { MediaViewer } from '@/components/MediaViewer';

export const revalidate = 0;

interface ProjectDetailPageProps {
  params: {
    slug: string;
  };
}

async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .single();

    if (error || !data) {
      // Fallback
      return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
    }
    return data as Project;
  } catch {
    return FALLBACK_PROJECTS.find((p) => p.slug === slug) || null;
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const categorySlug = getSlugFromCategory(project.category);
  const mediaFiles = project.media_files || [];

  const formattedLiveUrl = formatExternalUrl(project.live_url);
  const formattedRepoUrl = formatExternalUrl(project.repo_url);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Top Navigation / Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800/80">
        <Link
          href={`/category/${categorySlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Kategori {project.category}
        </Link>

        {/* Top Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          {formattedRepoUrl && (
            <a
              href={formattedRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs hover:scale-105"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          )}
          {formattedLiveUrl && (
            <a
              href={formattedLiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm shadow-indigo-600/20 hover:scale-105"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>

      {/* Project Header Info */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/category/${categorySlug}`}
            className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
          >
            {project.category}
          </Link>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(project.created_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.2]">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {project.short_description}
        </p>

        {/* Tech Stack Badges */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* PROMINENT ACTION BUTTONS: LIVE DEMO & GITHUB */}
        {(formattedLiveUrl || formattedRepoUrl) ? (
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            {formattedLiveUrl && (
              <a
                href={formattedLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Kunjungi Live Demo</span>
              </a>
            )}

            {formattedRepoUrl && (
              <a
                href={formattedRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-105 shadow-sm"
              >
                <Github className="w-4 h-4" />
                <span>Source Code GitHub</span>
              </a>
            )}
          </div>
        ) : (
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 italic">
              <Globe className="w-3.5 h-3.5" />
              Tautan demo / repositori dapat ditambahkan melalui menu Admin.
            </span>
          </div>
        )}
      </div>

      {/* Media Viewer Component: Photo Lightbox, HTML5 Video, Embedded Document Viewer */}
      <section className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Media & Pratinjau Interaktif
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Foto • Video • Dokumen / Slide
          </span>
        </div>

        <MediaViewer
          mediaFiles={mediaFiles}
          thumbnailUrl={project.thumbnail_url}
        />
      </section>

      {/* Project Case Study / Documentation Content */}
      <section className="p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/30 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800">
          Uraian Studi Kasus & Rincian Teknis
        </h2>

        <div className="prose dark:prose-invert max-w-none prose-slate prose-headings:font-bold prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-ul:my-2 prose-strong:text-slate-900 dark:prose-strong:text-white">
          {project.content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.content}
            </ReactMarkdown>
          ) : (
            <p className="italic text-slate-400">
              Belum ada deskripsi lengkap atau studi kasus untuk proyek ini.
            </p>
          )}
        </div>

        {/* Bottom CTA Section */}
        {(formattedLiveUrl || formattedRepoUrl) && (
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-800/40 p-5 rounded-2xl">
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Tertarik melihat proyek ini secara langsung?
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Akses demo online atau periksa kode sumber di repositori.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              {formattedRepoUrl && (
                <a
                  href={formattedRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
              )}
              {formattedLiveUrl && (
                <a
                  href={formattedLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
