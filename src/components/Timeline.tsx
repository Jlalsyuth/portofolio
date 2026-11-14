import { Briefcase, GraduationCap, Calendar, Building2 } from 'lucide-react';
import { ExperienceItem, EducationItem } from '@/lib/types';

interface TimelineProps {
  experience?: ExperienceItem[] | null;
  education?: EducationItem[] | null;
}

export function Timeline({ experience = [], education = [] }: TimelineProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Work Experience */}
      <div>
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pengalaman Kerja</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Riwayat karier & pencapaian profesional</p>
          </div>
        </div>

        {experience && experience.length > 0 ? (
          <div className="relative border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-4 pl-6 space-y-8">
            {experience.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Node indicator */}
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-indigo-600 bg-white dark:bg-slate-900 group-hover:scale-125 transition-transform" />

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-all shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.role}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.period}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {item.company}
                  </div>

                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">Belum ada riwayat pengalaman.</p>
        )}
      </div>

      {/* Education */}
      <div>
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Riwayat Pendidikan</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Latar belakang akademis & gelar</p>
          </div>
        </div>

        {education && education.length > 0 ? (
          <div className="relative border-l-2 border-purple-200 dark:border-purple-900/60 ml-4 pl-6 space-y-8">
            {education.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Node indicator */}
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-purple-600 bg-white dark:bg-slate-900 group-hover:scale-125 transition-transform" />

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-600/50 transition-all shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.degree}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.period}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {item.institution}
                  </div>

                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">Belum ada riwayat pendidikan.</p>
        )}
      </div>
    </div>
  );
}
