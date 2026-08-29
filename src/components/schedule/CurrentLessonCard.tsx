"use client";

import { useEffect, useState } from "react";

import {
  BookOpen,
  Clock3,
  DoorOpen,
  UserRound,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import {
  getCurrentSubject,
  type Lesson,
} from "@/services/scheduleService";

export default function CurrentLessonCard() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const currentLesson = await getCurrentSubject();

      setLesson(currentLesson);
      setLoading(false);
    }

    load();

    const interval = setInterval(load, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-slate-800 bg-slate-900">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-cyan-400" />

          <h2 className="text-xl font-semibold text-white">
            Pelajaran Saat Ini
          </h2>
        </div>

        {loading ? (
          <p className="text-slate-400">
            Memuat pelajaran...
          </p>
        ) : lesson ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {lesson.subject}
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <UserRound className="h-5 w-5 text-cyan-400" />

                <span>{lesson.teacher}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <DoorOpen className="h-5 w-5 text-cyan-400" />

                <span>{lesson.room}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <Clock3 className="h-5 w-5 text-cyan-400" />

                <span>
                  Jam {lesson.periods.join(", ")}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-slate-400">
              Tidak ada pelajaran yang sedang berlangsung.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}