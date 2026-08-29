"use client";

import { useEffect, useState } from "react";

import {
  BookMarked,
  Clock3,
  DoorOpen,
  UserRound,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import {
  getTodaySchedule,
  type Lesson,
} from "@/services/scheduleService";

export default function TodayScheduleCard() {
  const [schedule, setSchedule] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getTodaySchedule();

      setSchedule(data);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <BookMarked className="h-6 w-6 text-cyan-400" />

          <h2 className="text-xl font-semibold text-white">
            Jadwal Hari Ini
          </h2>
        </div>

        {loading ? (
          <p className="text-slate-400">
            Memuat jadwal...
          </p>
        ) : schedule.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-slate-400">
              Tidak ada jadwal hari ini.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedule.map((lesson, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-950 p-5 transition hover:border-cyan-500"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {lesson.subject}
                  </h3>

                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                    Jam {lesson.periods.join(", ")}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-3 text-slate-300">
                    <UserRound className="h-4 w-4 text-cyan-400" />

                    <span>{lesson.teacher}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300">
                    <DoorOpen className="h-4 w-4 text-cyan-400" />

                    <span>{lesson.room}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300">
                    <Clock3 className="h-4 w-4 text-cyan-400" />

                    <span>
                      Periode {lesson.periods.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}