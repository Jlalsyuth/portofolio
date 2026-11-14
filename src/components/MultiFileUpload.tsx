'use client';

import * as React from 'react';
import { MediaFile } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { 
  UploadCloud, 
  X, 
  FileText, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { toast } from 'sonner';

interface MultiFileUploadProps {
  files: MediaFile[];
  onChange: (files: MediaFile[]) => void;
  folderPrefix?: string;
}

export function MultiFileUpload({ files = [], onChange, folderPrefix = 'projects' }: MultiFileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [currentFileName, setCurrentFileName] = React.useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const supabase = createClient();

  // Helper to determine media type and folder
  const categorizeFile = (file: File): { type: 'image' | 'video' | 'document'; folder: string } => {
    const mime = file.type.toLowerCase();
    const name = file.name.toLowerCase();

    if (mime.startsWith('image/')) {
      return { type: 'image', folder: 'images' };
    }
    if (mime.startsWith('video/') || name.endsWith('.mp4') || name.endsWith('.webm')) {
      return { type: 'video', folder: 'videos' };
    }
    return { type: 'document', folder: 'documents' };
  };

  const uploadFileList = async (incomingFiles: FileList | File[]) => {
    if (!incomingFiles || incomingFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const newMediaItems: MediaFile[] = [...files];
    const total = incomingFiles.length;

    try {
      for (let i = 0; i < total; i++) {
        const file = incomingFiles[i];
        setCurrentFileName(file.name);
        setUploadProgress(Math.round(((i) / total) * 100));

        const { type, folder } = categorizeFile(file);
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniquePath = `${folderPrefix}/${folder}/${Date.now()}-${cleanName}`;

        const { data, error } = await supabase.storage
          .from('portfolio-assets')
          .upload(uniquePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          console.error(`Gagal upload ${file.name}:`, error);
          toast.error(`Gagal mengunggah ${file.name}: ${error.message}`);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('portfolio-assets')
          .getPublicUrl(data.path);

        newMediaItems.push({
          type,
          url: urlData.publicUrl,
          name: file.name,
        });

        setUploadProgress(Math.round(((i + 1) / total) * 100));
      }

      onChange(newMediaItems);
      toast.success(`${total} berkas berhasil diunggah.`);
    } catch (err: any) {
      console.error('Error saat upload:', err);
      toast.error('Terjadi kesalahan selama proses upload berkas.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setCurrentFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFileList(e.dataTransfer.files);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = files.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/40'
        } ${uploading ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,application/pdf,.doc,.docx,.ppt,.pptx"
          className="hidden"
          onChange={(e) => e.target.files && uploadFileList(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {uploading ? 'Sedang Mengunggah...' : 'Tarik & Letakkan Berkas atau Klik untuk Memilih'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Mendukung banyak file sekaligus: Foto (PNG, JPG, WebP), Video (MP4, WebM), dan Dokumen (PDF, PPT, DOC)
            </p>
          </div>
        </div>

        {/* Upload Progress Bar */}
        {uploading && (
          <div className="mt-5 w-full max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="truncate max-w-[200px]">{currentFileName}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {files && files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Berkas Terunggah ({files.length}):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {files.map((item, idx) => {
              const isImage = item.type === 'image';
              const isVideo = item.type === 'video';

              return (
                <div
                  key={idx}
                  className="relative group flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden flex items-center justify-center">
                    {isImage ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    ) : isVideo ? (
                      <VideoIcon className="w-5 h-5 text-purple-500" />
                    ) : (
                      <FileText className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                      {item.name}
                    </p>
                    <span className="inline-block text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {item.type}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Hapus berkas"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
