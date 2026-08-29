import { notFound, redirect } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AssignmentDetail from "@/components/assignments/AssignmentDetail";

import { getCurrentUser } from "@/lib/currentUser";
import { getAssignmentById } from "@/services/assignmentService";
import { getMySubmission } from "@/services/assignmentSubmissionService";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AssignmentDetailPage({
  params,
}: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const assignmentId = Number(id);

  if (!Number.isInteger(assignmentId)) {
    notFound();
  }

  const assignment =
    await getAssignmentById(assignmentId);

  if (!assignment) {
    notFound();
  }

  const submission =
    await getMySubmission(assignmentId);

  return (
    <DashboardLayout>
      <AssignmentDetail
        assignment={assignment}
        submission={submission}
      />
    </DashboardLayout>
  );
}