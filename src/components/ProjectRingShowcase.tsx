'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  ExternalLink,
  Github,
  ArrowUpRight,
  FolderGit2,
  Sparkles,
  Layers,
  LayoutGrid,
  Disc3,
  RotateCw
} from 'lucide-react';
import { Project } from '@/lib/types';
import { cn, formatExternalUrl } from '@/lib/utils';
import { RippleEffect } from '@/components/RippleEffect';
import { ProjectCard } from '@/components/ProjectCard';
import { MotionReveal } from '@/components/MotionReveal';

interface ProjectRingShowcaseProps {
  projects: Project[];
}

export function ProjectRingShowcase({ projects }: ProjectRingShowcaseProps) {
  const [viewMode, setViewMode] = useState<'ring' | 'grid'>('ring');
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [radius, setRadius] = useState(380);
  const [cardWidth, setCardWidth] = useState(320);

  // Prepare cards: ensure at least 6 items for a complete 3D ring cylinder
  const displayProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    if (projects.length >= 6) return projects;
    // Duplicate projects if fewer than 6 to form a rich continuous 3D ring
    const duplicated: Project[] = [];
    while (duplicated.length < 6) {
      duplicated.push(...projects);
    }
    return duplicated.slice(0, 6);
  }, [projects]);

  const totalCards = displayProjects.length;
  const angleStep = totalCards > 0 ? 360 / totalCards : 60;

  // Rotation motion values with smooth spring physics
  const rotationMotion = useMotionValue(0);
  const smoothRotation = useSpring(rotationMotion, {
    stiffness: 70,
    damping: 18,
    restDelta: 0.01,
  });

  const [activeRotation, setActiveRotation] = useState(0);

  // Sync state for indicator calculations
  useEffect(() => {
    const unsubscribe = smoothRotation.on('change', (latest) => {
      setActiveRotation(latest);
    });
    return () => unsubscribe();
  }, [smoothRotation]);

  // Responsive radius adjustment
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setRadius(240);
        setCardWidth(255);
      } else if (width < 1024) {
        setRadius(320);
        setCardWidth(290);
      } else {
        setRadius(400);
        setCardWidth(330);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-spin loop
  useEffect(() => {
    if (!isAutoSpin || isHovered || viewMode !== 'ring' || totalCards === 0) return;

    const interval = setInterval(() => {
      rotationMotion.set(rotationMotion.get() - 0.22);
    }, 32);

    return () => clearInterval(interval);
  }, [isAutoSpin, isHovered, viewMode, totalCards, rotationMotion]);

  // Navigation handlers
  const handleNext = () => {
    const current = rotationMotion.get();
    const target = Math.round((current - angleStep) / angleStep) * angleStep;
    rotationMotion.set(target);
  };

  const handlePrev = () => {
    const current = rotationMotion.get();
    const target = Math.round((current + angleStep) / angleStep) * angleStep;
    rotationMotion.set(target);
  };

  const handleCardClick = (index: number) => {
    const current = rotationMotion.get();
    const currentNormalized = ((current % 360) + 360) % 360;
    const targetAngle = index * angleStep;
    
    // Calculate shortest angular difference
    let diff = (360 - targetAngle) - currentNormalized;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    
    rotationMotion.set(current + diff);
  };

  // Drag interaction variables
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startRotationRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (viewMode !== 'ring') return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startRotationRef.current = rotationMotion.get();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    const sensitivity = 0.35;
    rotationMotion.set(startRotationRef.current + deltaX * sensitivity);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    // Snap to nearest card
    const current = rotationMotion.get();
    const snapped = Math.round(current / angleStep) * angleStep;
    rotationMotion.set(snapped);
  };

  // Find active card index
  const activeIndex = useMemo(() => {
    if (totalCards === 0) return 0;
    const normalized = (((-activeRotation % 360) + 360) % 360);
    const index = Math.round(normalized / angleStep) % totalCards;
    return (index + totalCards) % totalCards;
  }, [activeRotation, angleStep, totalCards]);

  const categoryColors: Record<string, string> = {
    'Web App': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800',
    'Mobile App': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800',
    'UI/UX': 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/80 dark:text-pink-300 dark:border-pink-800',
    'Business': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
  };

  return (
    <section id="koleksi-proyek" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
      {/* Section Header with View Mode Switcher */}
      <MotionReveal direction="up" delay={0.1} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Showcase Proyek Interaktif
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Koleksi Karya Terpilih
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Jelajahi proyek dengan animasi cincin 3D berputar interaktif atau beralih ke tampilan grid klasik.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center p-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs">
            <button
              onClick={() => setViewMode('ring')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
                viewMode === 'ring'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Disc3 className="w-3.5 h-3.5" />
              <span>Cincin 3D</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid Klasik</span>
            </button>
          </div>

          <RippleEffect color="rgba(99, 102, 241, 0.15)" className="rounded-xl">
            <Link
              href="/category/web-app"
              className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors shadow-2xs block"
            >
              Semua Kategori →
            </Link>
          </RippleEffect>
        </div>
      </MotionReveal>

      {/* VIEW MODE 1: 3D CYLINDRICAL RING CAROUSEL */}
      {viewMode === 'ring' ? (
        <div
          className="relative w-full rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white/60 via-slate-50/40 to-white/60 dark:from-slate-900/60 dark:via-slate-950/40 dark:to-slate-900/60 backdrop-blur-xl p-4 sm:p-8 overflow-hidden shadow-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Ambient Lighting & Neon Floor Reflection */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-pink-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[550px] h-[100px] bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full" />
          </div>

          {/* Top Quick Controls Bar inside Ring View */}
          <div className="relative z-20 flex items-center justify-between px-2 pb-4 border-b border-slate-200/60 dark:border-slate-800/60 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                0{activeIndex + 1}
              </span>
              <span>/</span>
              <span className="font-mono">0{totalCards}</span>
              <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">•</span>
              <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400">
                Tarik / Geser kursor untuk memutar cincin 3D
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoSpin(!isAutoSpin)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-2xs"
                title={isAutoSpin ? 'Jeda Putaran Otomatis' : 'Aktifkan Putaran Otomatis'}
              >
                {isAutoSpin ? <Pause className="w-3 h-3 text-indigo-500" /> : <Play className="w-3 h-3 text-emerald-500" />}
                <span>{isAutoSpin ? 'Auto-Spin Aktif' : 'Auto-Spin Jeda'}</span>
              </button>
            </div>
          </div>

          {/* 3D Ring Stage Container */}
          <div
            className="relative w-full h-[520px] sm:h-[580px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            style={{ perspective: '1400px' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* The 3D Rotating Cylinder Drum */}
            <motion.div
              className="relative flex items-center justify-center"
              style={{
                width: cardWidth,
                height: 440,
                transformStyle: 'preserve-3d',
                rotateY: smoothRotation,
              }}
            >
              {displayProjects.map((project, idx) => {
                const cardAngle = idx * angleStep;
                const formattedLiveUrl = formatExternalUrl(project.live_url);
                const formattedRepoUrl = formatExternalUrl(project.repo_url);
                const isCurrentActive = idx === activeIndex;

                return (
                  <div
                    key={`${project.id}-${idx}`}
                    onClick={() => !isCurrentActive && handleCardClick(idx)}
                    style={{
                      position: 'absolute',
                      width: cardWidth,
                      transformStyle: 'preserve-3d',
                      transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                      backfaceVisibility: 'hidden',
                    }}
                    className={cn(
                      'group rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg',
                      isCurrentActive
                        ? 'border-indigo-400 dark:border-indigo-500/70 bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-500/20 ring-2 ring-indigo-500/30'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 opacity-80 hover:opacity-100 hover:border-slate-400 dark:hover:border-slate-600'
                    )}
                  >
                    {/* Card Thumbnail */}
                    <Link
                      href={`/project/${project.slug}`}
                      className="block relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800"
                    >
                      {project.thumbnail_url ? (
                        <img
                          src={project.thumbnail_url}
                          alt={project.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 p-4">
                          <FolderGit2 className="w-10 h-10 mb-1 stroke-1" />
                          <span className="text-[11px] font-medium">No preview available</span>
                        </div>
                      )}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span
                          className={cn(
                            'px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-md shadow-xs',
                            categoryColors[project.category] || 'bg-slate-100 text-slate-700 border-slate-200'
                          )}
                        >
                          {project.category}
                        </span>
                      </div>
                    </Link>

                    {/* Card Content Body */}
                    <div className="p-4 sm:p-5 flex flex-col justify-between space-y-3 bg-white dark:bg-slate-900">
                      <div>
                        <Link href={`/project/${project.slug}`} className="group/title block">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors line-clamp-1 flex items-center justify-between">
                            <span>{project.title}</span>
                            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover/title:opacity-100 -translate-y-0.5 translate-x-0.5 transition-all text-indigo-500" />
                          </h3>
                        </Link>

                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {project.short_description || 'Klik untuk melihat rincian studi kasus, arsitektur, dan aset proyek.'}
                        </p>

                        {/* Tech tags */}
                        {project.tech_stack && project.tech_stack.length > 0 && (
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {project.tech_stack.slice(0, 3).map((tech, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.tech_stack.length > 3 && (
                              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                                +{project.tech_stack.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                        <Link
                          href={`/project/${project.slug}`}
                          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group/btn"
                        >
                          Detail
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </Link>

                        <div className="flex items-center gap-1.5">
                          {formattedRepoUrl && (
                            <RippleEffect color="rgba(99, 102, 241, 0.2)" className="rounded-lg">
                              <a
                                href={formattedRepoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-2xs hover:scale-105"
                                title="Repositori GitHub"
                              >
                                <Github className="w-3 h-3" />
                                <span className="hidden sm:inline">Code</span>
                              </a>
                            </RippleEffect>
                          )}
                          {formattedLiveUrl && (
                            <RippleEffect color="rgba(255, 255, 255, 0.4)" className="rounded-lg">
                              <a
                                href={formattedLiveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all hover:scale-105"
                                title="Buka Live Demo"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Demo</span>
                              </a>
                            </RippleEffect>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Bottom Floating Navigation Controls */}
          <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            {/* Interactive Dot Trackers */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
              {displayProjects.map((proj, idx) => (
                <button
                  key={`dot-${idx}`}
                  onClick={() => handleCardClick(idx)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    idx === activeIndex
                      ? 'w-8 bg-indigo-600 dark:bg-indigo-400'
                      : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500'
                  )}
                  title={`Ke proyek ${proj.title}`}
                />
              ))}
            </div>

            {/* Prev & Next Ring Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95"
                title="Putar ke Proyek Sebelumnya"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center transition-all shadow-xs hover:scale-105 active:scale-95"
                title="Putar ke Proyek Selanjutnya"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: CLASSIC RESPONSIVE 3-COLUMN GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>
      )}
    </section>
  );
}
