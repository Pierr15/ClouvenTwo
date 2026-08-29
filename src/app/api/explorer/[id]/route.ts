import { NextResponse } from "next/server";

import {
  deleteExplorerItem,
  getExplorerItem,
  renameExplorerItem,
} from "@/services/explorerService";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/explorer/:id
 */
export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  const { id } = await params;

  const item =
    await getExplorerItem(id);

  if (!item) {
    return NextResponse.json(
      {
        success: false,
        message:
          "File atau folder tidak ditemukan.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    item,
  });
}

/**
 * PATCH /api/explorer/:id
 *
 * Rename file/folder.
 *
 * {
 *   "name": "Nama Baru"
 * }
 */
export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  const { id } = await params;

  const body = await request.json();

  const name =
    typeof body.name === "string"
      ? body.name.trim()
      : "";

  if (!name) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Nama baru wajib diisi.",
      },
      { status: 400 },
    );
  }

  const success =
    await renameExplorerItem(
      id,
      name,
    );

  if (!success) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal mengubah nama item.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
  });
}

/**
 * DELETE /api/explorer/:id
 */
export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  const { id } = await params;

  const success =
    await deleteExplorerItem(id);

  if (!success) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal menghapus item.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
  });
}