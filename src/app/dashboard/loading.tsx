import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Skeleton from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-72 max-w-full" />
          <Skeleton className="h-4 w-52" />
        </div>

        {/* Quick menu */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-2xl" />
          ))}
        </div>

        {/* Dashboard cards */}
        <div className="grid gap-5 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <Skeleton className="h-5 w-40" />

              <div className="mt-5 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
