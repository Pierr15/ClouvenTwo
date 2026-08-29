"use client";

import { useEffect, useState } from "react";

import { CalendarRange, BookOpen, Clock3, Layers3 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { getCurrentBlock } from "@/services/blockService";

import { getWeekSchedule, type Lesson } from "@/services/scheduleService";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] as const;

type DayName = (typeof days)[number];

export default function WeekScheduleCard() {
  const [loading, setLoading] = useState(true);

  const [schedule, setSchedule] = useState<Record<DayName, Lesson[]>>({
    Senin: [],
    Selasa: [],
    Rabu: [],
    Kamis: [],
    Jumat: [],
  });

  const block = getCurrentBlock();

  useEffect(() => {
    async function load() {
      const data = await getWeekSchedule(block);

      setSchedule(data);

      setLoading(false);
    }

    load();
  }, [block]);

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarRange className="h-6 w-6 text-cyan-400" />

            <h2 className="text-xl font-semibold">Jadwal Mingguan</h2>
          </div>

          <span className="rounded-xl bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
            Blok {block}
          </span>
        </div>

        {loading ? (
          <p className="text-slate-400">Memuat jadwal...</p>
        ) : (
          <div className="space-y-6">
            {days.map((day) => (
              <div
                key={day}
                className="rounded-xl border border-slate-800 bg-slate-950 p-5"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Layers3 className="h-5 w-5 text-cyan-400" />

                  <h3 className="text-lg font-bold text-white">{day}</h3>
                </div>

                {schedule[day].length === 0 ? (
                  <p className="text-slate-500">Tidak ada jadwal.</p>
                ) : (
                  <div className="space-y-3">
                    {schedule[day].map((lesson, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-cyan-400" />

                          <span className="font-semibold text-white">
                            {lesson.subject}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                          <Clock3 className="h-4 w-4" />
                          Jam {lesson.periods.join(", ")}
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {lesson.teacher}
                        </p>

                        <p className="text-xs text-slate-500">{lesson.room}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
