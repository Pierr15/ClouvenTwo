"use server";

import {
  submitAssignment,
  deleteMySubmission,
  getMySubmissionUrl,
} from "@/services/assignmentSubmissionService";

export async function uploadAssignmentAction(
  formData: FormData,
) {
  const assignmentIdValue =
    formData.get("assignmentId");

  const file = formData.get("file");

  if (
    typeof assignmentIdValue !== "string" ||
    !assignmentIdValue
  ) {
    return {
      success: false,
      error: "ID tugas tidak valid.",
    };
  }

  if (!(file instanceof File)) {
    return {
      success: false,
      error: "File tugas belum dipilih.",
    };
  }

  const assignmentId =
    Number(assignmentIdValue);

  if (!Number.isInteger(assignmentId)) {
    return {
      success: false,
      error: "ID tugas tidak valid.",
    };
  }

  return submitAssignment(
    assignmentId,
    file,
  );
}

export async function deleteAssignmentSubmissionAction(
  assignmentId: number,
) {
  return deleteMySubmission(assignmentId);
}

export async function getAssignmentSubmissionUrlAction(
  assignmentId: number,
) {
  return getMySubmissionUrl(assignmentId);
}