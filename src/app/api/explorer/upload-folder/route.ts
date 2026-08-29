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

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const MAX_FILES = 500;

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

    const formData = await request.formData();

    const categoryValue =
      formData.get("category");

    const parentIdValue =
      formData.get("parentId");

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

    const files = formData
      .getAll("files")
      .filter(
        (value): value is File =>
          value instanceof File,
      );

    if (files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Folder tidak berisi file.",
        },
        { status: 400 },
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        {
          success: false,
          message:
            `Maksimal ${MAX_FILES} file dalam satu upload folder.`,
        },
        { status: 400 },
      );
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message:
              `File "${file.name}" melebihi batas 50 MB.`,
          },
          { status: 400 },
        );
      }
    }

    /*
     * Map path folder ke ID explorer_items.
     *
     * Contoh:
     *
     * tugas/
     * tugas/gambar/
     *
     * akan menjadi:
     *
     * {
     *   "tugas": "uuid-folder",
     *   "tugas/gambar": "uuid-folder-gambar"
     * }
     */
    const folderMap = new Map<
      string,
      string
    >();

    const createdItemIds: string[] = [];
    const uploadedStoragePaths: string[] = [];

    /*
     * Ambil semua relative path.
     *
     * Browser biasanya mengirim:
     *
     * Folder Saya/file.pdf
     * Folder Saya/gambar/foto.jpg
     */
    const relativePaths = files.map(
      (file) =>
        getRelativePath(file),
    );

    /*
     * Buat daftar semua folder yang diperlukan.
     */
    const folderPaths = new Set<string>();

    for (const relativePath of relativePaths) {
      const parts =
        splitPath(relativePath);

      /*
       * Bagian terakhir adalah nama file.
       * Semua bagian sebelumnya adalah folder.
       */
      parts.pop();

      let currentPath = "";

      for (const part of parts) {
        currentPath = currentPath
          ? `${currentPath}/${part}`
          : part;

        folderPaths.add(currentPath);
      }
    }

    /*
     * Folder harus dibuat dari parent
     * terdalam ke child.
     */
    const sortedFolders = [
      ...folderPaths,
    ].sort(
      (a, b) =>
        getDepth(a) - getDepth(b),
    );

    /*
     * Buat semua folder di database.
     */
    for (const folderPath of sortedFolders) {
      const parts =
        splitPath(folderPath);

      const folderName =
        parts[parts.length - 1];

      const parentPath =
        parts.length > 1
          ? parts
              .slice(0, -1)
              .join("/")
          : null;

      const explorerParentId =
        parentPath
          ? folderMap.get(parentPath) ??
            null
          : parentId;

      const { data, error } =
        await supabaseAdmin
          .from("explorer_items")
          .insert({
            name: folderName,
            type: "folder",
            category,
            parent_id:
              explorerParentId,
            member_id: user.id,
          })
          .select("id")
          .single();

      if (error || !data) {
        console.error(
          "Create folder error:",
          error,
        );

        await cleanupUpload(
          uploadedStoragePaths,
          createdItemIds,
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "Gagal membuat struktur folder.",
          },
          { status: 500 },
        );
      }

      folderMap.set(
        folderPath,
        data.id,
      );

      createdItemIds.push(data.id);
    }

    /*
     * Upload semua file.
     */
    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      const relativePath =
        relativePaths[index];

      const parts =
        splitPath(relativePath);

      const fileName =
        parts[parts.length - 1];

      const fileFolderPath =
        parts.length > 1
          ? parts
              .slice(0, -1)
              .join("/")
          : null;

      const fileParentId =
        fileFolderPath
          ? folderMap.get(
              fileFolderPath,
            ) ?? null
          : parentId;

      const safeName =
        fileName.replace(
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

      const buffer = Buffer.from(
        await file.arrayBuffer(),
      );

      const {
        error: uploadError,
      } =
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
          "Upload folder storage error:",
          uploadError,
        );

        await cleanupUpload(
          uploadedStoragePaths,
          createdItemIds,
        );

        return NextResponse.json(
          {
            success: false,
            message:
              `Gagal mengupload "${fileName}".`,
          },
          { status: 500 },
        );
      }

      uploadedStoragePaths.push(
        storagePath,
      );

      const { data, error } =
        await supabaseAdmin
          .from("explorer_items")
          .insert({
            name: fileName,
            type: "file",
            category,
            parent_id:
              fileParentId,
            storage_path:
              storagePath,
            mime_type:
              file.type ||
              "application/octet-stream",
            file_size: file.size,
            member_id: user.id,
          })
          .select("id")
          .single();

      if (error || !data) {
        console.error(
          "Insert explorer file error:",
          error,
        );

        await cleanupUpload(
          uploadedStoragePaths,
          createdItemIds,
        );

        return NextResponse.json(
          {
            success: false,
            message:
              `Gagal menyimpan "${fileName}" ke Explorer.`,
          },
          { status: 500 },
        );
      }

      createdItemIds.push(data.id);
    }

    return NextResponse.json({
      success: true,
      message:
        "Folder berhasil diupload.",
      foldersCreated:
        sortedFolders.length,
      filesCreated:
        files.length,
    });
  } catch (error) {
    console.error(
      "Explorer folder upload error:",
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

function getRelativePath(
  file: File,
): string {
  const possiblePath =
    (
      file as File & {
        webkitRelativePath?: string;
      }
    ).webkitRelativePath;

  if (
    possiblePath &&
    possiblePath.trim()
  ) {
    return normalizePath(
      possiblePath,
    );
  }

  return normalizePath(file.name);
}

function normalizePath(
  value: string,
): string {
  return value
    .replaceAll("\\", "/")
    .split("/")
    .filter(Boolean)
    .map((part) =>
      part.replace(
        /[^a-zA-Z0-9._ -]/g,
        "_",
      ),
    )
    .join("/");
}

function splitPath(
  value: string,
): string[] {
  return value
    .split("/")
    .filter(Boolean);
}

function getDepth(
  path: string,
): number {
  return splitPath(path).length;
}

async function cleanupUpload(
  storagePaths: string[],
  itemIds: string[],
) {
  if (storagePaths.length > 0) {
    await supabaseAdmin.storage
      .from("explorer")
      .remove(storagePaths);
  }

  if (itemIds.length > 0) {
    await supabaseAdmin
      .from("explorer_items")
      .delete()
      .in("id", itemIds);
  }
}