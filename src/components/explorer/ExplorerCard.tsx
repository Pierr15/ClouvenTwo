"use client";

import Image from "next/image";

import {
  Award,
  BookOpen,
  Download,
  FileText,
  Folder,
  Image as ImageIcon,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

export type ExplorerItemType =
  | "folder"
  | "file"
  | "pdf"
  | "document"
  | "image"
  | "certificate";

  export type ExplorerCategory =
  | "materials"
  | "documentation"
  | "certificates";

interface ExplorerCardProps {
  name: string;
  type: ExplorerItemType;
  category?:ExplorerCategory;
  description?: string;
  size?: string;
  count?: number;
  thumbnail?: string;
  view?: "grid" | "list";
  onClick?: () => void;
  onDownload?: () => void;
  onDownloadZip?: () => void;
  onDelete?: () => void;
}

const typeConfig = {
  folder: {
    icon: Folder,
    iconClass: "text-cyan-400",
    bgClass: "bg-cyan-500/10",
  },
  file: {
    icon: FileText,
    iconClass: "text-slate-400",
    bgClass: "bg-slate-500/10",
  },
  pdf: {
    icon: FileText,
    iconClass: "text-red-400",
    bgClass: "bg-red-500/10",
  },
  document: {
    icon: BookOpen,
    iconClass: "text-blue-400",
    bgClass: "bg-blue-500/10",
  },
  image: {
    icon: ImageIcon,
    iconClass: "text-purple-400",
    bgClass: "bg-purple-500/10",
  },
  certificate: {
    icon: Award,
    iconClass: "text-amber-400",
    bgClass: "bg-amber-500/10",
  },
};

export default function ExplorerCard({
  name,
  type,
  description,
  size,
  count,
  thumbnail,
  view = "grid",
  onClick,
  onDownload,
  onDownloadZip,
  onDelete,
}: ExplorerCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  if (view === "list") {
    return (
      <div className="group flex items-center gap-3 rounded-xl border border-white/5 bg-[#111a2e] p-3 transition-all duration-200 hover:border-cyan-500/20 hover:bg-[#142038]">
        <button
          type="button"
          onClick={onClick}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          {thumbnail ? (
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-900">
              <Image
                src={thumbnail}
                alt={name}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${config.bgClass}`}
            >
              <Icon
                className={`h-5 w-5 ${config.iconClass}`}
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-200">
              {name}
            </p>

            <p className="mt-0.5 truncate text-xs text-slate-600">
              {description ??
                (count !== undefined
                  ? `${count} item`
                  : (size ?? "File"))}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1">
          {size && (
            <span className="hidden text-xs text-slate-600 sm:block">
              {size}
            </span>
          )}

          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white/5 hover:text-cyan-400"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
          )}

          {onDownloadZip &&
            type === "folder" && (
              <button
                type="button"
                onClick={onDownloadZip}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white/5 hover:text-cyan-400"
                title="Download ZIP"
              >
                <Download className="h-4 w-4" />
              </button>
            )}

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
              title="Hapus"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onDelete) {
                onDelete();
              }
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white/5 hover:text-slate-300"
            title="Lainnya"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/5 bg-[#111a2e] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-950/10">
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left"
      >
        {thumbnail ? (
          <div className="relative aspect-video overflow-hidden bg-slate-950">
            <Image
              src={thumbnail}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-[#091120]">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${config.bgClass}`}
            >
              <Icon
                className={`h-7 w-7 ${config.iconClass}`}
              />
            </div>
          </div>
        )}

        <div className="p-4">
          <p className="truncate text-sm font-semibold text-slate-200">
            {name}
          </p>

          <p className="mt-1 truncate text-xs text-slate-600">
            {description ??
              (count !== undefined
                ? `${count} item`
                : (size ?? "File"))}
          </p>
        </div>
      </button>

      {(onDownload ||
        onDownloadZip ||
        onDelete) && (
        <div className="border-t border-white/5 px-4 py-2.5">
          <div className="flex gap-2">
            {onDownload && (
              <button
                type="button"
                onClick={onDownload}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-slate-500 transition hover:bg-cyan-500/5 hover:text-cyan-400"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            )}

            {onDownloadZip &&
              type === "folder" && (
                <button
                  type="button"
                  onClick={onDownloadZip}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-slate-500 transition hover:bg-cyan-500/5 hover:text-cyan-400"
                >
                  <Download className="h-3.5 w-3.5" />
                  ZIP
                </button>
              )}

            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
                title="Hapus"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}