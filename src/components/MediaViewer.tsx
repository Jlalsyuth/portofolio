'use client';

import * as React from 'react';
import { MediaFile } from '@/lib/types';
import { 
  FileText, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Download, 
  ExternalLink, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaViewerProps {
  mediaFiles: MediaFile[];
  thumbnailUrl?: string | null;
}

export function MediaViewer({ mediaFiles = [], thumbnailUrl }: MediaViewerProps) {
  // Combine thumbnail if not in mediaFiles
  const allMedia: MediaFile[] = React.useMemo(() => {
    const list = [...mediaFiles];
    if (thumbnailUrl && !list.some((m) => m.url === thumbnailUrl)) {
      list.unshift({
        type: 'image',
        url: thumbnailUrl,
        name: 'Cover / Thumbnail',
      });
    }
    return list;
  }, [mediaFiles, thumbnailUrl]);

  const [activeTab, setActiveTab] = React.useState<'all' | 'image' | 'video' | 'document'>('all');
  
  // Lightbox State for Images
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = React.useState<number>(1);

  // Active document for preview
  const documents = React.useMemo(() => allMedia.filter((m) => m.type === 'document'), [allMedia]);
  const [selectedDocUrl, setSelectedDocUrl] = React.useState<string>(documents[0]?.url || '');

  React.useEffect(() => {
    if (documents.length > 0 && !selectedDocUrl) {
      setSelectedDocUrl(documents[0].url);
    }
  }, [documents, selectedDocUrl]);

  const images = React.useMemo(() => allMedia.filter((m) => m.type === 'image'), [allMedia]);
  const videos = React.useMemo(() => allMedia.filter((m) => m.type === 'video'), [allMedia]);

  const filteredMedia = React.useMemo(() => {
    if (activeTab === 'all') return allMedia;
    return allMedia.filter((m) => m.type === activeTab);
  }, [allMedia, activeTab]);

  // Handlers for Lightbox
  const openLightbox = (indexInImages: number) => {
    setLightboxIndex(indexInImages);
    setZoomLevel(1);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setZoomLevel(1);
  };

  const nextLightboxImage = () => {
    if (lightboxIndex !== null && images.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
      setZoomLevel(1);
    }
  };

  const prevLightboxImage = () => {
    if (lightboxIndex !== null && images.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
      setZoomLevel(1);
    }
  };

  // Keyboard navigation for Lightbox
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightboxImage();
      if (e.key === 'ArrowLeft') prevLightboxImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, images.length]);

  if (allMedia.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/40 text-slate-500">
        Belum ada berkas media (foto, video, dokumen) yang diunggah untuk proyek ini.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Media Type Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={cn(
            'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          Semua ({allMedia.length})
        </button>

        {images.length > 0 && (
          <button
            onClick={() => setActiveTab('image')}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
              activeTab === 'image'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Foto ({images.length})
          </button>
        )}

        {videos.length > 0 && (
          <button
            onClick={() => setActiveTab('video')}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
              activeTab === 'video'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            <VideoIcon className="w-3.5 h-3.5" />
            Video ({videos.length})
          </button>
        )}

        {documents.length > 0 && (
          <button
            onClick={() => setActiveTab('document')}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
              activeTab === 'document'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            Dokumen / Slide ({documents.length})
          </button>
        )}
      </div>

      {/* Videos Section */}
      {(activeTab === 'all' || activeTab === 'video') && videos.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <VideoIcon className="w-4 h-4 text-purple-500" />
            Pemutar Video Demo
          </h4>
          <div className="grid grid-cols-1 gap-6">
            {videos.map((vid, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-black/90 shadow-lg"
              >
                <div className="aspect-video w-full">
                  <video
                    src={vid.url}
                    controls
                    preload="metadata"
                    className="w-full h-full object-contain"
                  >
                    Browser Anda tidak mendukung pemutar video HTML5.
                  </video>
                </div>
                <div className="p-3 bg-slate-900 text-slate-200 text-xs flex justify-between items-center">
                  <span className="font-medium truncate">{vid.name}</span>
                  <a
                    href={vid.url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-indigo-400 flex items-center gap-1 shrink-0 ml-2"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh Video
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Embedded Document Viewer (PDF / Presentation) */}
      {(activeTab === 'all' || activeTab === 'document') && documents.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              Document & Pitch Deck Viewer
            </h4>

            {documents.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {documents.map((doc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDocUrl(doc.url)}
                    className={cn(
                      'px-2.5 py-1 rounded text-xs truncate max-w-[200px] border transition-colors',
                      selectedDocUrl === doc.url
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    )}
                  >
                    {doc.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-sm">
                {documents.find((d) => d.url === selectedDocUrl)?.name || 'Dokumen'}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={selectedDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Buka Tab Baru
                </a>
                <a
                  href={selectedDocUrl}
                  download
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh Dokumen
                </a>
              </div>
            </div>

            {/* Embedded iFrame for PDF / Document viewer */}
            <div className="relative w-full h-[550px] bg-slate-100 dark:bg-slate-950">
              <iframe
                src={
                  selectedDocUrl.toLowerCase().endsWith('.pdf')
                    ? selectedDocUrl
                    : `https://docs.google.com/viewer?url=${encodeURIComponent(selectedDocUrl)}&embedded=true`
                }
                className="w-full h-full border-0"
                title="Document Viewer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Images Gallery with Lightbox */}
      {(activeTab === 'all' || activeTab === 'image') && images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-500" />
            Galeri Gambar (Klik untuk Zoom / Lightbox)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 cursor-pointer shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                  <Maximize2 className="w-5 h-5 drop-shadow" />
                  <span className="text-xs font-medium drop-shadow">Perbesar</span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white text-[11px] truncate">
                  {img.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-10">
            <span className="text-xs sm:text-sm font-medium text-slate-300 truncate max-w-md">
              {images[lightboxIndex].name} ({lightboxIndex + 1} dari {images.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={closeLightbox}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white ml-2"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Image Container */}
          <div className="relative flex-1 flex items-center justify-center overflow-auto my-2">
            <img
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].name}
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-h-[80vh] max-w-full object-contain transition-transform duration-200 rounded-lg shadow-2xl"
            />

            {/* Prev / Next controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevLightboxImage}
                  className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white hover:scale-110 transition-all focus:outline-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextLightboxImage}
                  className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white hover:scale-110 transition-all focus:outline-none"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Bar: Thumbnails preview */}
          <div className="flex justify-center items-center gap-2 overflow-x-auto py-2 z-10">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => openLightbox(idx)}
                className={cn(
                  'w-14 h-10 rounded-md overflow-hidden border-2 transition-all shrink-0',
                  lightboxIndex === idx
                    ? 'border-indigo-500 scale-105 opacity-100'
                    : 'border-transparent opacity-50 hover:opacity-80'
                )}
              >
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
