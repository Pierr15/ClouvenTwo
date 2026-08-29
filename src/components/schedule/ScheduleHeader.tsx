import { CalendarDays, Layers3 } from "lucide-react";

type Props = {
  block: "A" | "B";
};

export default function ScheduleHeader({
  block,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-cyan-500/10 p-4">
            <CalendarDays className="h-8 w-8 text-cyan-400" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              Jadwal Pelajaran
            </h1>

            <p className="mt-1 text-slate-400">
              Jadwal belajar XI TKJ 2
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-4">
          <Layers3 className="h-6 w-6 text-cyan-400" />

          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-400">
              Blok Aktif
            </p>

            <p className="text-2xl font-bold text-white">
              {block}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}