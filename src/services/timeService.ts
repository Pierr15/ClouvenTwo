import schoolConfig from "@/data/schoolConfig.json";
import holidays from "@/data/holidays.json";

export type SchoolStatus =
  | "before-school"
  | "learning"
  | "break"
  | "after-school"
  | "holiday";

export type Holiday = {
  date: string;
  name: string;
};

const lessonTimes = schoolConfig.lessonTimes;

export function getCurrentDate() {
  return new Date();
}

export function getCurrentDayName() {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    timeZone: "Asia/Jakarta",
  }).format(new Date());
}

export function isWeekend() {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

export function isHoliday(date = new Date()) {
  const iso = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
  }).format(date);

  return (holidays.holidays as Holiday[]).some(
    (holiday) => holiday.date === iso,
  );
}

function toMinute(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export function getCurrentMinute() {
  const now = new Date();

  return (
    now
      .toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })
      .split(":")
      .map(Number)[0] *
      60 +
    now
      .toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })
      .split(":")
      .map(Number)[1]
  );
}

export function getCurrentLesson() {
  const minute = getCurrentMinute();

  for (const lesson of lessonTimes) {
    if (minute >= toMinute(lesson.start) && minute <= toMinute(lesson.end)) {
      return lesson.lesson;
    }
  }

  return null;
}

export function getSchoolStatus(): SchoolStatus {
  if (isWeekend() || isHoliday()) {
    return "holiday";
  }

  const minute = getCurrentMinute();

  const firstLesson = toMinute(lessonTimes[0].start);
  const lastLesson = toMinute(lessonTimes[lessonTimes.length - 1].end);

  if (minute < firstLesson) {
    return "before-school";
  }

  if (minute > lastLesson) {
    return "after-school";
  }

  for (const item of schoolConfig.breaks) {
    if (minute >= toMinute(item.start) && minute <= toMinute(item.end)) {
      return "break";
    }
  }

  return "learning";
}
