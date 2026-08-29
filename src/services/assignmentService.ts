import { supabase } from "@/lib/supabase";

export type AssignmentPriority =
  | "low"
  | "normal"
  | "high";

export type AssignmentStatus =
  | "pending"
  | "completed";

export interface Assignment {
  id: number;
  title: string;
  description: string | null;
  subject: string;
  teacher: string | null;
  assigned_date: string;
  due_date: string | null;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  attachment_url: string | null;
  submission_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Ambil semua tugas.
 */
export async function getAllAssignments(): Promise<
  Assignment[]
> {
  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .order("due_date", {
      ascending: true,
      nullsFirst: false,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Gagal mengambil assignments:",
      error
    );

    return [];
  }

  return data ?? [];
}

/**
 * Ambil tugas yang belum selesai.
 */
export async function getPendingAssignments(): Promise<
  Assignment[]
> {
  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("status", "pending")
    .order("due_date", {
      ascending: true,
      nullsFirst: false,
    });

  if (error) {
    console.error(
      "Gagal mengambil tugas pending:",
      error
    );

    return [];
  }

  return data ?? [];
}

/**
 * Ambil tugas yang sudah selesai.
 */
export async function getCompletedAssignments(): Promise<
  Assignment[]
> {
  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("status", "completed")
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Gagal mengambil tugas selesai:",
      error
    );

    return [];
  }

  return data ?? [];
}

/**
 * Ambil satu tugas berdasarkan ID.
 */
export async function getAssignmentById(
  id: number
): Promise<Assignment | null> {
  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(
      "Gagal mengambil assignment:",
      error
    );

    return null;
  }

  return data;
}

/**
 * Data untuk membuat tugas baru.
 */
export interface CreateAssignmentInput {
  title: string;
  description?: string | null;
  subject: string;
  teacher?: string | null;
  assigned_date?: string;
  due_date?: string | null;
  priority?: AssignmentPriority;
  attachment_url?: string | null;
  submission_url?: string | null;
}

/**
 * Data untuk memperbarui tugas.
 */
export interface UpdateAssignmentInput {
  title?: string;
  description?: string | null;
  subject?: string;
  teacher?: string | null;
  assigned_date?: string;
  due_date?: string | null;
  priority?: AssignmentPriority;
  status?: AssignmentStatus;
  attachment_url?: string | null;
  submission_url?: string | null;
}

/**
 * Membuat tugas baru.
 */
export async function createAssignment(
  input: CreateAssignmentInput,
): Promise<Assignment | null> {
  const { data, error } = await supabase
    .from("assignments")
    .insert({
      title: input.title,
      description: input.description ?? null,
      subject: input.subject,
      teacher: input.teacher ?? null,
      assigned_date:
        input.assigned_date ??
        new Date().toISOString().split("T")[0],
      due_date: input.due_date ?? null,
      priority: input.priority ?? "normal",
      attachment_url:
        input.attachment_url ?? null,
      submission_url:
        input.submission_url ?? null,
    })
    .select("*")
    .single();

  if (error) {
    console.error(
      "Gagal membuat assignment:",
      error,
    );

    return null;
  }

  return data;
}

/**
 * Memperbarui tugas.
 */
export async function updateAssignment(
  id: number,
  input: UpdateAssignmentInput,
): Promise<Assignment | null> {
  const { data, error } = await supabase
    .from("assignments")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error(
      "Gagal memperbarui assignment:",
      error,
    );

    return null;
  }

  return data;
}

/**
 * Menghapus tugas.
 */
export async function deleteAssignment(
  id: number,
): Promise<boolean> {
  const { error } = await supabase
    .from("assignments")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Gagal menghapus assignment:",
      error,
    );

    return false;
  }

  return true;
}