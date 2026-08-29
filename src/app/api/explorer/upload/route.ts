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

const MAX_FILE_SIZE =
  50 * 1024 * 1024;

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

    const formData =
      await request.formData();

    const file = formData.get(
      "file",
    );

    const categoryValue =
      formData.get("category");

    const parentIdValue =
      formData.get("parentId");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "File tidak ditemukan.",
        },
        { status: 400 },
      );
    }

    const category =
      typeof categoryValue === "string"
        ? categoryValue
        : "";

    const parentId =
      typeof parentIdValue === "string" &&
      parentIdValue.length > 0
        ? parentIdValue
        : null;

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

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Ukuran file maksimal 50 MB.",
        },
        { status: 400 },
      );
    }

    const safeName =
      file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_",
      );

    const fileId =
      crypto.randomUUID();

    const storagePath = [
      category,
      user.id,
      fileId,
      safeName,
    ].join("/");

    const buffer =
      Buffer.from(
        await file.arrayBuffer(),
      );

    const { error: uploadError } =
      await supabaseAdmin.storage
        .from("explorer")
        .upload(
          storagePath,
          buffer,
          {
            contentType:
              file.type ||
              "application/octet-stream",
            upsert: false,
          },
        );

    if (uploadError) {
      console.error(
        "Explorer storage upload error:",
        uploadError,
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Gagal mengupload file.",
        },
        { status: 500 },
      );
    }

    const { data: item, error: dbError } =
      await supabaseAdmin
        .from("explorer_items")
        .insert({
          name: file.name,
          type: "file",
          category,
          parent_id: parentId,
          storage_path: storagePath,
          mime_type:
            file.type ||
            "application/octet-stream",
          file_size: file.size,
          created_by: user.id,
        })
        .select("*")
        .single();

    if (dbError) {
      console.error(
        "Explorer database insert error:",
        dbError,
      );

      await supabaseAdmin.storage
        .from("explorer")
        .remove([storagePath]);

      return NextResponse.json(
        {
          success: false,
          message:
            "File berhasil diupload tetapi gagal dicatat ke Explorer.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error(
      "Explorer upload API error:",
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