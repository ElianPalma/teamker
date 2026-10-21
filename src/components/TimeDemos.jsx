import { useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Avatar, Badge, CountUp, Cursor, EASE, Icon, Window, hms, useLoop, useTargetPoint, useTicker } from './ui.jsx'
import { people } from './people.js'
import { useCopy } from '../copyContext.js'

export function PhoneClock({ active }) {
  const d = useCopy().demo
  const phase = useLoop([1300, 450, 2600, 450, 2200, 400], active)
  const box = useRef(null)
  const inBtn = useRef(null)
  const pauseBtn = useRef(null)
  const working = phase >= 2 && phase <= 3
  const paused = phase >= 4
  const target = phase <= 1 ? inBtn : pauseBtn
  const pt = useTargetPoint(box, target, [phase])
  const secs = useTicker(working, 60, 0, 37)
  const clicking = phase === 1 || phase === 3

  return (
    <div ref={box} className="relative">
      <div className="relative h-[560px] w-[280px] rounded-[2.8rem] border-[10px] border-ink-900 bg-white shadow-[0_40px_90px_-30px_rgba(15,23,42,0.6)]">
        <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-ink-900" />
        <div className="flex h-full flex-col px-5 pb-6 pt-12">
          <p className="text-xs font-medium text-ink-500">{d.monday}</p>
          <p className="mt-1 text-xl font-bold text-ink-900">{d.greeting}</p>

          <div className="mt-6 rounded-2xl bg-bg-soft p-4">
            <div className="flex items-center gap-2">
              <motion.span
                className="h-2.5 w-2.5 rounded-full"
                animate={{ backgroundColor: paused ? '#d97706' : working ? '#238e7f' : '#94a3b8', scale: working ? [1, 1.35, 1] : 1 }}
                transition={{ scale: { repeat: working ? Infinity : 0, duration: 1.2 } }}
              />
              <AnimatePresence mode="wait">
                <motion.span key={paused ? 'p' : working ? 'w' : 'i'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-sm font-semibold text-ink-700">
                  {paused ? d.status.paused : working ? d.status.working : d.status.idle}
                </motion.span>
              </AnimatePresence>
            </div>
            <p className="mt-2 font-mono text-[34px] font-bold tabular-nums tracking-tight text-ink-900">{hms(working || paused ? 8 * 3600 + secs : 8 * 3600)}</p>
            <p className="text-xs text-ink-500">{working || paused ? d.startedAt : d.startsAt}</p>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <AnimatePresence mode="wait" initial={false}>
              {phase <= 1 ? (
                <motion.div key="in" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: phase === 1 ? 0.95 : 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.25 }}>
                  <div ref={inBtn} className="bg-brand flex h-28 w-full flex-col items-center justify-center gap-1 rounded-3xl text-white shadow-[0_20px_40px_-15px_rgba(125,9,255,0.8)]">
                    <Icon name="login" className="h-7 w-7" />
                    <span className="text-lg font-bold">{d.clockIn}</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="work" className="grid grid-cols-2 gap-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                  <motion.div ref={pauseBtn} animate={{ scale: phase === 3 ? 0.94 : 1 }} className={`flex h-24 flex-col items-center justify-center gap-1 rounded-3xl border-2 ${paused ? 'border-warning bg-warning-soft' : 'border-warning/40 bg-white'} text-warning`}>
                    <Icon name="pause" className="h-6 w-6" />
                    <span className="text-sm font-bold">{paused ? d.resume : d.pause}</span>
                  </motion.div>
                  <div className="flex h-24 flex-col items-center justify-center gap-1 rounded-3xl border-2 border-error/30 bg-white text-error">
                    <Icon name="stop" className="h-6 w-6" />
                    <span className="text-sm font-bold">{d.clockOut}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Cursor x={pt.x} y={pt.y} clicking={clicking} />
    </div>
  )
}

const board = [
  { ...people[0], status: 'office', tone: 'success', start: 7 * 3600 + 58 * 60 },
  { ...people[1], status: 'paused', tone: 'warning', start: 4 * 3600 + 12 * 60 },
  { ...people[2], status: 'remote', tone: 'info', start: 6 * 3600 + 3 * 60 },
  { ...people[4], status: 'overtime', tone: 'violet', start: 9 * 3600 + 20 * 60, extra: '+1h 20m' },
  { ...people[5], status: 'review', tone: 'error', start: 0, missing: true },
]

export function TeamBoard({ active }) {
  const d = useCopy().demo
  const tick = useTicker(active, 1000, 0, 1)
  return (
    <Window className="w-full max-w-[600px]">
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-ink-900">{d.board.title}</p>
            <p className="text-xs text-ink-500">{d.board.subtitle}</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            {d.board.live}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { n: 12, l: d.board.kpis[0], c: 'text-success' },
            { n: 2, l: d.board.kpis[1], c: 'text-warning' },
            { n: 3, l: d.board.kpis[2], c: 'text-error' },
          ].map((k) => (
            <div key={k.l} className="rounded-xl border border-line p-3">
              <p className={`text-2xl font-bold ${k.c}`}>
                <CountUp to={k.n} duration={1.2} />
              </p>
              <p className="text-xs text-ink-500">{k.l}</p>
            </div>
          ))}
        </div>
        <ul className="mt-4 divide-y divide-line">
          {board.map((p, i) => (
            <motion.li
              key={p.name}
              className="flex items-center gap-3 py-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.09, duration: 0.5, ease: EASE }}
            >
              <Avatar initials={p.initials} color={p.color} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-900">{p.name}</p>
                <p className="truncate text-xs text-ink-500">{p.missing ? d.board.missingOut : d.roles[p.role]}</p>
              </div>
              <Badge tone={p.tone}>{d.board[p.status]}</Badge>
              <span className="w-[74px] text-right font-mono text-xs font-semibold tabular-nums text-ink-700">
                {p.extra ? p.extra : p.start ? hms(p.start + (p.tone === 'warning' ? 0 : tick)) : '—'}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </Window>
  )
}

export function CorrectionApproval({ active }) {
  const c = useCopy().demo.correction
  const phase = useLoop([1500, 500, 2800], active)
  const box = useRef(null)
  const approve = useRef(null)
  const pt = useTargetPoint(box, approve, [phase])
  const done = phase === 2
  return (
    <div ref={box} className="relative w-full max-w-[520px]">
      <Window bar={false} className="w-full">
        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
            <Icon name="bell" className="h-4 w-4" />
            {c.kicker}
          </div>
          <div className="mt-4 flex items-start gap-3">
            <Avatar initials="JR" color="#ff0be5" size="h-11 w-11 text-sm" />
            <div className="flex-1">
              <p className="text-[17px] font-bold text-ink-900">{c.title}</p>
              <p className="mt-0.5 text-sm text-ink-500">{c.date}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-bg-soft p-4 text-sm">
            <div>
              <p className="text-xs text-ink-500">{c.clockIn}</p>
              <p className="font-mono font-semibold text-ink-900">08:04</p>
            </div>
            <div>
              <p className="text-xs text-ink-500">{c.requested}</p>
              <p className="font-mono font-semibold text-ink-900">17:30</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-ink-500">{c.reason}</p>
              <p className="text-ink-700">{c.reasonText}</p>
            </div>
          </div>
          <div className="mt-5 h-12">
            <AnimatePresence mode="wait" initial={false}>
              {!done ? (
                <motion.div key="btns" className="flex gap-3" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  <span className="flex h-12 flex-1 items-center justify-center rounded-xl border border-line text-sm font-semibold text-ink-700">{c.reject}</span>
                  <motion.span ref={approve} animate={{ scale: phase === 1 ? 0.95 : 1 }} className="flex h-12 flex-1 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white">
                    {c.approve}
                  </motion.span>
                </motion.div>
              ) : (
                <motion.div key="ok" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-success-soft text-sm font-bold text-success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.1 }} />
                  </svg>
                  {c.approved}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Window>
      <Cursor x={pt.x} y={pt.y} clicking={phase === 1} visible={!done} />
    </div>
  )
}
