import { CompetitionBanner } from "./competition/competition-banner";
import { GuidelinesCard } from "./guidelines/guidelines-card";
import { LeaderboardCard } from "./leader-board/leaderboard-card";
import { LeaderboardEntry } from "./leader-board/types";

export default function MainLayout() {
 
  return (
    <div className="container-custom space-y-8">
      <CompetitionBanner />
      <LeaderboardCard  />
      <GuidelinesCard />
    </div>
  )
}
