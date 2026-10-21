import { useCopy } from '../copyContext.js'
import StoryFeature from './StoryFeature.jsx'
import { CorrectionApproval, PhoneClock, TeamBoard } from './TimeDemos.jsx'

export default function FeatureTime() {
  const t = useCopy().feature.time
  return (
    <StoryFeature
      id="fichajes"
      kicker={t.kicker}
      title={t.title}
      lines={t.lines}
      tone="bg-bg-soft"
      renderDemo={(step, active) => {
        if (step === 0) return <PhoneClock active={active} />
        if (step === 1) return <TeamBoard active={active} />
        return <CorrectionApproval active={active} />
      }}
    />
  )
}
