"use client";

import Image from "next/image";
import { useState } from "react";
import { Download, QrCode, RotateCcw, Sparkles } from "lucide-react";

import { generateQRCode } from "@/lib/tools/qrCode";
import BackButton from "@/components/navigation/BackButton";

export default function QRCodePage() {
  const [input, setInput] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setError("");
    setQrCode("");

    if (!input.trim()) {
      setError("Data QR Code wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const result = await generateQRCode(input);

      setQrCode(result.dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "QR Code gagal dibuat.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setInput("");
    setQrCode("");
    setError("");
  }

  function handleDownload() {
    if (!qrCode) {
      return;
    }

    const link = document.createElement("a");

    link.href = qrCode;
    link.download = "cloev-qrcode.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <main className="min-h-screen pb-10">
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
            <QrCode className="h-4 w-4 text-cyan-400" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Utility Tool
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white">
          QR Code Generator
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Buat QR Code dari teks, URL, konfigurasi jaringan, atau informasi
          lainnya secara cepat.
        </p>
      </section>

      {/* ==================================================
          MAIN
      ================================================== */}

      <section className="grid gap-5 xl:grid-cols-[420px_1fr]">
        {/* ==================================================
            INPUT CARD
        ================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/5">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">QR Input</h2>

              <p className="text-[11px] text-slate-500">
                Masukkan data yang ingin dibuat menjadi QR Code
              </p>
            </div>
          </div>

          {/* INPUT */}

          <div className="mb-5">
            <label
              htmlFor="qr-input"
              className="mb-2 block text-xs font-semibold text-slate-300"
            >
              Data
            </label>

            <textarea
              id="qr-input"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setError("");
              }}
              placeholder="Contoh: https://cloev.local"
              rows={7}
              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
            />

            <p className="mt-2 text-[10px] text-slate-600">
              Bisa berupa teks, URL, atau data konfigurasi lainnya.
            </p>
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
              onClick={handleGenerate}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <QrCode className="h-4 w-4" />

              {loading ? "Generating..." : "Generate QR"}
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

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10">
          <div className="mb-6">
            <h2 className="text-sm font-bold text-white">QR Code Result</h2>

            <p className="mt-1 text-[11px] text-slate-500">
              QR Code yang dihasilkan akan muncul di sini.
            </p>
          </div>

          {!qrCode ? (
            <div className="flex min-h-90 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center">
              <div>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
                  <QrCode className="h-6 w-6 text-slate-600" />
                </div>

                <p className="text-sm font-semibold text-slate-500">
                  Belum ada QR Code
                </p>

                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-700">
                  Masukkan data lalu tekan Generate QR untuk membuat QR Code.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-90 flex-col items-center justify-center">
              {/* QR */}

              <div className="rounded-2xl border border-slate-800 bg-white p-5 shadow-2xl shadow-black/20">
                <Image
                  src={qrCode}
                  alt="Generated QR Code"
                  width={256}
                  height={256}
                  unoptimized
                  className="h-64 w-64"
                />
              </div>

              {/* DATA */}

              <div className="mt-5 w-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                  Data
                </p>

                <p className="max-h-20 overflow-auto break-all font-mono text-xs leading-5 text-slate-400">
                  {input}
                </p>
              </div>

              {/* DOWNLOAD */}

              <button
                type="button"
                onClick={handleDownload}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/10 bg-cyan-400/5 px-4 py-3 text-xs font-bold text-cyan-400 transition hover:border-cyan-400/20 hover:bg-cyan-400/10"
              >
                <Download className="h-4 w-4" />
                Download QR Code
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          INFO
      ================================================== */}

      <section className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Tentang QR Code Generator
        </h2>

        <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-600">
          Tool ini digunakan untuk membuat QR Code dari berbagai jenis data
          seperti URL, teks, konfigurasi jaringan, dan informasi lainnya. QR
          Code dapat disimpan sebagai file PNG dan digunakan kembali.
        </p>
      </section>
    </main>
  );
}
