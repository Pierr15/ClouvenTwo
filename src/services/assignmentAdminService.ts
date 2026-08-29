import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/currentUser";

type ManageRole = "admin" | "guru";

function canManageAssignments(
  role: string | null | undefined,
): role is ManageRole {
  return role === "admin" || role === "guru";
}

/**
 * Memastikan user yang sedang login
 * memiliki hak untuk mengelola tugas.
 *
 * admin -> boleh
 * guru  -> boleh
 * siswa -> tidak boleh
 */
async function requireAssignmentManager() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      error: "Kamu harus login terlebih dahulu.",
    };
  }

  if (!canManageAssignments(user.role)) {
    return {
      user: null,
      error:
        "Kamu tidak memiliki izin untuk mengelola tugas.",
    };
  }

  return {
    user,
    error: null,
  };
}

/**
 * Hapus tugas.
 *
 * Hanya admin dan guru yang boleh menghapus.
 *
 * Submission siswa yang terkait juga akan
 * dihapus bersama file di Storage.
 */
export async function deleteAssignmentAsManager(
  assignmentId: number,
): Promise<{
  success: boolean;
  error?: string;
}> {
  const {
    user,
    error: permissionError,
  } = await requireAssignmentManager();

  if (!user) {
    return {
      success: false,
      error:
        permissionError ??
        "Kamu tidak memiliki izin.",
    };
  }

  if (!Number.isInteger(assignmentId)) {
    return {
      success: false,
      error: "ID tugas tidak valid.",
    };
  }

  /*
   * Pastikan tugas memang ada.
   */
  const {
    data: assignment,
    error: assignmentError,
  } = await supabaseAdmin
    .from("assignments")
    .select("id")
    .eq("id", assignmentId)
    .maybeSingle();

  if (assignmentError) {
    console.error(
      "Gagal memeriksa assignment:",
      assignmentError,
    );

    return {
      success: false,
      error: "Gagal memeriksa tugas.",
    };
  }

  if (!assignment) {
    return {
      success: false,
      error: "Tugas tidak ditemukan.",
    };
  }

  /*
   * Ambil semua submission yang berkaitan
   * dengan tugas ini.
   */
  const {
    data: submissions,
    error: submissionsError,
  } = await supabaseAdmin
    .from("assignment_submissions")
    .select("id, file_url")
    .eq("assignment_id", assignmentId);

  if (submissionsError) {
    console.error(
      "Gagal mengambil submission:",
      submissionsError,
    );

    return {
      success: false,
      error:
        "Gagal mengambil data pengumpulan tugas.",
    };
  }

  /*
   * Ambil path file dari Storage.
   */
  const filePaths = (submissions ?? [])
    .map(
      (submission) =>
        submission.file_url,
    )
    .filter(
      (
        filePath,
      ): filePath is string =>
        Boolean(filePath),
    );

  /*
   * Hapus file submission dari Storage.
   */
  if (filePaths.length > 0) {
    const {
      error: storageError,
    } = await supabaseAdmin.storage
      .from("assigments")
      .remove(filePaths);

    if (storageError) {
      console.error(
        "Gagal menghapus file submission:",
        storageError,
      );

      return {
        success: false,
        error:
          "Gagal menghapus file pengumpulan tugas.",
      };
    }
  }

  /*
   * Hapus data submission.
   */
  const {
    error: deleteSubmissionsError,
  } = await supabaseAdmin
    .from("assignment_submissions")
    .delete()
    .eq("assignment_id", assignmentId);

  if (deleteSubmissionsError) {
    console.error(
      "Gagal menghapus submission:",
      deleteSubmissionsError,
    );

    return {
      success: false,
      error:
        "Gagal menghapus data pengumpulan tugas.",
    };
  }

  /*
   * Hapus assignment.
   */
  const {
    error: deleteAssignmentError,
  } = await supabaseAdmin
    .from("assignments")
    .delete()
    .eq("id", assignmentId);

  if (deleteAssignmentError) {
    console.error(
      "Gagal menghapus assignment:",
      deleteAssignmentError,
    );

    return {
      success: false,
      error: "Gagal menghapus tugas.",
    };
  }

  return {
    success: true,
  };
}