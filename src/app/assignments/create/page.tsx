import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  ExternalLink,
  FileText,
  Save,
  UserRound,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getCurrentUser } from "@/lib/currentUser";
import BackButton from "@/components/navigation/BackButton";
import {
  createAssignment,
  type AssignmentPriority,
} from "@/services/assignmentService";

async function createAssignmentAction(formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();

  const subject = String(formData.get("subject") ?? "").trim();

  const teacher = String(formData.get("teacher") ?? "").trim();

  const description = String(formData.get("description") ?? "").trim();

  const assignedDate = String(formData.get("assigned_date") ?? "").trim();

  const dueDate = String(formData.get("due_date") ?? "").trim();

  const priorityValue = String(formData.get("priority") ?? "normal");

  const submissionUrl = String(formData.get("submission_url") ?? "").trim();

  const attachmentUrl = String(formData.get("attachment_url") ?? "").trim();

  if (!title || !subject) {
    redirect("/assignments/create?error=required");
  }

  const allowedPriorities: AssignmentPriority[] = ["low", "normal", "high"];

  const priority: AssignmentPriority = allowedPriorities.includes(
    priorityValue as AssignmentPriority,
  )
    ? (priorityValue as AssignmentPriority)
    : "normal";

  const result = await createAssignment({
    title,
    subject,
    teacher: teacher || null,
    description: description || null,
    assigned_date: assignedDate || undefined,
    due_date: dueDate || null,
    priority,
    submission_url: submissionUrl || null,
    attachment_url: attachmentUrl || null,
  });

  if (!result) {
    redirect("/assignments/create?error=create");
  }

  redirect("/assignments");
}

export default async function CreateAssignmentPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
  }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;

  const today = new Date().toISOString().split("T")[0];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Back */}
        <BackButton href="/assignments">Kembali ke Tugas</BackButton>

        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-3">
              <ClipboardList className="h-7 w-7 text-cyan-400" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white">Buat Tugas Baru</h1>

              <p className="mt-1 text-slate-400">
                Tambahkan tugas baru untuk kelas XI TKJ 2.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {params.error === "required" && (
          <div className="rounded-xl border border-red-800/40 bg-red-950/20 p-4">
            <p className="text-sm text-red-400">
              Judul dan mata pelajaran wajib diisi.
            </p>
          </div>
        )}

        {params.error === "create" && (
          <div className="rounded-xl border border-red-800/40 bg-red-950/20 p-4">
            <p className="text-sm text-red-400">
              Tugas gagal dibuat. Silakan coba lagi.
            </p>
          </div>
        )}

        {/* Form */}
        <form action={createAssignmentAction} className="space-y-6">
          {/* Informasi utama */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">
                Informasi Tugas
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Informasi dasar tugas yang akan ditampilkan kepada siswa.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Judul */}
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Judul Tugas
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="Contoh: Membuat Topologi Jaringan"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-500"
                />
              </div>

              {/* Mapel */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Mata Pelajaran
                </label>

                <div className="relative">
                  <ClipboardList className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="Contoh: Kejuruan"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Guru */}
              <div>
                <label
                  htmlFor="teacher"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Guru
                </label>

                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <input
                    id="teacher"
                    name="teacher"
                    type="text"
                    placeholder="Nama guru"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Deskripsi Tugas
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Jelaskan instruksi atau ketentuan tugas..."
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                />
              </div>
            </div>
          </section>

          {/* Deadline */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">Jadwal Tugas</h2>

              <p className="mt-1 text-sm text-slate-500">
                Atur tanggal diberikan dan batas pengumpulan.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Tanggal diberikan */}
              <div>
                <label
                  htmlFor="assigned_date"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Tanggal Diberikan
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <input
                    id="assigned_date"
                    name="assigned_date"
                    type="date"
                    defaultValue={today}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label
                  htmlFor="due_date"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Deadline
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <input
                    id="due_date"
                    name="due_date"
                    type="date"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-600">
                  Kosongkan jika tugas tidak memiliki deadline.
                </p>
              </div>

              {/* Prioritas */}
              <div>
                <label
                  htmlFor="priority"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Prioritas
                </label>

                <select
                  id="priority"
                  name="priority"
                  defaultValue="normal"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                >
                  <option value="low">Rendah</option>

                  <option value="normal">Normal</option>

                  <option value="high">Tinggi</option>
                </select>
              </div>
            </div>
          </section>

          {/* Pengumpulan */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">Pengumpulan</h2>

              <p className="mt-1 text-sm text-slate-500">
                Tambahkan link Google Form, Google Drive, Classroom, atau
                platform pengumpulan lainnya.
              </p>
            </div>

            <div className="space-y-5">
              {/* Submission URL */}
              <div>
                <label
                  htmlFor="submission_url"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
                >
                  <ExternalLink className="h-4 w-4 text-cyan-400" />
                  Link Pengumpulan
                </label>

                <input
                  id="submission_url"
                  name="submission_url"
                  type="url"
                  placeholder="https://forms.google.com/..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                />

                <p className="mt-2 text-xs text-slate-600">
                  Link ini akan muncul di halaman detail tugas untuk siswa.
                </p>
              </div>

              {/* Attachment URL */}
              <div>
                <label
                  htmlFor="attachment_url"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
                >
                  <FileText className="h-4 w-4 text-purple-400" />
                  Link Materi / Lampiran
                </label>

                <input
                  id="attachment_url"
                  name="attachment_url"
                  type="url"
                  placeholder="https://drive.google.com/..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500"
                />

                <p className="mt-2 text-xs text-slate-600">
                  Opsional. Bisa digunakan untuk link modul, PDF, atau materi
                  tambahan.
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/assignments"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              Batal
            </Link>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
            >
              <Save className="h-4 w-4" />
              Simpan Tugas
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
