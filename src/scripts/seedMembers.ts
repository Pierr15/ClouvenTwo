import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import members from "@/data/members.json";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seedMembers() {
  console.log("🚀 Import members...");

  const rows = members.map((member) => ({
    attendance_number: member.attendanceNumber,
    nis: member.nis,
    full_name: member.name,
    birth_date: member.birthDate || null,
    gender: member.gender,
    photo_url: member.photo || null,
    class_name: member.class,
    role: member.role,
    is_birthday_filled: member.isBirthdayFilled,
    is_active: member.isActive,
  }));

  const { error } = await supabase.from("members").insert(rows);

  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(`✅ Berhasil mengimport ${rows.length} siswa.`);
}

seedMembers();