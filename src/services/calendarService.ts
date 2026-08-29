export interface CalendarInfo {
  currentDate: Date;
  dayName: string;
  dayNumber: number;
  month: number;
  monthName: string;
  year: number;
  isWeekend: boolean;
}

export interface HolidayInfo {
  date: string;
  name: string;
  localName: string;
  countryCode: string;
}

/* ==================================================
   CONSTANTS
================================================== */

const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const HOLIDAY_API =
  "https://date.nager.at/api/v3/PublicHolidays";

/* ==================================================
   CALENDAR INFO
================================================== */

export function getCalendarInfo(): CalendarInfo {
  const today = new Date();

  return {
    currentDate: today,

    dayName:
      DAY_NAMES[today.getDay()],

    dayNumber:
      today.getDate(),

    month:
      today.getMonth() + 1,

    monthName:
      MONTH_NAMES[today.getMonth()],

    year:
      today.getFullYear(),

    isWeekend:
      today.getDay() === 0 ||
      today.getDay() === 6,
  };
}

/* ==================================================
   GET INDONESIA HOLIDAYS
================================================== */

export async function getIndonesiaHolidays(
  year: number,
): Promise<HolidayInfo[]> {
  try {
    const response = await fetch(
      `${HOLIDAY_API}/${year}/ID`,
      {
        next: {
          revalidate: 86400,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        "Gagal mengambil data kalender Indonesia.",
      );
    }

    const data =
      (await response.json()) as Array<{
        date: string;
        name: string;
        localName: string;
        countryCode: string;
      }>;

    return data.map(
      (holiday) => ({
        date: holiday.date,
        name: holiday.name,
        localName:
          holiday.localName,
        countryCode:
          holiday.countryCode,
      }),
    );
  } catch (error) {
    console.error(
      "Calendar API error:",
      error,
    );

    return [];
  }
}

/* ==================================================
   CHECK HOLIDAY
================================================== */

export async function isIndonesiaHoliday(
  date: Date,
): Promise<boolean> {
  const year =
    date.getFullYear();

  const iso =
    date.toISOString()
      .split("T")[0];

  const holidays =
    await getIndonesiaHolidays(
      year,
    );

  return holidays.some(
    (holiday) =>
      holiday.date === iso,
  );
}