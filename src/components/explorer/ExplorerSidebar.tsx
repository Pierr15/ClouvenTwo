"use client";

import {
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Images,
  Home,
} from "lucide-react";

export type ExplorerSection =
  | "home"
  | "materials"
  | "documentation"
  | "certificates";

interface ExplorerSidebarProps {
  activeSection: ExplorerSection;
  onSectionChange: (section: ExplorerSection) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

const menuItems = [
  {
    id: "home" as const,
    label: "Beranda",
    description: "Ringkasan Explorer",
    icon: Home,
  },
  {
    id: "materials" as const,
    label: "Materi",
    description: "Materi pembelajaran",
    icon: BookOpen,
  },
  {
    id: "documentation" as const,
    label: "Dokumentasi",
    description: "Foto kegiatan kelas",
    icon: Images,
  },
  {
    id: "certificates" as const,
    label: "Sertifikat",
    description: "Sertifikat siswa",
    icon: Award,
  },
];

export default function ExplorerSidebar({
  activeSection,
  onSectionChange,
  collapsed = false,
  onToggle,
}: ExplorerSidebarProps) {
  return (
    <aside
      className={`relative shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-[#0d1628] transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-full min-h-125 flex-col">
        {/* Header */}
        <div
          className={`flex h-16 shrink-0 items-center ${
            collapsed
              ? "justify-center"
              : "justify-between px-4"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
                <FolderOpen className="h-4.5 w-4.5 text-cyan-400" />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Explorer
                </p>

                <p className="text-[10px] text-slate-500">
                  Arsip CLOEV
                </p>
              </div>
            </div>
          )}

          {onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
              aria-label={
                collapsed
                  ? "Buka sidebar Explorer"
                  : "Tutup sidebar Explorer"
              }
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-2 pb-3 scrollbar-none">
          {!collapsed && (
            <p className="mb-2 px-3 pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
              Koleksi
            </p>
          )}

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSectionChange(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`group relative flex w-full items-center rounded-xl transition-all duration-200 ${
                    collapsed
                      ? "justify-center px-0 py-3"
                      : "gap-3 px-3 py-3"
                  } ${
                    active
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-slate-500 hover:bg-white/3 hover:text-slate-200"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 h-6 w-0.5 rounded-full bg-cyan-400" />
                  )}

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                      active
                        ? "bg-cyan-500/10"
                        : "bg-white/3 group-hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>

                  {!collapsed && (
                    <span className="min-w-0 text-left">
                      <span
                        className={`block truncate text-sm font-semibold ${
                          active
                            ? "text-cyan-300"
                            : "text-slate-300"
                        }`}
                      >
                        {item.label}
                      </span>

                      <span className="mt-0.5 block truncate text-[11px] text-slate-600">
                        {item.description}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="shrink-0 p-3">
            <div className="rounded-xl border border-white/5 bg-[#091120] px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                CLOEV Explorer
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Arsip digital XI TKJ 2
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}