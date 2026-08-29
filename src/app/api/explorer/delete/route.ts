import { NextResponse } from "next/server";

import {
  deleteExplorerItem,
} from "@/services/explorerService";

export async function DELETE(
  request: Request,
) {
  try {
    const body = await request.json();

    const itemId =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    if (!itemId) {
      return NextResponse.json(
        {
          success: false,
          message: "ID item wajib diisi.",
        },
        { status: 400 },
      );
    }

    const deleted =
      await deleteExplorerItem(itemId);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Gagal menghapus file atau folder. Pastikan kamu memiliki izin untuk menghapus item ini.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      requiresConfirmation: false,
      message:
        "Item berhasil dihapus beserta seluruh isinya.",
    });
  } catch (error) {
    console.error(
      "Explorer delete API error:",
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