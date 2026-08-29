"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock3,
  ExternalLink,
  FileText,
  UserRound,
} from "lucide-react";

import AssignmentUpload from "./AssignmentUpload";

import type { Assignment } from "@/services/assignmentService";
import type { AssignmentSubmission } from "@/services/assignmentSubmissionService";

type Props = {
  assignment: Assignment;
  submission: AssignmentSubmission | null;
};

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDeadlineStatus(
  dueDate: string | null,
) {
  if (!dueDate) {
    return {
      label: "Tidak ada deadline",
      className: "text-slate-400",
      urgent: false,
    };
  }

  const now = new Date();
  const deadline = new Date(dueDate);

  const nowDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const deadlineDate = new Date(
    deadline.getFullYear(),
    deadline.getMonth(),
    deadline.getDate(),
  );

  const diff =
    deadlineDate.getTime() -
    nowDate.getTime();

  const days = Math.ceil(
    diff / (1000 * 60 * 60 * 24),
  );

  if (days < 0) {
    return {
      label: "Deadline sudah terlewat",
      className: "text-red-400",
      urgent: true,
    };
  }

  if (days === 0) {
    return {
      label: "Deadline hari ini",
      className: "text-red-400",
      urgent: true,
    };
  }

  if (days === 1) {
    return {
      label: "Deadline besok",
      className: "text-yellow-400",
      urgent: true,
    };
  }

  if (days <= 3) {
    return {
      label: `${days} hari lagi`,
      className: "text-yellow-400",
      urgent: true,
    };
  }

  return {
    label: `${days} hari lagi`,
    className: "text-slate-400",
    urgent: false,
  };
}

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

export default function AssignmentDetail({
  assignment,
  submission,
}: Props) {
  const priority =
    priorityConfig[assignment.priority];

  const deadlineStatus =
    getDeadlineStatus(
      assignment.due_date,
    );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Kembali */}
      <Link
        href="/assignments"
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Tugas
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />

              <span className="text-sm font-medium text-cyan-400">
                {assignment.subject}
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-bold text-white">
              {assignment.title}
            </h1>

            <p className="mt-3 text-slate-400">
              {assignment.description ||
                "Tidak ada deskripsi tugas."}
            </p>
          </div>

          <span
            className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${priority.className}`}
          >
            Prioritas {priority.label}
          </span>
        </div>

        {/* Informasi */}
        <div className="mt-8 grid gap-4 border-t border-slate-800 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <UserRound className="h-5 w-5 text-slate-500" />

            <div>
              <p className="text-xs text-slate-500">
                Guru
              </p>

              <p className="text-sm font-medium text-slate-200">
                {assignment.teacher ||
                  "Belum ditentukan"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-slate-500" />

            <div>
              <p className="text-xs text-slate-500">
                Diberikan
              </p>

              <p className="text-sm font-medium text-slate-200">
                {formatDate(
                  assignment.assigned_date,
                )}
              </p>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-3">
            <Clock3
              className={`h-5 w-5 ${
                deadlineStatus.urgent
                  ? deadlineStatus.className
                  : "text-slate-500"
              }`}
            />

            <div>
              <p className="text-xs text-slate-500">
                Deadline
              </p>

              <p className="text-sm font-medium text-slate-200">
                {formatDate(
                  assignment.due_date,
                )}
              </p>

              <p
                className={`mt-0.5 text-xs font-medium ${deadlineStatus.className}`}
              >
                {deadlineStatus.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-slate-500" />

            <div>
              <p className="text-xs text-slate-500">
                Status
              </p>

              <p
                className={`text-sm font-medium ${
                  submission
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {submission
                  ? "Sudah dikumpulkan"
                  : "Belum dikumpulkan"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Link Pengumpulan Guru */}
      {assignment.submission_url && (
        <div className="rounded-2xl border border-cyan-800/50 bg-cyan-950/20 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-cyan-500/10 p-3">
              <ExternalLink className="h-6 w-6 text-cyan-400" />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-white">
                Link Pengumpulan
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Gunakan link berikut jika guru meminta
                pengumpulan melalui platform eksternal.
              </p>

              <a
                href={assignment.submission_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
              >
                Buka Link Pengumpulan
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Submission */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-500/10 p-3">
            <FileText className="h-6 w-6 text-purple-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              Pengumpulan Tugas
            </h2>

            <p className="text-sm text-slate-400">
              Upload hasil pekerjaanmu di sini.
            </p>
          </div>
        </div>

        <AssignmentUpload
          assignmentId={assignment.id}
          submission={submission}
        />
      </div>
    </div>
  );
}