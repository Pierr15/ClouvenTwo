import academicYears from "@/data/academicYears.json";
import type { AcademicYear } from "@/types";

const academicData = academicYears as AcademicYear[];

export function getAcademicYear() {
  return academicData[0];
}

export function getCurrentSemester(): "ganjil" | "genap" | null {
  const today = new Date();

  const academic = getAcademicYear();

  const ganjilStart = new Date(academic.semesters.ganjil.startDate);
  const ganjilEnd = new Date(academic.semesters.ganjil.endDate);

  if (today >= ganjilStart && today <= ganjilEnd) {
    return "ganjil";
  }

  const genapStart = new Date(academic.semesters.genap.startDate);
  const genapEnd = new Date(academic.semesters.genap.endDate);

  if (today >= genapStart && today <= genapEnd) {
    return "genap";
  }

  return null;
}

export function isSchoolDay(date: Date): boolean {
  const academic = getAcademicYear();

  const firstDay = new Date(academic.firstSchoolDay);
  const lastDay = new Date(academic.lastSchoolDay);

  return date >= firstDay && date <= lastDay;
}