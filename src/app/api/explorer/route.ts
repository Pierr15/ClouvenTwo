import { NextResponse } from "next/server";

import {
  createExplorerFolder,
  getExplorerItems,
  getLatestExplorerItems,
  uploadExplorerFile,
  type ExplorerCategory,
} from "@/services/explorerService";

const CATEGORIES: ExplorerCategory[] = [
  "materials",
  "documentation",
  "certificates",
];

function isValidCategory(value: string): value is ExplorerCategory {
  return CATEGORIES.includes(value as ExplorerCategory);
}

/**
 * GET /api/explorer
 *
 * Contoh:
 * /api/explorer
 * /api/explorer?category=materials
 * /api/explorer?category=materials&parentId=xxxxx
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");

    const parentId = searchParams.get("parentId");

    const latest = searchParams.get("latest");

    if (latest === "true") {
      const items = await getLatestExplorerItems(8);

      return NextResponse.json({
        success: true,
        items,
      });
    }

    if (category && !isValidCategory(category)) {
      return NextResponse.json(
        {
          success: false,
          message: "Kategori Explorer tidak valid.",
        },
        { status: 400 },
      );
    }

    const items = await getExplorerItems(
      category ? (category as ExplorerCategory) : undefined,
      parentId || null,
    );

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error("GET /api/explorer error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data Explorer.",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/explorer
 *
 * Membuat folder atau upload file.
 *
 * Folder:
 * Content-Type: application/json
 *
 * {
 *   "action": "create-folder",
 *   "name": "Linux",
 *   "category": "materials",
 *   "parentId": null
 * }
 *
 * File:
 * Content-Type: multipart/form-data
 *
 * file
 * category
 * parentId
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    // =========================
    // CREATE FOLDER
    // =========================

    if (contentType.includes("application/json")) {
      const body = await request.json();

      if (body.action !== "create-folder") {
        return NextResponse.json(
          {
            success: false,
            message: "Action tidak valid.",
          },
          { status: 400 },
        );
      }

      const name = typeof body.name === "string" ? body.name : "";

      const category = typeof body.category === "string" ? body.category : "";

      const parentId = typeof body.parentId === "string" ? body.parentId : null;

      if (!name.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Nama folder wajib diisi.",
          },
          { status: 400 },
        );
      }

      if (!isValidCategory(category)) {
        return NextResponse.json(
          {
            success: false,
            message: "Kategori tidak valid.",
          },
          { status: 400 },
        );
      }

      const folder = await createExplorerFolder({
        name,
        category,
        parentId,
      });

      if (!folder) {
        return NextResponse.json(
          {
            success: false,
            message: "Gagal membuat folder.",
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        item: folder,
      });
    }

    // =========================
    // UPLOAD FILE
    // =========================

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      const file = formData.get("file");

      const categoryValue = formData.get("category");

      const parentIdValue = formData.get("parentId");

      if (!(file instanceof File)) {
        return NextResponse.json(
          {
            success: false,
            message: "File tidak ditemukan.",
          },
          { status: 400 },
        );
      }

      const category = typeof categoryValue === "string" ? categoryValue : "";

      const parentId =
        typeof parentIdValue === "string" && parentIdValue
          ? parentIdValue
          : null;

      if (!isValidCategory(category)) {
        return NextResponse.json(
          {
            success: false,
            message: "Kategori tidak valid.",
          },
          { status: 400 },
        );
      }

      const item = await uploadExplorerFile({
        file,
        category,
        parentId,
      });

      if (!item) {
        return NextResponse.json(
          {
            success: false,
            message: "Gagal mengupload file.",
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        item,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Content-Type tidak didukung.",
      },
      { status: 415 },
    );
  } catch (error) {
    console.error("POST /api/explorer error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 },
    );
  }
}
