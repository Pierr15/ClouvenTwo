"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  Copy,
  Network,
  RotateCcw,
  Server,
  ShieldCheck,
} from "lucide-react";

import {
  calculateIPv4,
  type IPAddressResult,
} from "@/lib/tools/ipCalculator";

const presets = [
  "192.168.1.10/24",
  "10.0.0.1/8",
  "172.16.1.10/16",
];

export default function IPAddressCalculatorPage() {
  const [ip, setIp] = useState("");
  const [prefix, setPrefix] = useState("24");
  const [result, setResult] =
    useState<IPAddressResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  /* ==================================================
     CALCULATE
  ================================================== */

  function handleCalculate() {
    setError("");
    setResult(null);

    const value = ip.trim();

    if (!value) {
      setError("IPv4 address wajib diisi.");
      return;
    }

    try {
      const input =
        value.includes("/")
          ? value
          : `${value}/${prefix}`;

      const calculated =
        calculateIPv4(input);

      setResult(calculated);

      if (calculated.cidr !== Number(prefix)) {
        setPrefix(String(calculated.cidr));
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menghitung alamat IPv4.",
      );
    }
  }

  /* ==================================================
     PRESET
  ================================================== */

  function handlePreset(value: string) {
    const [address, cidr] =
      value.split("/");

    setIp(address);
    setPrefix(cidr ?? "24");
    setError("");
    setResult(null);
  }

  /* ==================================================
     RESET
  ================================================== */

  function handleReset() {
    setIp("");
    setPrefix("24");
    setResult(null);
    setError("");
    setCopied("");
  }

  /* ==================================================
     COPY
  ================================================== */

  async function handleCopy(
    label: string,
    value: string,
  ) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);

      window.setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch {
      setError("Gagal menyalin hasil.");
    }
  }

  /* ==================================================
     BINARY
  ================================================== */

  function toBinary(ipAddress: string) {
    return ipAddress
      .split(".")
      .map((octet) =>
        Number(octet)
          .toString(2)
          .padStart(8, "0"),
      )
      .join(".");
  }

  const binaryIp = result
    ? toBinary(result.ip)
    : "";

  return (
    <main className="min-h-screen pb-12">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8">
        <Link
          href="/tools"
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-cyan-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Tools
        </Link>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/5">
                <Network className="h-4.5 w-4.5 text-cyan-400" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                  CLOEV Tools
                </p>

                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600">
                  Network Utility
                </p>
              </div>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              IP Calculator
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Analisis IPv4 dan CIDR untuk mengetahui
              network address, broadcast, host range,
              subnet mask, dan informasi jaringan lainnya.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
              Calculator Ready
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================
          MAIN CALCULATOR
      ================================================== */}

      <section className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
        {/* ==================================================
            INPUT
        ================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-[#0d1420] p-5 shadow-xl shadow-black/10">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/5">
                <Calculator className="h-4.5 w-4.5 text-cyan-400" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-white">
                  Network Input
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-600">
                  Masukkan alamat IPv4
                </p>
              </div>
            </div>

            <span className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-cyan-400">
              IPv4
            </span>
          </div>

          {/* IP */}
          <div className="mb-5">
            <label
              htmlFor="ip"
              className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500"
            >
              IPv4 Address
            </label>

            <input
              id="ip"
              value={ip}
              onChange={(event) => {
                setIp(event.target.value);
                setResult(null);
                setError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleCalculate();
                }
              }}
              placeholder="192.168.1.10"
              spellCheck={false}
              autoComplete="off"
              className="w-full rounded-xl border border-slate-800 bg-[#080d15] px-4 py-3 font-mono text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/10"
            />

            <p className="mt-2 text-[10px] text-slate-700">
              Bisa menggunakan format{" "}
              <span className="font-mono text-slate-600">
                IP/CIDR
              </span>
              , contoh 192.168.1.10/24
            </p>
          </div>

          {/* PREFIX */}
          <div className="mb-6">
            <label
              htmlFor="prefix"
              className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500"
            >
              CIDR Prefix
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-slate-600">
                /
              </span>

              <input
                id="prefix"
                type="number"
                min={0}
                max={32}
                value={prefix}
                onChange={(event) => {
                  setPrefix(event.target.value);
                  setResult(null);
                  setError("");
                }}
                className="w-full rounded-xl border border-slate-800 bg-[#080d15] py-3 pl-8 pr-4 font-mono text-sm text-white outline-none transition focus:border-cyan-500/40 focus:ring-2 focus:ring-cyan-500/10"
              />
            </div>

            <p className="mt-2 text-[10px] text-slate-700">
              Prefix IPv4 berada pada rentang /0 sampai /32.
            </p>
          </div>

          {/* PRESETS */}
          <div className="mb-6">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-slate-600">
              Quick Preset
            </p>

            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() =>
                    handlePreset(preset)
                  }
                  className="rounded-lg border border-slate-800 bg-[#080d15] px-2.5 py-1.5 font-mono text-[9px] text-slate-500 transition hover:border-cyan-500/20 hover:text-cyan-400"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-3">
              <div className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />

                <p className="text-xs leading-5 text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCalculate}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 active:scale-[0.99]"
            >
              <Calculator className="h-3.5 w-3.5" />
              Calculate
            </button>

            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset calculator"
              className="rounded-xl border border-slate-800 bg-[#080d15] px-4 text-slate-500 transition hover:border-slate-700 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ==================================================
            RESULT
        ================================================== */}

        <div className="min-w-0 rounded-2xl border border-slate-800 bg-[#0d1420] p-5 shadow-xl shadow-black/10">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">
                  Network Analysis
                </h2>

                {result && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                )}
              </div>

              <p className="mt-1 text-[10px] text-slate-600">
                Hasil perhitungan jaringan IPv4
              </p>
            </div>

            {result && (
              <span className="rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1 font-mono text-[9px] font-bold text-emerald-400">
                /{result.cidr}
              </span>
            )}
          </div>

          {!result ? (
            <EmptyResult />
          ) : (
            <>
              {/* SUMMARY */}
              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <SummaryCard
                  icon={<Server className="h-4 w-4" />}
                  label="IP Class"
                  value={`Class ${result.ipClass}`}
                />

                <SummaryCard
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="Address Type"
                  value={result.type}
                />

                <SummaryCard
                  icon={<Network className="h-4 w-4" />}
                  label="Version"
                  value={result.version}
                />
              </div>

              {/* RESULT GRID */}
              <div className="grid gap-3 sm:grid-cols-2">
                <ResultItem
                  label="IP Address"
                  value={result.ip}
                  copyable
                  copied={copied === "IP Address"}
                  onCopy={() =>
                    handleCopy(
                      "IP Address",
                      result.ip,
                    )
                  }
                />

                <ResultItem
                  label="CIDR"
                  value={`/${result.cidr}`}
                />

                <ResultItem
                  label="Subnet Mask"
                  value={result.subnetMask}
                  copyable
                  copied={
                    copied === "Subnet Mask"
                  }
                  onCopy={() =>
                    handleCopy(
                      "Subnet Mask",
                      result.subnetMask,
                    )
                  }
                />

                <ResultItem
                  label="Network Address"
                  value={result.networkAddress}
                  copyable
                  copied={
                    copied === "Network Address"
                  }
                  onCopy={() =>
                    handleCopy(
                      "Network Address",
                      result.networkAddress,
                    )
                  }
                />

                <ResultItem
                  label="Broadcast Address"
                  value={result.broadcastAddress}
                  copyable
                  copied={
                    copied ===
                    "Broadcast Address"
                  }
                  onCopy={() =>
                    handleCopy(
                      "Broadcast Address",
                      result.broadcastAddress,
                    )
                  }
                />

                <ResultItem
                  label="First Usable Host"
                  value={result.firstUsableHost}
                />

                <ResultItem
                  label="Last Usable Host"
                  value={result.lastUsableHost}
                />

                <ResultItem
                  label="Total Addresses"
                  value={result.totalAddresses.toLocaleString()}
                />

                <ResultItem
                  label="Usable Hosts"
                  value={result.usableHosts.toLocaleString()}
                />

                <ResultItem
                  label="Binary IP"
                  value={binaryIp}
                  full
                  monoSmall
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* ==================================================
          INFO
      ================================================== */}

      <section className="mt-5 rounded-2xl border border-slate-800 bg-[#0d1420] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/5">
            <Network className="h-4 w-4 text-cyan-400" />
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tentang IP Calculator
            </h2>

            <p className="mt-2 max-w-4xl text-xs leading-6 text-slate-600">
              Tool ini menggunakan service IPv4 CLOEV
              untuk membantu pembelajaran jaringan
              komputer, khususnya IPv4, CIDR, subnet mask,
              network address, broadcast address, dan
              host address.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className="mt-5 flex items-center justify-between text-[9px] uppercase tracking-wider text-slate-700">
        <span>CLOEV Network Utility</span>
        <span>IPv4 • CIDR</span>
      </div>
    </main>
  );
}

