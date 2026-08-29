import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/currentUser";

export type ExplorerCategory =
  | "materials"
  | "documentation"
  | "certificates";

export type ExplorerItemType = "file" | "folder";

export interface ExplorerItem {
  id: string;
  name: string;
  type: ExplorerItemType;
  category: ExplorerCategory;
  parent_id: string | null;
  storage_path: string | null;
  file_url: string | null;
  mime_type: string | null;
  file_size: number | null;
  member_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Ambil semua item Explorer kelas.
 */
export async function getExplorerItems(
  category?: ExplorerCategory,
  parentId: string | null = null,
): Promise<ExplorerItem[]> {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  let query = supabaseAdmin
    .from("explorer_items")
    .select("*")
    .order("type", {
      ascending: true,
    })
    .order("name", {
      ascending: true,
    });

  if (category) {
    query = query.eq("category", category);
  }

  if (parentId) {
    query = query.eq("parent_id", parentId);
  } else {
    query = query.is("parent_id", null);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getExplorerItems error:", error);
    return [];
  }

  return (data ?? []) as ExplorerItem[];
}

/**
 * Ambil arsip terbaru dari seluruh kategori Explorer.
 *
 * Digunakan untuk:
 * Explorer > Beranda > Arsip terbaru
 *
 * Data berasal dari:
 * - Materi
 * - Dokumentasi
 * - Sertifikat
 *
 * Arsip milik seluruh siswa tetap bisa muncul,
 * bukan hanya milik user yang sedang login.
 */
export async function getRecentExplorerItems(
  limit = 6,
): Promise<ExplorerItem[]> {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const safeLimit = Math.min(
    Math.max(limit, 1),
    20,
  );

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("explorer_items")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(safeLimit);

  if (error) {
    console.error(
      "getRecentExplorerItems error:",
      error,
    );

    return [];
  }

  return (data ?? []) as ExplorerItem[];
}

/**
 * Ambil satu item berdasarkan ID.
 */
export async function getExplorerItem(
  id: string,
): Promise<ExplorerItem | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from("explorer_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getExplorerItem error:", error);
    return null;
  }

  return data as ExplorerItem | null;
}

/**
 * Alias untuk mengambil item berdasarkan ID.
 *
 * Digunakan oleh API download ZIP.
 */
export async function getExplorerItemById(
  id: string,
): Promise<ExplorerItem | null> {
  return getExplorerItem(id);
}

/**
 * Mengambil seluruh item turunan dari folder
 * secara recursive.
 */
export async function getExplorerItemsRecursive(
  parentId: string,
): Promise<ExplorerItem[]> {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  return getDescendantItems(parentId, user.id);
}

/**
 * Membuat folder baru di Explorer.
 */
export async function createExplorerFolder({
  name,
  category,
  parentId = null,
}: {
  name: string;
  category: ExplorerCategory;
  parentId?: string | null;
}): Promise<ExplorerItem | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const cleanName = name.trim();

  if (!cleanName) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from("explorer_items")
    .insert({
      name: cleanName,
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
    console.error("createExplorerFolder error:", error);
    return null;
  }

  return data as ExplorerItem;
}

/**
 * Membersihkan nama file agar aman digunakan
 * sebagai bagian dari path Storage.
 */
