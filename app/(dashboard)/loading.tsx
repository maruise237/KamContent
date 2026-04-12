export default function DashboardLoading() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 rounded-full border-2 border-white/[0.08]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#29AAE2] animate-spin" />
        </div>
        <p className="text-xs text-muted-foreground/50 animate-pulse">Chargement…</p>
      </div>
    </div>
  )
}
