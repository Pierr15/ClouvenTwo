"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Cloud,
  Code2,
  Database,
  Layers3,
  Monitor,
  Server,
  Sparkles,
} from "lucide-react";

/* ==================================================
   TECHNOLOGIES
================================================== */

const technologies = [
  {
    name: "Next.js",
    description:
      "Framework React yang digunakan sebagai fondasi utama aplikasi CLOEV.",
    icon: Layers3,
    label: "Framework",
  },
  {
    name: "TypeScript",
    description:
      "Bahasa pemrograman yang memberikan sistem tipe agar kode CLOEV lebih aman dan terstruktur.",
    icon: Code2,
    label: "Language",
  },
  {
    name: "Tailwind CSS",
    description:
      "Utility-first CSS framework yang digunakan untuk membangun tampilan antarmuka CLOEV.",
    icon: Sparkles,
    label: "Styling",
  },
  {
    name: "React",
    description:
      "Library antarmuka yang digunakan untuk membangun berbagai komponen interaktif CLOEV.",
    icon: Monitor,
    label: "UI Library",
  },
  {
    name: "Supabase",
    description:
      "Backend platform yang digunakan untuk database, storage, dan kebutuhan data CLOEV.",
    icon: Database,
    label: "Backend",
  },
];

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#070b12] pb-10 text-slate-200">
      {/* ==================================================
          BACK
      ================================================== */}

      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-cyan-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Dashboard
      </Link>

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0b111b] px-6 py-8 shadow-2xl shadow-cyan-950/10 sm:px-8 sm:py-10">
        {/* Glow */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/5">
              <Cloud className="h-4 w-4 text-cyan-400" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
              CLOEV Information
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Pengaturan
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Informasi mengenai CLOEV, versi aplikasi,
            lingkungan platform, dan teknologi yang
            digunakan dalam pengembangannya.
          </p>
        </div>
      </section>

      {/* ==================================================
          ABOUT CLOEV
      ================================================== */}

      <section className="mt-6 rounded-2xl border border-slate-800 bg-[#0b111b] p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-400/5">
            <Cloud className="h-5 w-5 text-blue-400" />
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-400">
              Tentang CLOEV
            </p>

            <h2 className="mt-2 text-lg font-bold text-white">
              CLOEV — Cloud Eleven
            </h2>

            <p className="mt-3 max-w-4xl text-xs leading-6 text-slate-500">
              CLOEV (Cloud Eleven) adalah platform
              digital yang dirancang untuk mendukung
              aktivitas dan pembelajaran kelas XI TKJ 2.
              Platform ini menggabungkan berbagai
              kebutuhan kelas dalam satu tempat agar
              informasi dapat diakses dengan lebih mudah,
              terorganisir, dan praktis.
            </p>

            <p className="mt-3 max-w-4xl text-xs leading-6 text-slate-500">
              CLOEV dikembangkan sebagai lingkungan
              digital kelas yang mendukung kegiatan
              akademik, pengelolaan informasi, serta
              pembelajaran Teknik Komputer dan Jaringan.
              Setiap bagian dirancang agar dapat
              digunakan dalam aktivitas kelas sehari-hari.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          VERSION
      ================================================== */}

      <section className="mt-5 rounded-2xl border border-slate-800 bg-[#0b111b] p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/5">
            <Server className="h-5 w-5 text-cyan-400" />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-400">
              Versi
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-bold text-white">
                CLOEV v1.0.0
              </h2>

              <span className="rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-emerald-400">
                Stable
              </span>
            </div>

            <p className="mt-3 max-w-4xl text-xs leading-6 text-slate-500">
              Versi utama CLOEV yang menjadi fondasi
              platform kelas. Versi ini mencakup
              lingkungan dashboard, informasi akademik,
              pengelolaan aktivitas kelas, Explorer,
              serta berbagai tools pendukung pembelajaran
              Teknik Komputer dan Jaringan.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          PLATFORM INFORMATION
      ================================================== */}

      <section className="mt-5">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-cyan-400" />

          <div>
            <h2 className="text-sm font-bold text-white">
              Informasi Platform
            </h2>

            <p className="mt-1 text-[11px] text-slate-600">
              Informasi dasar mengenai lingkungan CLOEV.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <InfoCard
            label="Nama"
            value="CLOEV"
          />

          <InfoCard
            label="Kepanjangan"
            value="Cloud Eleven"
          />

          <InfoCard
            label="Platform"
            value="Web Application"
          />

          <InfoCard
            label="Kelas"
            value="XI TKJ 2"
          />

          <InfoCard
            label="Tahun Ajaran"
            value="2026/2027"
          />
        </div>
      </section>

      {/* ==================================================
          TECHNOLOGIES
      ================================================== */}

      <section className="mt-8">
        <div className="mb-5 flex items-center gap-2">
          <Code2 className="h-4 w-4 text-cyan-400" />

          <div>
            <h2 className="text-sm font-bold text-white">
              Teknologi yang Digunakan
            </h2>

            <p className="mt-1 text-[11px] text-slate-600">
              Teknologi utama yang digunakan dalam
              pengembangan CLOEV.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {technologies.map((technology) => {
            const Icon = technology.icon;

            return (
              <div
                key={technology.name}
                className="group rounded-2xl border border-slate-800 bg-[#0b111b] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-500/20 hover:bg-[#0d1521]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/5">
                    <Icon className="h-5 w-5 text-cyan-400 transition group-hover:text-cyan-300" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-600">
                      {technology.label}
                    </p>

                    <h3 className="mt-1 text-sm font-bold text-white">
                      {technology.name}
                    </h3>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-6 text-slate-500">
                  {technology.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          FOOTER INFO
      ================================================== */}

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/5">
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">
              CLOEV
            </h3>

            <p className="mt-1 text-xs leading-6 text-slate-600">
              Cloud Eleven — platform digital untuk
              mendukung aktivitas dan pembelajaran
              kelas XI TKJ 2 tahun ajaran 2026/2027.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ==================================================
   INFO CARD
================================================== */

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0b111b] p-4">
      <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-600">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold text-cyan-400">
        {value}
      </p>
    </div>
  );
}