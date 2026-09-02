import { redirect } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

import ApelHeader from "@/components/apel/ApelHeader";
import LeaderTodayCard from "@/components/apel/LeaderTodayCard";
import NextLeaderCard from "@/components/apel/NextLeaderCard";
import BackButton from "@/components/navigation/BackButton";

import { getCurrentUser } from "@/lib/currentUser";

export default async function ApelPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full space-y-6">
        <BackButton href="/dashboard">Kembali ke Dashboard</BackButton>

        <ApelHeader />

        <div className="grid gap-6 lg:grid-cols-2">
          <LeaderTodayCard />
          <NextLeaderCard />
        </div>
      </div>
    </DashboardLayout>
  );
}
