import { Card } from "../../../ui/card"
import { SITE_CONFIG } from "../../../../lib/constants"
import { CompetitionTimer } from "./competition-timmer"
import { CompetitionActions } from "./competition-action"
import { useAppSelector } from "../../../../store/hooks"

export function CompetitionBanner() {
  const { user } = useAppSelector(state => state.auth)

  return (
    <Card className="bg-amber-50 p-6 text-center">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
       
        <h3 className="text-red-800 font-bold text-base md:text-lg text-center">
          Chào mừng Đại hội Đảng bộ thị trấn Lương Sơn lần thứ X, nhiệm kỳ 2025-2030
        </h3>
       
      </div>

      <div className="relative w-full md:w-[500px] h-[200px] md:h-[300px] mx-auto mb-4">
        <img
          src="/daihoidang.jpg"
          srcSet="/daihoidang-mobile.jpg 500w, /daihoidang.jpg 800w"
          sizes="(max-width: 768px) 100vw, 500px"
          alt="Đại hội Đảng bộ thị trấn Lương Sơn lần thứ X, nhiệm kỳ 2025-2030"
          width={500}
          height={300}
          className="object-contain w-full h-full rounded-lg shadow-lg"
          loading="lazy"
          decoding="async"
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

