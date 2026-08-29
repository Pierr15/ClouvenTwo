import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createSession } from "@/lib/sessionService";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const {
      fullName,
      nis,
      birthDate,
      pin,
      deviceId,
      userAgent,
    } = await req.json();

    if (
      !fullName ||
      !nis ||
      !birthDate ||
      !pin ||
      !deviceId ||
      !userAgent
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua data harus diisi.",
        },
        {
          status: 400,
        }
      );
    }

    const { data: member, error } = await supabaseAdmin
      .from("members")
      .select("*")
      .eq("nis", nis.trim())
      .single();

    console.log("NIS =", nis);
    console.log("Member =", member);
    console.log("Error =", error);

    if (error || !member) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama atau NIS tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    // ===================================
    // LOGIN PERTAMA
    // ===================================

    if (!member.first_login_completed) {
      const pinHash = await bcrypt.hash(pin, 10);

      const { error: updateError } = await supabaseAdmin
        .from("members")
        .update({
          birth_date: birthDate,
          pin_hash: pinHash,
          first_login_completed: true,
        })
        .eq("id", member.id);

      if (updateError) {
        return NextResponse.json(
          {
            success: false,
            message: "Gagal menyimpan data.",
          },
          {
            status: 500,
          }
        );
      }

      const session = await createSession(
        member.id,
        deviceId,
        userAgent,
        req.headers.get("x-forwarded-for") ?? "::1"
      );

      const response = NextResponse.json({
        success: true,
        firstLogin: true,
        message: "Akun berhasil diaktifkan.",
      });

      response.cookies.set("xi-tkj-2-session", session.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: session.expiresAt,
        path: "/",
      });

      return response;
    }

    // ===================================
    // LOGIN BERIKUTNYA
    // ===================================

    const pinValid = await bcrypt.compare(pin, member.pin_hash);

    if (!pinValid) {
      return NextResponse.json(
        {
          success: false,
          message: "PIN salah.",
        },
        {
          status: 401,
        }
      );
    }

    const session = await createSession(
      member.id,
      deviceId,
      userAgent,
      req.headers.get("x-forwarded-for") ?? "::1"
    );

    const response = NextResponse.json({
      success: true,
      firstLogin: false,
      message: "Login berhasil.",
    });

    response.cookies.set("xi-tkj-2-session", session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: session.expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

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