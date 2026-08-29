import { redirect } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

import { getCurrentUser } from "@/lib/currentUser";
import { getAllAssignments } from "@/services/assignmentService";

export default async function AssignmentManagePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const assignments = await getAllAssignments();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Kelola Tugas
          </h1>

          <p className="mt-1 text-slate-400">
            Tambah, ubah, dan kelola tugas kelas XI TKJ 2.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Total tugas
          </p>

          <p className="mt-1 text-3xl font-bold text-cyan-400">
            {assignments.length}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}