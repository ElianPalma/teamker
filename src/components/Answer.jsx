import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useCopy } from '../copyContext.js'
import { Avatar, EASE, Icon, Reveal, SplitWords } from './ui.jsx'
import { people } from './people.js'
import screen from '../assets/screen-ausencias.webp'

const show = { once: true, amount: 0.5 }

function ClockCard() {
  const d = useCopy().demo
  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <div className="grid grid-cols-2 gap-3">
        {[
          { v: '8h 06m', l: d.today },
          { v: '17h 06m', l: d.thisWeek },
        ].map((k) => (
          <div key={k.l} className="rounded-xl bg-bg-soft p-3">
            <p className="text-xl font-bold text-primary">{k.v}</p>
            <p className="text-xs text-ink-500">{k.l}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-xs font-semibold text-ink-700">{d.monday}</p>
        <div className="relative mt-2 h-3 overflow-hidden rounded-full bg-bg-soft">
          <motion.div
            className="absolute inset-y-0 left-[8%] rounded-full bg-primary"
            initial={{ width: '0%' }}
            whileInView={{ width: '64%' }}
            viewport={show}
            transition={{ delay: 0.5, duration: 1.4, ease: EASE }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] text-ink-400">
          <span>08:00</span>
          <span>12:00</span>
          <span>16:00</span>
          <span>20:00</span>
        </div>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-2">
        <span className="flex items-center justify-center gap-1.5 rounded-xl border border-warning/40 py-2 text-sm font-semibold text-warning">
          <Icon name="pause" className="h-4 w-4" />
          {d.pause}
        </span>
        <span className="flex items-center justify-center gap-1.5 rounded-xl border border-error/30 py-2 text-sm font-semibold text-error">
          <Icon name="stop" className="h-4 w-4" />
          {d.clockOut}
        </span>
      </div>
    </div>
  )
}

function DaysCard() {
  const c = useCopy().demo.calendar
  const cells = [...Array(5).fill(null), ...Array.from({ length: 21 }, (_, i) => i + 1)]
  const picked = [10, 11, 12, 13, 14]
  return (
    <div className="flex h-full flex-col p-5">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-bold text-ink-900">{c.monthShort}</p>
        <p className="text-xs text-ink-500">
          {c.leftOf[0]} <span className="font-bold text-primary">17</span> {c.leftOf[1]}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {cells.map((d, i) => {
          const k = picked.indexOf(d)
          return (
            <motion.span
              key={i}
              className={`flex h-7 items-center justify-center rounded-md text-[11px] font-medium ${d ? (i % 7 >= 5 ? 'text-ink-400' : 'text-ink-700') : ''}`}
              initial={{ backgroundColor: 'rgba(125,9,255,0)', color: k >= 0 ? '#334155' : undefined }}
              whileInView={k >= 0 ? { backgroundColor: 'rgba(125,9,255,1)', color: '#ffffff' } : undefined}
              viewport={show}
              transition={{ delay: 0.6 + k * 0.12, duration: 0.3 }}
            >
              {d}
            </motion.span>
          )
        })}
      </div>
    </div>
  )
}

function PeopleCard() {
  const r = useCopy().demo.roles
  return (
    <div className="grid h-full grid-cols-3 content-start gap-2 p-5">
      {people.map((p, i) => (
        <motion.div
          key={p.name}
          className="flex flex-col items-center rounded-xl border border-line p-2.5 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={show}
          transition={{ delay: 0.5 + i * 0.08, duration: 0.45, ease: EASE }}
        >
          <Avatar initials={p.initials} color={p.color} size="h-8 w-8 text-[10px]" />
          <p className="mt-2 w-full truncate text-[11px] font-semibold text-ink-900">{p.name.split(' ')[0]}</p>
          <p className="w-full truncate text-[10px] text-ink-500">{r[p.role]}</p>
        </motion.div>
      ))}
    </div>
  )
}

const fan = [
  { x: -1, rot: -6 },
  { x: 0, rot: 0 },
  { x: 1, rot: 6 },
]

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const seg = (t, a, b) => clamp01((t - a) / (b - a))

function CardShell({ card, className = '' }) {
  return (
    <figure className={`flex w-[380px] max-w-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.3)] ${className}`}>
      <div className="h-[250px] bg-white">{card.body}</div>
      <figcaption className="flex items-center gap-2.5 border-t border-line bg-bg-soft px-5 py-4 text-[17px] font-semibold text-ink-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-soft text-primary">
          <Icon name={card.icon} className="h-[18px] w-[18px]" />
        </span>
        {card.label}
      </figcaption>
    </figure>
  )
}

function FanCard({ card, index, t }) {
  const { x: dir, rot } = fan[index]
  const x = useTransform(t, (v) => dir * 400 * (1 - seg(v, 0, 1)))
  const rotate = useTransform(t, (v) => rot * (1 - seg(v, 0, 1)))
  const scale = useTransform(t, (v) => 1 - 0.3 * seg(v, 0.9, 1.4))
  const opacity = useTransform(t, (v) => 1 - seg(v, 0.9, 1.4))
  return (
    <motion.div className="absolute left-1/2 top-1/2 -ml-[190px] -mt-[153px] will-change-transform" style={{ x, rotate, scale, opacity, zIndex: index === 1 ? 2 : 1 }}>
      <CardShell card={card} />
    </motion.div>
  )
}

export default function Answer() {
  const t = useCopy()
  const ref = useRef(null)
  const cards = [
    { label: t.answer.cards[0], icon: 'clock', body: <ClockCard /> },
    { label: t.answer.cards[1], icon: 'calendar', body: <DaysCard /> },
    { label: t.answer.cards[2], icon: 'folder', body: <PeopleCard /> },
  ]
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const tl = useTransform(scrollYProgress, (p) => p * 2.3)
  const screenOpacity = useTransform(tl, (v) => seg(v, 1, 1.9))
  const screenScale = useTransform(tl, (v) => 0.86 + 0.14 * seg(v, 1, 1.9))
  const screenY = useTransform(tl, (v) => `${6 * (1 - seg(v, 1, 1.9))}%`)

  return (
    <section id="producto" className="relative scroll-mt-16 bg-white">
      <div ref={ref} className="relative hidden lg:block" style={{ height: '220vh' }}>
        <div className="sticky top-0 flex h-screen flex-col items-center overflow-hidden px-6 pt-28 text-center">
          <SplitWords text={t.answer.title} highlightFrom={t.answer.highlightFrom} className="max-w-[16ch] text-[clamp(2.6rem,5vw,4.6rem)] font-bold leading-[1.02] tracking-[-0.035em]" />
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-[clamp(1.1rem,1.6vw,1.3rem)] leading-snug text-ink-700">{t.answer.subtitle}</p>
          </Reveal>
          <div className="relative mt-10 w-full max-w-[1200px] flex-1">
            {cards.map((c, i) => (
              <FanCard key={c.label} card={c} index={i} t={tl} />
            ))}
            <motion.div
              className="absolute inset-x-0 top-0 mx-auto will-change-transform"
              style={{ opacity: screenOpacity, scale: screenScale, y: screenY, maxWidth: 'min(1060px, calc((100vh - 400px) * 2.05))' }}
            >
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_100px_-40px_rgba(15,23,42,0.35)]">
                <img src={screen} alt={t.answer.screenAlt} className="block w-full" width="1353" height="636" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="px-4 py-24 lg:hidden">
        <div className="mx-auto max-w-xl text-center">
          <SplitWords text={t.answer.title} highlightFrom={t.answer.highlightFrom} className="text-[clamp(2.4rem,9vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.035em]" />
          <p className="mt-5 text-lg leading-snug text-ink-700">{t.answer.subtitle}</p>
        </div>
        <div className="mt-12 flex flex-col items-center gap-6">
          {cards.map((c) => (
            <Reveal key={c.label} className="w-full max-w-[380px]">
              <CardShell card={c} className="w-full" />
            </Reveal>
          ))}
          <Reveal className="w-full max-w-xl">
            <div className="overflow-hidden rounded-2xl border border-line shadow-[0_30px_70px_-34px_rgba(15,23,42,0.4)]">
              <img src={screen} alt="" className="block w-full" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
