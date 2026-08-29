import { redirect } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ExplorerContent from "@/components/explorer/ExplorerContent";

import { getCurrentUser } from "@/lib/currentUser";

export default async function ExplorerPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout>
      <ExplorerContent />
    </DashboardLayout>
  );
}