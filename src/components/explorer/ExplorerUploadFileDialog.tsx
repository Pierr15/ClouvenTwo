"use client";

import {
  FileUp,
  Loader2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExplorerUploadFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
  parentId: string | null;
  onSuccess: () => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const CERTIFICATE_ACCEPT =
  ".pdf,.jpg,.jpeg,.png";

export default function ExplorerUploadFileDialog({
  open,
  onOpenChange,
  category,
  parentId,
  onSuccess,
}: ExplorerUploadFileDialogProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const isCertificate =
    category === "certificates";

  const acceptedFileTypes =
    isCertificate
      ? CERTIFICATE_ACCEPT
      : undefined;

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error(
        `File "${selectedFile.name}" melebihi batas 50 MB.`,
      );

      event.target.value = "";
      setFile(null);
      return;
    }

    if (isCertificate) {
      const fileName =
        selectedFile.name.toLowerCase();

      const isValidCertificate =
        fileName.endsWith(".pdf") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".png");

      if (!isValidCertificate) {
        toast.error(
          "Sertifikat hanya dapat berupa PDF, JPG, JPEG, atau PNG.",
        );

        event.target.value = "";
        setFile(null);
        return;
      }
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error(
        "Pilih file terlebih dahulu.",
      );

      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "file",
        file,
      );

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

      const response = await fetch(
        "/api/explorer",
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
            "Gagal mengupload file.",
        );
      }

      toast.success(
        `File "${file.name}" berhasil diupload.`,
      );

      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error(
        "Explorer upload file error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mengupload file.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (
    value: boolean,
  ) => {
    if (loading) {
      return;
    }

    onOpenChange(value);

    if (!value) {
      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
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
            {isCertificate
              ? "Upload Sertifikat"
              : "Upload File"}
          </DialogTitle>

          <DialogDescription className="text-slate-500">
            {isCertificate
              ? "Upload sertifikat dalam format PDF, JPG, JPEG, atau PNG. Maksimal 50 MB."
              : "Pilih satu file untuk diupload ke Explorer. Maksimal 50 MB."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-3">
          <input
            ref={inputRef}
            type="file"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
            disabled={loading}
            className="block w-full cursor-pointer rounded-xl border border-white/10 bg-[#091120] p-3 text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-500/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-cyan-400 hover:file:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-50"
          />

          {file && (
            <div className="mt-3 rounded-xl border border-white/5 bg-[#091120] px-4 py-3">
              <p className="truncate text-sm font-medium text-slate-200">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatFileSize(file.size)}
              </p>
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
            disabled={
              loading || !file
            }
            onClick={() =>
              void handleUpload()
            }
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

  if (
    bytes <
    1024 * 1024 * 1024
  ) {
    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }

  return `${(
    bytes /
    (1024 * 1024 * 1024)
  ).toFixed(1)} GB`;
}