import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import piket from "@/data/piket.json";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Day = "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat";

async function seedPicket() {
  console.log("🚀 Import picket...");

  for (const day of Object.keys(piket.schedule) as Day[]) {
    const members = piket.schedule[day].members;

    // Buat grup piket
    const { data: group, error: groupError } = await supabase
      .from("picket_groups")
      .insert({
        day,
        notes: piket.notes.join("\n"),
      })
      .select()
      .single();

    if (groupError) {
      console.error(groupError);
      return;
    }

    for (const fullName of members) {
      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("id")
        .eq("full_name", fullName)
        .single();

      if (memberError || !member) {
        console.warn(`⚠ Member tidak ditemukan: ${fullName}`);
        continue;
      }

      const { error } = await supabase
        .from("picket_members")
        .insert({
          group_id: group.id,
          member_id: member.id,
        });

      if (error) {
        console.error(error);
      }
    }
  }

  console.log("✅ Piket berhasil diimport.");
}

seedPicket();