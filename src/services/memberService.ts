import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface Member {
  id: string;
  nis: string;
  full_name: string;
  birth_date: string | null;
  photo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  attendance_number: number;
  gender: "L" | "P";
  class_name: string;
  role: string;
  is_birthday_filled: boolean;
  first_login_completed: boolean;
}

/**
 * Ambil semua data siswa
 */
export async function getAllMembers(): Promise<Member[]> {
  const { data, error } = await supabaseAdmin
    .from("members")
    .select("*")
    .eq("is_active", true)
    .order("attendance_number", {
      ascending: true,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as Member[];
}

/**
 * Cari siswa berdasarkan NIS
 */
export async function getMemberByNIS(nis: string): Promise<Member | null> {
  const { data, error } = await supabaseAdmin
    .from("members")
    .select("*")
    .eq("nis", nis)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data as Member | null;
}

/**
 * Cari siswa berdasarkan nomor absen
 */
export async function getMemberByAttendanceNumber(
  attendanceNumber: number,
): Promise<Member | null> {
  const { data, error } = await supabaseAdmin
    .from("members")
    .select("*")
    .eq("attendance_number", attendanceNumber)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data as Member | null;
}

/**
 * Cari siswa berdasarkan nama
 */
export async function getMemberByName(
  fullName: string,
): Promise<Member | null> {
  const { data, error } = await supabaseAdmin
    .from("members")
    .select("*")
    .ilike("full_name", fullName)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data as Member | null;
}

/**
 * Ambil siswa yang ulang tahun hari ini
 */
export async function getBirthdayMembers(): Promise<Member[]> {
  const today = new Date();

  const month = today.getMonth() + 1;
  const day = today.getDate();

  const { data, error } = await supabaseAdmin
    .from("members")
    .select("*")
    .eq("is_active", true)
    .eq("is_birthday_filled", true);

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []).filter((member) => {
    if (!member.birth_date) return false;

    const birth = new Date(member.birth_date);

    return birth.getMonth() + 1 === month && birth.getDate() === day;
  }) as Member[];
}
