import { supabaseAdmin } from "@/lib/supabaseAdmin";

import { getCurrentUser } from "@/lib/currentUser";

const BUCKET_NAME = "assigments";

export interface AssignmentSubmission {
  id: number;
  assignment_id: number;
  member_id: string;
  file_name: string;
  file_url: string;
  submitted_at: string;
  updated_at: string;
  status: "submitted" | "revised";
  notes: string | null;
}

/**
 * Ambil submission milik siswa yang sedang login
 * untuk satu assignment.
 */
export async function getMySubmission(
  assignmentId: number,
): Promise<AssignmentSubmission | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from("assignment_submissions")
    .select("*")
    .eq("assignment_id", assignmentId)
    .eq("member_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "Gagal mengambil submission:",
      error,
    );

    return null;
  }

  return data;
}

/**
 * Ambil semua submission milik siswa
 * yang sedang login.
 *
 * Digunakan untuk halaman utama /assignments
 * agar status setiap tugas bisa disesuaikan
 * dengan submission siswa tersebut.
 */
export async function getMySubmissions(): Promise<
  AssignmentSubmission[]
> {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from("assignment_submissions")
    .select("*")
    .eq("member_id", user.id)
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Gagal mengambil semua submission:",
      error,
    );

    return [];
  }

  return data ?? [];
}

/**
 * Upload tugas siswa.
 *
 * File disimpan:
 *
 * assigments/
 * └── assignment_id/
 *     └── member_id/
 *         └── filename
 */
export async function submitAssignment(
  assignmentId: number,
  file: File,
): Promise<{
  success: boolean;
  submission?: AssignmentSubmission;
  error?: string;
}> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "Kamu harus login terlebih dahulu.",
    };
  }

  if (!file || file.size === 0) {
    return {
      success: false,
      error: "File tidak boleh kosong.",
    };
  }

  // Batas tambahan di aplikasi.
  // Bucket Supabase juga memiliki batas 50 MB.
  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: "Ukuran file maksimal 50 MB.",
    };
  }

  // Pastikan assignment memang ada.
  const { data: assignment, error: assignmentError } =
    await supabaseAdmin
      .from("assignments")
      .select("id")
      .eq("id", assignmentId)
      .maybeSingle();

  if (assignmentError || !assignment) {
    return {
      success: false,
      error: "Tugas tidak ditemukan.",
    };
  }

  // Cek apakah siswa sudah pernah mengumpulkan.
  const { data: existingSubmission } =
    await supabaseAdmin
      .from("assignment_submissions")
      .select("*")
      .eq("assignment_id", assignmentId)
      .eq("member_id", user.id)
      .maybeSingle();

  /*
   * Bersihkan nama file agar aman digunakan
   * sebagai path Storage.
   */
  const safeFileName = file.name
    .normalize("NFKD")
    .replace(/[^\w.\- ]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 150);

  const fileName =
    safeFileName || "tugas";

  const filePath =
    `${assignmentId}/${user.id}/${fileName}`;

  /*
   * Kalau siswa sudah pernah mengumpulkan,
   * hapus file lamanya terlebih dahulu.
   */
  if (existingSubmission?.file_url) {
    const { error: removeError } =
      await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove([existingSubmission.file_url]);

    if (removeError) {
      console.warn(
        "File lama gagal dihapus:",
        removeError,
      );
    }
  }

  /*
   * Upload file baru.
   */
  const { error: uploadError } =
    await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        upsert: true,
        contentType:
          file.type || "application/octet-stream",
      });

  if (uploadError) {
    console.error(
      "Gagal upload tugas:",
      uploadError,
    );

    return {
      success: false,
      error: "Gagal mengupload file tugas.",
    };
  }

  const now = new Date().toISOString();

  /*
   * Simpan PATH Storage ke database.
   *
   * Jangan menyimpan public URL karena bucket
   * assignment sebaiknya tetap private.
   */
  const submissionData = {
    assignment_id: assignmentId,
    member_id: user.id,
    file_name: file.name,
    file_url: filePath,
    submitted_at:
      existingSubmission?.submitted_at ?? now,
    updated_at: now,
    status: existingSubmission
      ? "revised"
      : "submitted",
  };

  let data: AssignmentSubmission | null =
    null;

  if (existingSubmission) {
    const { data: updated, error } =
      await supabaseAdmin
        .from("assignment_submissions")
        .update(submissionData)
        .eq("id", existingSubmission.id)
        .select("*")
        .single();

    if (error) {
      console.error(
        "Gagal memperbarui submission:",
        error,
      );

      return {
        success: false,
        error:
          "File berhasil diupload, tetapi data submission gagal diperbarui.",
      };
    }

    data = updated;
  } else {
    const { data: inserted, error } =
      await supabaseAdmin
        .from("assignment_submissions")
        .insert(submissionData)
        .select("*")
        .single();

    if (error) {
      console.error(
        "Gagal menyimpan submission:",
        error,
      );

      // Kalau database gagal, hapus file
      // yang baru saja diupload.
      await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      return {
        success: false,
        error:
          "File berhasil diupload, tetapi data submission gagal disimpan.",
      };
    }

    data = inserted;
  }

  return {
    success: true,
    submission: data ?? undefined,
  };
}

/**
 * Membuat signed URL untuk melihat/download
 * file submission milik siswa yang sedang login.
 */
export async function getMySubmissionUrl(
  assignmentId: number,
): Promise<string | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data: submission, error } =
    await supabaseAdmin
      .from("assignment_submissions")
      .select("file_url")
      .eq("assignment_id", assignmentId)
      .eq("member_id", user.id)
      .maybeSingle();

  if (
    error ||
    !submission?.file_url
  ) {
    return null;
  }

  const { data, error: signedUrlError } =
    await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUrl(
        submission.file_url,
        60 * 10,
      );

  if (signedUrlError) {
    console.error(
      "Gagal membuat signed URL:",
      signedUrlError,
    );

    return null;
  }

  return data.signedUrl;
}

/**
 * Hapus submission milik siswa yang sedang login.
 */
export async function deleteMySubmission(
  assignmentId: number,
): Promise<{
  success: boolean;
  error?: string;
}> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "Kamu harus login terlebih dahulu.",
    };
  }

  const { data: submission, error } =
    await supabaseAdmin
      .from("assignment_submissions")
      .select("id, file_url")
      .eq("assignment_id", assignmentId)
      .eq("member_id", user.id)
      .maybeSingle();

  if (error || !submission) {
    return {
      success: false,
      error: "Submission tidak ditemukan.",
    };
  }

  if (submission.file_url) {
    const { error: storageError } =
      await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove([submission.file_url]);

    if (storageError) {
      console.error(
        "Gagal menghapus file:",
        storageError,
      );

      return {
        success: false,
        error: "Gagal menghapus file tugas.",
      };
    }
  }

  const { error: deleteError } =
    await supabaseAdmin
      .from("assignment_submissions")
      .delete()
      .eq("id", submission.id)
      .eq("member_id", user.id);

  if (deleteError) {
    console.error(
      "Gagal menghapus submission:",
      deleteError,
    );

    return {
      success: false,
      error:
        "File berhasil dihapus, tetapi data submission gagal dihapus.",
    };
  }

  return {
    success: true,
  };
}