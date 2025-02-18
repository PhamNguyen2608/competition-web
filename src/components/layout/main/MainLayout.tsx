import { CompetitionBanner } from "./competition/competition-banner";
import { GuidelinesCard } from "./guidelines/guidelines-card";

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
