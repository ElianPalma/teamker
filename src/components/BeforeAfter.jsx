import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionTemplate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react'
import { useCopy } from '../copyContext.js'
import { Avatar, Badge, EASE, Icon, Reveal, SplitWords } from './ui.jsx'
import { people } from './people.js'

const badCells = new Set(['2-2', '2-3', '4-3', '5-3'])

function Before() {
  const b = useCopy().demo.before
  return (
    <div className="absolute inset-0 grid grid-cols-1 gap-4 bg-[#eef0f3] p-5 pt-16 md:grid-cols-2 md:p-8 md:pt-16">
      <div className="flex flex-col gap-4">
        <div className="rotate-[-1.5deg] overflow-hidden rounded-xl border border-[#c9ced6] bg-white shadow-md">
          <div className="flex items-center gap-2 bg-[#1f7244] px-3 py-1.5 text-xs font-semibold text-white">
            <Icon name="table" className="h-3.5 w-3.5" />
            {b.file}
          </div>
          <table className="w-full text-[11px] md:text-xs">
            <tbody>
              {b.sheet.map((r, i) => (
                <tr key={i} className={i === 0 ? 'bg-[#f3f4f6] font-semibold' : ''}>
                  {r.map((c, j) => {
                    const Cell = i === 0 ? 'th' : 'td'
                    return (
                      <Cell key={j} scope={i === 0 ? 'col' : undefined} style={i === 0 ? { textAlign: 'inherit', fontWeight: 'inherit' } : undefined} className={`border border-[#e5e7eb] px-2 py-1.5 ${badCells.has(`${i}-${j}`) ? 'bg-[#fde8e8] font-semibold text-[#b91c1c]' : 'text-[#374151]'}`}>
                        {c}
                      </Cell>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rotate-[1deg] rounded-xl border border-[#c9ced6] bg-white p-3 shadow-md">
          <p className="text-[11px] font-semibold text-[#6b7280]">{b.inbox}</p>
          {b.mails.map((m) => (
            <p key={m} className="mt-1.5 truncate border-t border-[#f1f5f9] pt-1.5 text-xs font-semibold text-[#111827]">{m}</p>
          ))}
        </div>
      </div>
      <div className="hidden flex-col gap-2.5 rounded-xl bg-[#e5ddd5] p-4 shadow-md md:flex">
        <p className="mb-1 text-xs font-semibold text-[#54656f]">{b.group}</p>
        {b.bubbles.map((m, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
            className={`max-w-[85%] rounded-lg px-3 py-2 text-[13px] shadow-sm ${m.side === 'right' ? 'self-end bg-[#d9fdd3]' : 'self-start bg-white'}`}
          >
            <p className="text-[11px] font-semibold text-[#7d09ff]">{m.who}</p>
            <p className="text-[#111b21]">{m.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function After() {
  const a = useCopy().demo.after
  const looks = [
    { icon: 'check', tone: 'bg-success-soft text-success' },
    { icon: 'plane', tone: 'bg-violet-soft text-primary' },
    { icon: 'file', tone: 'bg-info-soft text-info' },
  ]
  const items = a.items.map((it, i) => ({ ...it, ...looks[i] }))
  const team = [
    { ...people[0], status: a.statuses[0], tone: 'success' },
    { ...people[1], status: a.statuses[1], tone: 'violet' },
    { ...people[2], status: a.statuses[2], tone: 'info' },
    { ...people[4], status: a.statuses[3], tone: 'error' },
  ]
  return (
    <div className="absolute inset-0 grid grid-cols-1 gap-4 overflow-hidden bg-white p-5 pt-16 md:grid-cols-2 md:p-8 md:pt-16">
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-violet-soft blur-3xl" />
      <div className="relative flex flex-col gap-3">
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)]">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${it.tone}`}>
              <Icon name={it.icon} />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-ink-900">{it.title}</p>
              <p className="truncate text-sm text-ink-500">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="relative hidden flex-col rounded-2xl border border-line bg-white p-5 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)] md:flex">
        <div className="flex items-center justify-between">
          <p className="font-bold text-ink-900">{a.today}</p>
          <Badge tone="warning">{a.missing}</Badge>
        </div>
        <ul className="mt-3 divide-y divide-line">
          {team.map((p) => (
            <li key={p.name} className="flex items-center gap-3 py-2.5">
              <Avatar initials={p.initials} color={p.color} />
              <span className="flex-1 truncate text-sm font-semibold text-ink-900">{p.name}</span>
              <Badge tone={p.tone}>{p.status}</Badge>
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-3 text-sm text-ink-500">{a.footer}</p>
      </div>
    </div>
  )
}

export default function BeforeAfter() {
  const t = useCopy().beforeAfter
  const box = useRef(null)
  const inView = useInView(box, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const pos = useMotionValue(50)
  const [dragging, setDragging] = useState(false)
  const [val, setVal] = useState(50)
  useMotionValueEvent(pos, 'change', (v) => setVal(Math.round(v)))
  const clip = useMotionTemplate`inset(0 0 0 ${pos}%)`
  const left = useMotionTemplate`${pos}%`

  useEffect(() => {
    if (!inView || reduce) return
    const seq = async () => {
      await animate(pos, 22, { duration: 1.1, ease: EASE })
      await animate(pos, 78, { duration: 1.4, ease: EASE })
      await animate(pos, 50, { duration: 1, ease: EASE })
    }
    seq()
  }, [inView, reduce, pos])

  function setFromEvent(e) {
    const r = box.current.getBoundingClientRect()
    const p = ((e.clientX - r.left) / r.width) * 100
    pos.stop()
    pos.set(Math.max(3, Math.min(97, p)))
  }

  return (
    <section id="antes-despues" className="relative scroll-mt-16 bg-white py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
        <SplitWords text={t.title} highlightFrom={t.highlightFrom} className="text-[clamp(2.6rem,6vw,4.6rem)] font-bold leading-[1.02] tracking-[-0.035em]" />
        <Reveal delay={0.15}>
          <p className="mt-5 text-lg text-ink-500">{t.subtitle}</p>
        </Reveal>
      </div>
      <Reveal className="mx-auto mt-12 max-w-6xl px-4 md:px-8">
        <div
          ref={box}
          className={`relative h-[520px] touch-pan-y select-none overflow-hidden rounded-3xl border border-line shadow-[0_40px_100px_-40px_rgba(15,23,42,0.45)] md:h-[480px] ${dragging ? 'cursor-grabbing' : 'cursor-ew-resize'}`}
          onPointerDown={(e) => {
            setDragging(true)
            e.currentTarget.setPointerCapture(e.pointerId)
            setFromEvent(e)
          }}
          onPointerMove={(e) => dragging && setFromEvent(e)}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
        >
          <Before />
          <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
            <After />
          </motion.div>
          <span className="absolute left-4 top-4 z-10 rounded-full bg-ink-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{t.before}</span>
          <span className="bg-brand absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-semibold text-white">{t.after}</span>
          <motion.div className="absolute inset-y-0 z-20 w-0" style={{ left }}>
            <div className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_0_1px_rgba(125,9,255,0.4)]" />
            <div
              role="slider"
              tabIndex={0}
              aria-label={t.sliderLabel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={val}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') pos.set(Math.max(3, pos.get() - 5))
                if (e.key === 'ArrowRight') pos.set(Math.min(97, pos.get() + 5))
              }}
              className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-[0_10px_30px_-5px_rgba(125,9,255,0.5)] ring-4 ring-primary/20 focus-visible:outline-2 focus-visible:outline-primary"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
              </svg>
            </div>
          </motion.div>
        </div>
      </Reveal>
    </section>
  )
}
