import { Cake } from "lucide-react";

import { getTodayBirthdays } from "@/services/birthdayService";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default async function BirthdayCard() {
  const birthdays = await getTodayBirthdays();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center gap-2">
        <Cake className="h-6 w-6 text-pink-400" />

        <h2 className="text-xl font-bold text-white">
          Ulang Tahun Hari Ini
        </h2>
      </div>

      {birthdays.length === 0 ? (
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4 text-center text-slate-400">
          Tidak ada siswa yang berulang tahun hari ini.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {birthdays.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 rounded-xl border border-pink-900/40 bg-pink-950/20 p-4 transition-all duration-300 hover:border-pink-500"
            >
              <Avatar size="lg">
                <AvatarImage
                  alt={member.full_name}
                />

                <AvatarFallback>
                  {member.full_name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h3 className="font-semibold text-white">
                  {member.full_name}
                </h3>

                <p className="text-sm text-slate-400">
                  berusia {member.age} tahun hari ini 🎉
                </p>
              </div>

              <Cake className="h-5 w-5 text-pink-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}