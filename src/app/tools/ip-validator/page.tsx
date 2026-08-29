"use client";

import Link from "next/link";
import { useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Network,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import {
  validateIPAddress,
  type IPValidatorResult,
} from "@/lib/tools/ipValidator";

export default function IPValidatorPage() {
  const [input, setInput] = useState("");

  const [result, setResult] =
    useState<IPValidatorResult | null>(null);

  const [error, setError] = useState("");

  function handleValidate() {
    setError("");
    setResult(null);

    try {
      const data = validateIPAddress(input);

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "IPv4 tidak valid.",
      );
    }
  }

  function handleReset() {
    setInput("");
    setResult(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#070b12] text-slate-200">
      {/* ==================================================
          BACK TO TOOLS
      ================================================== */}

      <div className="mb-5">
        <Link
          href="/tools"
          className="group inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0b111b] px-3 py-2 text-xs font-medium text-slate-500 transition hover:border-cyan-500/30 hover:bg-[#0d1521] hover:text-cyan-400"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />

          <span>Kembali ke Tools</span>
        </Link>
      </div>

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0b111b] px-6 py-8 shadow-2xl shadow-cyan-950/10 sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/5">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
              CLOEV Network Tools
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            IP Validator
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Periksa validitas alamat IPv4,
            tipe alamat, kelas IP, CIDR,
            subnet mask, dan representasi
            binary dalam satu tempat.
          </p>
        </div>
      </section>

      {/* ==================================================
          VALIDATOR
      ================================================== */}

      <section className="mt-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        {/* ==================================================
            INPUT
        ================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-[#0b111b] p-5 shadow-lg shadow-black/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/5">
              <Network className="h-4 w-4 text-cyan-400" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">
                IP Address Input
              </h2>

              <p className="text-[11px] text-slate-600">
                Masukkan IPv4 atau IPv4/CIDR.
              </p>
            </div>
          </div>

          <label className="mt-6 block">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              IPv4 Address
            </span>

            <input
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleValidate();
                }
              }}
              placeholder="Contoh: 192.168.1.10/24"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
            />
          </label>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleValidate}
              className="flex-1 rounded-xl bg-cyan-500 px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              Validate IP
            </button>

            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-500 transition hover:border-slate-700 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mt-4 flex gap-3 rounded-xl border border-red-400/10 bg-red-400/5 p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

              <div>
                <p className="text-xs font-bold text-red-400">
                  Invalid IPv4
                </p>

                <p className="mt-1 text-[11px] leading-5 text-red-400/70">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* ==================================================
              EXAMPLES
          ================================================== */}

          <div className="mt-6">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
              Contoh
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {[
                "192.168.1.10",
                "192.168.1.10/24",
                "8.8.8.8",
                "127.0.0.1",
              ].map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setInput(example)}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 font-mono text-[10px] text-slate-500 transition hover:border-cyan-500/30 hover:text-cyan-400"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ==================================================
            RESULT
        ================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-[#0b111b] p-5 shadow-lg shadow-black/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">
                Validation Result
              </h2>

              <p className="mt-1 text-[11px] text-slate-600">
                Informasi alamat IP.
              </p>
            </div>

            {result && (
              <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />

                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                  Valid
                </span>
              </div>
            )}
          </div>

          {!result ? (
            <div className="mt-6 flex min-h-80 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40">
              <div className="text-center">
                <Network className="mx-auto h-8 w-8 text-slate-800" />

                <p className="mt-3 text-xs font-medium text-slate-600">
                  Belum ada hasil
                </p>

                <p className="mt-1 text-[10px] text-slate-700">
                  Masukkan IPv4 lalu tekan
                  Validate IP.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ResultItem
                label="IP Address"
                value={result.ipAddress}
                mono
              />

              <ResultItem
                label="Version"
                value={result.version}
              />

              <ResultItem
                label="Address Type"
                value={result.addressType}
                accent
              />

              <ResultItem
                label="IP Class"
                value={`Class ${result.ipClass}`}
              />

              <ResultItem
                label="CIDR Prefix"
                value={
                  result.cidr !== null
                    ? `/${result.cidr}`
                    : "Tidak ditentukan"
                }
              />

              <ResultItem
                label="Subnet Mask"
                value={
                  result.subnetMask ??
                  "Tidak ditentukan"
                }
                mono
              />

              <div className="sm:col-span-2">
                <ResultItem
                  label="Binary"
                  value={result.binary}
                  mono
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          INFORMATION
      ================================================== */}

      <section className="mt-6 rounded-2xl border border-slate-800 bg-[#0b111b] p-5">
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/5">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">
              Tentang IP Validator
            </h3>

            <p className="mt-1 text-xs leading-6 text-slate-500">
              Validator memeriksa struktur IPv4,
              nilai setiap octet, prefix CIDR,
              tipe alamat, kelas IP, subnet mask,
              dan representasi binary.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ==================================================
   RESULT ITEM
================================================== */

function ResultItem({
  label,
  value,
  mono = false,
  accent = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
        {label}
      </p>

      <p
        className={`mt-2 break-all text-sm font-bold ${
          mono ? "font-mono" : ""
        } ${
          accent
            ? "text-cyan-400"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}