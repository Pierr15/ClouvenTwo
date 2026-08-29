"use client";

import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

import {
  FileUp,
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

interface ExplorerUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
  parentId: string | null;
  onSuccess: () => void;
}

const MAX_FILE_SIZE =
  50 * 1024 * 1024;

export default function ExplorerUploadDialog({
  open,
  onOpenChange,
  category,
  parentId,
  onSuccess,
}: ExplorerUploadDialogProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [dragging, setDragging] =
    useState(false);

  const selectFile = (selectedFile: File) => {
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(
        "Ukuran file maksimal 50 MB.",
      );
      return;
    }

    setFile(selectedFile);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (selectedFile) {
      selectFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Pilih file terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("category", category);

      if (parentId) {
        formData.append(
          "parentId",
          parentId,
        );
      }

      const response = await fetch(
        "/api/explorer/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
            "Gagal mengupload file.",
        );
      }

      toast.success(
        `"${file.name}" berhasil diupload.`,
      );

      setFile(null);

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
          : "Gagal mengupload file.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!loading) {
      onOpenChange(value);

      if (!value) {
        setFile(null);

        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="border-white/10 bg-[#101b30] text-white">
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10">
            <FileUp className="h-5 w-5 text-cyan-400" />
          </div>

          <DialogTitle className="text-white">
            Upload File
          </DialogTitle>

          <DialogDescription className="text-slate-500">
            Upload file ke lokasi Explorer saat
            ini. Ukuran maksimal 50 MB.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleInputChange}
            disabled={loading}
          />

          {!file ? (
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                inputRef.current?.click()
              }
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() =>
                setDragging(false)
              }
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);

                const droppedFile =
                  event.dataTransfer.files?.[0];

                if (droppedFile) {
                  selectFile(droppedFile);
                }
              }}
              className={`flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center transition ${
                dragging
                  ? "border-cyan-400 bg-cyan-500/10"
                  : "border-white/10 bg-[#091120] hover:border-cyan-500/30 hover:bg-cyan-500/5"
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
                <UploadCloud className="h-7 w-7 text-cyan-400" />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-300">
                Pilih file atau tarik ke sini
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Semua jenis file · Maks. 50 MB
              </p>
            </button>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#091120] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                  <FileUp className="h-5 w-5 text-cyan-400" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {formatFileSize(
                      file.size,
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setFile(null);

                    if (inputRef.current) {
                      inputRef.current.value =
                        "";
                    }
                  }}
                  className="rounded-lg p-2 text-slate-600 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                  aria-label="Hapus file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              handleOpenChange(false)
            }
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={!file || loading}
            onClick={() => void handleUpload()}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            Upload
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatFileSize(
  bytes: number,
): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}