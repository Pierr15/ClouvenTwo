import {
  CalendarPlus,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import type { Profile } from "@/services/profileService";

interface ProfileAboutProps {
  profile: Profile;
}

export default function ProfileAbout({
  profile,
}: ProfileAboutProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const accountItems = [
    {
      icon: ShieldCheck,
      label: "Role",
      value: profile.role,
      iconClass: "text-blue-400",
      bgClass: "bg-blue-500/10",
    },
    {
      icon: profile.is_active ? CheckCircle2 : CircleAlert,
      label: "Status Akun",
      value: profile.is_active ? "Aktif" : "Nonaktif",
      iconClass: profile.is_active
        ? "text-emerald-400"
        : "text-red-400",
      bgClass: profile.is_active
        ? "bg-emerald-500/10"
        : "bg-red-500/10",
    },
    {
      icon: CalendarPlus,
      label: "Data Ulang Tahun",
      value: profile.is_birthday_filled
        ? "Sudah Diisi"
        : "Belum Diisi",
      iconClass: profile.is_birthday_filled
        ? "text-cyan-400"
        : "text-amber-400",
      bgClass: profile.is_birthday_filled
        ? "bg-cyan-500/10"
        : "bg-amber-500/10",
    },
    {
      icon: CheckCircle2,
      label: "First Login",
      value: profile.first_login_completed
        ? "Selesai"
        : "Belum Selesai",
      iconClass: profile.first_login_completed
        ? "text-emerald-400"
        : "text-amber-400",
      bgClass: profile.first_login_completed
        ? "bg-emerald-500/10"
        : "bg-amber-500/10",
    },
    {
      icon: Clock3,
      label: "Akun Dibuat",
      value: formatDate(profile.created_at),
      iconClass: "text-violet-400",
      bgClass: "bg-violet-500/10",
    },
    {
      icon: Clock3,
      label: "Terakhir Diperbarui",
      value: formatDate(profile.updated_at),
      iconClass: "text-sky-400",
      bgClass: "bg-sky-500/10",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-blue-500/10 bg-[#111a2e] p-5 shadow-lg shadow-blue-950/10 sm:p-6">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              Akun
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              Informasi Akun
            </h2>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/3">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {accountItems.map((item) => {
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