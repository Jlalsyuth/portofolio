'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Sparkles, Award } from 'lucide-react';

export interface Partner {
  name: string;
  role: string;
  category: 'Enterprise' | 'Academic' | 'Startup' | 'Organization' | 'Competition';
  logoText?: string;
  logoUrl?: string;
  badge?: string;
}

export const DEFAULT_PARTNERS: Partner[] = [
  {
    name: 'PT PLN Nusantara Power UP Brantas',
    role: 'Business Intelligence & Web System Intern (SO Division)',
    category: 'Enterprise',
    badge: 'BUMN',
  },
  {
    name: 'Universitas Brawijaya',
    role: 'Information Systems & Academic Digitalization',
    category: 'Academic',
    badge: 'Campus',
  },
  {
    name: 'BEM FILKOM UB',
    role: 'Information & Technology Development Staff',
    category: 'Organization',
    badge: 'Student Gov',
  },
  {
    name: 'BIOS FILKOM UB',
    role: 'Entrepreneurship Department Staff',
    category: 'Organization',
    badge: 'Student Org',
  },
  {
    name: 'Industrial Business Project',
    role: 'CEO & Team Leader (AI Waste Management - Gemash)',
    category: 'Startup',
    badge: 'Finalist',
  },
  {
    name: 'Dekan Cup FILKOM UB',
    role: 'Founder & Concept Designer (Career-Tech - JAFDOTKOM)',
    category: 'Startup',
    badge: '3rd Winner',
  },
  {
    name: 'World Invention Competition (WICE)',
    role: 'Project Presenter & Researcher',
    category: 'Competition',
    badge: 'Gold Medalist',
  },
];

export function PartnershipMarquee({
  partners = DEFAULT_PARTNERS,
}: {
  partners?: Partner[];
}) {
  // Duplicate for seamless infinite loop ticker
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="relative py-12 overflow-hidden border-y border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Kepercayaan & Rekam Jejak Kolaborasi</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Institusi & Klien yang Pernah Bekerja Sama
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl mx-auto">
          Membangun solusi perangkat lunak yang berdampak nyata bersama perusahaan multinasional, institusi terkemuka, dan startup inovatif.
        </p>
      </div>

      {/* Marquee Track with gradient fade edges */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)]">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] py-3">
          {duplicatedPartners.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="group relative mx-3.5 sm:mx-4 flex items-center gap-3.5 px-5 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              {/* Partner Logo / Emblem */}
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center transition-colors shadow-2xs font-bold text-sm">
                {item.logoUrl ? (
                  <img
                    src={item.logoUrl}
                    alt={item.name}
                    className="w-6 h-6 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                ) : (
                  <Building2 className="w-5 h-5 filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300" />
                )}
              </div>

              {/* Partner Name & Role */}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white transition-colors duration-200">
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/80 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 border border-slate-200/50 dark:border-slate-700/50 transition-colors">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.role}
                </span>
              </div>

              {/* Floating Tooltip Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 text-[11px] font-medium shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-30 translate-y-2 group-hover:translate-y-0 border border-slate-700">
                <div className="flex items-center gap-1.5">
                  <Award className="w-3 h-3 text-indigo-400" />
                  <span>{item.category}: {item.role}</span>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
