import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function findMember(
  fullName: string,
  nis: string
) {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("full_name", fullName)
    .eq("nis", nis)
    .single();

  if (error) return null;

  return data;
}

export async function hashPin(pin: string) {
  return bcrypt.hash(pin, 10);
}

export async function verifyPin(
  pin: string,
  hash: string
) {
  return bcrypt.compare(pin, hash);
}