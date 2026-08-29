import { supabase } from "@/lib/supabase";

export interface BirthdayMember {
  id: string;
  full_name: string;
  nis: string;
  birth_date: string;
  age: number;
}

export async function getTodayBirthdays(): Promise<BirthdayMember[]> {
  const now = new Date();

  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
  }).format(now);

  const [year, month, day] = today
    .split("-")
    .map(Number);

  const { data, error } = await supabase
    .from("members")
    .select("id, full_name, nis, birth_date")
    .not("birth_date", "is", null);

  if (error) {
    return [];
  }

  return (
    data
      ?.filter((member) => {
        if (!member.birth_date) {
          return false;
        }

        const birth = new Date(`${member.birth_date}T00:00:00`);

        return (
          birth.getUTCMonth() + 1 === month &&
          birth.getUTCDate() === day
        );
      })
      .map((member) => {
        const birth = new Date(
          `${member.birth_date}T00:00:00`,
        );

        let age = year - birth.getUTCFullYear();

        const birthdayPassed =
          month > birth.getUTCMonth() + 1 ||
          (month === birth.getUTCMonth() + 1 &&
            day >= birth.getUTCDate());

        if (!birthdayPassed) {
          age--;
        }

        return {
          id: member.id,
          full_name: member.full_name,
          nis: member.nis,
          birth_date: member.birth_date,
          age,
        };
      })
      .sort((a, b) =>
        a.full_name.localeCompare(b.full_name),
      ) ?? []
  );
}