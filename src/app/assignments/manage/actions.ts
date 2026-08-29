"use server";

import { revalidatePath } from "next/cache";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/currentUser";

type AssignmentPriority =
  | "low"
  | "normal"
  | "high";

type AssignmentStatus =
  | "pending"
  | "completed";

async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Kamu harus login terlebih dahulu.");
  }

  /*
   * Untuk sementara management dikunci di server.
   *
   * Nanti kalau sistem role sudah tersedia,
   * bagian ini kita ganti menjadi pengecekan
   * role admin/guru.
   */
  return user;
}

/**
 * Tambah tugas baru.
 */
export async function createAssignmentAction(
  formData: FormData,
) {
  await requireAdmin();

  const title = String(
    formData.get("title") ?? "",
  ).trim();

  const description = String(
    formData.get("description") ?? "",
  ).trim();

  const subject = String(
    formData.get("subject") ?? "",
  ).trim();

  const teacher = String(
    formData.get("teacher") ?? "",
  ).trim();

  const assignedDate = String(
    formData.get("assigned_date") ?? "",
  ).trim();

  const dueDate = String(
    formData.get("due_date") ?? "",
  ).trim();

  const priority = String(
    formData.get("priority") ?? "normal",
  ) as AssignmentPriority;

  const submissionUrl = String(
    formData.get("submission_url") ?? "",
  ).trim();

  if (!title) {
    return {
      success: false,
      error: "Judul tugas wajib diisi.",
    };
  }

  if (!subject) {
    return {
      success: false,
      error: "Mata pelajaran wajib diisi.",
    };
  }

  if (
    !["low", "normal", "high"].includes(
      priority,
    )
  ) {
    return {
      success: false,
      error: "Prioritas tugas tidak valid.",
    };
  }

  const { data, error } =
    await supabaseAdmin
      .from("assignments")
      .insert({
        title,
        description: description || null,
        subject,
        teacher: teacher || null,
        assigned_date:
          assignedDate ||
          new Date()
            .toISOString()
            .split("T")[0],
        due_date: dueDate || null,
        priority,
        status: "pending",
        submission_url:
          submissionUrl || null,
      })
      .select("*")
      .single();

  if (error) {
    console.error(
      "Gagal membuat tugas:",
      error,
    );

    return {
      success: false,
      error: "Gagal membuat tugas.",
    };
  }

  revalidatePath("/assignments");
  revalidatePath("/assignments/manage");

  return {
    success: true,
    assignment: data,
  };
}

/**
 * Update tugas.
 */
export async function updateAssignmentAction(
  formData: FormData,
) {
  await requireAdmin();

  const id = Number(
    formData.get("id"),
  );

  if (!Number.isInteger(id)) {
    return {
      success: false,
      error: "ID tugas tidak valid.",
    };
  }

  const title = String(
    formData.get("title") ?? "",
  ).trim();

  const description = String(
    formData.get("description") ?? "",
  ).trim();

  const subject = String(
    formData.get("subject") ?? "",
  ).trim();

  const teacher = String(
    formData.get("teacher") ?? "",
  ).trim();

  const assignedDate = String(
    formData.get("assigned_date") ?? "",
  ).trim();

  const dueDate = String(
    formData.get("due_date") ?? "",
  ).trim();

  const priority = String(
    formData.get("priority") ?? "normal",
  ) as AssignmentPriority;

  const status = String(
    formData.get("status") ?? "pending",
  ) as AssignmentStatus;

  const submissionUrl = String(
    formData.get("submission_url") ?? "",
  ).trim();

  if (!title) {
    return {
      success: false,
      error: "Judul tugas wajib diisi.",
    };
  }

  if (!subject) {
    return {
      success: false,
      error: "Mata pelajaran wajib diisi.",
    };
  }

  if (
    !["low", "normal", "high"].includes(
      priority,
    )
  ) {
    return {
      success: false,
      error: "Prioritas tidak valid.",
    };
  }

  if (
    !["pending", "completed"].includes(
      status,
    )
  ) {
    return {
      success: false,
      error: "Status tugas tidak valid.",
    };
  }

  const { data, error } =
    await supabaseAdmin
      .from("assignments")
      .update({
        title,
        description: description || null,
        subject,
        teacher: teacher || null,
        assigned_date:
          assignedDate ||
          new Date()
            .toISOString()
            .split("T")[0],
        due_date: dueDate || null,
        priority,
        status,
        submission_url:
          submissionUrl || null,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

  if (error) {
    console.error(
      "Gagal memperbarui tugas:",
      error,
    );

    return {
      success: false,
      error: "Gagal memperbarui tugas.",
    };
  }

  revalidatePath("/assignments");
  revalidatePath(`/assignments/${id}`);
  revalidatePath("/assignments/manage");

  return {
    success: true,
    assignment: data,
  };
}

/**
 * Hapus tugas.
 */
export async function deleteAssignmentAction(
  formData: FormData,
) {
  await requireAdmin();

  const id = Number(
    formData.get("id"),
  );

  if (!Number.isInteger(id)) {
    return {
      success: false,
      error: "ID tugas tidak valid.",
    };
  }

  const { error } =
    await supabaseAdmin
      .from("assignments")
      .delete()
      .eq("id", id);

  if (error) {
    console.error(
      "Gagal menghapus tugas:",
      error,
    );

    return {
      success: false,
      error: "Gagal menghapus tugas.",
    };
  }

  revalidatePath("/assignments");
  revalidatePath("/assignments/manage");

  return {
    success: true,
  };
}