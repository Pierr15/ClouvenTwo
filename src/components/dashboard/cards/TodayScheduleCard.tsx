"use client";

import { useEffect, useState } from "react";

import {
  BookOpen,
  Clock3,
  DoorOpen,
  UserRound,
} from "lucide-react";

import {
  getCurrentSubject,
  getTodaySchedule,
  type Lesson,
} from "@/services/scheduleService";

export default function TodayScheduleCard() {
  const [current, setCurrent] =
    useState<Lesson | null>(null);

  const [schedule, setSchedule] =
    useState<Lesson[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      const [
        currentLesson,
        todaySchedule,
      ] = await Promise.all([
        getCurrentSubject(),
        getTodaySchedule(),
      ]);

      setCurrent(currentLesson);
      setSchedule(todaySchedule);
      setLoading(false);
    }

    load();

    const interval = setInterval(
      load,
      60000,
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-cyan-400" />

        <h2 className="text-xl font-bold text-white">
          Jadwal Hari Ini
        </h2>
      </div>

      {loading ? (
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-slate-400">
            Memuat jadwal...
          </p>
        </div>
      ) : current ? (
        <div className="mt-5 rounded-xl border border-cyan-700 bg-cyan-950/30 p-4">
          <p className="text-xs uppercase tracking-wider text-cyan-400">
            Sedang Berlangsung
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            {current.subject}
          </h3>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <UserRound className="h-4 w-4 text-cyan-400" />

              <span>
                {current.teacher}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-300">
              <DoorOpen className="h-4 w-4 text-cyan-400" />

              <span>
                {current.room}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock3 className="h-4 w-4 text-cyan-400" />

              <span>
                Jam{" "}
                {current.periods.join(", ")}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
          <p className="text-slate-400">
            Saat ini tidak ada pelajaran yang sedang berlangsung.
          </p>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="rounded-lg bg-slate-950 p-4">
            <p className="text-slate-400">
              Memuat jadwal hari ini...
            </p>
          </div>
        ) : schedule.length === 0 ? (
          <div className="rounded-lg bg-slate-950 p-4">
            <p className="text-slate-400">
              Tidak ada jadwal hari ini.
            </p>
          </div>
        ) : (
          schedule.map(
            (lesson, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-cyan-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-cyan-400" />

                    <h3 className="font-semibold text-white">
                      {lesson.subject}
                    </h3>
                  </div>

                  <span className="flex items-center gap-1 rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                    <Clock3 className="h-3 w-3" />

                    Jam{" "}
                    {lesson.periods.join(
                      ", ",
                    )}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <UserRound className="h-4 w-4 text-cyan-400" />

                    <span>
                      {lesson.teacher}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <DoorOpen className="h-4 w-4" />

                    <span>
                      {lesson.room}
                    </span>
                  </div>
                </div>
              </div>
            ),
          )
        )}
      </div>
    </div>
  );
}