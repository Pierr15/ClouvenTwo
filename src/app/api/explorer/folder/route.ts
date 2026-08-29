import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/currentUser";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const VALID_CATEGORIES = [
  "materials",
  "documentation",
  "certificates",
] as const;

type ExplorerCategory =
  (typeof VALID_CATEGORIES)[number];

export async function POST(
  request: Request,
) {
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

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const category =
      typeof body.category === "string"
        ? body.category
        : "";

    const parentId =
      typeof body.parentId === "string" &&
      body.parentId.length > 0
        ? body.parentId
        : null;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nama folder wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (
      !VALID_CATEGORIES.includes(
        category as ExplorerCategory,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Kategori Explorer tidak valid.",
        },
        { status: 400 },
      );
    }

    const { data, error } =
      await supabaseAdmin
        .from("explorer_items")
        .insert({
          name,
          type: "folder",
          category,
          parent_id: parentId,
          storage_path: null,
          file_url: null,
          mime_type: null,
          file_size: null,
          member_id: user.id,
        })
        .select("*")
        .single();

    if (error) {
      console.error(
        "Create explorer folder error:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Gagal membuat folder.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      item: data,
    });
  } catch (error) {
    console.error(
      "Explorer folder API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Terjadi kesalahan pada server.",
      },
      { status: 500 },
    );
  }
}