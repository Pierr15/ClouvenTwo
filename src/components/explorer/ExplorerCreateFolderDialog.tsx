"use client";

import { useState } from "react";
import { FolderPlus, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExplorerCreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
  parentId: string | null;
  onSuccess: () => void;
}

export default function ExplorerCreateFolderDialog({
  open,
  onOpenChange,
  category,
  parentId,
  onSuccess,
}: ExplorerCreateFolderDialogProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const folderName = name.trim();

    if (!folderName) {
      toast.error("Nama folder wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/explorer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "create-folder",
            name: folderName,
            category,
            parentId,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
            "Gagal membuat folder.",
        );
      }

      toast.success(
        `Folder "${folderName}" berhasil dibuat.`,
      );

      setName("");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal membuat folder.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!loading) {
      onOpenChange(value);

      if (!value) {
        setName("");
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
            <FolderPlus className="h-5 w-5 text-cyan-400" />
          </div>

          <DialogTitle className="text-white">
            Buat Folder Baru
          </DialogTitle>

          <DialogDescription className="text-slate-500">
            Folder akan dibuat di lokasi Explorer
            saat ini.
          </DialogDescription>
        </DialogHeader>

        <div className="py-3">
          <label
            htmlFor="explorer-folder-name"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Nama Folder
          </label>

          <input
            id="explorer-folder-name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !loading
              ) {
                void handleCreate();
              }
            }}
            placeholder="Contoh: Materi Linux"
            autoFocus
            disabled={loading}
            className="h-11 w-full rounded-xl border border-white/10 bg-[#091120] px-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500/40 disabled:opacity-50"
          />
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
            disabled={loading}
            onClick={() => void handleCreate()}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            Buat Folder
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}