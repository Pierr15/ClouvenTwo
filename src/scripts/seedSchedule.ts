import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import schedule from "@/data/schedule.json";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Day = "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat";

type Lesson = {
  periods: number[];
  subject: string;
  teacher: string;
  room: string;
};

type ScheduleRow = {
  day: string;
  block: string;
  period_start: number;
  period_end: number;
  subject: string;
  teacher: string | null;
  room: string | null;
};

async function seedSchedule() {
  console.log("🚀 Import schedule...");

  const rows: ScheduleRow[] = [];

  for (const block of ["A", "B"] as const) {
    const days = schedule.blocks[block];

    for (const day of Object.keys(days) as Day[]) {
      const lessons = days[day] as Lesson[];

      for (const lesson of lessons) {
        rows.push({
          day,
          block,
          period_start: lesson.periods[0],
          period_end: lesson.periods[lesson.periods.length - 1],
          subject: lesson.subject,
          teacher: lesson.teacher || null,
          room: lesson.room || null,
        });
      }
    }
  }

  const { error } = await supabase.from("schedules").insert(rows);

  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(`✅ Berhasil import ${rows.length} jadwal.`);
}

seedSchedule();