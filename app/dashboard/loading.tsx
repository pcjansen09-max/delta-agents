export default function DashboardLoading() {
  return (
    <div className="pt-16 md:pt-0 space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-64 bg-white/[0.06] rounded-xl" />
        <div className="h-4 w-48 bg-white/[0.04] rounded-lg" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-5 space-y-3">
            <div className="w-6 h-6 bg-white/[0.06] rounded-lg" />
            <div className="h-8 w-16 bg-white/[0.06] rounded-lg" />
            <div className="h-4 w-28 bg-white/[0.04] rounded" />
            <div className="h-3 w-20 bg-white/[0.03] rounded" />
          </div>
        ))}
      </div>

      {/* Activity skeleton */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="h-5 w-40 bg-white/[0.06] rounded-lg" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.04]">
            <div className="w-6 h-6 bg-white/[0.06] rounded" />
            <div className="flex-1 h-4 bg-white/[0.04] rounded" />
            <div className="w-20 h-3 bg-white/[0.03] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
