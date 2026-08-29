import schoolConfig from "@/data/schoolConfig.json";

export type BlockType = "A" | "B";

/**
 * Menghitung selisih minggu dari tanggal awal blok.
 */
function getWeekDifference(start: Date, current: Date): number {
  const diffTime = current.getTime() - start.getTime();

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return Math.floor(diffDays / 7);
}

/**
 * Mengembalikan blok aktif (A/B)
 */
export function getCurrentBlock(date: Date = new Date()): BlockType {
  const startDate = new Date(schoolConfig.blocks.startDate);

  const week = getWeekDifference(startDate, date);

  if (schoolConfig.blocks.startBlock === "A") {
    return week % 2 === 0 ? "A" : "B";
  }

  return week % 2 === 0 ? "B" : "A";
}

/**
 * Mengembalikan nomor minggu sejak awal tahun ajaran.
 */
export function getCurrentWeek(date: Date = new Date()) {
  const startDate = new Date(schoolConfig.blocks.startDate);

  return getWeekDifference(startDate, date) + 1;
}

/**
 * Mengecek apakah blok A aktif.
 */
export function isBlockA(date: Date = new Date()) {
  return getCurrentBlock(date) === "A";
}

/**
 * Mengecek apakah blok B aktif.
 */
export function isBlockB(date: Date = new Date()) {
  return getCurrentBlock(date) === "B";
}