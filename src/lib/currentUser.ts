import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { SESSION_COOKIE_NAME } from "./auth-config";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  // Ambil session saja
  const { data: session } = await supabaseAdmin
    .from("login_sessions")
    .select("id, member_id, expires_at")
    .eq("session_token", token)
    .eq("is_active", true)
    .maybeSingle();

  if (!session) return null;

  if (new Date(session.expires_at) < new Date()) {
    await supabaseAdmin
      .from("login_sessions")
      .update({ is_active: false })
      .eq("id", session.id);

    cookieStore.delete(SESSION_COOKIE_NAME);

    return null;
  }

  // Baru ambil member berdasarkan member_id
  const { data: member } = await supabaseAdmin
    .from("members")
    .select("*")
    .eq("id", session.member_id)
    .maybeSingle();

  return member;
}
