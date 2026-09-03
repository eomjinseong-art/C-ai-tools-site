export function HomeSkeleton() {
  return (
    <div className="flex flex-col gap-10 animate-pulse">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 py-10">
        <div className="h-9 w-72 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 w-64 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
    </div>
  );
}

export function BrowseSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 animate-pulse lg:grid-cols-[180px_1fr_400px]">
      <div className="flex gap-2 lg:flex-col">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 rounded-lg bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-6 w-28 rounded bg-gray-200 dark:bg-gray-800" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <div className="aspect-video rounded-xl bg-gray-200 dark:bg-gray-800" />
        <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-24 rounded-xl bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-7 w-56 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
    </div>
  );
}
