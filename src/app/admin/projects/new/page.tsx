'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Sparkles, 
  FileCode2, 
  FolderPlus, 
  HelpCircle 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ProjectCategory, MediaFile } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { MultiFileUpload } from '@/components/MultiFileUpload';
import { toast } from 'sonner';

export default function NewProjectPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [category, setCategory] = React.useState<ProjectCategory>('Web App');
  const [shortDescription, setShortDescription] = React.useState('');
  const [content, setContent] = React.useState('');
  const [thumbnailUrl, setThumbnailUrl] = React.useState('');
  const [mediaFiles, setMediaFiles] = React.useState<MediaFile[]>([]);
  const [techStackInput, setTechStackInput] = React.useState('');
  const [liveUrl, setLiveUrl] = React.useState('');
  const [repoUrl, setRepoUrl] = React.useState('');

  const [saving, setSaving] = React.useState(false);
  const [autoSlug, setAutoSlug] = React.useState(true);

  // Auto-generate slug when title changes if autoSlug is enabled
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug) {
      setSlug(slugify(val));
    }
  };

  // If first uploaded image exists and thumbnailUrl is empty, auto-fill thumbnail
  React.useEffect(() => {
    if (!thumbnailUrl && mediaFiles.length > 0) {
      const firstImg = mediaFiles.find((m) => m.type === 'image');
      if (firstImg) {
        setThumbnailUrl(firstImg.url);
      }
    }
  }, [mediaFiles, thumbnailUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim()) {
      toast.error('Judul dan slug proyek wajib diisi.');
      return;
    }

    setSaving(true);

    try {
      const techStackArray = techStackInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        category,
        short_description: shortDescription.trim() || null,
        content: content.trim() || null,
        thumbnail_url: thumbnailUrl.trim() || null,
        media_files: mediaFiles,
        tech_stack: techStackArray,
        live_url: liveUrl.trim() || null,
        repo_url: repoUrl.trim() || null,
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([payload])
        .select()
        .single();

      if (error) {
        toast.error(`Gagal menyimpan proyek: ${error.message}`);
        setSaving(false);
        return;
      }

      toast.success('Proyek baru berhasil dipublikasikan!');
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error('Terjadi kesalahan yang tidak terduga.');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard Admin
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Tambah Proyek Baru
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Lengkapi detail proyek, unggah media (foto, video, PDF), dan publikasikan ke portofolio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Card */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            1. Informasi Dasar Proyek
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Judul Proyek *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Contoh: Modern SaaS Dashboard & Billing"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Slug URL *
                </label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[11px] text-indigo-500 hover:underline"
                >
                  {autoSlug ? '(Auto dari judul)' : '(Manual)'}
                </button>
              </div>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="modern-saas-dashboard"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Kategori Proyek *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Web App">Web App</option>
                <option value="Mobile App">Mobile App</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Deskripsi Singkat (Ringkasan untuk kartu preview)
              </label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Ringkasan 1-2 kalimat tentang masalah yang diselesaikan dan solusi yang dihadirkan..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tech Stack / Tools (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="Next.js 14, TypeScript, Supabase, Tailwind CSS, PostgreSQL"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                URL Live Demo (Opsional)
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                URL Repository GitHub (Opsional)
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Media Upload Card */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              2. Unggah Media Multi-file (Supabase Storage)
            </h2>
            <span className="text-xs text-slate-400">
              Foto, Video, & Dokumen PDF/Deck
            </span>
          </div>

          <MultiFileUpload
            files={mediaFiles}
            onChange={(files) => setMediaFiles(files)}
            folderPrefix="projects"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              URL Thumbnail Utama (Cover Card)
            </label>
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://... (Terisi otomatis dari gambar pertama yang diunggah)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Case Study Content Markdown */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              3. Penjelasan Lengkap & Studi Kasus (Markdown)
            </h2>
            <span className="text-xs text-indigo-500 font-medium">
              Mendukung Format Markdown
            </span>
          </div>

          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`### Latar Belakang & Masalah
Uraikan permasalahan yang melatarbelakangi proyek ini...

### Solusi & Arsitektur
Jelaskan solusi arsitektur perangkat lunak yang dirancang...

### Fitur Utama
1. Fitur satu...
2. Fitur dua...

### Hasil & Dampak
Pencapaian metrik kuantitatif dan kualitatif proyek ini...`}
            className="w-full px-3.5 py-2.5 font-mono text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan Proyek...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Publikasikan Proyek
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
