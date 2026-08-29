import { redirect } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

import ScheduleHeader from "@/components/schedule/ScheduleHeader";
import CurrentLessonCard from "@/components/schedule/CurrentLessonCard";
import TodayScheduleCard from "@/components/schedule/TodayScheduleCard";
import WeekScheduleCard from "@/components/schedule/WeekScheduleCard";

import { getCurrentUser } from "@/lib/currentUser";
import { getCurrentBlock } from "@/services/blockService";

export default async function SchedulePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const block = getCurrentBlock();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ScheduleHeader block={block} />

        <div className="grid gap-6 xl:grid-cols-2">
          <CurrentLessonCard />

          <TodayScheduleCard />
        </div>

        <WeekScheduleCard />
      </div>
    </DashboardLayout>
  );
}
