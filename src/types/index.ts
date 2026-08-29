export interface Member {
  id: number;
  attendanceNumber: number;
  name: string;
  nis: string;
  birthDate: string;
  gender: "L" | "P";
  photo: string;
  role: string;
  isActive: boolean;
}

export interface Semester {
  startDate: string;
  endDate: string;
}

export interface AcademicYear {
  academicYear: string;
  class: string;
  firstSchoolDay: string;
  lastSchoolDay: string;
  schoolDays: string[];
  semesters: {
    ganjil: Semester;
    genap: Semester;
  };
}

export interface Holiday {
  date: string;
  name: string;
  isNationalHoliday: boolean;
}