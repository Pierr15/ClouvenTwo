"use client";

import BackButton from "@/components/navigation/BackButton";
import { useState } from "react";
import {
  Calculator,
  RotateCcw,
  Network,
  Binary,
  Copy,
  Check,
} from "lucide-react";

import {
  calculateMACAddress,
  type MACAddressResult,
} from "@/lib/tools/macAddress";

export default function MACAddressPage() {
  const [mac, setMac] = useState("");
  const [result, setResult] = useState<MACAddressResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  function handleCalculate() {
    setError("");
    setResult(null);
    setCopied("");

    try {
      const calculated = calculateMACAddress(mac);

      setResult(calculated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "MAC Address tidak valid.");
    }
  }

  function handleReset() {
    setMac("");
    setResult(null);
    setError("");
    setCopied("");
  }

  async function handleCopy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(label);

      setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch {
      setError("Gagal menyalin data.");
    }
  }

  return (
    <main className="min-h-screen bg-[#070b12] pb-10 text-slate-200">
      {/* ==================================================
          BACK
      ================================================== */}

      <BackButton href="/tools">Kembali ke Tools</BackButton>

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/5">
            <Network className="h-4 w-4 text-cyan-400" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
            Network Tool
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white">
          MAC Address
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Validasi dan analisis MAC Address untuk memahami format hexadecimal,
          jenis alamat, serta struktur MAC Address.
        </p>
      </section>

      {/* ==================================================
          MAIN GRID
      ================================================== */}

      <section className="grid gap-5 xl:grid-cols-[420px_1fr]">
        {/* ==================================================
            INPUT CARD
        ================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-[#0b111b] p-5 shadow-xl shadow-black/10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/5">
              <Network className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">MAC Input</h2>

              <p className="text-[11px] text-slate-500">Masukkan MAC Address</p>
            </div>
          </div>

          {/* INPUT */}

          <div className="mb-5">
            <label
              htmlFor="mac"
              className="mb-2 block text-xs font-semibold text-slate-300"
            >
              MAC Address
            </label>

            <input
              id="mac"
              type="text"
              value={mac}
              onChange={(event) => {
                setMac(event.target.value);
                setError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleCalculate();
                }
              }}
              placeholder="00:1A:2B:3C:4D:5E"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
            />

            <p className="mt-2 text-[10px] text-slate-600">
              Contoh: 00:1A:2B:3C:4D:5E
            </p>
          </div>

          {/* SUPPORTED FORMAT */}

          <div className="mb-6 rounded-xl border border-slate-800/80 bg-slate-950/50 p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
              Format yang didukung
            </p>

            <div className="mt-3 space-y-2 font-mono text-[11px] text-slate-500">
              <p>00:1A:2B:3C:4D:5E</p>
              <p>00-1A-2B-3C-4D-5E</p>
              <p>001A.2B3C.4D5E</p>
              <p>001A2B3C4D5E</p>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-3 text-xs leading-5 text-red-300">
              {error}
            </div>
          )}

          {/* ACTIONS */}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCalculate}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              <Calculator className="h-4 w-4" />
              Calculate
            </button>

            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset"
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 text-slate-500 transition hover:border-slate-700 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ==================================================
            RESULT CARD
        ================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-[#0b111b] p-5 shadow-xl shadow-black/10">
          <div className="mb-6">
            <h2 className="text-sm font-bold text-white">MAC Analysis</h2>

            <p className="mt-1 text-[11px] text-slate-500">
              Informasi MAC Address akan muncul di sini.
            </p>
          </div>

          {!result ? (
            <div className="flex min-h-90 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center">
              <div>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
                  <Network className="h-5 w-5 text-slate-600" />
                </div>

                <p className="text-sm font-semibold text-slate-500">
                  Belum ada hasil
                </p>

                <p className="mt-1 text-xs text-slate-700">
                  Masukkan MAC Address lalu tekan Calculate.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* SUMMARY */}

              <div className="grid gap-3 sm:grid-cols-2">
                <ResultItem
                  label="MAC Address"
                  value={result.colonFormat}
                  copyable
                  copied={copied === "mac"}
                  onCopy={() => handleCopy(result.colonFormat, "mac")}
                />

                <ResultItem label="Address Type" value={result.type} />

                <ResultItem
                  label="Administration"
                  value={result.administration}
                />

                <ResultItem
                  label="OUI"
                  value={result.oui}
                  copyable
                  copied={copied === "oui"}
                  onCopy={() => handleCopy(result.oui, "oui")}
                />
              </div>

              {/* FORMATS */}

              <div>
                <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                  MAC Formats
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <ResultItem label="Colon" value={result.colonFormat} />

                  <ResultItem label="Hyphen" value={result.hyphenFormat} />

                  <ResultItem label="Cisco / Dot" value={result.dotFormat} />

                  <ResultItem label="Compact" value={result.compactFormat} />
                </div>
              </div>

              {/* BINARY */}

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Binary className="h-4 w-4 text-cyan-400" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
                    Binary Representation
                  </p>
                </div>

                <ResultItem
                  label="48-bit Binary"
                  value={result.binary}
                  full
                  copyable
                  copied={copied === "binary"}
                  onCopy={() => handleCopy(result.binary, "binary")}
                />
              </div>

              {/* DEVICE IDENTIFIER */}

              <ResultItem
                label="Device Identifier"
                value={result.deviceIdentifier}
                full
              />
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          INFO
      ================================================== */}

      <section className="mt-5 rounded-2xl border border-slate-800 bg-[#0b111b] p-5">
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/5">
            <Network className="h-4 w-4 text-cyan-400" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">
              Tentang MAC Address
            </h2>

            <p className="mt-1 max-w-3xl text-xs leading-6 text-slate-500">
              MAC Address merupakan alamat identitas pada interface jaringan.
              Tool ini membantu memahami format hexadecimal serta bit yang
              menentukan apakah alamat termasuk Unicast atau Multicast dan
              apakah alamat tersebut menggunakan administrasi lokal atau global.
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
  full = false,
  copyable = false,
  copied = false,
  onCopy,
}: {
  label: string;
  value: string;
  full?: boolean;
  copyable?: boolean;
  copied?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div
      className={`group relative rounded-xl border border-slate-800 bg-slate-950/70 p-4 ${
        full ? "sm:col-span-2" : ""
      }`}
    >
      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
        {label}
      </p>

      <p className="break-all pr-8 font-mono text-sm font-semibold text-cyan-300">
        {value}
      </p>

      {copyable && onCopy && (
        <button
          type="button"
          onClick={onCopy}
          aria-label={`Copy ${label}`}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-600 transition hover:border-cyan-400/20 hover:text-cyan-400"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </div>
  );
}
