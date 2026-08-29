"use client";

import { useCallback, useState } from "react";

import PhotoViewer from "./PhotoViewer";

import {
  AlertTriangle,
  Award,
  BookOpen,
  ChevronRight,
  FileText,
  Folder,
  Images,
  SearchX,
  Trash2,
} from "lucide-react";

import { toast } from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ExplorerCard, { type ExplorerItemType } from "./ExplorerCard";

import ExplorerHeader from "./ExplorerHeader";

import ExplorerSidebar, { type ExplorerSection } from "./ExplorerSidebar";

import ExplorerCreateFolderDialog from "./ExplorerCreateFolderDialog";

import ExplorerUploadFolderDialog from "./ExplorerUploadFolderDialog";

import ExplorerUploadFileDialog from "./ExplorerUploadFileDialog";

type ExplorerCategory = "materials" | "documentation" | "certificates";

type ExplorerItem = {
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
};

type ViewerMedia = {
  src: string;
  alt?: string;
  name?: string;
  type: "image" | "video";
};

const categoryNames: Record<ExplorerCategory, string> = {
  materials: "Materi",
  documentation: "Dokumentasi",
  certificates: "Sertifikat",
};

const sectionConfig: Record<
  ExplorerSection,
  {
    title: string;
    description: string;
  }
> = {
  home: {
    title: "Beranda",
    description: "Pusat arsip digital kelas XI TKJ 2.",
  },

  materials: {
    title: "Materi",
    description: "Materi pembelajaran yang tersedia untuk kelas.",
  },

  documentation: {
    title: "Dokumentasi",
    description: "Kumpulan foto dan dokumentasi kegiatan kelas.",
  },

  certificates: {
    title: "Sertifikat",
    description: "Arsip sertifikat siswa dan kegiatan.",
  },
};

const categoryCards: {
  section: ExplorerSection;
  name: string;
  type: ExplorerItemType;
  description: string;
}[] = [
  {
    section: "materials",
    name: "Materi",
    type: "folder",
    description: "Materi pembelajaran kelas",
  },

  {
    section: "documentation",
    name: "Dokumentasi",
    type: "image",
    description: "Foto dan video kegiatan kelas",
  },

  {
    section: "certificates",
    name: "Sertifikat",
    type: "certificate",
    description: "Sertifikat siswa",
  },
];

