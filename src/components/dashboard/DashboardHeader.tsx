"use client";

import Link from "next/link";

import {
  CalendarDays,
  ChevronRight,
  Cloud,
  Settings,
  Sparkles,
} from "lucide-react";

import CurrentDateTime from "./CurrentDateTime";

type Props = {
  fullName: string;
};

export default function DashboardHeader({ fullName }: Props) {
  const hour = new Date().getHours();

  let greeting = "Selamat Malam";

  if (hour >= 5 && hour < 11) {
    greeting = "Selamat Pagi";
  } else if (hour >= 11 && hour < 15) {
    greeting = "Selamat Siang";
  } else if (hour >= 15 && hour < 18) {
    greeting = "Selamat Sore";
  }

  return (
    <header className="relative mb-6 overflow-hidden rounded-3xl border border-blue-500/15 bg-[#111a2e] shadow-xl shadow-blue-950/20">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-28 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl" />

        <div className="absolute -bottom-28 right-1/3 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Top bar */}
      <div className="relative flex items-center justify-between border-b border-white/5 px-5 py-4 sm:px-6">
        {/* CLOEV */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
            <Cloud className="h-5 w-5 text-white" />
          </div>

          <div>
            <p className="text-sm font-bold tracking-[0.16em] text-white">
              CLOEV
            </p>

            <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-slate-500">
              Cloud Eleven
            </p>
          </div>

          <div className="ml-1 hidden items-center gap-1.5 rounded-full border border-cyan-400/10 bg-cyan-400/5 px-2.5 py-1 sm:flex">
            <Sparkles className="h-3 w-3 text-cyan-400" />

            <span className="text-[10px] font-semibold text-cyan-300">
              XI TKJ 2
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden rounded-xl border border-white/5 bg-white/3 px-3 py-2 lg:block">
            <CurrentDateTime />
          </div>

          {/* Profile */}
          <Link
            href="/profile"
            className="group flex items-center gap-2 rounded-xl border border-white/5 bg-white/3 px-2.5 py-2 transition hover:border-cyan-400/20 hover:bg-cyan-400/5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500/20 to-cyan-400/20 text-[10px] font-bold text-cyan-300">
              {getInitials(fullName)}
            </div>

            <div className="hidden max-w-47.5 sm:block">
              <p className="truncate text-xs font-semibold text-white group-hover:text-cyan-300">
                {fullName}
              </p>

              <p className="text-[9px] uppercase tracking-wider text-slate-500">
                Student
              </p>
            </div>

            <ChevronRight className="h-3.5 w-3.5 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-cyan-400" />
          </Link>

          {/* Settings */}
          <Link
            href="/settings"
            aria-label="Pengaturan"
            title="Pengaturan"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/70 text-slate-400 transition hover:border-cyan-500/30 hover:bg-slate-800 hover:text-cyan-400"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative px-5 py-7 sm:px-7 sm:py-8">
        <div className="relative z-10 max-w-4xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-400/5 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/80" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
              Dashboard Siswa
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {greeting},{" "}
            <span className="bg-linear-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              {fullName}!
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Selamat datang di website kelas XI TKJ 2. Kelola jadwal pelajaran,
            tugas, anggota, apel pagi, dan berbagai informasi kelas dari CLOEV.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href="/schedule"
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              <CalendarDays className="h-4 w-4" />
              Lihat Jadwal
              <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/assignments"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-cyan-300"
            >
              Lihat Tugas
            </Link>
          </div>
        </div>

        {/* Decorative cloud */}
        <div className="pointer-events-none absolute -bottom-8.75 -right-4 hidden opacity-20 sm:block">
          <Cloud className="h-48 w-48 stroke-[0.7] text-blue-400" />
        </div>

        <div className="pointer-events-none absolute right-20 top-8 hidden h-20 w-20 rounded-full border border-cyan-400/10 sm:block" />
      </div>
    </header>
  );
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "ST";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
