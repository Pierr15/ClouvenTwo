import {
  BadgeInfo,
  GraduationCap,
  UserRound,
} from "lucide-react";

import type { Member } from "@/services/memberService";

type Props = {
  title: string;
  member: Member;
};

export default function LeaderCard({
  title,
  member,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold text-cyan-400">
        {title}
      </h2>

      <div className="flex flex-col items-center">
        <h3 className="text-center text-xl font-bold text-white">
          {member.full_name}
        </h3>

        <p className="mt-1 text-slate-400">
          {member.class_name}
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3">
          <BadgeInfo className="h-5 w-5 text-cyan-400" />

          <span className="text-slate-300">
            NIS
          </span>

          <span className="ml-auto font-medium text-white">
            {member.nis}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <UserRound className="h-5 w-5 text-cyan-400" />

          <span className="text-slate-300">
            Absen
          </span>

          <span className="ml-auto font-medium text-white">
            {member.attendance_number}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <GraduationCap className="h-5 w-5 text-cyan-400" />

          <span className="text-slate-300">
            Kelas
          </span>

          <span className="ml-auto font-medium text-white">
            {member.class_name}
          </span>
        </div>
      </div>
    </div>
  );
}