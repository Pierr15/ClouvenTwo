import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  CheckCircle2,
  Cloud,
  GraduationCap,
  IdCard,
  Sparkles,
} from "lucide-react";

import type { Profile } from "@/services/profileService";

interface ProfileHeaderProps {
  profile: Profile;
}

export default function ProfileHeader({
  profile,
}: ProfileHeaderProps) {
  const initials = profile.full_name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <section className="relative overflow-hidden rounded-3xl border border-blue-500/15 bg-[#111a2e] shadow-xl shadow-blue-950/20">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl" />

        <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Top label */}
      <div className="relative flex items-center justify-between border-b border-white/5 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
            <Cloud className="h-4.5 w-4.5 text-white" />
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-white">
              CLOEV
            </p>

            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
              Cloud Eleven
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/70" />

          <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-300">
            Aktif
          </span>
        </div>
      </div>

      {/* Profile */}
      <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-7">
        {/* Avatar */}
        <div className="relative mx-auto shrink-0 sm:mx-0">
          <div className="absolute -inset-1.5 rounded-full bg-linear-to-br from-blue-500 via-cyan-400 to-blue-500 opacity-60 blur-md" />

          <Avatar className="relative h-28 w-28 border-4 border-[#111a2e] shadow-2xl sm:h-32 sm:w-32">
            <AvatarImage
              src={profile.photo_url ?? ""}
              alt={profile.full_name}
            />

            <AvatarFallback className="bg-linear-to-br from-blue-600 to-cyan-500 text-2xl font-black text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#111a2e] bg-emerald-500">
            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
          </div>
        </div>

        {/* Identity */}
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/5 px-3 py-1.5">
            <Sparkles className="h-3 w-3 text-cyan-400" />

            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-300">
              CLOEV Two
            </span>
          </div>

          <h1 className="warp-break-words text-2xl font-black tracking-tight text-white sm:text-3xl">
            {profile.full_name}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Siswa · XI TKJ 2
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <Badge
              variant="secondary"
              className="gap-2 border border-white/5 bg-[#091120] px-3 py-1.5 text-xs font-semibold text-slate-300"
            >
              <IdCard className="h-3.5 w-3.5 text-cyan-400" />
              NIS {profile.nis}
            </Badge>

            <Badge className="gap-2 border border-blue-400/15 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-500/10">
              <GraduationCap className="h-3.5 w-3.5" />
              {profile.class_name}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}