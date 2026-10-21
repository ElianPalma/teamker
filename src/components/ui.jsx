import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion, useSpring } from 'motion/react'

export const EASE = [0.16, 1, 0.3, 1]

export function Txt({ children }) {
  if (typeof children !== 'string') return children
  const parts = children.split(/(\[[^\]]+\])/g)
  return parts.map((p, i) =>
    p.startsWith('[') && p.endsWith(']') ? (
      <span key={i} className="ph">
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    ),
  )
}

export function Reveal({ children, delay = 0, y = 24, className = '', as = 'div', once = true, amount = 0.3 }) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </Comp>
  )
}

export function SplitWords({ text, className = '', delay = 0, stagger = 0.06, as = 'h2', wordClassName = '', highlightFrom = Infinity, highlightClassName = 'text-gradient' }) {
  const Comp = motion[as]
  const words = text.split(' ')
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.22em] -mb-[0.22em] align-bottom" aria-hidden="true">
          <motion.span
            className={`inline-block pb-[0.22em] -mb-[0.22em] ${wordClassName} ${i >= highlightFrom ? highlightClassName : ''}`}
            variants={{
              hidden: { y: '105%', rotate: 4, opacity: 0 },
              show: { y: '0%', rotate: 0, opacity: 1, transition: { duration: 0.9, ease: EASE } },
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Comp>
  )
}

export function ButtonLink({ href, children, variant = 'primary', className = '', ...rest }) {
  const base =
    'relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[17px] font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary select-none'
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    ghost: 'bg-white text-ink-900 border border-line hover:border-ink-400',
    light: 'bg-white text-ink-900 hover:bg-violet-soft',
    outlineLight: 'bg-white/10 text-white border border-white/40 hover:bg-white/20',
    textLight: 'bg-transparent text-white hover:bg-white/10',
  }
  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </a>
  )
}

export function CountUp({ to, from = 0, duration = 1.6, prefix = '', suffix = '', format = (v) => Math.round(v).toLocaleString('es-ES') }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(reduce ? to : from)
  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(from, to, { duration, ease: EASE, onUpdate: setVal })
    return () => controls.stop()
  }, [inView, reduce, to, from, duration])
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {format(val)}
      {suffix}
    </span>
  )
}

export function useLoop(durations, active) {
  const [phase, setPhase] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (!active) {
      setPhase(0)
      return
    }
    if (reduce) {
      setPhase(durations.length - 1)
      return
    }
    let i = 0
    let t
    const tick = () => {
      t = setTimeout(() => {
        i = (i + 1) % durations.length
        setPhase(i)
        tick()
      }, durations[i])
    }
    setPhase(0)
    tick()
    return () => clearTimeout(t)
  }, [active, reduce, durations.join(',')])
  return phase
}

export function useTargetPoint(containerRef, targetRef, deps = []) {
  const [pt, setPt] = useState({ x: 0, y: 0 })
  useLayoutEffect(() => {
    function measure() {
      const c = containerRef.current
      const t = targetRef.current
      if (!c || !t) return
      const cr = c.getBoundingClientRect()
      const tr = t.getBoundingClientRect()
      const sx = cr.width / c.offsetWidth || 1
      setPt({ x: (tr.left - cr.left + tr.width * 0.6) / sx, y: (tr.top - cr.top + tr.height * 0.55) / sx })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, deps)
  return pt
}

export function useTicker(active, stepMs = 1000, start = 0, inc = 1) {
  const [v, setV] = useState(start)
  useEffect(() => {
    if (!active) {
      setV(start)
      return
    }
    const id = setInterval(() => setV((x) => x + inc), stepMs)
    return () => clearInterval(id)
  }, [active, stepMs, start, inc])
  return v
}

export function hms(total) {
  const h = String(Math.floor(total / 3600)).padStart(2, '0')
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const s = String(Math.floor(total % 60)).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export function Cursor({ x, y, clicking, visible = true }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-30"
      initial={false}
      animate={{ x, y, opacity: visible ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.8 }}
      aria-hidden="true"
    >
      <motion.svg width="22" height="26" viewBox="0 0 22 26" animate={{ scale: clicking ? 0.82 : 1 }} transition={{ duration: 0.15 }} className="drop-shadow-[0_4px_8px_rgba(15,23,42,0.35)]">
        <path d="M2 2 L2 21 L7.2 16.4 L10.6 24 L14 22.5 L10.7 15 L18 15 Z" fill="#0f172a" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </motion.svg>
      {clicking && (
        <motion.span
          className="absolute -left-3 -top-3 h-8 w-8 rounded-full border-2 border-primary"
          initial={{ scale: 0.3, opacity: 0.9 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}
    </motion.div>
  )
}

const paths = {
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  pause: <><circle cx="12" cy="12" r="9" /><path d="M10 9v6M14 9v6" /></>,
  stop: <><circle cx="12" cy="12" r="9" /><rect x="9" y="9" width="6" height="6" rx="1" /></>,
  login: <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5M15 12H3" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  plane: <path d="M10.5 13.5L3 11l1.5-1.5 8 1 4-4c1-1 2.5-1.5 3.5-.5s.5 2.5-.5 3.5l-4 4 1 8L15 21l-2.5-7.5L9 17v3l-1.5 1.5L6 18l-3-1.5L4.5 15h3z" />,
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  download: <><path d="M12 4v11M7 10l5 5 5-5" /><path d="M5 20h14" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" /></>,
  eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 6.1A10.6 10.6 0 0 1 12 6c5 0 8.5 4 9.5 6-.4.8-1.1 1.9-2.1 3M6.5 7.6C4.6 8.9 3.2 10.6 2.5 12c1 2 4.5 6 9.5 6 1.6 0 3-.4 4.3-1" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
  bell: <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  chat: <path d="M4 5h16v11H8l-4 4z" />,
  table: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M3 15h18M9 4v16" /></>,
  home: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>,
}

export function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

export function WhatsAppIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.6 2 2.17 6.43 2.17 11.87c0 1.74.46 3.44 1.32 4.94L2.09 22l5.33-1.4a9.86 9.86 0 0 0 4.62 1.18h.01c5.44 0 9.87-4.43 9.87-9.87a9.8 9.8 0 0 0-2.87-7zM12.05 20.1h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.16.83.84-3.08-.2-.32a8.18 8.18 0 0 1-1.26-4.36c0-4.52 3.68-8.2 8.21-8.2a8.2 8.2 0 0 1 8.2 8.21c0 4.53-3.68 8.25-8.14 8.25zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  )
}

export function Avatar({ initials, color = '#7d09ff', size = 'h-8 w-8 text-[11px]' }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white ${size}`} style={{ background: color }}>
      {initials}
    </span>
  )
}

export function Badge({ tone = 'violet', children }) {
  const tones = {
    violet: 'bg-violet-soft text-primary',
    success: 'bg-success-soft text-success',
    warning: 'bg-warning-soft text-warning',
    error: 'bg-error-soft text-error',
    info: 'bg-info-soft text-info',
    gray: 'bg-bg-soft text-ink-500',
  }
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>
}

export function Window({ children, className = '', bar = true }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35),0_0_0_1px_rgba(15,23,42,0.02)] ${className}`}>
      {bar && (
        <div className="flex items-center gap-1.5 border-b border-line bg-bg-soft px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
      )}
      {children}
    </div>
  )
}