function sanitizeFileName(
  fileName: string,
): string {
  return fileName
    .replace(
      /[<>:"/\\|?*\x00-\x1F]/g,
      "_",
    )
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Upload satu file ke Supabase Storage.
 */
export async function uploadExplorerFile({
  file,
  category,
  parentId = null,
}: {
  file: File;
  category: ExplorerCategory;
  parentId?: string | null;
}): Promise<ExplorerItem | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  if (!file || file.size <= 0) {
    return null;
  }

  const safeName = sanitizeFileName(file.name);

  if (!safeName) {
    return null;
  }

  const storagePath = [
    user.id,
    category,
    `${crypto.randomUUID()}-${safeName}`,
  ].join("/");

  const { error: uploadError } =
    await supabaseAdmin.storage
      .from("explorer")
      .upload(
        storagePath,
        file,
        {
          contentType:
            file.type ||
            "application/octet-stream",
          upsert: false,
        },
      );

  if (uploadError) {
    console.error(
      "uploadExplorerFile storage error:",
      uploadError,
    );

    return null;
  }

  const {
    data,
    error: databaseError,
  } = await supabaseAdmin
    .from("explorer_items")
    .insert({
      name: safeName,
      type: "file",
      category,
      parent_id: parentId,
      storage_path: storagePath,
      file_url: null,
      mime_type:
        file.type ||
        "application/octet-stream",
      file_size: file.size,
      member_id: user.id,
    })
    .select("*")
    .single();

  if (databaseError) {
    console.error(
      "uploadExplorerFile database error:",
      databaseError,
    );

    await supabaseAdmin.storage
      .from("explorer")
      .remove([storagePath]);

    return null;
  }

  return data as ExplorerItem;
}

/**
 * Rename file atau folder.
 */
export async function renameExplorerItem(
  id: string,
  newName: string,
): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  const cleanName = newName.trim();

  if (!cleanName) {
    return false;
  }

  const { error } = await supabaseAdmin
    .from("explorer_items")
    .update({
      name: cleanName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("member_id", user.id);

  if (error) {
    console.error(
      "renameExplorerItem error:",
      error,
    );

    return false;
  }

  return true;
}

/**
 * Mengambil seluruh item turunan folder
 * secara recursive.
 */
async function getDescendantItems(
  parentId: string,
  memberId: string,
): Promise<ExplorerItem[]> {
  const { data, error } = await supabaseAdmin
    .from("explorer_items")
    .select("*")
    .eq("parent_id", parentId)
    .eq("member_id", memberId);

  if (error) {
    console.error(
      "getDescendantItems error:",
      error,
    );

    return [];
  }

  const children =
    (data ?? []) as ExplorerItem[];

  const descendants: ExplorerItem[] = [
    ...children,
  ];

  for (const child of children) {
    if (child.type === "folder") {
      const nested =
        await getDescendantItems(
          child.id,
          memberId,
        );

      descendants.push(...nested);
    }
  }

  return descendants;
}

/**
 * Hapus file atau folder.
 *
 * Jika folder dihapus, seluruh isi folder
 * beserta file Storage di dalamnya ikut dihapus.
 */
export async function deleteExplorerItem(
  id: string,
): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  /*
   * =========================
   * CARI ITEM UTAMA
   * =========================
   */
  const {
    data: item,
    error: itemError,
  } = await supabaseAdmin
    .from("explorer_items")
    .select("*")
    .eq("id", id)
    .eq("member_id", user.id)
    .maybeSingle();

  if (itemError) {
    console.error(
      "deleteExplorerItem item error:",
      itemError,
    );

    return false;
  }

  if (!item) {
    return false;
  }

  const explorerItem =
    item as ExplorerItem;

  /*
   * =========================
   * AMBIL SEMUA TURUNAN
   * =========================
   *
   * Kalau file:
   *   hanya file itu sendiri.
   *
   * Kalau folder:
   *   folder + seluruh isi recursive.
   */
  const descendants =
    explorerItem.type === "folder"
      ? await getDescendantItems(
          id,
          user.id,
        )
      : [];

  const allItems: ExplorerItem[] = [
    explorerItem,
    ...descendants,
  ];

  /*
   * =========================
   * KUMPULKAN STORAGE PATH
   * =========================
   */
  const storagePaths =
    allItems
      .filter(
        (child) =>
          child.type === "file" &&
          Boolean(child.storage_path),
      )
      .map(
        (child) =>
          child.storage_path as string,
      );

  /*
   * =========================
   * HAPUS FILE DARI STORAGE
   * =========================
   */
  if (storagePaths.length > 0) {
    const {
      error: storageError,
    } = await supabaseAdmin.storage
      .from("explorer")
      .remove(storagePaths);

    if (storageError) {
      console.error(
        "deleteExplorerItem storage error:",
        storageError,
      );

      return false;
    }
  }

  /*
   * =========================
   * KUMPULKAN SEMUA ID
   * =========================
   */
  const itemIds = allItems.map(
    (child) => child.id,
  );

  /*
   * =========================
   * HAPUS DATABASE
   * =========================
   *
   * Gunakan .in() agar:
   *
   * folder
   * ├── file
   * ├── subfolder
   * │   └── file
   *
   * semuanya ikut terhapus.
   */
  const {
    error: databaseError,
  } = await supabaseAdmin
    .from("explorer_items")
    .delete()
    .in("id", itemIds)
    .eq("member_id", user.id);

  if (databaseError) {
    console.error(
      "deleteExplorerItem database error:",
      databaseError,
    );

    return false;
  }

  return true;
}

/**
 * Membuat signed URL untuk membuka/download file.
 *
 * Bucket Explorer tetap private.
 */
export async function createExplorerSignedUrl(
  id: string,
): Promise<string | null> {
  const item = await getExplorerItem(id);

  if (
    !item ||
    item.type !== "file" ||
    !item.storage_path
  ) {
    return null;
  }

  const {
    data,
    error,
  } = await supabaseAdmin.storage
    .from("explorer")
    .createSignedUrl(
      item.storage_path,
      60 * 10,
    );

  if (error) {
    console.error(
      "createExplorerSignedUrl error:",
      error,
    );

    return null;
  }

  return data.signedUrl;
}

/**
 * Mengambil arsip Explorer terbaru
 * dari seluruh kategori.
 *
 * Digunakan untuk halaman Beranda Explorer.
 */
export async function getLatestExplorerItems(
  limit = 8,
): Promise<ExplorerItem[]> {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const safeLimit = Math.min(
    Math.max(limit, 1),
    20,
  );

  const { data, error } = await supabaseAdmin
    .from("explorer_items")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(safeLimit);

  if (error) {
    console.error(
      "getLatestExplorerItems error:",
      error,
    );

    return [];
  }

  return (data ?? []) as ExplorerItem[];
}