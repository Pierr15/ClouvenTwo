"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  ListFilter,
  Search,
} from "lucide-react";

import AssignmentCard from "./AssignmentCard";

import type {
  Assignment,
} from "@/services/assignmentService";

type AssignmentWithStudentStatus =
  Assignment & {
    studentStatus:
      | "pending"
      | "completed";
  };

type Props = {
  assignments: AssignmentWithStudentStatus[];
  canManage: boolean;
};

export default function AssignmentContent({
  assignments,
  canManage,
}: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");

  /*
   * Filter tugas.
   */
  const filteredAssignments = useMemo(() => {
    const keyword = search
      .toLowerCase()
      .trim();

    return assignments.filter(
      (assignment) => {
        const matchSearch =
          assignment.title
            .toLowerCase()
            .includes(keyword) ||
          assignment.subject
            .toLowerCase()
            .includes(keyword) ||
          (assignment.teacher ?? "")
            .toLowerCase()
            .includes(keyword);

        /*
         * Status menggunakan status siswa,
         * BUKAN status global assignment.
         */
        const matchStatus =
          status === "all" ||
          assignment.studentStatus ===
            status;

        const matchPriority =
          priority === "all" ||
          assignment.priority ===
            priority;

        return (
          matchSearch &&
          matchStatus &&
          matchPriority
        );
      },
    );
  }, [
    assignments,
    search,
    status,
    priority,
  ]);

  /*
   * Statistik berdasarkan submission
   * siswa yang sedang login.
   */
  const completedCount =
    assignments.filter(
      (assignment) =>
        assignment.studentStatus ===
        "completed",
    ).length;

  const pendingCount =
    assignments.length -
    completedCount;

  /*
   * Jumlah tugas yang memiliki
   * link pengumpulan dari guru/admin.
   */
  const submissionLinkCount =
    assignments.filter(
      (assignment) =>
        Boolean(
          assignment.submission_url,
        ),
    ).length;

  return (
    <div className="space-y-6">
      {/* Statistik */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Belum Selesai */}
        <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="rounded-xl bg-yellow-500/10 p-3">
            <Clock3 className="h-6 w-6 text-yellow-400" />
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Belum Selesai
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {pendingCount}
            </p>
          </div>
        </div>

        {/* Selesai */}
        <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="rounded-xl bg-green-500/10 p-3">
            <CheckCircle2 className="h-6 w-6 text-green-400" />
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Selesai
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {completedCount}
            </p>
          </div>
        </div>

        {/* Ada Link Pengumpulan */}
        <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="rounded-xl bg-cyan-500/10 p-3">
            <ExternalLink className="h-6 w-6 text-cyan-400" />
          </div>

          <div>
            <p className="text-sm text-slate-400">
              Ada Link Pengumpulan
            </p>

            <p className="mt-1 text-2xl font-bold text-cyan-400">
              {submissionLinkCount}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Cari tugas, mata pelajaran, atau guru..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-500"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <ListFilter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value,
                )
              }
              className="appearance-none rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-8 text-sm text-white outline-none focus:border-cyan-500"
            >
              <option value="all">
                Semua Status
              </option>

              <option value="pending">
                Belum Selesai
              </option>

              <option value="completed">
                Selesai
              </option>
            </select>
          </div>

          {/* Prioritas */}
          <select
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target.value,
              )
            }
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
          >
            <option value="all">
              Semua Prioritas
            </option>

            <option value="low">
              Rendah
            </option>

            <option value="normal">
              Normal
            </option>

            <option value="high">
              Tinggi
            </option>
          </select>
        </div>
      </div>

      {/* Jumlah hasil */}
      <div>
        <p className="text-sm text-slate-400">
          Menampilkan{" "}
          <span className="font-semibold text-slate-200">
            {filteredAssignments.length}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-slate-200">
            {assignments.length}
          </span>{" "}
          tugas
        </p>
      </div>

      {/* Daftar Tugas */}
      {filteredAssignments.length ===
      0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
          <Search className="mx-auto h-10 w-10 text-slate-600" />

          <h3 className="mt-4 text-lg font-semibold text-white">
            Tidak ada tugas
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Belum ada tugas yang sesuai
            dengan pencarian atau filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssignments.map(
            (assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                canManage={canManage}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}