"use client";

import { useEffect, useState } from "react";

import {
  ClipboardCheck,
  FileText,
  UsersRound,
} from "lucide-react";

import {
  getTodayPiket,
  type PiketToday,
} from "@/services/piketService";

export default function TodayPicketCard() {
  const [piket, setPiket] =
    useState<PiketToday | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      const data = await getTodayPiket();

      setPiket(data);
      setLoading(false);
    }

    load();

    const interval = setInterval(
      load,
      60000,
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="h-6 w-6 text-cyan-400" />

          <h2 className="text-xl font-bold text-white">
            Piket Hari Ini
          </h2>
        </div>

        {!loading && piket && (
          <span className="rounded-full bg-cyan-900/40 px-3 py-1 text-xs font-medium text-cyan-400">
            {piket.day}
          </span>
        )}
      </div>

      {loading ? (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-slate-400">
            Memuat data piket...
          </p>
        </div>
      ) : !piket ? (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-slate-400">
            Data piket hari ini tidak tersedia.
          </p>
        </div>
      ) : !piket.isSchoolDay ? (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-slate-400">
            Hari ini bukan hari sekolah.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <div className="mb-4 flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-cyan-400" />

              <h3 className="font-semibold text-white">
                Siswa yang Bertugas
              </h3>
            </div>

            {piket.members.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-slate-400">
                  Belum ada siswa yang dijadwalkan piket hari ini.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {piket.members.map(
                  (member, index) => (
                    <div
                      key={`${member}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 transition hover:border-cyan-600"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-900 text-sm font-semibold text-cyan-300">
                        {index + 1}
                      </div>

                      <span className="text-slate-200">
                        {member}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-amber-700/40 bg-amber-950/20 p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-300" />

              <h3 className="font-semibold text-amber-300">
                Catatan
              </h3>
            </div>

            {piket.notes.length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">
                Tidak ada catatan.
              </p>
            ) : (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                {piket.notes.map(
                  (note, index) => (
                    <li key={`${note}-${index}`}>
                      {note}
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}