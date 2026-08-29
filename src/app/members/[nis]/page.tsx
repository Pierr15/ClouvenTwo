import { notFound } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MemberProfile from "../../../components/members/MemberProfile";

import { getMemberByNIS } from "@/services/memberService";

type Props = {
  params: Promise<{
    nis: string;
  }>;
};

export default async function MemberDetailPage({
  params,
}: Props) {
  const { nis } = await params;

  const member = await getMemberByNIS(nis);

  if (!member) {
    notFound();
  }

  return (
    <DashboardLayout>
      <MemberProfile member={member} />
    </DashboardLayout>
  );
}