export default function ExplorerContent() {
  const [activeSection, setActiveSection] = useState<ExplorerSection>("home");

  const [search, setSearch] = useState("");

  const [view, setView] = useState<"grid" | "list">("grid");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [latestItems, setLatestItems] = useState<ExplorerItem[]>([]);

  const [latestLoading, setLatestLoading] = useState(false);

  const [items, setItems] = useState<ExplorerItem[]>([]);

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const [folderPath, setFolderPath] = useState<ExplorerItem[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [createFolderOpen, setCreateFolderOpen] = useState(false);

  const [uploadFileOpen, setUploadFileOpen] = useState(false);

  const [uploadFolderOpen, setUploadFolderOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ExplorerItem | null>(null);

  const [deleteChildCount, setDeleteChildCount] = useState(0);

  const [viewerOpen, setViewerOpen] = useState(false);

  const [viewerIndex, setViewerIndex] = useState(0);

  const [viewerPhotos, setViewerPhotos] = useState<ViewerMedia[]>([]);

  const loadItems = useCallback(
    async (
      selectedCategory?: ExplorerCategory,
      parentId: string | null = null,
    ) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        if (selectedCategory) {
          params.set("category", selectedCategory);
        }

        if (parentId) {
          params.set("parentId", parentId);
        }

        const query = params.toString();

        const response = await fetch(
          `/api/explorer${query ? `?${query}` : ""}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message ?? "Gagal mengambil data Explorer.");
        }

        setItems((result.items ?? []) as ExplorerItem[]);
      } catch (fetchError) {
        console.error("Explorer fetch error:", fetchError);

        setItems([]);

        setError("Gagal memuat data Explorer.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const loadLatestItems = useCallback(async () => {
    try {
      setLatestLoading(true);

      const response = await fetch("/api/explorer?latest=true", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Gagal mengambil arsip terbaru.");
      }

      setLatestItems((result.items ?? []) as ExplorerItem[]);
    } catch (latestError) {
      console.error("Latest explorer fetch error:", latestError);

      setLatestItems([]);
    } finally {
      setLatestLoading(false);
    }
  }, []);

  const handleSectionChange = (section: ExplorerSection) => {
    setActiveSection(section);
    setSearch("");
    setCurrentFolderId(null);
    setFolderPath([]);

    if (section === "home") {
      void loadItems();
      void loadLatestItems();
      return;
    }

    void loadItems(section as ExplorerCategory, null);
  };

  const openFolder = (folder: ExplorerItem) => {
    if (folder.type !== "folder") {
      return;
    }

    setCurrentFolderId(folder.id);

    setFolderPath((current) => [...current, folder]);

    void loadItems(folder.category, folder.id);
  };

  const goToRoot = () => {
    setCurrentFolderId(null);
    setFolderPath([]);

    if (activeSection === "home") {
      void loadItems();
      return;
    }

    void loadItems(activeSection as ExplorerCategory, null);
  };

  const goToFolder = (index: number) => {
    const targetFolder = folderPath[index];

    if (!targetFolder) {
      return;
    }

    const newPath = folderPath.slice(0, index + 1);

    setFolderPath(newPath);

    setCurrentFolderId(targetFolder.id);

    void loadItems(targetFolder.category, targetFolder.id);
  };

  const handleRetry = () => {
    if (currentFolderId) {
      const currentFolder = folderPath[folderPath.length - 1];

      if (currentFolder) {
        void loadItems(currentFolder.category, currentFolder.id);

        return;
      }
    }

    if (activeSection === "home") {
      void loadItems();
      return;
    }

    void loadItems(activeSection as ExplorerCategory, null);
  };

  const handleCreateFolderSuccess = () => {
    handleRetry();
  };

  const handleUploadFileSuccess = () => {
    handleRetry();
  };

  const handleUploadFolderSuccess = () => {
    handleRetry();
  };

  const handleDownload = (item: ExplorerItem) => {
    const endpoint =
      item.type === "folder"
        ? `/api/explorer/${item.id}/download-zip`
        : `/api/explorer/${item.id}/download`;

    const link = document.createElement("a");

    link.href = endpoint;
    link.download = "";

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

  const handleOpenMedia = async (selectedItem: ExplorerItem) => {
    const isImage =
      selectedItem.mime_type?.startsWith("image/") ||
      selectedItem.type === "image";

    const isVideo = selectedItem.mime_type?.startsWith("video/");

    if (!isImage && !isVideo) {
      return;
    }

    try {
      const response = await fetch(`/api/explorer/${selectedItem.id}/view`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.url) {
        throw new Error(result.message ?? "Gagal membuka media.");
      }

      setViewerPhotos([
        {
          src: result.url,
          alt: selectedItem.name,
          name: selectedItem.name,
          type: isVideo ? "video" : "image",
        },
      ]);

      setViewerIndex(0);
      setViewerOpen(true);
    } catch (openError) {
      console.error("Open explorer media error:", openError);

      toast.error(
        openError instanceof Error ? openError.message : "Gagal membuka media.",
      );
    }
  };

  const handleDeleteClick = async (item: ExplorerItem) => {
    try {
      setDeleteLoading(true);
      setDeleteTarget(item);
      setDeleteChildCount(0);

      if (item.type !== "folder") {
        setDeleteDialogOpen(true);

        return;
      }

      const params = new URLSearchParams();

      params.set("category", item.category);

      params.set("parentId", item.id);

      const response = await fetch(`/api/explorer?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Gagal memeriksa isi folder.");
      }

      const children = (result.items ?? []) as ExplorerItem[];

      setDeleteChildCount(children.length);

      setDeleteDialogOpen(true);
    } catch (deleteCheckError) {
      console.error("Check delete target error:", deleteCheckError);

      toast.error(
        deleteCheckError instanceof Error
          ? deleteCheckError.message
          : "Gagal memeriksa item.",
      );

      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleteLoading(true);

      const response = await fetch("/api/explorer/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: deleteTarget.id,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Gagal menghapus item.");
      }

      toast.success(
        deleteTarget.type === "folder"
          ? `Folder "${deleteTarget.name}" berhasil dihapus.`
          : `File "${deleteTarget.name}" berhasil dihapus.`,
      );

      setDeleteDialogOpen(false);

      setDeleteTarget(null);

      setDeleteChildCount(0);

      handleRetry();
    } catch (deleteError) {
      console.error("Delete explorer item error:", deleteError);

      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus item.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    if (deleteLoading) {
      return;
    }

    setDeleteDialogOpen(open);

    if (!open) {
      setDeleteTarget(null);
      setDeleteChildCount(0);
    }
  };

  const filteredItems = search.trim()
    ? items.filter((item) =>
        item.name.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : items;

  const isHome = activeSection === "home" && !currentFolderId;

  const displayedItems = isHome ? [] : filteredItems;

  const config = sectionConfig[activeSection];

  const hasFolderPath = folderPath.length > 0;

  const currentCategory =
    activeSection === "home"
      ? "materials"
      : (activeSection as ExplorerCategory);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#0a1020]">
      {/* HEADER */}
      <div className="shrink-0 px-4 pt-5 md:px-6 lg:px-8">
        <div className="mx-auto max-w-350">
          <ExplorerHeader
            search={search}
            onSearchChange={setSearch}
            view={view}
            onViewChange={setView}
            onCreateFolder={() => setCreateFolderOpen(true)}
            onUploadFile={() => setUploadFileOpen(true)}
            onUploadFolder={() => setUploadFolderOpen(true)}
          />
        </div>
      </div>

      {/* MAIN */}
      <div className="min-h-0 flex-1 px-4 pb-6 md:px-6 lg:px-8">
        <div className="mx-auto flex h-full min-h-0 max-w-350 gap-5">
          {/* SIDEBAR */}
          <ExplorerSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((current) => !current)}
          />

          {/* CONTENT */}
          <section className="min-w-0 flex-1 overflow-y-auto rounded-2xl border border-white/5 bg-[#0d1628] p-5 scrollbar-none md:p-6">
            {/* TITLE */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">
                {currentFolderId
                  ? folderPath[folderPath.length - 1]?.name
                  : config.title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {currentFolderId
                  ? `Folder ${config.title}`
                  : config.description}
              </p>
            </div>

            {/* BREADCRUMB */}
            {hasFolderPath && (
              <div className="mb-6 flex items-center gap-1 overflow-x-auto rounded-xl border border-white/5 bg-[#091120] px-4 py-3 scrollbar-none">
                <button
                  type="button"
                  onClick={goToRoot}
                  className="shrink-0 text-sm font-medium text-slate-400 transition hover:text-cyan-400"
                >
                  {activeSection === "home"
                    ? "Beranda"
                    : categoryNames[activeSection as ExplorerCategory]}
                </button>

                {folderPath.map((folder, index) => (
                  <div
                    key={folder.id}
                    className="flex shrink-0 items-center gap-1"
                  >
                    <ChevronRight className="h-4 w-4 text-slate-700" />

                    <button
                      type="button"
                      onClick={() => goToFolder(index)}
                      className={
                        index === folderPath.length - 1
                          ? "text-sm font-semibold text-white"
                          : "text-sm text-slate-400 transition hover:text-cyan-400"
                      }
                    >
                      {folder.name}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* HOME */}
            {isHome && (
              <>
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryCards.map((card) => (
                    <ExplorerCard
                      key={card.section}
                      name={card.name}
                      type={card.type}
                      description={card.description}
                      count={0}
                      onClick={() => handleSectionChange(card.section)}
                    />
                  ))}
                </div>

                <div>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-cyan-400" />

                      <h3 className="text-sm font-bold text-slate-200">
                        Arsip terbaru
                      </h3>
                    </div>

                    <span className="text-[11px] text-slate-600">Terbaru</span>
                  </div>

                  {latestLoading ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-28 animate-pulse rounded-xl border border-white/5 bg-[#091120]"
                        />
                      ))}
                    </div>
                  ) : latestItems.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/5 bg-[#091120] px-5 py-8 text-center">
                      <FileText className="mx-auto h-7 w-7 text-slate-700" />

                      <p className="mt-3 text-sm font-medium text-slate-400">
                        Belum ada arsip.
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Materi, dokumentasi, dan sertifikat akan muncul di sini.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {latestItems.map((item) => (
                        <LatestExplorerCard
                          key={item.id}
                          item={item}
                          onClick={() => {
                            if (item.type === "folder") {
                              handleSectionChange(item.category);

                              return;
                            }

                            handleSectionChange(item.category);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* LOADING */}
            {!isHome && loading && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-36 animate-pulse rounded-2xl border border-white/5 bg-[#091120]"
                  />
                ))}
              </div>
            )}

            {/* ERROR */}
            {!isHome && !loading && error && (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-red-500/10 bg-[#091120] px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/5">
                  <SearchX className="h-6 w-6 text-red-400" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-300">
                  Tidak dapat memuat Explorer
                </p>

                <p className="mt-1 text-xs text-slate-600">{error}</p>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-4 rounded-lg bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-500/15"
                >
                  Coba lagi
                </button>
              </div>
            )}

            {/* ITEMS */}
            {!isHome && !loading && !error && (
              <>
                {displayedItems.length > 0 ? (
                  <div
                    className={
                      view === "grid"
                        ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        : "space-y-2"
                    }
                  >
                    {displayedItems.map((item) => {
                      const isImage =
                        item.mime_type?.startsWith("image/") ||
                        item.type === "image";

                      const isVideo = item.mime_type?.startsWith("video/");

                      const isMedia = isImage || isVideo;

                      return (
                        <ExplorerCard
                          key={item.id}
                          name={item.name}
                          type={item.type}
                          category={item.category}
                          view={view}
                          size={
                            item.file_size
                              ? formatFileSize(item.file_size)
                              : undefined
                          }
                          onClick={() => {
                            if (item.type === "folder") {
                              openFolder(item);

                              return;
                            }

                            if (isMedia) {
                              void handleOpenMedia(item);
                            }
                          }}
                          onDownload={() => void handleDownload(item)}
                          onDelete={() => void handleDeleteClick(item)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <EmptyExplorer
                    section={activeSection}
                    title={config.title}
                    hasSearch={Boolean(search.trim())}
                  />
                )}
              </>
            )}
          </section>
        </div>
      </div>

      {/* PHOTO / VIDEO VIEWER */}
      <PhotoViewer
        open={viewerOpen}
        photos={viewerPhotos}
        initialIndex={viewerIndex}
        onClose={() => setViewerOpen(false)}
      />

      {/* CREATE FOLDER */}
      <ExplorerCreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        category={currentCategory}
        parentId={currentFolderId}
        onSuccess={handleCreateFolderSuccess}
      />

      {/* UPLOAD FILE */}
      <ExplorerUploadFileDialog
        open={uploadFileOpen}
        onOpenChange={setUploadFileOpen}
        category={currentCategory}
        parentId={currentFolderId}
        onSuccess={handleUploadFileSuccess}
      />

      {/* UPLOAD FOLDER */}
      <ExplorerUploadFolderDialog
        open={uploadFolderOpen}
        onOpenChange={setUploadFolderOpen}
        category={currentCategory}
        parentId={currentFolderId}
        onSuccess={handleUploadFolderSuccess}
      />

      {/* DELETE CONFIRMATION */}
      <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="border-white/10 bg-[#101b30] text-slate-200 sm:max-w-md">
          <DialogHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>

            <DialogTitle className="text-white">
              Konfirmasi Penghapusan
            </DialogTitle>

            <DialogDescription className="text-slate-500">
              {deleteTarget?.type === "folder"
                ? deleteChildCount > 0
                  ? `Folder "${deleteTarget.name}" masih berisi ${deleteChildCount} item. Menghapus folder ini juga akan menghapus seluruh isi di dalamnya.`
                  : `Folder "${deleteTarget.name}" kosong. Apakah kamu yakin ingin menghapusnya?`
                : `File "${deleteTarget?.name}" akan dihapus secara permanen dari Explorer.`}
            </DialogDescription>
          </DialogHeader>

          {deleteTarget?.type === "folder" && deleteChildCount > 0 && (
            <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 px-4 py-3">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                <div>
                  <p className="text-sm font-semibold text-amber-300">
                    Perhatian
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Folder ini tidak kosong. Pastikan seluruh file dan folder di
                    dalamnya memang sudah tidak diperlukan.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              disabled={deleteLoading}
              onClick={() => handleDeleteDialogChange(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/10 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="button"
              disabled={deleteLoading || !deleteTarget}
              onClick={() => void handleDeleteConfirm()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />

              {deleteLoading ? "Menghapus..." : "Hapus"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmptyExplorer({
  section,
  title,
  hasSearch,
}: {
  section: ExplorerSection;
  title: string;
  hasSearch: boolean;
}) {
  const Icon =
    section === "materials"
      ? BookOpen
      : section === "documentation"
        ? Images
        : section === "certificates"
          ? Award
          : Folder;

  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/5 bg-[#091120] px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/5">
        {hasSearch ? (
          <SearchX className="h-6 w-6 text-slate-600" />
        ) : (
          <Icon className="h-6 w-6 text-cyan-400" />
        )}
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-300">
        {hasSearch ? "Tidak ditemukan" : "Belum ada data"}
      </p>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-600">
        {hasSearch
          ? "Coba gunakan kata pencarian yang berbeda."
          : `Belum ada ${title.toLowerCase()} yang ditambahkan ke Explorer CLOEV.`}
      </p>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function LatestExplorerCard({
  item,
  onClick,
}: {
  item: ExplorerItem;
  onClick: () => void;
}) {
  const categoryLabel = categoryNames[item.category];

  const isImage = item.mime_type?.startsWith("image/");

  const isVideo = item.mime_type?.startsWith("video/");

  const Icon = isImage
    ? Images
    : isVideo
      ? Images
      : item.category === "materials"
        ? BookOpen
        : item.category === "certificates"
          ? Award
          : FileText;

  const date = new Date(item.created_at);

  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-xl border border-white/5 bg-[#091120] p-4 text-left transition-all duration-200 hover:border-cyan-500/20 hover:bg-cyan-500/5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
          <Icon className="h-4.5 w-4.5 text-cyan-400" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-200 transition-colors group-hover:text-cyan-300">
            {item.name}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">{categoryLabel}</p>

          <p className="mt-2 text-[10px] text-slate-600">{formattedDate}</p>
        </div>

        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-700 transition-transform group-hover:translate-x-0.5 group-hover:text-cyan-400" />
      </div>
    </button>
  );
}
