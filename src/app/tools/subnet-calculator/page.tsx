"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Calculator,
  Network,
  RotateCcw,
  Server,
  Layers3,
} from "lucide-react";

import {
  calculateSubnets,
  type SubnetCalculatorResult,
} from "@/lib/tools/subnetCalculator";

export default function SubnetCalculatorPage() {
  const [network, setNetwork] = useState("");
  const [prefix, setPrefix] = useState("26");

  const [result, setResult] =
    useState<SubnetCalculatorResult | null>(null);

  const [error, setError] = useState("");

  function handleCalculate() {
    setError("");
    setResult(null);

    if (!network.trim()) {
      setError("Network IPv4 wajib diisi.");
      return;
    }

    const newPrefix = Number(prefix);

    if (
      !Number.isInteger(newPrefix) ||
      newPrefix < 0 ||
      newPrefix > 32
    ) {
      setError(
        "Prefix subnet harus berada di antara /0 sampai /32.",
      );
      return;
    }

    try {
      const calculation = calculateSubnets(
        network,
        newPrefix,
      );

      setResult(calculation);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghitung subnet.",
      );
    }
  }

  function handleReset() {
    setNetwork("");
    setPrefix("26");
    setResult(null);
    setError("");
  }

  return (
    <main className="min-h-screen pb-10">
      {/* ==================================================
          BACK
      ================================================== */}

      <Link
        href="/tools"
        className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-cyan-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Tools
      </Link>

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/5">
            <Layers3 className="h-4 w-4 text-cyan-400" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Network Tool
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white">
          Subnet Calculator
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Hitung pembagian subnet IPv4 berdasarkan
          network awal dan prefix subnet baru. Tool ini
          menampilkan jumlah subnet, subnet mask, host,
          hingga tabel setiap subnet.
        </p>
      </section>

      {/* ==================================================
          CALCULATOR
      ================================================== */}

      <section className="grid gap-5 xl:grid-cols-[380px_1fr]">
        {/* ==================================================
            INPUT
        ================================================== */}

        <div className="h-fit rounded-2xl border border-slate-800 bg-[#0d1420] p-5 shadow-xl shadow-black/10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/5">
              <Network className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">
                Subnet Input
              </h2>

              <p className="text-[11px] text-slate-500">
                Masukkan network IPv4
              </p>
            </div>
          </div>

          {/* NETWORK */}

          <div className="mb-5">
            <label
              htmlFor="network"
              className="mb-2 block text-xs font-semibold text-slate-300"
            >
              Network IPv4 / CIDR
            </label>

            <input
              id="network"
              type="text"
              value={network}
              onChange={(event) => {
                setNetwork(event.target.value);
                setError("");
              }}
              placeholder="Contoh: 192.168.1.0/24"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
            />

            <p className="mt-2 text-[10px] text-slate-600">
              Contoh: 192.168.1.0/24
            </p>
          </div>

          {/* NEW PREFIX */}

          <div className="mb-6">
            <label
              htmlFor="prefix"
              className="mb-2 block text-xs font-semibold text-slate-300"
            >
              New Subnet Prefix
            </label>

            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-slate-500">
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
                  setError("");
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
              />
            </div>

            <p className="mt-2 text-[10px] text-slate-600">
              Prefix baru harus ≥ prefix network awal.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-400/10 bg-red-400/5 px-4 py-3 text-xs leading-5 text-red-300">
              {error}
            </div>
          )}

          {/* ACTION */}

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
            RESULT
        ================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-[#0d1420] p-5 shadow-xl shadow-black/10">
          <div className="mb-6">
            <h2 className="text-sm font-bold text-white">
              Subnet Result
            </h2>

            <p className="mt-1 text-[11px] text-slate-500">
              Hasil perhitungan subnet akan muncul di
              sini.
            </p>
          </div>

          {!result ? (
            <div className="flex min-h-80 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center">
              <div>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
                  <Server className="h-5 w-5 text-slate-600" />
                </div>

                <p className="text-sm font-semibold text-slate-500">
                  Belum ada hasil
                </p>

                <p className="mt-1 text-xs text-slate-700">
                  Masukkan network dan prefix lalu tekan
                  Calculate.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* SUMMARY */}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <ResultItem
                  label="Network Address"
                  value={result.networkAddress}
                />

                <ResultItem
                  label="Original CIDR"
                  value={`/${result.originalPrefix}`}
                />

                <ResultItem
                  label="Original Mask"
                  value={result.originalSubnetMask}
                />

                <ResultItem
                  label="New CIDR"
                  value={`/${result.newPrefix}`}
                />

                <ResultItem
                  label="New Subnet Mask"
                  value={result.newSubnetMask}
                />

                <ResultItem
                  label="Total Subnets"
                  value={result.totalSubnets.toLocaleString()}
                />

                <ResultItem
                  label="Addresses / Subnet"
                  value={result.addressesPerSubnet.toLocaleString()}
                />

                <ResultItem
                  label="Usable Hosts / Subnet"
                  value={result.usableHostsPerSubnet.toLocaleString()}
                />

                <ResultItem
                  label="Subnet Increment"
                  value={result.subnetIncrement.toLocaleString()}
                />

                <ResultItem
                  label="First Subnet"
                  value={result.firstSubnet}
                />

                <ResultItem
                  label="Last Subnet"
                  value={result.lastSubnet}
                />
              </div>

              {/* TABLE */}

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Subnet Table
                    </h3>

                    <p className="mt-1 text-[10px] text-slate-600">
                      Menampilkan maksimal 4096 subnet.
                    </p>
                  </div>

                  <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                    {result.subnets.length} Rows
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-800">
                  <div className="max-h-105 overflow-auto">
                    <table className="w-full min-w-215 border-collapse text-left">
                      <thead className="sticky top-0 z-10 bg-[#111827]">
                        <tr className="border-b border-slate-800">
                          <TableHeader>
                            #
                          </TableHeader>

                          <TableHeader>
                            Network
                          </TableHeader>

                          <TableHeader>
                            First Host
                          </TableHeader>

                          <TableHeader>
                            Last Host
                          </TableHeader>

                          <TableHeader>
                            Broadcast
                          </TableHeader>

                          <TableHeader>
                            Addresses
                          </TableHeader>

                          <TableHeader>
                            Hosts
                          </TableHeader>
                        </tr>
                      </thead>

                      <tbody>
                        {result.subnets.map(
                          (subnet) => (
                            <tr
                              key={subnet.subnet}
                              className="border-b border-slate-900 transition last:border-0 hover:bg-slate-800/40"
                            >
                              <TableCell>
                                {subnet.subnet}
                              </TableCell>

                              <TableCell>
                                {subnet.networkAddress}
                              </TableCell>

                              <TableCell>
                                {subnet.firstHost}
                              </TableCell>

                              <TableCell>
                                {subnet.lastHost}
                              </TableCell>

                              <TableCell>
                                {subnet.broadcastAddress}
                              </TableCell>

                              <TableCell>
                                {subnet.totalAddresses.toLocaleString()}
                              </TableCell>

                              <TableCell>
                                {subnet.usableHosts.toLocaleString()}
                              </TableCell>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ==================================================
          INFO
      ================================================== */}

      <section className="mt-5 rounded-2xl border border-slate-800 bg-[#0d1420] p-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Tentang Subnet Calculator
        </h2>

        <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-600">
          Tool ini digunakan untuk membantu pembelajaran
          subnetting dalam jaringan komputer. Masukkan
          network IPv4 beserta prefix awal, kemudian
          tentukan prefix subnet baru untuk melihat
          pembagian network, host, broadcast, dan jumlah
          subnet.
        </p>
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
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
        {label}
      </p>

      <p className="break-all font-mono text-sm font-semibold text-cyan-300">
        {value}
      </p>
    </div>
  );
}

/* ==================================================
   TABLE HEADER
================================================== */

function TableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="whitespace-nowrap px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-500">
      {children}
    </th>
  );
}

/* ==================================================
   TABLE CELL
================================================== */

function TableCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-slate-400">
      {children}
    </td>
  );
}