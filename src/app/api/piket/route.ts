import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/currentUser";

const days = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const day = days[new Date().getDay()];

  if (day === "Sabtu" || day === "Minggu") {
    return NextResponse.json({
      day,
      members: [],
      isSchoolDay: false,
      notes: [],
    });
  }

  const { data: group, error: groupError } =
    await supabaseAdmin
      .from("picket_groups")
      .select("id, day, notes")
      .eq("day", day)
      .single();

  if (groupError || !group) {
    return NextResponse.json({
      day,
      members: [],
      isSchoolDay: true,
      notes: [],
    });
  }

  const { data: relations, error: relationError } =
    await supabaseAdmin
      .from("picket_members")
      .select("member_id")
      .eq("group_id", group.id);

  if (relationError) {
    return NextResponse.json(
      { error: "Gagal mengambil anggota piket" },
      { status: 500 }
    );
  }

  const memberIds =
    relations?.map((item) => item.member_id) ?? [];

  let members: string[] = [];

  if (memberIds.length > 0) {
    const { data: memberData } =
      await supabaseAdmin
        .from("members")
        .select("full_name")
        .in("id", memberIds)
        .order("attendance_number");

    members =
      memberData?.map(
        (member) => member.full_name
      ) ?? [];
  }

  return NextResponse.json({
    day,
    members,
    isSchoolDay: true,
    notes: group.notes
      ? [group.notes]
      : [],
  });
}