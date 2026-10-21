import { useMemo, useState } from 'react'
import { useCopy } from '../copyContext.js'
import { config } from '../config.js'
import { DEFAULT_USERS, MAX_USERS, MIN_BILLABLE, formatters, quote, tiers } from '../pricing.js'
import { ButtonLink, Reveal, SplitWords } from './ui.jsx'

function Check({ small = false }) {
  return (
    <svg className={`${small ? 'mt-0.5 h-3.5 w-3.5' : 'mt-1 h-4 w-4'} shrink-0 text-success`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TierCard({ tier, first, active, annual, onPick, fmt, t }) {
  const q = quote(tier.exampleUsers, annual)
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={active}
      className={`rounded-3xl bg-white p-6 text-left transition-colors duration-150 ${active ? 'ring-2 ring-primary' : 'ring-1 ring-line hover:ring-ink-400'}`}
    >
      <p className="text-sm font-semibold text-ink-500">{first ? t.tierRangeFirst(tier.max) : t.tierRange(tier.min, tier.max)}</p>
      <p className="mt-3 text-[32px] font-bold leading-none tracking-tight tabular-nums text-ink-900">{fmt.unit.format(tier.pricePerUser)}</p>
      <p className="mt-1 text-sm text-ink-700">{t.perPersonMonth}</p>
      <ul className="mt-4 space-y-1 text-sm text-ink-700">
        {annual && (
          <li className="flex gap-1.5">
            <Check small />
            {t.freeMonthShort}
          </li>
        )}
        <li className="flex gap-1.5">
          {tier.setup === 0 || annual ? <Check small /> : <span className="w-3.5 shrink-0 text-center text-ink-400">+</span>}
          {tier.setup === 0 ? t.setupFree : annual ? t.setupFreeAnnual(fmt.money.format(tier.setup)) : t.setupPaid(fmt.money.format(tier.setup))}
        </li>
      </ul>
      <p className="mt-1 text-sm tabular-nums text-ink-500">
        {t.example(tier.exampleUsers, `${fmt.money.format(annual ? q.yearly : q.monthly)} ${annual ? t.perYear : t.perMonth}`)}
      </p>
    </button>
  )
}

export default function Pricing() {
  const copy = useCopy()
  const t = copy.pricing
  const fmt = useMemo(() => formatters(copy.meta.numberLocale), [copy.meta.numberLocale])
  const [users, setUsers] = useState(DEFAULT_USERS)
  const [annual, setAnnual] = useState(true)
  const q = useMemo(() => quote(users, annual), [users, annual])
  const total = annual ? q.yearly : q.monthly
  const pct = ((users - 1) / (MAX_USERS - 1)) * 100

  return (
    <section id="precios" className="relative scroll-mt-16 bg-white py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
        <SplitWords text={t.title} highlightFrom={t.highlightFrom} className="text-[clamp(2.6rem,6vw,4.6rem)] font-bold leading-[1.02] tracking-[-0.035em]" />
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-2xl text-[clamp(1.1rem,1.8vw,1.3rem)] leading-snug text-ink-700">{t.subtitle}</p>
        </Reveal>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 md:px-8">
        <Reveal delay={0.2} className="mt-10 flex justify-center">
          <div role="radiogroup" aria-label={t.period} className="flex rounded-full border border-line bg-bg-soft p-1">
            {[
              { v: false, label: t.monthly },
              { v: true, label: t.annual },
            ].map((o) => (
              <button
                key={String(o.v)}
                type="button"
                role="radio"
                aria-checked={annual === o.v}
                onClick={() => setAnnual(o.v)}
                className={`rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors duration-150 ${annual === o.v ? 'bg-ink-900 text-white' : 'bg-transparent text-ink-700 hover:text-ink-900'}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="rounded-[2rem] bg-bg-soft p-6 ring-1 ring-line md:p-12">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <label htmlFor="pricing-users" className="text-2xl font-bold tracking-tight text-ink-900 md:text-[28px]">
                  {t.question}
                </label>
                <p className="mt-6 text-[clamp(2.5rem,6vw,4rem)] font-bold leading-none tracking-tight tabular-nums text-ink-900">{t.people(users)}</p>
                <input
                  id="pricing-users"
                  type="range"
                  min={1}
                  max={MAX_USERS}
                  value={users}
                  onChange={(e) => setUsers(Number(e.target.value))}
                  aria-valuetext={t.people(users)}
                  className="pricing-range mt-6 w-full"
                  style={{ '--pct': `${pct}%` }}
                />
                <div className="mt-2 flex justify-between text-sm tabular-nums text-ink-500">
                  <span>1</span>
                  <span>{MAX_USERS}</span>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 ring-1 ring-line md:p-8">
                <p className="text-sm font-semibold text-ink-500">
                  {fmt.unit.format(q.tier.pricePerUser)} {t.perPersonMonth}
                </p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
                  <span aria-live="polite" className="text-[clamp(2.6rem,6vw,4.25rem)] font-bold leading-none tracking-tight tabular-nums text-ink-900">
                    {fmt.money.format(total)}
                  </span>
                  <span className="text-lg text-ink-700">{annual ? t.perYear : t.perMonth}</span>
                </div>
                {!annual && q.setup > 0 && (
                  <p className="mt-3 flex flex-wrap items-baseline gap-x-2 text-ink-700">
                    <span className="text-2xl font-bold tracking-tight tabular-nums text-ink-900">+ {fmt.money.format(q.setup)}</span>
                    <span className="text-[15px]">{t.setupOnce}</span>
                  </p>
                )}
                <ul className="mt-6 space-y-2 text-[15px] text-ink-700">
                  {annual && (
                    <li className="flex gap-2">
                      <Check />
                      {t.freeMonth(fmt.money.format(q.monthly))}
                    </li>
                  )}
                  {(annual || q.setup === 0) && (
                    <li className="flex gap-2">
                      <Check />
                      {annual && q.tier.setup > 0 ? t.setupFreeAnnual(fmt.money.format(q.tier.setup)) : t.setupFree}
                    </li>
                  )}
                  {q.tier.setupNote === 'import' && (
                    <li className="flex gap-2">
                      <Check />
                      {t.setupIncludesImport}
                    </li>
                  )}
                  {users < MIN_BILLABLE && (
                    <li className="flex gap-2">
                      <Check />
                      {t.minimum}
                    </li>
                  )}
                </ul>
                <ButtonLink href={q.tier.cta === 'trial' ? config.trialUrl : config.demoUrl} className="mt-8 w-full">
                  {q.tier.cta === 'trial' ? t.trial : t.demo}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, i) => (
            <Reveal key={tier.id} delay={i * 0.06}>
              <TierCard tier={tier} first={i === 0} active={q.tier.id === tier.id} annual={annual} onPick={() => setUsers(tier.exampleUsers)} fmt={fmt} t={t} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-col items-center gap-2 text-center">
          <p className="text-xl font-bold tracking-tight text-ink-900">{t.moreTitle}</p>
          <p className="text-ink-700">
            {t.moreText}{' '}
            <a href={config.demoUrl} className="font-semibold text-primary underline-offset-4 hover:underline">
              {t.demo}
            </a>
          </p>
          <p className="mt-6 max-w-[60ch] text-sm text-ink-500">{t.note}</p>
        </Reveal>
      </div>
    </section>
  )
}
