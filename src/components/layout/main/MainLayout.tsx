import { CompetitionBanner } from "./competition/competition-banner";
import { GuidelinesCard } from "./guidelines/guidelines-card";
import { LeaderboardCard } from "./leader-board/leaderboard-card";

export default function MainLayout() {
 
  return (
    <div className="container-custom space-y-8">
      <CompetitionBanner />
      <div id="guidelines">
        <GuidelinesCard />
      </div>
    </div>
  )
}
