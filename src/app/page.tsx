import Link from 'next/link';
import { 
  Download, 
  Linkedin, 
  Github, 
  Mail, 
  Globe, 
  Twitter, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Code2, 
  Smartphone, 
  Palette, 
  Briefcase,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { FALLBACK_PROFILE, FALLBACK_PROJECTS } from '@/lib/data';
import { Profile, Project } from '@/lib/types';
import { Timeline } from '@/components/Timeline';
import { ProjectCard } from '@/components/ProjectCard';

export const revalidate = 0; // Dynamic rendering for fresh Supabase data

async function getProfileData(): Promise<Profile> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return FALLBACK_PROFILE;
    }
    return data as Profile;
  } catch {
    return FALLBACK_PROFILE;
  }
}

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error || !data || data.length === 0) {
      return FALLBACK_PROJECTS;
    }
    return data as Project[];
  } catch {
    return FALLBACK_PROJECTS;
  }
}

export default async function HomePage() {
  const [profile, projects] = await Promise.all([
    getProfileData(),
    getFeaturedProjects(),
  ]);

  const socialLinks = profile.social_links || {};

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Ambient Gradient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Tersedia untuk Peluang & Proyek Baru
            </div>

            {/* Name & Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Halo, Saya{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {profile.full_name}
              </span>
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-600 dark:text-slate-300">
              {profile.headline || 'Full-Stack Software Engineer & Product Builder'}
            </p>

            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {profile.about ||
                'Membangun aplikasi web, mobile, serta produk digital yang cepat, responsif, dan mudah digunakan dengan arsitektur modern.'}
            </p>

            {/* CTA Buttons & Social Links */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              {profile.cv_file_url ? (
                <a
                  href={profile.cv_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  Unduh CV / Resume
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  CV Belum Diunggah
                </button>
              )}

              {profile.contact_email && (
                <a
                  href={`mailto:${profile.contact_email}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all hover:scale-105 shadow-xs"
                >
                  <Mail className="w-4 h-4 text-indigo-500" />
                  Hubungi Saya
                </a>
              )}
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center justify-center gap-3">
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 transition-all"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 transition-all"
                  title="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 transition-all"
                  title="Twitter / X"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {socialLinks.website && (
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 transition-all"
                  title="Personal Website"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Quick Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/category/web-app"
            className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-900/60 hover:border-blue-400 dark:hover:border-blue-600/50 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Web App</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Next.js, React, Node.js</p>
          </Link>

          <Link
            href="/category/mobile-app"
            className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-900/60 hover:border-purple-400 dark:hover:border-purple-600/50 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Mobile App</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">React Native, Flutter</p>
          </Link>

          <Link
            href="/category/ui-ux"
            className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-pink-50/50 to-white dark:from-pink-950/20 dark:to-slate-900/60 hover:border-pink-400 dark:hover:border-pink-600/50 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">UI/UX</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Figma, Design System</p>
          </Link>

          <Link
            href="/category/business"
            className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900/60 hover:border-emerald-400 dark:hover:border-emerald-600/50 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Business</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pitch Deck, Model Bisnis</p>
          </Link>
        </div>
      </section>

      {/* 3. About & Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm space-y-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              Tentang & Keahlian Teknis
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {profile.about}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Teknologi & Tools Utama
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {profile.skills && profile.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Experience & Education Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Timeline experience={profile.experience} education={profile.education} />
      </section>

      {/* 5. Featured Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              Showcase Proyek Unggulan
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Koleksi Karya Terpilih
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Jelajahi beberapa proyek unggulan dari kategori Web, Mobile, UI/UX, dan Business
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/category/web-app"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Lihat Kategori
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      </section>
    </div>
  );
}
