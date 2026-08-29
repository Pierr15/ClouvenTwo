import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/currentUser";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteContext,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Kamu harus login terlebih dahulu.",
        },
        {
          status: 401,
        },
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID item tidak valid.",
        },
        {
          status: 400,
        },
      );
    }

    const { data: item, error: itemError } =
      await supabaseAdmin
        .from("explorer_items")
        .select(
          "id, name, type, mime_type, storage_path, category",
        )
        .eq("id", id)
        .maybeSingle();

    if (itemError) {
      console.error(
        "Explorer view item error:",
        itemError,
      );

      return NextResponse.json(
        {
          success: false,
          message: "Gagal mengambil data media.",
        },
        {
          status: 500,
        },
      );
    }

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          message: "Media tidak ditemukan.",
        },
        {
          status: 404,
        },
      );
    }

    if (item.type !== "file") {
      return NextResponse.json(
        {
          success: false,
          message: "Item ini bukan file media.",
        },
        {
          status: 400,
        },
      );
    }

    if (!item.storage_path) {
      return NextResponse.json(
        {
          success: false,
          message: "File tidak memiliki storage path.",
        },
        {
          status: 404,
        },
      );
    }

    const mimeType =
      item.mime_type ?? "";

    const isImage =
      mimeType.startsWith("image/");

    const isVideo =
      mimeType.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          success: false,
          message:
            "File ini bukan foto atau video yang dapat ditampilkan.",
        },
        {
          status: 400,
        },
      );
    }

    const { data: signedData, error: signedError } =
      await supabaseAdmin.storage
        .from("explorer")
        .createSignedUrl(
          item.storage_path,
          60 * 30,
        );

    if (signedError || !signedData?.signedUrl) {
      console.error(
        "Explorer view signed URL error:",
        signedError,
      );

      return NextResponse.json(
        {
          success: false,
          message: "Gagal membuat URL media.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      url: signedData.signedUrl,
      name: item.name,
      type: isVideo
        ? "video"
        : "image",
      mime_type: mimeType,
    });
  } catch (error) {
    console.error(
      "Explorer view route error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat membuka media.",
      },
      {
        status: 500,
      },
    );
  }
}