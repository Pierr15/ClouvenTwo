export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a1020]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

        <p className="text-sm text-slate-400">Memuat...</p>
      </div>
    </div>
  );
}
