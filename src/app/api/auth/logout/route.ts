import { NextResponse } from "next/server";

import { getSessionCookie, deleteSessionCookie } from "@/lib/cookies";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST() {
  try {
    const sessionToken = await getSessionCookie();

    if (sessionToken) {
      const { error } = await supabaseAdmin
        .from("login_sessions")
        .update({
          is_active: false,
        })
        .eq("session_token", sessionToken);

      if (error) {
        console.error(error);
      }
    }

    await deleteSessionCookie();

    return NextResponse.json({
      success: true,
      message: "Logout berhasil.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server.",
      },
      {
        status: 500,
      }
    );
  }
}