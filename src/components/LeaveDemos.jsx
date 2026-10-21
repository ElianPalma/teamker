import { useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Avatar, Badge, Cursor, EASE, Icon, Window, useLoop, useTargetPoint } from './ui.jsx'
import { people } from './people.js'
import { useCopy } from '../copyContext.js'

const pick = [10, 11, 12, 13, 14]

export function CalendarRequest({ active }) {
  const c = useCopy().demo.calendar
  const phase = useLoop([900, 280, 280, 280, 280, 280, 700, 450, 2400], active)
  const box = useRef(null)
  const sendBtn = useRef(null)
  const dayRefs = useRef({})
  const selected = phase >= 1 ? pick.slice(0, Math.min(phase, 5)) : []
  const left = 22 - selected.length
  const sent = phase === 8
  const dayTarget = { current: dayRefs.current[pick[Math.max(0, Math.min(phase, 5) - 1)]] }
  const target = phase >= 6 ? sendBtn : dayTarget
  const pt = useTargetPoint(box, target, [phase])
  const cells = [...Array(5).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1)]

  return (
    <div ref={box} className="relative w-full max-w-[520px]">
      <Window bar={false}>
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-ink-900">{c.month}</p>
              <p className="text-xs text-ink-500">{c.mine}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-ink-500">{c.left}</p>
              <p className="text-2xl font-bold text-primary tabular-nums">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={left} className="inline-block" initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }} transition={{ duration: 0.25 }}>
                    {left}
                  </motion.span>
                </AnimatePresence>
                <span className="text-sm font-semibold text-ink-500"> {c.ofDays}</span>
              </p>
            </div>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-soft">
            <motion.div className="bg-brand h-full rounded-full" animate={{ width: `${(left / 22) * 100}%` }} transition={{ duration: 0.3 }} />
          </div>
          <div className="mt-5 grid grid-cols-7 gap-1.5 text-center">
            {c.weekdays.map((d, i) => (
              <span key={i} className="pb-1 text-[11px] font-semibold text-ink-400">{d}</span>
            ))}
            {cells.map((d, i) => {
              const weekend = i % 7 >= 5
              const on = d && selected.includes(d)
              return (
                <motion.span
                  key={i}
                  ref={(el) => {
                    if (d) dayRefs.current[d] = el
                  }}
                  animate={{ backgroundColor: on ? (sent ? '#e3f4f1' : '#7d09ff') : weekend && d ? '#f8f9fa' : '#ffffff', color: on ? (sent ? '#238e7f' : '#ffffff') : weekend ? '#94a3b8' : '#334155', scale: on ? [1, 1.15, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex h-9 items-center justify-center rounded-lg text-sm font-medium ${d ? 'border border-line' : ''}`}
                >
                  {d}
                </motion.span>
              )
            })}
          </div>
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="text-sm text-ink-500">{selected.length ? c.workdays(selected.length) : c.pick}</span>
            <AnimatePresence mode="wait" initial={false}>
              {!sent ? (
                <motion.span key="send" ref={sendBtn} animate={{ scale: phase === 7 ? 0.94 : 1, opacity: selected.length === 5 ? 1 : 0.45 }} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">
                  {c.request}
                </motion.span>
              ) : (
                <motion.span key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1.5 rounded-xl bg-success-soft px-4 py-2.5 text-sm font-bold text-success">
                  <Icon name="check" className="h-4 w-4" strokeWidth={3} />
                  {c.sent}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Window>
      <Cursor x={pt.x} y={pt.y} clicking={phase >= 1 && phase <= 5 ? phase % 2 === 1 : phase === 7} visible={!sent} />
    </div>
  )
}

export function LeaveApproval({ active }) {
  const a = useCopy().demo.approval
  const phase = useLoop([1400, 450, 3000], active)
  const box = useRef(null)
  const approveBtn = useRef(null)
  const pt = useTargetPoint(box, approveBtn, [phase])
  const done = phase === 2
  const rows = [people[0], people[1], people[3], people[4]]
  return (
    <div ref={box} className="relative flex w-full max-w-[560px] flex-col gap-4">
      <Window bar={false}>
        <div className="flex items-center gap-3 p-5">
          <Avatar initials="LG" color="#7d09ff" size="h-11 w-11 text-sm" />
          <div className="min-w-0 flex-1">
            <p className="font-bold text-ink-900">{a.title}</p>
            <p className="text-sm text-ink-500">{a.range}</p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {!done ? (
              <motion.div key="b" className="flex gap-2" exit={{ opacity: 0 }}>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink-500">
                  <Icon name="x" className="h-4 w-4" strokeWidth={2.4} />
                </span>
                <motion.span ref={approveBtn} animate={{ scale: phase === 1 ? 0.92 : 1 }} className="flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.6} />
                  {a.approve}
                </motion.span>
              </motion.div>
            ) : (
              <motion.span key="ok" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 20 }}>
                <Badge tone="success">{a.approved}</Badge>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </Window>

      <Window bar={false}>
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-ink-900">{a.team}</p>
            <AnimatePresence>
              {done && (
                <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.5 }} className="text-xs font-semibold text-success">
                  {a.updated}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-center gap-y-2.5 text-xs">
            {rows.map((p, i) => (
              <div key={p.name} className="contents">
                <span className="flex items-center gap-2 truncate font-medium text-ink-700">
                  <Avatar initials={p.initials} color={p.color} size="h-6 w-6 text-[9px]" />
                  {p.name.split(' ')[0]}
                </span>
                <div className="relative h-6 rounded-md bg-bg-soft">
                  {i === 0 && (
                    <motion.div
                      className="bg-brand absolute inset-y-0 left-[30%] w-[22%] origin-left rounded-md"
                      initial={false}
                      animate={{ scaleX: done ? 1 : 0 }}
                      transition={{ delay: done ? 0.3 : 0, duration: 0.7, ease: EASE }}
                    />
                  )}
                  {i === 2 && <div className="absolute inset-y-0 left-[62%] w-[14%] rounded-md bg-info/70" />}
                  {i === 3 && <div className="absolute inset-y-0 left-[4%] w-[18%] rounded-md bg-primary/40" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Window>
      <Cursor x={pt.x} y={pt.y} clicking={phase === 1} visible={!done} />
    </div>
  )
}

const types = {
  vac: { cls: 'bg-primary', soft: 'bg-violet-soft text-primary' },
  sick: { cls: 'bg-error', soft: 'bg-error-soft text-error' },
  leave: { cls: 'bg-warning', soft: 'bg-warning-soft text-warning' },
  remote: { cls: 'bg-info', soft: 'bg-info-soft text-info' },
}

const plan = [
  { p: people[0], items: [] },
  { p: people[1], items: [{ t: 'vac', from: 0, to: 5 }] },
  { p: people[2], items: [{ t: 'remote', from: 1, to: 2 }, { t: 'remote', from: 3, to: 4 }] },
  { p: people[3], items: [{ t: 'leave', from: 4, to: 5 }] },
  { p: people[4], items: [{ t: 'sick', from: 0, to: 3 }] },
  { p: people[5], items: [{ t: 'remote', from: 0, to: 1 }] },
]

export function TeamCalendar({ active }) {
  const tc = useCopy().demo.teamCalendar
  const days = tc.days
  const today = 2
  const out = plan.filter((r) => r.items.some((it) => it.t !== 'remote' && it.from <= today && it.to > today))
  return (
    <Window className="w-full max-w-[620px]">
      <div className="p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-ink-900">{tc.title}</p>
            <p className="text-xs text-ink-500">{tc.week}</p>
          </div>
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex items-center gap-2 rounded-full bg-ink-900 py-1 pl-1 pr-3 text-xs font-semibold text-white">
            <span className="flex -space-x-2">
              {out.map((r) => (
                <Avatar key={r.p.name} initials={r.p.initials} color={r.p.color} size="h-6 w-6 text-[9px] ring-2 ring-ink-900" />
              ))}
            </span>
            {tc.out(out.length)}
          </motion.div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(types).map(([k, ty]) => (
            <span key={k} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${ty.soft}`}>{tc.types[k]}</span>
          ))}
        </div>
        <div className="relative mt-4">
          <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-y-2 text-xs">
            <span />
            {days.map((d, i) => (
              <span key={d} className={`pb-1 text-center font-semibold ${i === today ? 'text-primary' : 'text-ink-400'}`}>{d}</span>
            ))}
            {plan.map((row, ri) => (
              <div key={row.p.name} className="contents">
                <span className="flex items-center gap-2 truncate font-medium text-ink-700">
                  <Avatar initials={row.p.initials} color={row.p.color} size="h-6 w-6 text-[9px]" />
                  {row.p.name.split(' ')[0]}
                </span>
                <div className="relative col-span-5 h-7 rounded-md bg-bg-soft">
                  {row.items.map((it, k) => (
                    <motion.div
                      key={k}
                      className={`absolute inset-y-0.5 origin-left rounded-md ${types[it.t].cls}`}
                      style={{ left: `calc(${(it.from / 5) * 100}% + 2px)`, width: `calc(${((it.to - it.from) / 5) * 100}% - 4px)` }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: active ? 1 : 0 }}
                      transition={{ delay: 0.2 + ri * 0.1 + k * 0.05, duration: 0.6, ease: EASE }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-[100px] right-0">
            <motion.div
              className="absolute inset-y-0 w-0.5 rounded bg-primary"
              style={{ left: `${((today + 0.5) / 5) * 100}%` }}
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </div>
    </Window>
  )
}
