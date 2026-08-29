export interface Holiday {
  date: string;
  name: string;
  isNationalHoliday: boolean;
}

export async function getHolidays(): Promise<Holiday[]> {
  return [];
}

export async function isHoliday(date: Date): Promise<boolean> {
  return date instanceof Date && false;
}