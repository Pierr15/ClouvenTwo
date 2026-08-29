"use client";

import {
  FolderPlus,
  FolderUp,
  LayoutGrid,
  List,
  Plus,
  Search,
  Upload,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExplorerHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  onCreateFolder?: () => void;
  onUploadFile?: () => void;
  onUploadFolder?: () => void;
}

export default function ExplorerHeader({
  search,
  onSearchChange,
  view,
  onViewChange,
  onCreateFolder,
  onUploadFile,
  onUploadFolder,
}: ExplorerHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#0d1628] p-4 md:flex-row md:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

        <input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Cari file atau folder..."
          className="h-10 w-full rounded-xl border border-white/5 bg-[#091120] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500/30"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-xl border border-white/5 bg-[#091120] p-1">
          <button
            type="button"
            onClick={() =>
              onViewChange("grid")
            }
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
              view === "grid"
                ? "bg-cyan-500/10 text-cyan-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
            aria-label="Tampilan grid"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              onViewChange("list")
            }
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
              view === "list"
                ? "bg-cyan-500/10 text-cyan-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
            aria-label="Tampilan list"
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-cyan-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">
                Baru
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-52 border-white/10 bg-[#101b30] text-slate-200"
          >
            <DropdownMenuItem
              onClick={onCreateFolder}
              className="cursor-pointer gap-3 focus:bg-white/5 focus:text-white"
            >
              <FolderPlus className="h-4 w-4 text-cyan-400" />

              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  Folder Baru
                </span>

                <span className="text-xs text-slate-500">
                  Buat folder baru
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/5" />

            <DropdownMenuItem
              onClick={onUploadFile}
              className="cursor-pointer gap-3 focus:bg-white/5 focus:text-white"
            >
              <Upload className="h-4 w-4 text-cyan-400" />

              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  Upload File
                </span>

                <span className="text-xs text-slate-500">
                  Maksimal 50 MB
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/5" />

            <DropdownMenuItem
              onClick={onUploadFolder}
              className="cursor-pointer gap-3 focus:bg-white/5 focus:text-white"
            >
              <FolderUp className="h-4 w-4 text-cyan-400" />

              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  Upload Folder
                </span>

                <span className="text-xs text-slate-500">
                  Upload seluruh folder
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}