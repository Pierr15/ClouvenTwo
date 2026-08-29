"use client";

import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

import {
  FolderUp,
  Loader2,
  UploadCloud,
  X,
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

interface ExplorerUploadFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
  parentId: string | null;
  onSuccess: () => void;
}

const MAX_FILE_SIZE =
  50 * 1024 * 1024;

const MAX_FILES = 500;

export default function ExplorerUploadFolderDialog({
  open,
  onOpenChange,
  category,
  parentId,
  onSuccess,
}: ExplorerUploadFolderDialogProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [files, setFiles] =
    useState<File[]>([]);

  const [loading, setLoading] =
    useState(false);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(
      event.target.files ?? [],
    );

    if (selectedFiles.length === 0) {
      return;
    }

    if (selectedFiles.length > MAX_FILES) {
      toast.error(
        `Maksimal ${MAX_FILES} file dalam satu folder.`,
      );
      return;
    }

    const oversizedFile =
      selectedFiles.find(
        (file) =>
          file.size > MAX_FILE_SIZE,
      );

    if (oversizedFile) {
      toast.error(
        `File "${oversizedFile.name}" melebihi batas 50 MB.`,
      );
      return;
    }

    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error(
        "Pilih folder terlebih dahulu.",
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "category",
        category,
      );

      if (parentId) {
        formData.append(
          "parentId",
          parentId,
        );
      }

      files.forEach((file) => {
        formData.append(
          "files",
          file,
        );
      });

      const response = await fetch(
        "/api/explorer/upload-folder",
        {
          method: "POST",
          body: formData,
        },
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ??
            "Gagal mengupload folder.",
        );
      }

      toast.success(
        `Folder berhasil diupload. ${result.filesCreated} file dan ${result.foldersCreated} folder ditambahkan.`,
      );

      setFiles([]);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mengupload folder.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (
    value: boolean,
  ) => {
    if (loading) {
      return;
    }

    onOpenChange(value);

    if (!value) {
      setFiles([]);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const rootFolderName =
    getRootFolderName(files);

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent className="border-white/10 bg-[#101b30] text-white">
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
            <FolderUp className="h-5 w-5 text-cyan-400" />
          </div>

          <DialogTitle className="text-white">
            Upload Folder
          </DialogTitle>

          <DialogDescription className="text-slate-500">
            Pilih folder dari perangkatmu.
            Struktur subfolder akan tetap
            dipertahankan di Explorer.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3">
          <input
            ref={inputRef}
            type="file"
            // @ts-expect-error webkitdirectory
            webkitdirectory=""
            multiple
            className="hidden"
            onChange={handleInputChange}
            disabled={loading}
          />

          {files.length === 0 ? (
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                inputRef.current?.click()
              }
              className="flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#091120] px-6 text-center transition hover:border-cyan-500/30 hover:bg-cyan-500/5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
                <UploadCloud className="h-7 w-7 text-cyan-400" />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-300">
                Pilih Folder
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Maksimal 500 file · 50 MB per file
              </p>
            </button>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#091120] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                  <FolderUp className="h-5 w-5 text-cyan-400" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {rootFolderName}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {files.length} file ditemukan
                  </p>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setFiles([]);

                    if (inputRef.current) {
                      inputRef.current.value =
                        "";
                    }
                  }}
                  className="rounded-lg p-2 text-slate-600 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                  aria-label="Batalkan pilihan folder"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 rounded-xl border border-white/5 bg-[#0d1628] px-4 py-3">
                <p className="text-xs leading-5 text-slate-500">
                  Struktur folder akan dipertahankan
                  saat disimpan ke Explorer.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              handleClose(false)
            }
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={
              files.length === 0 ||
              loading
            }
            onClick={() =>
              void handleUpload()
            }
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            Upload Folder
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getRootFolderName(
  files: File[],
): string {
  if (files.length === 0) {
    return "Folder";
  }

  const file =
    files[0] as File & {
      webkitRelativePath?: string;
    };

  const relativePath =
    file.webkitRelativePath;

  if (!relativePath) {
    return "Folder";
  }

  return (
    relativePath.split("/")[0] ??
    "Folder"
  );
}