import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Skeleton from "@/components/ui/skeleton";

export default function AssignmentsLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>

        {/* Statistik */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-4 h-8 w-16" />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-4 h-8 w-16" />
          </div>
        </div>

        {/* Assignment list */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-full max-w-xl" />
                </div>

                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
