import Link from "next/link";

import {
  Users,
  CalendarDays,
  ClipboardList,
  FolderOpen,
  Wrench,
  UserCircle,
  Megaphone,
  Terminal,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const menus = [
  {
    title: "Anggota",
    description: "Daftar siswa XI TKJ 2",
    href: "/members",
    icon: Users,
  },
  {
    title: "Pelajaran",
    description: "Jadwal pelajaran kelas",
    href: "/schedule",
    icon: CalendarDays,
  },
  {
    title: "Tugas",
    description: "Tugas dan pekerjaan kelas",
    href: "/assignments",
    icon: ClipboardList,
  },
  {
    title: "Explorer",
    description: "File dan dokumen kelas",
    href: "/explorer",
    icon: FolderOpen,
  },
  {
    title: "Alat",
    description: "Berbagai tools CLOEV",
    href: "/tools",
    icon: Wrench,
  },
  {
    title: "Profil",
    description: "Informasi akun kamu",
    href: "/profile",
    icon: UserCircle,
  },
  {
    title: "Apel",
    description: "Informasi dan jadwal apel",
    href: "/apel",
    icon: Megaphone,
  },
  {
    title: "Terminal",
    description: "Linux simulator CLOEV",
    href: "/terminal",
    icon: Terminal,
  },
];

export default function QuickMenu() {
  return (
    <Card className="overflow-hidden border-blue-500/10 bg-[#111a2e] shadow-xl shadow-blue-950/10">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">
              Navigasi CLOEV
            </p>

            <h2 className="text-xl font-bold tracking-tight text-white">
              Menu Halaman
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Akses cepat ke berbagai fitur CLOEV.
            </p>
          </div>

          <div className="hidden rounded-lg border border-white/5 bg-white/3 px-2.5 py-1.5 sm:block">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
              Quick Access
            </span>
          </div>
        </div>

        {/* Menu */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <Link
                key={menu.title}
                href={menu.href}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-[#101b2d] hover:shadow-lg hover:shadow-blue-950/20"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-cyan-400/5 blur-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                <div className="relative flex items-center gap-3">
                  {/* Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/5 transition-colors group-hover:border-cyan-400/20 group-hover:bg-cyan-400/10">
                    <Icon className="h-4.5 w-4.5 text-cyan-400 transition-transform duration-200 group-hover:scale-110" />
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-200 transition-colors group-hover:text-white">
                      {menu.title}
                    </h3>

                    <p className="mt-0.5 truncate text-[10px] text-slate-500 group-hover:text-slate-400">
                      {menu.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-700 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-cyan-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}