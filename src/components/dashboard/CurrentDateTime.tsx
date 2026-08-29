"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

export default function CurrentDateTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const date = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(now);

  const time = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(now);

  return (
    <div className="flex flex-col items-start lg:items-end">
      <div className="flex items-center gap-2 text-cyan-400">
        <Clock3 className="h-5 w-5" />

        <span className="text-sm font-medium">
          Waktu Saat Ini
        </span>
      </div>

      <p className="mt-2 text-slate-400" suppressHydrationWarning>
        {date}
      </p>

      <p
        className="mt-1 text-4xl font-bold tracking-widest text-cyan-400"
        suppressHydrationWarning
      >
        {time}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        WIB (UTC+7)
      </p>
    </div>
  );
}