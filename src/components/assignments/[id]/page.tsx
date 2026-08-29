import { notFound, redirect } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getCurrentUser } from "@/lib/currentUser";
import { getAssignmentById } from "@/services/assignmentService";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Flag,
  UserRound,
} from "lucide-react";

import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

export default async function AssignmentDetailPage({
  params,
}: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const assignmentId = Number(id);

  if (!Number.isInteger(assignmentId)) {
    notFound();
  }

  const assignment =
    await getAssignmentById(assignmentId);

  if (!assignment) {
    notFound();
  }

  const priority =
    priorityConfig[assignment.priority];

  const completed =
    assignment.status === "completed";

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link
          href="/assignments"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Tugas
        </Link>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400">
              <BookOpen className="h-5 w-5" />

              <span className="font-medium">
                {assignment.subject}
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-bold text-white">
              {assignment.title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${priority.className}`}
            >
              <Flag className="h-3.5 w-3.5" />
              Prioritas {priority.label}
            </span>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                completed
                  ? "bg-green-500/10 text-green-400"
                  : "bg-yellow-500/10 text-yellow-400"
              }`}
            >
              {completed ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Clock3 className="h-3.5 w-3.5" />
              )}

              {completed
                ? "Selesai"
                : "Belum selesai"}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <InfoItem
            icon={<UserRound />}
            label="Guru"
            value={
              assignment.teacher ??
              "Belum ditentukan"
            }
          />

          <InfoItem
            icon={<CalendarDays />}
            label="Diberikan"
            value={formatDate(
              assignment.assigned_date
            )}
          />

          <InfoItem
            icon={<Clock3 />}
            label="Deadline"
            value={formatDate(
              assignment.due_date
            )}
          />
        </div>

        {assignment.description && (
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-400" />

              <h2 className="font-semibold text-white">
                Deskripsi Tugas
              </h2>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {assignment.description}
            </p>
          </div>
        )}

        {assignment.attachment_url && (
          <div className="mt-6">
            <a
              href={assignment.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-cyan-500 hover:text-cyan-400"
            >
              <FileText className="h-4 w-4" />
              Buka Lampiran
            </a>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function InfoItem({
  icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="h-4 w-4 [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>

        <span className="text-sm">
          {label}
        </span>
      </div>

      <p className="mt-2 font-semibold text-white">
        {value}
      </p>
    </div>
  );
}