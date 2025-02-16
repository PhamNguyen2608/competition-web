import { Card } from "../../../ui/card"
import { SITE_CONFIG } from "../../../../lib/constants"
import { CompetitionTimer } from "./competition-timmer"
import { CompetitionActions } from "./competition-action"
import { useAppSelector } from "../../../../store/hooks"

export function CompetitionBanner() {
  const { user } = useAppSelector(state => state.auth)

  return (
    <Card className="bg-amber-50 p-6 text-center">
      <div className="relative w-24 h-24 mx-auto mb-4">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oOIA3PVisfanUQ7UicIwRpCUOg4KLW.png"
          alt="Banner"
          className="object-contain w-full h-full"
          loading="lazy"
        />
      </div>
      
      <section className="space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-neutral-800 font-display">{SITE_CONFIG.title}</h1>
        </header>

        <div>
          <h2 className="text-xl text-neutral-600 font-bold mb-4 font-display">{SITE_CONFIG.status}</h2>
          <CompetitionTimer />
        </div>

        <CompetitionActions />

        {!user && (
          <p className="text-neutral-600 italic">{SITE_CONFIG.loginMessage}</p>
        )}
      </section>
    </Card>
  )
}

