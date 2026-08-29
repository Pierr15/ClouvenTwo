import { NextResponse } from "next/server";

import {
  createExplorerSignedUrl,
} from "@/services/explorerService";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/explorer/:id/download
 *
 * Membuat signed URL sementara untuk file.
 *
 * Catatan:
 * - File bisa didownload.
 * - Folder belum didownload sebagai ZIP.
 * - Jika ID mengarah ke folder, API akan menolak.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID item tidak ditemukan.",
        },
        { status: 400 },
      );
    }

    const signedUrl =
      await createExplorerSignedUrl(id);

    if (!signedUrl) {
      return NextResponse.json(
        {
          success: false,
          message:
            "File tidak ditemukan atau tidak dapat diakses.",
        },
        { status: 404 },
      );
    }

    return NextResponse.redirect(
      signedUrl,
    );
  } catch (error) {
    console.error(
      "Explorer download error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal menyiapkan download file.",
      },
      { status: 500 },
    );
  }
}