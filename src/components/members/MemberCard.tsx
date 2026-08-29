import Link from "next/link";
import {
  BadgeInfo,
  GraduationCap,
  UserRound,
} from "lucide-react";

import type { Member } from "@/services/memberService";

type Props = {
  member: Member;
};

export default function MemberCard({ member }: Props) {
  return (
    <Link href={`/members/${member.nis}`} className="group">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10">
        <div className="flex flex-col items-center">
          <h2 className="text-center text-lg font-bold text-white">
            {member.full_name}
          </h2>

          <span className="mt-1 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
            {member.role}
          </span>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <BadgeInfo className="h-4 w-4 text-cyan-400" />

            <span>NIS</span>

            <span className="ml-auto font-medium text-white">
              {member.nis}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <UserRound className="h-4 w-4 text-cyan-400" />

            <span>Absen</span>

            <span className="ml-auto font-medium text-white">
              {member.attendance_number}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <GraduationCap className="h-4 w-4 text-cyan-400" />

            <span>Kelas</span>

            <span className="ml-auto font-medium text-white">
              {member.class_name}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}