/* ==================================================
   EMPTY RESULT
================================================== */

function EmptyResult() {
  return (
    <div className="flex min-h-[105] items-center justify-center rounded-xl border border-dashed border-slate-800 bg-[#080d15] px-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-[#0d1420]">
          <Network className="h-5 w-5 text-slate-700" />
        </div>

        <p className="text-sm font-semibold text-slate-500">
          Belum ada analisis
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-700">
          Masukkan IPv4 dan CIDR prefix pada panel
          Network Input, kemudian tekan Calculate.
        </p>
      </div>
    </div>
  );
}

/* ==================================================
   SUMMARY CARD
================================================== */

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#080d15] p-4">
      <div className="mb-3 flex items-center gap-2 text-cyan-400">
        {icon}

        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
          {label}
        </span>
      </div>

      <p className="text-sm font-bold text-white">
        {value}
      </p>
    </div>
  );
}

/* ==================================================
   RESULT ITEM
================================================== */

function ResultItem({
  label,
  value,
  full = false,
  monoSmall = false,
  copyable = false,
  copied = false,
  onCopy,
}: {
  label: string;
  value: string;
  full?: boolean;
  monoSmall?: boolean;
  copyable?: boolean;
  copied?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div
      className={`group rounded-xl border border-slate-800 bg-[#080d15] p-4 transition hover:border-slate-700 ${
        full ? "sm:col-span-2" : ""
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">
          {label}
        </p>

        {copyable && (
          <button
            type="button"
            onClick={onCopy}
            className="flex items-center gap-1.5 text-slate-700 transition hover:text-cyan-400"
            aria-label={`Copy ${label}`}
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span className="text-[8px] text-emerald-400">
                  Copied
                </span>
              </>
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        )}
      </div>

      <p
        className={`break-all font-mono font-semibold text-cyan-300 ${
          monoSmall
            ? "text-[11px] leading-5"
            : "text-sm"
        }`}
      >
        {value}
      </p>
    </div>
  );
}