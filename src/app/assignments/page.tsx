import { redirect } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AssignmentHeader from "@/components/assignments/AssignmentHeader";
import AssignmentContent from "@/components/assignments/AssignmentContent";

import { getCurrentUser } from "@/lib/currentUser";
import { getAllAssignments } from "@/services/assignmentService";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AssignmentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const assignments = await getAllAssignments();

  /*
   * Ambil submission milik siswa yang sedang login.
   */
  const { data: submissions } =
    await supabaseAdmin
      .from("assignment_submissions")
      .select("assignment_id")
      .eq("member_id", user.id);

  const submittedAssignmentIds = new Set(
    (submissions ?? []).map(
      (submission) =>
        submission.assignment_id,
    ),
  );

  /*
   * Tambahkan status khusus untuk siswa
   * yang sedang login.
   */
  const assignmentsWithStudentStatus =
    assignments.map((assignment) => ({
      ...assignment,

      studentStatus:
        submittedAssignmentIds.has(
          assignment.id,
        )
          ? ("completed" as const)
          : ("pending" as const),
    }));

  /*
   * Statistik tugas siswa.
   */
  const pendingAssignments =
    assignmentsWithStudentStatus.filter(
      (assignment) =>
        assignment.studentStatus ===
        "pending",
    ).length;

  /*
   * Hak kelola tugas.
   */
  const canManage =
    user.role === "admin" ||
    user.role === "guru";

  return (
    <DashboardLayout>
      <AssignmentHeader
        totalAssignments={
          assignmentsWithStudentStatus.length
        }
        pendingAssignments={
          pendingAssignments
        }
      />

      <AssignmentContent
        assignments={
          assignmentsWithStudentStatus
        }
        canManage={canManage}
      />
    </DashboardLayout>
  );
}