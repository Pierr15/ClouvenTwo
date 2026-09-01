import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a1020] p-6">
      <Skeleton className="mb-6 h-10 w-48" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
          >
            <Skeleton className="mb-4 h-14 w-14 rounded-full" />
            <Skeleton className="mb-2 h-5 w-36" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
