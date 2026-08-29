"use client";

import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileCheck2,
  Trash2,
  UserRound,
} from "lucide-react";

import DeleteAssignmentButton from "./DeleteAssignmentButton";

import type { Assignment } from "@/services/assignmentService";

type StudentStatus = "pending" | "completed";

type AssignmentWithStudentStatus = Assignment & {
  studentStatus: StudentStatus;
};

type Props = {
  assignment: AssignmentWithStudentStatus;
  canManage?: boolean;
};

const priorityConfig = {
  low: {
    label: "Rendah",
    className:
      "border-green-500/20 bg-green-500/10 text-green-400",
  },
  normal: {
    label: "Normal",
    className:
      "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  },
  high: {
    label: "Tinggi",
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },
};

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDeadlineStatus(dueDate: string | null) {
  if (!dueDate) {
    return {
      label: "Tidak ada deadline",
      className: "text-slate-500",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(dueDate);
  deadline.setHours(0, 0, 0, 0);

  const diff =
    deadline.getTime() - today.getTime();

  const days = Math.ceil(
    diff / (1000 * 60 * 60 * 24),
  );

  if (days < 0) {
    return {
      label: "Deadline terlewat",
      className: "text-red-400",
    };
  }

  if (days === 0) {
    return {
      label: "Deadline hari ini",
      className: "text-red-400",
    };
  }

  if (days === 1) {
    return {
      label: "Deadline besok",
      className: "text-yellow-400",
    };
  }

  if (days <= 3) {
    return {
      label: `${days} hari lagi`,
      className: "text-yellow-400",
    };
  }

  return {
    label: `${days} hari lagi`,
    className: "text-slate-400",
  };
}

export default function AssignmentCard({
  assignment,
  canManage = false,
}: Props) {
  const priority =
    priorityConfig[assignment.priority];

  const completed =
    assignment.studentStatus === "completed";

  const deadlineStatus =
    getDeadlineStatus(assignment.due_date);

  const hasSubmissionLink =
    Boolean(assignment.submission_url);

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10">
      <Link
        href={`/assignments/${assignment.id}`}
        className="block"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 shrink-0 text-cyan-400" />

              <span className="text-sm font-medium text-cyan-400">
                {assignment.subject}
              </span>
            </div>

            <h2 className="mt-3 text-xl font-bold text-white transition-colors group-hover:text-cyan-400">
              {assignment.title}
            </h2>
          </div>

          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${priority.className}`}
          >
            {priority.label}
          </span>
        </div>

        {/* Deskripsi */}
        {assignment.description && (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-400">
            {assignment.description}
          </p>
        )}

        {/* Informasi */}
        <div className="mt-6 space-y-3 border-t border-slate-800 pt-5">
          {/* Guru */}
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <UserRound className="h-4 w-4 text-slate-500" />

            <span>
              {assignment.teacher ??
                "Guru belum ditentukan"}
            </span>
          </div>

          {/* Deadline */}
          <div className="flex items-start gap-3 text-sm">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

            <div>
              <p className="text-slate-400">
                Dikumpulkan
              </p>

              <p className="font-medium text-slate-200">
                {formatDate(
                  assignment.due_date,
                )}
              </p>

              <p
                className={`mt-0.5 text-xs ${deadlineStatus.className}`}
              >
                {deadlineStatus.label}
              </p>
            </div>
          </div>

          {/* Status siswa */}
          <div className="flex items-center gap-3 text-sm">
            {completed ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-400" />

                <span className="font-medium text-green-400">
                  Sudah dikumpulkan
                </span>
              </>
            ) : (
              <>
                <Clock3 className="h-4 w-4 text-yellow-400" />

                <span className="font-medium text-yellow-400">
                  Belum dikumpulkan
                </span>
              </>
            )}
          </div>
        </div>

        {/* Fitur pengumpulan */}
        <div className="mt-5 border-t border-slate-800 pt-5">
          <div className="flex flex-wrap gap-2">
            {hasSubmissionLink && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-400">
                <ExternalLink className="h-3.5 w-3.5" />
                Ada Link Pengumpulan
              </span>
            )}

            {completed ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400">
                <FileCheck2 className="h-3.5 w-3.5" />
                Sudah Dikumpulkan
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-400">
                <FileCheck2 className="h-3.5 w-3.5" />
                Bisa Upload Tugas
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400 transition-colors group-hover:text-cyan-400">
              Lihat Detail Tugas
            </span>

            <span className="text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-cyan-400">
              →
            </span>
          </div>
        </div>
      </Link>

      {/* Admin / Guru controls */}
      {canManage && (
        <div className="mt-5 border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Trash2 className="h-3.5 w-3.5" />
              Kelola tugas
            </div>

            <DeleteAssignmentButton
              assignmentId={assignment.id}
              assignmentTitle={assignment.title}
            />
          </div>
        </div>
      )}
    </article>
  );
}