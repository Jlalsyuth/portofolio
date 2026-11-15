'use client';

import Link from 'next/link';
import { ExternalLink, Github, ArrowUpRight, FolderGit2 } from 'lucide-react';
import { Project } from '@/lib/types';
import { cn, formatExternalUrl } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const categoryColors: Record<string, string> = {
    'Web App': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    'Mobile App': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    'UI/UX': 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/60 dark:text-pink-300 dark:border-pink-800',
    'Business': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
  };

  const formattedLiveUrl = formatExternalUrl(project.live_url);
  const formattedRepoUrl = formatExternalUrl(project.repo_url);

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all duration-300 overflow-hidden">
      {/* Thumbnail Container */}
      <Link href={`/project/${project.slug}`} className="block relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 p-4">
            <FolderGit2 className="w-12 h-12 mb-2 stroke-1" />
            <span className="text-xs font-medium">No preview available</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm',
              categoryColors[project.category] || 'bg-slate-100 text-slate-700 border-slate-200'
            )}
          >
            {project.category}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <Link href={`/project/${project.slug}`} className="group/title block">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors line-clamp-1 flex items-center justify-between">
              <span>{project.title}</span>
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover/title:opacity-100 -translate-y-1 translate-x-1 transition-all" />
            </h3>
          </Link>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {project.short_description || 'Klik untuk melihat rincian studi kasus, arsitektur, dan aset proyek.'}
          </p>

          {/* Tech Stack Tags */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech_stack.slice(0, 4).map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
                >
                  {tech}
                </span>
              ))}
              {project.tech_stack.length > 4 && (
                <span className="px-1.5 py-0.5 rounded-md text-xs font-medium bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                  +{project.tech_stack.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
          {/* Main Action Links Row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              href={`/project/${project.slug}`}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group/btn"
            >
              Lihat Detail
              <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </Link>

            <div className="flex items-center gap-2">
              {formattedRepoUrl && (
                <a
                  href={formattedRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all shadow-2xs"
                  title="Buka Repositori GitHub"
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
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all hover:scale-105"
                  title="Buka Live Demo"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
