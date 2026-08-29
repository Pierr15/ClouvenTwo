"use client";

import { useMemo, useState } from "react";

import MemberGrid from "./MemberGrid";
import MemberSearch from "./MemberSearch";

import type { Member } from "@/services/memberService";

type Props = {
  members: Member[];
};

export default function MemberContent({ members }: Props) {
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [status, setStatus] = useState("all");

  const filteredMembers = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return members.filter((member) => {
      const matchSearch =
        member.full_name.toLowerCase().includes(keyword) ||
        member.nis.includes(keyword) ||
        String(member.attendance_number).includes(keyword);

      const matchGender = gender === "all" || member.gender === gender;

      const matchStatus =
        status === "all" ||
        (status === "active" ? member.is_active : !member.is_active);

      return matchSearch && matchGender && matchStatus;
    });
  }, [members, search, gender, status]);

  return (
    <>
      <MemberSearch value={search} onChange={setSearch} />

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
        >
          <option value="all">Semua Gender</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>

      <MemberGrid members={filteredMembers} />
    </>
  );
}
