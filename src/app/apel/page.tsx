import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

import ApelHeader from "@/components/apel/ApelHeader";
import LeaderTodayCard from "@/components/apel/LeaderTodayCard";
import NextLeaderCard from "@/components/apel/NextLeaderCard";

import { getCurrentUser } from "@/lib/currentUser";

export default async function ApelPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Dashboard
      </Link>

      <ApelHeader />

      <div className="grid gap-6 lg:grid-cols-2">
        <LeaderTodayCard />
        <NextLeaderCard />
      </div>
    </DashboardLayout>
  );
}
