import { useCopy } from '../copyContext.js'
import StoryFeature from './StoryFeature.jsx'
import { CalendarRequest, LeaveApproval, TeamCalendar } from './LeaveDemos.jsx'

export default function FeatureLeave() {
  const t = useCopy().feature.leave
  return (
    <StoryFeature
      id="vacaciones"
      kicker={t.kicker}
      title={t.title}
      lines={t.lines}
      renderDemo={(step, active) => {
        if (step === 0) return <CalendarRequest active={active} />
        if (step === 1) return <LeaveApproval active={active} />
        return <TeamCalendar active={active} />
      }}
    />
  )
}
