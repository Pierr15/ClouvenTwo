import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/currentUser";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardGrid from "../../components/dashboard/DashboardGrid";

import QuickMenu from "../../components/dashboard/QuickMenu";

import TodayScheduleCard from "@/components/dashboard/cards/TodayScheduleCard";
import TodayPicketCard from "@/components/dashboard/cards/TodayPicketCard";
import BirthdayCard from "@/components/dashboard/cards/BirthdayCard";
import WeatherCard from "@/components/dashboard/cards/WeatherCard";

import LogoutButton from "../../components/auth/LogoutButton";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        fullName={user.full_name}
      />

      <DashboardGrid>
        <QuickMenu />

        <TodayScheduleCard />

        <TodayPicketCard />

        <BirthdayCard />

        <WeatherCard />

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Informasi Akun
          </h2>

          <div className="mt-4 space-y-2 text-slate-300">
            <p>
              <span className="font-medium text-white">
                Nama:
              </span>{" "}
              {user.full_name}
            </p>

            <p>
              <span className="font-medium text-white">
                NIS:
              </span>{" "}
              {user.nis}
            </p>
          </div>

          <div className="mt-6">
            <LogoutButton />
          </div>
        </div>
      </DashboardGrid>
    </DashboardLayout>
  );
}