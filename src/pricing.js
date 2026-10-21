export const tiers = [
  { id: 'micro', min: 1, max: 5, pricePerUser: 3, setup: 0, exampleUsers: 5, cta: 'trial' },
  { id: 'equipo', min: 6, max: 25, pricePerUser: 2.6, setup: 99, exampleUsers: 15, cta: 'trial' },
  { id: 'pyme', min: 26, max: 50, pricePerUser: 2.3, setup: 199, exampleUsers: 40, cta: 'demo' },
  { id: 'negocio', min: 51, max: 250, pricePerUser: 2, setup: 399, exampleUsers: 150, setupNote: 'import', cta: 'demo' },
]

export const MIN_BILLABLE = 5
export const MAX_USERS = 250
export const DEFAULT_USERS = 20

export function tierFor(users) {
  const n = Math.max(users, MIN_BILLABLE)
  return tiers.find((t) => n >= t.min && n <= t.max) ?? tiers[tiers.length - 1]
}

export function quote(users, annual) {
  const tier = tierFor(users)
  const billable = Math.max(users, MIN_BILLABLE)
  const monthly = billable * tier.pricePerUser
  return { tier, billable, monthly, yearly: monthly * 11, setup: annual ? 0 : tier.setup }
}

export function formatters(numberLocale) {
  return {
    money: new Intl.NumberFormat(numberLocale, { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: 'always' }),
    unit: new Intl.NumberFormat(numberLocale, { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  }
}
