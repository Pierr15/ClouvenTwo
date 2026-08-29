const days = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;

export interface PiketToday {
  day: string;
  members: string[];
  isSchoolDay: boolean;
  notes: string[];
}

function emptyPiket(
  day: string,
  isSchoolDay = true,
): PiketToday {
  return {
    day,
    members: [],
    isSchoolDay,
    notes: [],
  };
}

export async function getTodayPiket(
  date: Date = new Date(),
): Promise<PiketToday> {
  const day = days[date.getDay()];

  if (day === "Sabtu" || day === "Minggu") {
    return emptyPiket(day, false);
  }

  try {
    const response = await fetch("/api/piket", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return emptyPiket(day);
    }

    const data = (await response.json()) as PiketToday;

    return data;
  } catch {
    return emptyPiket(day);
  }
}

export async function getPiketByDay(
  day: string,
) {
  const response = await fetch(
    `/api/piket?day=${encodeURIComponent(day)}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function getAllPiket() {
  const response = await fetch("/api/piket/all", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export async function getPiketNotes() {
  const response = await fetch("/api/piket/notes", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export async function isPiketToday(
  name: string,
) {
  const today = await getTodayPiket();

  return today.members.some(
    (member) =>
      member.toLowerCase() ===
      name.toLowerCase(),
  );
}