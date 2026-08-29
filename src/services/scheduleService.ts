import { getCurrentBlock } from "./blockService";
import { getCurrentLesson } from "./timeService";

export type SchoolDay =
  | "Senin"
  | "Selasa"
  | "Rabu"
  | "Kamis"
  | "Jumat";

export type Block = "A" | "B";

export interface Lesson {
  periods: number[];
  subject: string;
  teacher: string;
  room: string;
}

interface ScheduleRow {
  day: SchoolDay;
  block: Block;
  period_start: number;
  period_end: number;
  subject: string;
  teacher: string | null;
  room: string | null;
}

const days: SchoolDay[] = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
];

const emptyWeekSchedule = (): Record<
  SchoolDay,
  Lesson[]
> => ({
  Senin: [],
  Selasa: [],
  Rabu: [],
  Kamis: [],
  Jumat: [],
});

export function getToday(): SchoolDay | null {
  const day = new Date().getDay();

  if (day === 0 || day === 6) {
    return null;
  }

  return days[day - 1];
}

function convertLesson(
  row: ScheduleRow,
): Lesson {
  return {
    periods: Array.from(
      {
        length:
          row.period_end -
          row.period_start +
          1,
      },
      (_, index) =>
        row.period_start + index,
    ),
    subject: row.subject,
    teacher: row.teacher ?? "-",
    room: row.room ?? "-",
  };
}

/**
 * Mengambil jadwal berdasarkan hari dan blok.
 *
 * Data diambil melalui API server:
 *
 * Client
 *   ↓
 * /api/schedule
 *   ↓
 * supabaseAdmin
 *   ↓
 * schedules
 */
export async function getSchedule(
  day: SchoolDay,
  block: Block,
): Promise<Lesson[]> {
  try {
    const params = new URLSearchParams({
      day,
      block,
    });

    const response = await fetch(
      `/api/schedule?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return [];
    }

    const result = await response.json();

    if (
      !result.success ||
      !Array.isArray(result.items)
    ) {
      return [];
    }

    return (
      result.items as ScheduleRow[]
    ).map(convertLesson);
  } catch {
    return [];
  }
}

export async function getSubjects(
  day: SchoolDay,
  block: Block,
): Promise<Lesson[]> {
  return getSchedule(day, block);
}

export async function getLessonNow(
  day: SchoolDay,
  block: Block,
  lesson: number,
): Promise<Lesson | null> {
  const schedule = await getSchedule(
    day,
    block,
  );

  return (
    schedule.find((subject) =>
      subject.periods.includes(lesson),
    ) ?? null
  );
}

export async function getTodaySchedule(): Promise<
  Lesson[]
> {
  const today = getToday();

  if (!today) {
    return [];
  }

  const block = getCurrentBlock();

  return getSchedule(
    today,
    block,
  );
}

export async function getCurrentSubject(): Promise<
  Lesson | null
> {
  const today = getToday();

  if (!today) {
    return null;
  }

  const lesson = getCurrentLesson();

  if (!lesson) {
    return null;
  }

  const block = getCurrentBlock();

  return getLessonNow(
    today,
    block,
    lesson,
  );
}

export interface WeekLesson extends Lesson {
  day: SchoolDay;
  block: Block;
}

export async function getWeekSchedule(
  block: Block,
): Promise<
  Record<SchoolDay, Lesson[]>
> {
  try {
    const params = new URLSearchParams({
      block,
    });

    const response = await fetch(
      `/api/schedule?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return emptyWeekSchedule();
    }

    const result = await response.json();

    if (
      !result.success ||
      !Array.isArray(result.items)
    ) {
      return emptyWeekSchedule();
    }

    const resultSchedule =
      emptyWeekSchedule();

    (
      result.items as ScheduleRow[]
    ).forEach((row) => {
      if (
        resultSchedule[row.day]
      ) {
        resultSchedule[row.day].push(
          convertLesson(row),
        );
      }
    });

    return resultSchedule;
  } catch {
    return emptyWeekSchedule();
  }
}