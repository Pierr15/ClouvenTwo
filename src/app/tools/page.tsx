import Link from "next/link";

import {
  ArrowLeft,
  Binary,
  Calculator,
  CheckCircle2,
  Cpu,
  Globe2,
  QrCode,
  ArrowUpRight,
  Network,
  Sparkles,
} from "lucide-react";

const tools = [
  {
    title: "IP Calculator",
    description:
      "Hitung network address, broadcast, host range, jumlah host, subnet mask, dan prefix IPv4.",
    href: "/tools/ip-calculator",
    icon: Calculator,
    category: "Jaringan",
    status: "Ready",
  },
  {
    title: "Subnet Calculator",
    description:
      "Analisis subnet, prefix, subnet mask, network address, broadcast, dan pembagian host.",
    href: "/tools/subnet-calculator",
    icon: Globe2,
    category: "Subnet",
    status: "Ready",
  },
  {
    title: "Binary Calculator",
    description:
      "Konversi alamat IPv4 antara bentuk desimal dan biner untuk memahami struktur alamat jaringan.",
    href: "/tools/binary",
    icon: Binary,
    category: "Binary",
    status: "Ready",
  },
  {
    title: "IP Validator",
    description:
      "Periksa apakah sebuah alamat merupakan IPv4 atau IPv6 yang valid beserta informasi formatnya.",
    href: "/tools/ip-validator",
    icon: CheckCircle2,
    category: "Validator",
    status: "Ready",
  },
  {
    title: "MAC Address",
    description:
      "Validasi format MAC Address dan analisis informasi dasar perangkat jaringan.",
    href: "/tools/mac-address",
    icon: Cpu,
    category: "MAC",
    status: "Ready",
  },
  {
    title: "QR Code",
    description:
      "Buat QR Code dari teks, alamat jaringan, konfigurasi Wi-Fi, atau informasi lainnya.",
    href: "/tools/qr-code",
    icon: QrCode,
    category: "QR",
    status: "Ready",
  },
];

export default function ToolsPage() {
  const readyCount = tools.filter((tool) => tool.status === "Ready").length;

  return (
    <main className="min-h-screen bg-[#070b12] text-slate-200">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Dashboard
      </Link>
      {/* ==================================================
          HERO
      ================================================== */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0b111b] px-6 py-8 shadow-2xl shadow-cyan-950/10 sm:px-8 sm:py-10">
        {/* Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/5">
              <Network className="h-4 w-4 text-cyan-400" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
              CLOEV Tools
            </span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Network &amp; TKJ Tools
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              Kumpulan tools untuk membantu proses pembelajaran Teknik Komputer
              dan Jaringan. Hitung, validasi, konversi, dan analisis berbagai
              informasi jaringan dalam satu tempat.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-7 flex flex-wrap gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                Total Tools
              </p>

              <p className="mt-1 text-lg font-black text-white">
                {tools.length}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/5 px-4 py-3">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-emerald-500/70">
                Available
              </p>

              <p className="mt-1 text-lg font-black text-emerald-400">
                {readyCount}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                Environment
              </p>

              <p className="mt-1 text-lg font-black text-cyan-400">CLOEV</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION HEADER
      ================================================== */}
      <section className="mt-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />

              <h2 className="text-lg font-bold text-white">Available Tools</h2>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Pilih tools yang ingin digunakan.
            </p>
          </div>

          <div className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
              {readyCount} of {tools.length} ready
            </span>
          </div>
        </div>

        {/* ==================================================
            TOOL GRID
        ================================================== */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const ready = tool.status === "Ready";

            const content = (
              <>
                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                      ready
                        ? "border-cyan-400/10 bg-cyan-400/5 text-cyan-400"
                        : "border-slate-800 bg-slate-900 text-slate-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider ${
                      ready
                        ? "border-emerald-400/10 bg-emerald-400/5 text-emerald-400"
                        : "border-slate-800 bg-slate-900 text-slate-600"
                    }`}
                  >
                    {tool.status}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-6">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                    {tool.category}
                  </p>

                  <h3 className="mt-2 text-base font-bold text-white">
                    {tool.title}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    {tool.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  {ready ? (
                    <>
                      <span className="text-xs font-semibold text-cyan-400">
                        Buka
                      </span>

                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/5 text-cyan-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-medium text-slate-700">
                        Tahap Pengembangan
                      </span>

                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700">
                        Segera Hadir
                      </span>
                    </>
                  )}
                </div>
              </>
            );

            if (ready) {
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-2xl border border-slate-800 bg-[#0b111b] p-5 shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-500/30 hover:bg-[#0d1521] hover:shadow-cyan-950/10"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={tool.href}
                className="cursor-default rounded-2xl border border-slate-900 bg-[#090e16] p-5 opacity-60"
              >
                {content}
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          INFO
      ================================================== */}
      <section className="mt-6 rounded-2xl border border-slate-800 bg-[#0b111b] p-5">
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/5">
            <Network className="h-4 w-4 text-cyan-400" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">
              Alat Jaringan CLOEV
            </h3>

            <p className="mt-1 text-xs leading-6 text-slate-500">
              Tools di halaman ini dirancang untuk membantu praktik dan
              pembelajaran jaringan pada kelas XI TKJ 2. Hasil perhitungan
              jaringan menggunakan library yang sesuai agar perhitungannya lebih
              akurat.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
