import { cache } from "react";

import { getCurrentUser } from "@/lib/currentUser";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type Profile = {
  id: string;
  nis: string;
  full_name: string;
  birth_date: string | null;
  photo_url: string | null;
  pin_hash: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  attendance_number: number;
  gender: string;
  class_name: string;
  role: string;
  is_birthday_filled: boolean;
  first_login_completed: boolean;
};

export const getProfile = cache(async (): Promise<Profile | null> => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from("members")
    .select("*")
    .eq("nis", currentUser.nis)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Profile;
});