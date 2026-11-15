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
  ExternalLink,
  Award,
  Zap,
  TrendingUp,
  FolderGit2
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
    return { ...FALLBACK_PROFILE, ...data } as Profile;
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
  const photoUrl = profile.photo_url || FALLBACK_PROFILE.photo_url;

  return (
    <div className="space-y-28 pb-24">
      {/* 1. Hero Section (2-Column Layout with Full Body Photo Showcase) */}
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden">
        {/* Ambient Gradient Background Glow */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-pink-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/15 via-indigo-500/15 to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Intro & Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Status pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50/90 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
                Tersedia untuk Peluang & Proyek Baru
              </div>

              {/* Name & Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                  Halo, Saya{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    {profile.full_name}
                  </span>
                </h1>

                <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                  {profile.headline || 'Full-Stack Software Engineer & Product Builder'}
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {profile.about ||
                  'Membangun aplikasi web, mobile, serta produk digital yang cepat, responsif, dan mudah digunakan dengan arsitektur modern.'}
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
                {profile.cv_file_url ? (
                  <a
                    href={profile.cv_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    Unduh CV / Resume
                  </a>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    CV Belum Diunggah
                  </button>
                )}

                {profile.contact_email && (
                  <a
                    href={`mailto:${profile.contact_email}`}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all hover:scale-105 shadow-sm backdrop-blur-md"
                  >
                    <Mail className="w-4 h-4 text-indigo-500" />
                    Hubungi Saya
                  </a>
                )}

                <a
                  href="#koleksi-proyek"
                  className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-2xl font-semibold text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Lihat Karya <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Social Icons & Quick Stats */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 border-t border-slate-200/70 dark:border-slate-800/70">
                <div className="flex items-center gap-2.5">
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 transition-all shadow-2xs"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.github && (
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 transition-all shadow-2xs"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 transition-all shadow-2xs"
                      title="Twitter / X"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {socialLinks.website && (
                    <a
                      href={socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 transition-all shadow-2xs"
                      title="Personal Website"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pl-4 border-l border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">5+</span> Tahun
                  </div>
                  <span>•</span>
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">20+</span> Proyek
                  </div>
                  <span>•</span>
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">100%</span> Kepuasan
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Full Body Photo Showcase (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* Outer Decorative Ring & Glow */}
              <div className="relative w-full max-w-sm sm:max-w-md">
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/30 via-purple-500/30 to-pink-500/20 rounded-[2.5rem] blur-2xl opacity-75 group-hover:opacity-100 transition-opacity" />

                {/* Main Photo Card */}
                <div className="relative rounded-[2rem] border-2 border-white/60 dark:border-white/10 bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[3/4] group">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={profile.full_name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-indigo-50/50 to-slate-100 dark:from-slate-800 dark:to-slate-900 text-slate-400">
                      <Sparkles className="w-16 h-16 text-indigo-400 mb-3 animate-pulse" />
                      <p className="font-bold text-slate-700 dark:text-slate-300">Foto Profil / Full Body</p>
                      <p className="text-xs text-slate-400 mt-1">Dapat diunggah melalui menu Admin</p>
                    </div>
                  )}

                  {/* Gradient Overlay at bottom for seamless blending */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none" />

                  {/* Bottom Portrait Caption */}
                  <div className="absolute bottom-4 inset-x-4 text-white z-10 text-center">
                    <p className="font-extrabold text-sm drop-shadow">{profile.full_name}</p>
                    <p className="text-[11px] text-slate-200/90 font-medium drop-shadow">{profile.headline || 'Full-Stack Developer'}</p>
                  </div>
                </div>

                {/* Floating Badge 1 (Top Left): Skill Highlight */}
                <div className="absolute -top-4 -left-4 sm:-left-6 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xl backdrop-blur-md flex items-center gap-2 animate-float-slow z-20">
                  <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Spesialisasi</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Full-Stack & Cloud</p>
                  </div>
                </div>

                {/* Floating Badge 2 (Bottom Right): Experience Badge */}
                <div className="absolute -bottom-4 -right-4 sm:-right-6 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xl backdrop-blur-md flex items-center gap-2 animate-float-reverse z-20">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Hasil Teruji</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Kualitas Enterprise</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Category Quick Cards with Glassmorphism */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Link
            href="/category/web-app"
            className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Web App</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Next.js, React, Node.js</p>
          </Link>

          <Link
            href="/category/mobile-app"
            className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md hover:border-purple-400 dark:hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Mobile App</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">React Native, Flutter</p>
          </Link>

          <Link
            href="/category/ui-ux"
            className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md hover:border-pink-400 dark:hover:border-pink-500/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">UI/UX</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Figma, Design System</p>
          </Link>

          <Link
            href="/category/business"
            className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Business</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pitch Deck, Model Bisnis</p>
          </Link>
        </div>
      </section>

      {/* 3. About & Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl shadow-sm space-y-8">
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Teknologi & Tools Utama
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {profile.skills && profile.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-100/90 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors flex items-center gap-1.5 shadow-2xs"
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

      {/* 5. Featured Projects Showcase */}
      <section id="koleksi-proyek" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
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
              className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-2xs"
            >
              Lihat Semua Kategori →
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
