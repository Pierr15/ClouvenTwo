import {
  isIndonesiaHoliday,
} from "./calendarService";

import {
  getAllMembers,
  type Member,
} from "./memberService";

/*
 * ==================================================
 * KONFIGURASI APEL
 * ==================================================
 *
 * Apel pertama:
 * Rabu, 22 Juli 2026
 *
 * Nomor absen pertama:
 * 1
 *
 * Hari apel:
 * - Selasa
 * - Rabu
 * - Kamis
 *
 * Hari Senin/Jumat/Sabtu/Minggu
 * tidak dihitung.
 *
 * Tanggal merah/libur nasional
 * juga tidak dihitung.
 */
const START_DATE = new Date(
  "2026-07-22T00:00:00+07:00",
);

const START_ABSEN = 1;

/*
 * ==================================================
 * CEK HARI APEL
 * ==================================================
 *
 * Selasa = 2
 * Rabu   = 3
 * Kamis  = 4
 */
async function isApelDay(
  date: Date,
): Promise<boolean> {
  const day = date.getDay();

  // Hanya Selasa, Rabu, Kamis
  if (
    day !== 2 &&
    day !== 3 &&
    day !== 4
  ) {
    return false;
  }

  // Libur nasional tidak dihitung
  if (
    await isIndonesiaHoliday(date)
  ) {
    return false;
  }

  return true;
}

/*
 * ==================================================
 * HITUNG JUMLAH HARI APEL YANG TELAH LEWAT
 * ==================================================
 *
 * Menghitung hari apel sejak START_DATE
 * sampai SEBELUM tanggal yang diperiksa.
 *
 * Contoh:
 *
 * 22 Juli = Absen 1
 * 23 Juli = Absen 2
 * ...
 *
 * Jika ada tanggal merah:
 *
 * 25 Agustus = LIBUR
 * 26 Agustus = nomor berikutnya
 */
async function getPassedApelDays(
  date: Date,
): Promise<number> {
  let count = 0;

  const current = new Date(
    START_DATE,
  );

  while (current < date) {
    if (
      await isApelDay(current)
    ) {
      count++;
    }

    current.setDate(
      current.getDate() + 1,
    );
  }

  return count;
}

/*
 * ==================================================
 * HITUNG NOMOR ABSEN PEMIMPIN
 * ==================================================
 */
async function getCurrentAttendanceNumber(
  totalStudents: number,
  date: Date,
): Promise<number> {
  const passed =
    await getPassedApelDays(date);

  return (
    (START_ABSEN - 1 + passed) %
      totalStudents
  ) + 1;
}

/*
 * ==================================================
 * PEMIMPIN APEL BERDASARKAN TANGGAL
 * ==================================================
 */
export async function getLeaderByDate(
  date: Date = new Date(),
): Promise<Member | null> {
  const members =
    await getAllMembers();

  const students = members
    .filter(
      (member) =>
        member.role === "student" &&
        member.is_active,
    )
    .sort(
      (a, b) =>
        a.attendance_number -
        b.attendance_number,
    );

  if (students.length === 0) {
    return null;
  }

  const attendanceNumber =
    await getCurrentAttendanceNumber(
      students.length,
      date,
    );

  return (
    students.find(
      (member) =>
        member.attendance_number ===
        attendanceNumber,
    ) ?? null
  );
}

/*
 * ==================================================
 * PEMIMPIN APEL HARI INI
 * ==================================================
 */
export async function getLeaderToday() {
  return getLeaderByDate(
    new Date(),
  );
}

/*
 * ==================================================
 * PEMIMPIN APEL BERIKUTNYA
 * ==================================================
 *
 * Mulai dari besok.
 *
 * Akan melewati:
 * - Jumat
 * - Sabtu
 * - Minggu
 * - Senin
 * - tanggal merah
 *
 * sampai menemukan:
 * Selasa/Rabu/Kamis yang merupakan
 * hari sekolah.
 */
export async function getNextLeader() {
  const next = new Date();

  next.setDate(
    next.getDate() + 1,
  );

  while (
    !(await isApelDay(next))
  ) {
    next.setDate(
      next.getDate() + 1,
    );
  }

  return getLeaderByDate(next);
}