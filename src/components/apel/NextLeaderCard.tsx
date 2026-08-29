import LeaderCard from "./LeaderCard";

import { getNextLeader } from "@/services/apelService";

export default async function NextLeaderCard() {
  const member = await getNextLeader();

  if (!member) return null;

  return (
    <LeaderCard
      title="Pemimpin Apel Berikutnya"
      member={member}
    />
  );
}