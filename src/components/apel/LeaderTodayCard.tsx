import LeaderCard from "./LeaderCard";

import { getLeaderToday } from "@/services/apelService";

export default async function LeaderTodayCard() {
  const member = await getLeaderToday();

  if (!member) return null;

  return (
    <LeaderCard
      title="Pemimpin Apel Hari Ini"
      member={member}
    />
  );
}