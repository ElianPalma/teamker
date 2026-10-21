import { useRef, useState } from 'react'
import { motion, useInView, useMotionValueEvent, useScroll } from 'motion/react'
import { EASE, Reveal, SplitWords } from './ui.jsx'

function MobileStep({ line, index, renderDemo }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.5 })
  return (
    <div ref={ref} className="flex flex-col gap-6">
      <Reveal>
        <p className="text-[19px] leading-snug text-ink-700">{line}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="flex justify-center">{renderDemo(index, inView)}</div>
      </Reveal>
    </div>
  )
}

export default function StoryFeature({ id, kicker, title, lines, renderDemo, tone = 'bg-white' }) {
  const ref = useRef(null)
  const stageRef = useRef(null)
  const [step, setStep] = useState(0)
  const plays = useRef(lines.map(() => 0))
  const lastStep = useRef(0)
  if (lastStep.current !== step) {
    plays.current[step] += 1
    lastStep.current = step
  }
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const stageInView = useInView(stageRef, { amount: 0.4 })
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const n = lines.length
    setStep(Math.max(0, Math.min(n - 1, Math.floor(p * n * 0.999))))
  })
  function goTo(i) {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const span = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + (span * (i + 0.5)) / lines.length, behavior: 'smooth' })
  }

  return (
    <section id={id} className={`relative scroll-mt-16 ${tone}`}>
      <div ref={ref} className="relative hidden lg:block" style={{ height: `${lines.length * 85 + 30}vh` }}>
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-14 px-8">
            <div>
              <Reveal>
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-primary">{kicker}</p>
              </Reveal>
              <SplitWords text={title} className="text-[clamp(2.8rem,4.6vw,4.4rem)] font-bold leading-[1.0] tracking-[-0.035em]" />
              <ol className="mt-10 flex flex-col gap-2">
                {lines.map((l, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      className="group relative w-full cursor-pointer rounded-2xl py-3 pl-6 pr-3 text-left"
                      aria-current={step === i ? 'step' : undefined}
                    >
                      <span className="absolute left-0 top-3 bottom-3 w-[3px] overflow-hidden rounded-full bg-line">
                        {step === i && <motion.span layoutId={`${id}-bar`} className="bg-brand absolute inset-0 rounded-full" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                      </span>
                      <motion.span
                        animate={{ opacity: step === i ? 1 : 0.38 }}
                        transition={{ duration: 0.4 }}
                        className="block text-[19px] leading-snug text-ink-900 group-hover:opacity-80"
                      >
                        {l}
                      </motion.span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div ref={stageRef} className="relative flex h-[620px] items-center justify-center">
              <div className="pointer-events-none absolute inset-8 -z-0 rounded-[3rem] bg-brand opacity-[0.10] blur-3xl" />
              {lines.map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={false}
                  animate={{ opacity: step === i ? 1 : 0, y: step === i ? 0 : i < step ? -16 : 16 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  style={{ pointerEvents: step === i ? 'auto' : 'none', zIndex: step === i ? 1 : 0 }}
                  aria-hidden={step !== i}
                >
                  <div key={plays.current[i]} className="flex h-full w-full items-center justify-center">
                    {renderDemo(i, stageInView && step === i)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-xl flex-col gap-14 px-4 py-24 lg:hidden">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">{kicker}</p>
          <SplitWords text={title} className="text-[clamp(2.4rem,9vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.035em]" />
        </div>
        {lines.map((l, i) => (
          <MobileStep key={i} line={l} index={i} renderDemo={renderDemo} />
        ))}
      </div>
    </section>
  )
}
