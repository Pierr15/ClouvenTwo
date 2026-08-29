import { redirect } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MemberContent from "@/components/members/MemberContent";
import MemberHeader from "@/components/members/MemberHeader";

import { getCurrentUser } from "@/lib/currentUser";
import { getAllMembers } from "@/services/memberService";

export default async function MembersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const members = await getAllMembers();

  return (
    <DashboardLayout>
      <MemberHeader totalMembers={members.length} />

      <MemberContent members={members} />
    </DashboardLayout>
  );
}