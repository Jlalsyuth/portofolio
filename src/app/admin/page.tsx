'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  FolderPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ExternalLink, 
  FileText, 
  UserCircle, 
  Layers, 
  Upload, 
  Plus, 
  Save, 
  Loader2, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Project, Profile, ExperienceItem, EducationItem } from '@/lib/types';
import { FALLBACK_PROFILE, FALLBACK_PROJECTS } from '@/lib/data';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<'projects' | 'profile'>('projects');
  
  // Projects State
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('All');
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Profile State
  const [profile, setProfile] = React.useState<Profile>(FALLBACK_PROFILE);
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [cvUploading, setCvUploading] = React.useState(false);

  const supabase = createClient();

  // Fetch Projects
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        setProjects(FALLBACK_PROJECTS);
      } else if (data && data.length > 0) {
        setProjects(data as Project[]);
      } else {
        setProjects(FALLBACK_PROJECTS);
      }
    } catch {
      setProjects(FALLBACK_PROJECTS);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Fetch Profile
  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(FALLBACK_PROFILE);
      } else if (data) {
        setProfile(data as Profile);
      }
    } catch {
      setProfile(FALLBACK_PROFILE);
    } finally {
      setLoadingProfile(false);
    }
  };

  React.useEffect(() => {
    fetchProjects();
    fetchProfile();
  }, []);

  // Handle Delete Project
  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus proyek "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error(`Gagal menghapus proyek: ${error.message}`);
      } else {
        toast.success(`Proyek "${title}" berhasil dihapus.`);
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err: any) {
      toast.error('Terjadi kesalahan saat menghapus proyek.');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle CV Upload
  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvUploading(true);
    try {
      const fileName = `documents/CV_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data, error } = await supabase.storage
        .from('portfolio-assets')
        .upload(fileName, file, { upsert: true });

      if (error) {
        toast.error(`Gagal mengunggah CV: ${error.message}`);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(data.path);

      setProfile((prev) => ({ ...prev, cv_file_url: urlData.publicUrl }));
      toast.success('File CV berhasil diunggah!');
    } catch (err) {
      toast.error('Gagal mengunggah file CV.');
    } finally {
      setCvUploading(false);
    }
  };

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const payload = {
        full_name: profile.full_name,
        headline: profile.headline,
        about: profile.about,
        contact_email: profile.contact_email,
        social_links: profile.social_links,
        skills: profile.skills,
        experience: profile.experience,
        education: profile.education,
        cv_file_url: profile.cv_file_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profile')
        .upsert({ id: profile.id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', ...payload });

      if (error) {
        toast.error(`Gagal menyimpan profil: ${error.message}`);
      } else {
        toast.success('Data profil & CV berhasil diperbarui!');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan saat menyimpan profil.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Filtered Projects
  const filteredProjects = projects.filter((p) => {
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.short_description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard Pengelola Portofolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola karya proyek, resume/CV, riwayat pengalaman, dan data diri Anda.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Tambah Proyek Baru
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'projects'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Manajemen Proyek ({projects.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCircle className="w-4 h-4" />
          Profil & CV Interaktif
        </button>
      </div>

      {/* TAB 1: MANAJEMEN PROYEK */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Controls: Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berdasarkan judul atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Web App', 'Mobile App', 'UI/UX', 'Business'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'All' ? 'Semua Kategori' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            {loadingProjects ? (
              <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                Memuat daftar proyek...
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Proyek</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4 hidden md:table-cell">Media</th>
                      <th className="py-3.5 px-4 hidden lg:table-cell">Tanggal</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {filteredProjects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                              {proj.thumbnail_url ? (
                                <img src={proj.thumbnail_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">N/A</div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs">
                                {proj.title}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate max-w-xs">
                                /{proj.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                            {proj.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 hidden md:table-cell text-xs text-slate-500">
                          {proj.media_files?.length || 0} berkas
                        </td>

                        <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-slate-400">
                          {new Date(proj.created_at).toLocaleDateString('id-ID')}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/project/${proj.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Lihat Proyek"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <Link
                              href={`/admin/projects/${proj.id}/edit`}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Edit Proyek"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDeleteProject(proj.id, proj.title)}
                              disabled={deletingId === proj.id}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                              title="Hapus Proyek"
                            >
                              {deletingId === proj.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">
                Tidak ada proyek yang cocok dengan pencarian Anda.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MANAJEMEN PROFIL & CV */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-8 max-w-4xl">
          {/* Section: Identitas */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-indigo-500" />
              Data Diri & Kontak
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Headline / Role *
                </label>
                <input
                  type="text"
                  required
                  value={profile.headline || ''}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  placeholder="Senior Full-Stack Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Kontak
                </label>
                <input
                  type="email"
                  value={profile.contact_email || ''}
                  onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={profile.social_links?.linkedin || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      social_links: { ...profile.social_links, linkedin: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={profile.social_links?.github || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      social_links: { ...profile.social_links, github: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Twitter / Website URL
                </label>
                <input
                  type="url"
                  value={profile.social_links?.website || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      social_links: { ...profile.social_links, website: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tentang Saya (Ringkasan Diri)
              </label>
              <textarea
                rows={4}
                value={profile.about || ''}
                onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Section: CV Upload */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Unggah Dokumen CV / Resume (PDF)
            </h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors border border-slate-300 dark:border-slate-700">
                <Upload className="w-4 h-4 text-indigo-500" />
                {cvUploading ? 'Mengunggah...' : 'Pilih File CV (PDF)'}
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleCvUpload}
                  disabled={cvUploading}
                />
              </label>

              {profile.cv_file_url && (
                <a
                  href={profile.cv_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Pratinjau CV Saat Ini
                </a>
              )}
            </div>
          </div>

          {/* Section: Skills */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              Daftar Keahlian / Tech Stack
            </h2>
            <p className="text-xs text-slate-500">
              Pisahkan nama teknologi dengan koma (contoh: Next.js, TypeScript, PostgreSQL, Figma)
            </p>
            <input
              type="text"
              value={profile.skills?.join(', ') || ''}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 disabled:opacity-70"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan Profil...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Perubahan Profil
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
