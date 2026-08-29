"use client";

import Link from "next/link";
import {
  ClipboardList,
  Plus,
  ListTodo,
  Clock3,
} from "lucide-react";

type Props = {
  totalAssignments: number;
  pendingAssignments: number;
};

export default function AssignmentHeader({
  totalAssignments,
  pendingAssignments,
}: Props) {
  return (
    <header className="mb-8">
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-500/10 p-3">
            <ClipboardList className="h-7 w-7 text-cyan-400" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              Tugas
            </h1>

            <p className="mt-1 text-slate-400">
              Daftar tugas dan pekerjaan kelas XI TKJ 2
            </p>
          </div>
        </div>

        {/* Tambah tugas */}
        <Link
          href="/assignments/create"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          Tambah Tugas
        </Link>
      </div>

      {/* Statistik */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Total */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="rounded-xl bg-cyan-500/10 p-3">
            <ListTodo className="h-5 w-5 text-cyan-400" />
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Total Tugas
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {totalAssignments}
            </p>
          </div>
        </div>

        {/* Pending */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="rounded-xl bg-yellow-500/10 p-3">
            <Clock3 className="h-5 w-5 text-yellow-400" />
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Belum Selesai
            </p>

            <p className="mt-1 text-2xl font-bold text-yellow-400">
              {pendingAssignments}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}