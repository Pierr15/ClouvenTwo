import Link from "next/link";
import {
  ArrowLeft,
  BadgeInfo,
  Cake,
  CircleCheckBig,
  GraduationCap,
  ShieldCheck,
  UserRound,
  VenusAndMars,
} from "lucide-react";
import type { ReactNode } from "react";

import type { Member } from "@/services/memberService";

type Props = {
  member: Member;
};

function calculateAge(birthDate: string | null) {
  if (!birthDate) return "-";

  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const month = today.getMonth() - birth.getMonth();

  if (
    month < 0 ||
    (month === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return `${age} Tahun`;
}

export default function MemberProfile({
  member,
}: Props) {
  return (
    <>
      <Link
        href="/members"
        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/5 bg-[#0d1628] px-4 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:text-cyan-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Members
      </Link>

      <section className="overflow-hidden rounded-2xl border border-white/5 bg-[#0d1628]">
        {/* PROFILE HEADER */}
        <div className="relative border-b border-white/5 bg-linear-to-br from-cyan-500/5 via-transparent to-blue-500/5 px-6 py-10 md:px-8">
          <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-cyan-400/5 blur-2xl" />

          <div className="relative flex flex-col items-center">
            {/* Initial */}
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10 shadow-lg shadow-cyan-500/5">
              <span className="text-4xl font-bold text-cyan-300">
                {member.full_name.charAt(0).toUpperCase()}
              </span>
            </div>

            <h1 className="mt-5 text-center text-2xl font-bold tracking-tight text-white md:text-3xl">
              {member.full_name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border border-cyan-400/10 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300">
                {member.class_name}
              </span>

              <span className="rounded-full border border-green-400/10 bg-green-500/10 px-4 py-1.5 text-xs font-semibold text-green-400">
                {member.role}
              </span>

              <span
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${
                  member.is_active
                    ? "border-emerald-400/10 bg-emerald-500/10 text-emerald-400"
                    : "border-red-400/10 bg-red-500/10 text-red-400"
                }`}
              >
                {member.is_active ? "Aktif" : "Tidak Aktif"}
              </span>
            </div>
          </div>
        </div>

        {/* INFORMATION */}
        <div className="p-6 md:p-8">
          <div className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-300">
              Informasi Anggota
            </h2>

            <p className="mt-1 text-xs text-slate-600">
              Informasi dasar anggota kelas XI TKJ 2.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <InfoItem
              icon={<BadgeInfo className="h-5 w-5 text-cyan-400" />}
              label="NIS"
              value={member.nis}
            />

            <InfoItem
              icon={<UserRound className="h-5 w-5 text-cyan-400" />}
              label="Nomor Absen"
              value={String(member.attendance_number)}
            />

            <InfoItem
              icon={
                <GraduationCap className="h-5 w-5 text-cyan-400" />
              }
              label="Kelas"
              value={member.class_name}
            />

            <InfoItem
              icon={
                <VenusAndMars className="h-5 w-5 text-cyan-400" />
              }
              label="Gender"
              value={
                member.gender === "L"
                  ? "Laki-laki"
                  : "Perempuan"
              }
            />

            <InfoItem
              icon={<Cake className="h-5 w-5 text-cyan-400" />}
              label="Tanggal Lahir"
              value={
                member.birth_date
                  ? new Date(
                      member.birth_date,
                    ).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )
                  : "-"
              }
            />

            <InfoItem
              icon={<Cake className="h-5 w-5 text-cyan-400" />}
              label="Umur"
              value={calculateAge(member.birth_date)}
            />

            <InfoItem
              icon={
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
              }
              label="Role"
              value={member.role}
            />

            <InfoItem
              icon={
                <CircleCheckBig
                  className={`h-5 w-5 ${
                    member.is_active
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                />
              }
              label="Status"
              value={
                member.is_active
                  ? "Aktif"
                  : "Tidak Aktif"
              }
            />
          </div>
        </div>
      </section>
    </>
  );
}

type InfoItemProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function InfoItem({
  icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-white/5 bg-[#091120] p-4 transition-all duration-200 hover:border-cyan-500/20 hover:bg-[#0b1426]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-cyan-500/10">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-600">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}