export type AssignmentDeadlineStatus =
  | "no_deadline"
  | "active"
  | "soon"
  | "overdue";

export type AssignmentDeadlineInfo = {
  status: AssignmentDeadlineStatus;
  label: string;
  className: string;
};

/**
 * Menentukan status deadline sebuah assignment.
 *
 * Aturan:
 * - Tidak ada due_date → no_deadline
 * - Sudah melewati deadline → overdue
 * - Kurang dari atau sama dengan 2 hari → soon
 * - Selain itu → active
 */
export function getAssignmentDeadlineStatus(
  dueDate: string | null,
): AssignmentDeadlineStatus {
  if (!dueDate) {
    return "no_deadline";
  }

  const deadline = new Date(dueDate);

  if (Number.isNaN(deadline.getTime())) {
    return "no_deadline";
  }

  const now = new Date();

  if (deadline.getTime() < now.getTime()) {
    return "overdue";
  }

  const difference =
    deadline.getTime() - now.getTime();

  const twoDays =
    2 * 24 * 60 * 60 * 1000;

  if (difference <= twoDays) {
    return "soon";
  }

  return "active";
}

/**
 * Mengambil informasi lengkap untuk ditampilkan
 * pada UI assignment.
 */
export function getAssignmentDeadlineInfo(
  dueDate: string | null,
): AssignmentDeadlineInfo {
  const status =
    getAssignmentDeadlineStatus(dueDate);

  switch (status) {
    case "overdue":
      return {
        status,
        label: "Terlambat",
        className:
          "text-red-400",
      };

    case "soon":
      return {
        status,
        label: "Segera Deadline",
        className:
          "text-yellow-400",
      };

    case "active":
      return {
        status,
        label: "Masih tersedia",
        className:
          "text-green-400",
      };

    case "no_deadline":
    default:
      return {
        status,
        label: "Tidak ada deadline",
        className:
          "text-slate-500",
      };
  }
}

/**
 * Format tanggal deadline untuk UI.
 */
export function formatAssignmentDeadline(
  dueDate: string | null,
): string {
  if (!dueDate) {
    return "Tidak ada deadline";
  }

  const date = new Date(dueDate);

  if (Number.isNaN(date.getTime())) {
    return "Tidak ada deadline";
  }

  return date.toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
}