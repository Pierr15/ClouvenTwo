import {
  CalendarDays,
  GraduationCap,
  Hash,
  User,
  Users,
  BadgeInfo,
} from "lucide-react";

import type { Profile } from "@/services/profileService";

interface ProfileInfoProps {
  profile: Profile;
}

export default function ProfileInfo({
  profile,
}: ProfileInfoProps) {
  const birthDate = profile.birth_date
    ? new Date(profile.birth_date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  const items = [
    {
      icon: User,
      label: "Nama Lengkap",
      value: profile.full_name,
      iconClass: "text-cyan-400",
      bgClass: "bg-cyan-500/10",
    },
    {
      icon: Hash,
      label: "NIS",
      value: profile.nis,
      iconClass: "text-blue-400",
      bgClass: "bg-blue-500/10",
    },
    {
      icon: BadgeInfo,
      label: "Nomor Absen",
      value: String(profile.attendance_number),
      iconClass: "text-violet-400",
      bgClass: "bg-violet-500/10",
    },
    {
      icon: Users,
      label: "Jenis Kelamin",
      value: profile.gender,
      iconClass: "text-pink-400",
      bgClass: "bg-pink-500/10",
    },
    {
      icon: CalendarDays,
      label: "Tanggal Lahir",
      value: birthDate,
      iconClass: "text-amber-400",
      bgClass: "bg-amber-500/10",
    },
    {
      icon: GraduationCap,
      label: "Kelas",
      value: profile.class_name,
      iconClass: "text-emerald-400",
      bgClass: "bg-emerald-500/10",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-blue-500/10 bg-[#111a2e] p-5 shadow-lg shadow-blue-950/10 sm:p-6">
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              Profil Siswa
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Informasi Siswa
            </h2>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/3">
            <GraduationCap className="h-5 w-5 text-cyan-400" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="group rounded-2xl border border-white/5 bg-[#091120] p-4 transition-all duration-200 hover:border-cyan-400/15 hover:bg-[#0c1628]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bgClass}`}
                  >
                    <Icon
                      className={`h-5 w-5 ${item.iconClass}`}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      {item.label}
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-slate-200">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}