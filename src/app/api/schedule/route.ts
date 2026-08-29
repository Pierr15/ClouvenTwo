import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/currentUser";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const DAYS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
] as const;

const BLOCKS = ["A", "B"] as const;

type SchoolDay = (typeof DAYS)[number];
type Block = (typeof BLOCKS)[number];

function isValidDay(value: string): value is SchoolDay {
  return DAYS.includes(value as SchoolDay);
}

function isValidBlock(value: string): value is Block {
  return BLOCKS.includes(value as Block);
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Kamu harus login.",
        },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);

    const day = searchParams.get("day");
    const block = searchParams.get("block");

    if (day && !isValidDay(day)) {
      return NextResponse.json(
        {
          success: false,
          message: "Hari tidak valid.",
        },
        { status: 400 },
      );
    }

    if (block && !isValidBlock(block)) {
      return NextResponse.json(
        {
          success: false,
          message: "Blok tidak valid.",
        },
        { status: 400 },
      );
    }

    let query = supabaseAdmin
      .from("schedules")
      .select("*")
      .order("period_start", {
        ascending: true,
      });

    if (day) {
      query = query.eq("day", day);
    }

    if (block) {
      query = query.eq("block", block);
    }

    const { data, error } = await query;

    if (error) {
      console.error("GET /api/schedule error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal mengambil jadwal.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      items: data ?? [],
    });
  } catch (error) {
    console.error("Schedule API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 },
    );
  }
}