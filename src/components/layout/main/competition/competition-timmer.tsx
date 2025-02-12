import { TIMER_UNITS } from "../../../../lib/constants"

export function CompetitionTimer() {
  return (
    <div className="flex justify-center gap-8">
      {TIMER_UNITS.map((unit) => (
        <div key={unit} className="text-center">
          <div className="text-2xl font-bold font-mono">--</div>
          <div className="text-sm font-medium">{unit}</div>
        </div>
      ))}
    </div>
  )
}

