"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import { deleteAssignmentAction } from "@/app/assignments/actions";

type Props = {
  assignmentId: number;
  assignmentTitle: string;
};

export default function DeleteAssignmentButton({
  assignmentId,
  assignmentTitle,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  function handleOpen() {
    setError(null);
    setOpen(true);
  }

  function handleClose() {
    if (deleting) return;

    setOpen(false);
    setError(null);
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    try {
      const result =
        await deleteAssignmentAction(
          assignmentId,
        );

      if (!result.success) {
        setError(
          result.error ??
            "Gagal menghapus tugas.",
        );

        return;
      }

      setOpen(false);

      window.location.reload();
    } catch (error) {
      console.error(error);

      setError(
        "Terjadi kesalahan saat menghapus tugas.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Tombol Hapus */}
      <button
        type="button"
        onClick={handleOpen}
        disabled={deleting}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:border-red-500/30 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Hapus
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              handleClose();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-red-500/10 p-3">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>

                <div>
                  <h2 className="font-semibold text-white">
                    Hapus Tugas?
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Tindakan ini bersifat permanen
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={deleting}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-50"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Isi */}
            <div className="p-5">
              <p className="text-sm leading-6 text-slate-400">
                Kamu yakin ingin menghapus tugas:
              </p>

              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-semibold text-white">
                  {assignmentTitle}
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

                  <p className="text-xs leading-5 text-red-300">
                    Tugas, data pengumpulan siswa,
                    dan file submission yang terkait
                    akan dihapus dan tidak dapat
                    dikembalikan.
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-800 bg-slate-950/50 p-5">
              <button
                type="button"
                onClick={handleClose}
                disabled={deleting}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Ya, Hapus Tugas
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}