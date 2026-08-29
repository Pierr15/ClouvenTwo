import { NextResponse } from "next/server";
import JSZip from "jszip";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

import {
  getExplorerItem,
  getExplorerItemsRecursive,
  type ExplorerItem,
} from "@/services/explorerService";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/explorer/:id/download-zip
 *
 * Download sebuah folder beserta seluruh
 * isi dan subfoldernya dalam bentuk ZIP.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    const folder =
      await getExplorerItem(id);

    if (!folder) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Folder tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    if (folder.type !== "folder") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Item yang dipilih bukan folder.",
        },
        { status: 400 },
      );
    }

    const items =
      await getExplorerItemsRecursive(
        folder.id,
      );

    const zip = new JSZip();

    const rootFolder =
      zip.folder(folder.name);

    if (!rootFolder) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Gagal membuat folder ZIP.",
        },
        { status: 500 },
      );
    }

    /*
     * Folder kosong maupun folder yang
     * mempunyai isi tetap dibuat.
     */
    for (const item of items) {
      const zipPath =
        getZipPath(
          folder,
          item,
          items,
        );

      if (item.type === "folder") {
        zip.folder(zipPath);
        continue;
      }

      if (
        item.type === "file" &&
        item.storage_path
      ) {
        const {
          data,
          error,
        } =
          await supabaseAdmin.storage
            .from("explorer")
            .download(
              item.storage_path,
            );

        if (error || !data) {
          console.error(
            "ZIP storage download error:",
            error,
          );

          continue;
        }

        const arrayBuffer =
          await data.arrayBuffer();

        zip.file(
          zipPath,
          arrayBuffer,
        );
      }
    }

    /*
     * Jika folder benar-benar kosong,
     * folder utama tetap ada di ZIP.
     */
    if (items.length === 0) {
      rootFolder.folder(
        ".keep",
      );
    }

    const zipBuffer =
      await zip.generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9,
        },
      });

    const safeName =
      folder.name
        .replace(
          /[<>:"/\\|?*\x00-\x1F]/g,
          "_",
        )
        .trim() ||
      "folder";

    return new NextResponse(
      new Uint8Array(zipBuffer),
      {
        status: 200,
        headers: {
          "Content-Type":
            "application/zip",
          "Content-Disposition":
            `attachment; filename="${safeName}.zip"`,
          "Content-Length":
            String(zipBuffer.length),
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "Explorer ZIP download error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal membuat file ZIP.",
      },
      { status: 500 },
    );
  }
}

/**
 * Membuat path item di dalam ZIP.
 *
 * Contoh:
 *
 * Test Linux/
 * ├── command.txt
 * └── Debian/
 *     └── latihan.pdf
 *
 * Menjadi:
 *
 * Test Linux/command.txt
 * Test Linux/Debian/latihan.pdf
 */
function getZipPath(
  rootFolder: ExplorerItem,
  item: ExplorerItem,
  allItems: ExplorerItem[],
): string {
  const parts: string[] = [
    rootFolder.name,
  ];

  const parents: string[] = [];

  let current:
    | ExplorerItem
    | undefined = item;

  while (
    current &&
    current.parent_id !== null
  ) {
    parents.unshift(
      current.name,
    );

    current = allItems.find(
      (candidate) =>
        candidate.id ===
        current?.parent_id,
    );
  }

  parts.push(...parents);

  if (
    !parts.includes(item.name)
  ) {
    parts.push(item.name);
  }

  return parts.join("/");
}