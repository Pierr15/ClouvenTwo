import MemberCard from "./MemberCard";
import type { Member } from "@/services/memberService";

type Props = {
  members: Member[];
};

export default function MemberGrid({
  members,
}: Props) {
  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">
        <h2 className="text-lg font-semibold text-white">
          Belum ada data anggota.
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Data anggota kelas akan muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
        />
      ))}
    </div>
  );
}