"use server";

import { revalidatePath } from "next/cache";

import { deleteAssignmentAsManager } from "@/services/assignmentAdminService";

export async function deleteAssignmentAction(
  assignmentId: number,
) {
  const result =
    await deleteAssignmentAsManager(
      assignmentId,
    );

  if (!result.success) {
    return {
      success: false,
      error:
        result.error ??
        "Gagal menghapus tugas.",
    };
  }

  revalidatePath("/assignments");

  return {
    success: true,
  };
}