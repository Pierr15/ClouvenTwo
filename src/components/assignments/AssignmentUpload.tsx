"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Download,
  Eye,
  FileUp,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import {
  uploadAssignmentAction,
  getAssignmentSubmissionUrlAction,
  deleteAssignmentSubmissionAction,
} from "@/app/assignments/[id]/actions";

import type { AssignmentSubmission } from "@/services/assignmentSubmissionService";

type Props = {
  assignmentId: number;
  submission: AssignmentSubmission | null;
};

export default function AssignmentUpload({
  assignmentId,
  submission,
}: Props) {
  const router = useRouter();

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [file, setFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  const [openingFile, setOpeningFile] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile =
      event.target.files?.[0];

    setError("");
    setSuccess(false);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const MAX_FILE_SIZE =
      50 * 1024 * 1024;

    if (
      selectedFile.size >
      MAX_FILE_SIZE
    ) {
      setFile(null);
      setError(
        "Ukuran file maksimal 50 MB.",
      );

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    setFile(selectedFile);
  }

  function removeFile() {
    setFile(null);
    setError("");
    setSuccess(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!file) {
      setError(
        "Pilih file tugas terlebih dahulu.",
      );
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();

      formData.append(
        "assignmentId",
        String(assignmentId),
      );

      formData.append(
        "file",
        file,
      );

      const result =
        await uploadAssignmentAction(
          formData,
        );

      if (!result.success) {
        setError(
          result.error ??
            "Gagal mengupload tugas.",
        );

        return;
      }

      setSuccess(true);
      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        "Terjadi kesalahan saat mengupload tugas.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleOpenFile() {
    if (!submission) {
      return;
    }

    setOpeningFile(true);
    setError("");

    try {
      const url =
        await getAssignmentSubmissionUrlAction(
          assignmentId,
        );

      if (!url) {
        setError(
          "File tugas tidak dapat dibuka.",
        );

        return;
      }

      window.open(
        url,
        "_blank",
        "noopener,noreferrer",
      );
    } catch (error) {
      console.error(error);

      setError(
        "Gagal membuka file tugas.",
      );
    } finally {
      setOpeningFile(false);
    }
  }

  async function handleDownload() {
    if (!submission) {
      return;
    }

    setOpeningFile(true);
    setError("");

    try {
      const url =
        await getAssignmentSubmissionUrlAction(
          assignmentId,
        );

      if (!url) {
        setError(
          "File tugas tidak dapat didownload.",
        );

        return;
      }

      const link =
        document.createElement("a");

      link.href = url;
      link.target = "_blank";
      link.rel =
        "noopener noreferrer";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);

      setError(
        "Gagal mendownload file tugas.",
      );
    } finally {
      setOpeningFile(false);
    }
  }

  async function handleDelete() {
    if (!submission) {
      return;
    }

    const confirmed =
      window.confirm(
        "Yakin ingin menghapus pengumpulan tugas ini?",
      );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");
    setSuccess(false);

    try {
      const result =
        await deleteAssignmentSubmissionAction(
          assignmentId,
        );

      if (!result.success) {
        setError(
          result.error ??
            "Gagal menghapus pengumpulan tugas.",
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        "Terjadi kesalahan saat menghapus pengumpulan tugas.",
      );
    } finally {
      setDeleting(false);
    }
  }

  function formatFileSize(
    size: number,
  ) {
    if (size < 1024) {
      return `${size} B`;
    }

    if (
      size <
      1024 * 1024
    ) {
      return `${(
        size / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      size /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }

  return (
    <div className="mt-6 space-y-5">
      {/* Submission yang sudah ada */}
      {submission && (
        <div className="rounded-2xl border border-green-800/40 bg-green-950/20 p-5">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-green-500/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-green-400">
                Tugas sudah dikumpulkan
              </p>

              <p className="mt-2 truncate text-sm font-medium text-white">
                {submission.file_name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Dikumpulkan{" "}
                {new Date(
                  submission.submitted_at,
                ).toLocaleString(
                  "id-ID",
                )}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {/* Lihat */}
                <button
                  type="button"
                  onClick={
                    handleOpenFile
                  }
                  disabled={
                    openingFile ||
                    deleting
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-cyan-500 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {openingFile ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}

                  Lihat File
                </button>

                {/* Download */}
                <button
                  type="button"
                  onClick={
                    handleDownload
                  }
                  disabled={
                    openingFile ||
                    deleting
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {openingFile ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}

                  Download
                </button>

                {/* Hapus */}
                <button
                  type="button"
                  onClick={
                    handleDelete
                  }
                  disabled={
                    deleting ||
                    openingFile
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-red-800/50 bg-red-950/20 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:border-red-500 hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}

                  {deleting
                    ? "Menghapus..."
                    : "Hapus Pengumpulan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!file ? (
        <form
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="assignment-file"
            className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center transition-all duration-300 hover:border-purple-500 hover:bg-purple-950/10"
          >
            <div className="rounded-2xl bg-purple-500/10 p-4 transition-colors group-hover:bg-purple-500/20">
              <FileUp className="h-8 w-8 text-purple-400" />
            </div>

            <h3 className="mt-4 font-semibold text-white">
              {submission
                ? "Upload ulang tugas"
                : "Upload tugas kamu"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Klik untuk memilih file dari perangkat
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Maksimal 50 MB
            </p>

            <input
              ref={inputRef}
              id="assignment-file"
              type="file"
              onChange={
                handleFileChange
              }
              disabled={uploading}
              className="hidden"
            />
          </label>
        </form>
      ) : (
        /* File Terpilih */
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-purple-500/20 bg-purple-950/10 p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-purple-500/10 p-3">
                <FileUp className="h-6 w-6 text-purple-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-white">
                  {file.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {formatFileSize(
                    file.size,
                  )}
                </p>
              </div>

              {!uploading && (
                <button
                  type="button"
                  onClick={
                    removeFile
                  }
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-800 hover:text-red-400"
                  aria-label="Hapus file"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengupload tugas...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />

                  {submission
                    ? "Kumpulkan Revisi"
                    : "Kumpulkan Tugas"}
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-800/40 bg-red-950/20 p-4">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-green-800/40 bg-green-950/20 p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />

          <div>
            <p className="text-sm font-medium text-green-400">
              Tugas berhasil dikumpulkan!
            </p>

            <p className="mt-1 text-xs text-slate-500">
              File kamu sudah tersimpan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}