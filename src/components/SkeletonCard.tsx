export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 overflow-hidden animate-pulse shadow-sm">
      <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="w-20 h-5 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
        <div className="w-3/4 h-6 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="pt-2 flex justify-between items-center">
          <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="space-y-8 animate-pulse max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="w-32 h-32 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="w-48 h-8 bg-slate-200 dark:bg-slate-800 rounded mx-auto md:mx-0" />
          <div className="w-72 h-5 bg-slate-200 dark:bg-slate-800 rounded mx-auto md:mx-0" />
          <div className="w-full max-w-xl h-16 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="flex gap-3 justify-center md:justify-start pt-2">
            <div className="w-32 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
