import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateSessionToken, getSessionExpiry } from "@/lib/session";

export async function createSession(
  memberId: string,
  deviceId: string,
  userAgent: string,
  ipAddress = "Unknown IP",
) {
  const sessionToken = generateSessionToken();
  const expiresAt = getSessionExpiry(30);

  // Cek apakah perangkat ini sudah pernah login
  const { data: existingSession } = await supabaseAdmin
    .from("login_sessions")
    .select("id")
    .eq("member_id", memberId)
    .eq("device_id", deviceId)
    .maybeSingle();

  if (existingSession) {
    const { error } = await supabaseAdmin
      .from("login_sessions")
      .update({
        session_token: sessionToken,
        user_agent: userAgent,
        ip_address: ipAddress,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        is_active: true,
      })
      .eq("id", existingSession.id);

    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin.from("login_sessions").insert({
      member_id: memberId,
      session_token: sessionToken,
      device_id: deviceId,
      user_agent: userAgent,
      ip_address: ipAddress,
      created_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      is_active: true,
    });

    if (error) throw error;
  }

  return {
    sessionToken,
    expiresAt,
  };
}
