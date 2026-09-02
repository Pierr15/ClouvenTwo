"use client";

import BackButton from "@/components/navigation/BackButton";
import { useState } from "react";
import {
  Binary,
  Calculator,
  Network,
  RotateCcw,
  ArrowRightLeft,
} from "lucide-react";

import {
  binaryToIPv4,
  ipv4ToBinary,
  type BinaryCalculatorResult,
} from "@/lib/tools/binaryCalculator";

type Mode = "decimal" | "binary";

export default function BinaryCalculatorPage() {
  const [mode, setMode] = useState<Mode>("decimal");

  const [input, setInput] = useState("");

  const [result, setResult] = useState<BinaryCalculatorResult | null>(null);

  const [error, setError] = useState("");

  function handleCalculate() {
    setError("");
    setResult(null);

    try {
      const calculated =
        mode === "decimal" ? ipv4ToBinary(input) : binaryToIPv4(input);

      setResult(calculated);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Input tidak valid.");
    }
  }

  function handleReset() {
    setInput("");
    setResult(null);
    setError("");
  }

  function handleSwapMode() {
    setMode((current) => (current === "decimal" ? "binary" : "decimal"));

    setInput("");
    setResult(null);
    setError("");
  }

  const placeholder =
    mode === "decimal"
      ? "Contoh: 192.168.1.10"
      : "Contoh: 11000000.10101000.00000001.00001010";

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
            <Binary className="h-4 w-4 text-cyan-400" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
            Network Tool
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white">
          Binary Calculator
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Konversi alamat IPv4 antara bentuk desimal dan binary untuk membantu
          memahami struktur alamat jaringan dan setiap oktetnya.
        </p>
      </section>

      {/* ==================================================
          CALCULATOR
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
              <h2 className="text-sm font-bold text-white">Binary Input</h2>

              <p className="text-[11px] text-slate-500">Masukkan alamat IPv4</p>
            </div>
          </div>

          {/* ==================================================
              MODE
          ================================================== */}

          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold text-slate-300">
              Conversion Mode
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode("decimal");
                  setInput("");
                  setResult(null);
                  setError("");
                }}
                className={`rounded-xl border px-3 py-3 text-xs font-semibold transition ${
                  mode === "decimal"
                    ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                    : "border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-300"
                }`}
              >
                IPv4 → Binary
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("binary");
                  setInput("");
                  setResult(null);
                  setError("");
                }}
                className={`rounded-xl border px-3 py-3 text-xs font-semibold transition ${
                  mode === "binary"
                    ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                    : "border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-300"
                }`}
              >
                Binary → IPv4
              </button>
            </div>
          </div>

          {/* ==================================================
              INPUT
          ================================================== */}

          <div className="mb-6">
            <label
              htmlFor="binary-input"
              className="mb-2 block text-xs font-semibold text-slate-300"
            >
              {mode === "decimal" ? "IPv4 Address" : "Binary IPv4"}
            </label>

            <input
              id="binary-input"
              type="text"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleCalculate();
                }
              }}
              placeholder={placeholder}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
            />

            <p className="mt-2 text-[10px] text-slate-600">
              {mode === "decimal"
                ? "Format: xxx.xxx.xxx.xxx"
                : "Format: 8bit.8bit.8bit.8bit"}
            </p>
          </div>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-3 text-xs leading-5 text-red-300">
              {error}
            </div>
          )}

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCalculate}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-400"
            >
              <Calculator className="h-4 w-4" />
              Convert
            </button>

            <button
              type="button"
              onClick={handleSwapMode}
              aria-label="Tukar mode"
              title="Tukar mode"
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 text-slate-500 transition hover:border-slate-700 hover:text-white"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset"
              title="Reset"
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
            <h2 className="text-sm font-bold text-white">Calculation Result</h2>

            <p className="mt-1 text-[11px] text-slate-500">
              Hasil konversi dan informasi setiap oktet.
            </p>
          </div>

          {!result ? (
            <EmptyResult />
          ) : (
            <div className="space-y-4">
              {/* Main result */}

              <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-4">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                  IPv4
                </p>

                <p className="break-all font-mono text-lg font-bold text-white">
                  {result.ip}
                </p>

                <div className="my-4 h-px bg-cyan-400/10" />

                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                  Binary
                </p>

                <p className="break-all font-mono text-sm font-semibold leading-7 text-cyan-300">
                  {result.binary}
                </p>
              </div>

              {/* Octets */}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white">
                      Octet Breakdown
                    </h3>

                    <p className="mt-1 text-[10px] text-slate-600">
                      Setiap oktet IPv4 terdiri dari 8 bit.
                    </p>
                  </div>

                  <span className="rounded-full border border-slate-800 bg-slate-950 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                    32 Bits
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {result.octets.map((octet) => (
                    <OctetCard
                      key={octet.position}
                      position={octet.position}
                      decimal={octet.decimal}
                      binary={octet.binary}
                      bits={octet.bits}
                    />
                  ))}
                </div>
              </div>

              {/* Summary */}

              <div className="grid gap-3 sm:grid-cols-2">
                <ResultItem
                  label="Decimal Octets"
                  value={result.decimalOctets.join(" . ")}
                />

                <ResultItem
                  label="Binary Octets"
                  value={result.binaryOctets.join(" . ")}
                />
              </div>
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
            <Binary className="h-4 w-4 text-cyan-400" />
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tentang Binary Calculator
            </h2>

            <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-600">
              Binary Calculator digunakan untuk memahami representasi alamat
              IPv4 dalam bentuk binary. Setiap alamat IPv4 terdiri dari 32 bit
              yang terbagi menjadi empat oktet, masing-masing berisi 8 bit.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ==================================================
   EMPTY RESULT
================================================== */

function EmptyResult() {
  return (
    <div className="flex min-h-90 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center">
      <div>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
          <Binary className="h-5 w-5 text-slate-600" />
        </div>

        <p className="text-sm font-semibold text-slate-500">Belum ada hasil</p>

        <p className="mt-1 text-xs text-slate-700">
          Masukkan IPv4 atau binary lalu tekan Convert.
        </p>
      </div>
    </div>
  );
}

/* ==================================================
   OCTET CARD
================================================== */

function OctetCard({
  position,
  decimal,
  binary,
  bits,
}: {
  position: number;
  decimal: number;
  binary: string;
  bits: number[];
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
          Octet {position}
        </span>

        <span className="font-mono text-xs font-bold text-white">
          {decimal}
        </span>
      </div>

      <p className="mb-3 font-mono text-sm font-bold tracking-[0.12em] text-cyan-300">
        {binary}
      </p>

      <div className="grid grid-cols-8 gap-1">
        {bits.map((bit, index) => (
          <div
            key={`${position}-${index}`}
            className={`flex h-7 items-center justify-center rounded-md border font-mono text-[10px] font-bold ${
              bit === 1
                ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                : "border-slate-800 bg-slate-900 text-slate-600"
            }`}
          >
            {bit}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================================================
   RESULT ITEM
================================================== */

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
        {label}
      </p>

      <p className="break-all font-mono text-xs font-semibold text-slate-300">
        {value}
      </p>
    </div>
  );
}
