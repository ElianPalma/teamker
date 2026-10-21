import { useCopy, locale } from '../copyContext.js'
import { config, whatsappHref } from '../config.js'
import { langHref, languages } from '../copy.js'
import logo from '../assets/logo.webp'

export default function Footer() {
  const copy = useCopy()
  const t = copy.footer
  return (
    <footer className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[2fr_1fr_1fr_1fr] md:px-8">
        <div>
          <img src={logo} alt="Teamkers" className="h-7 w-auto" width="671" height="96" loading="lazy" decoding="async" />
          <p className="mt-3 text-sm text-ink-500">{t.byline}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-ink-900">{t.contact}</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><a className="hover:text-primary" href={whatsappHref(copy.whatsapp.message)}>WhatsApp</a></li>
            {config.contactEmail && <li><a className="hover:text-primary" href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a></li>}
            {config.contactPhone && <li><a className="hover:text-primary" href={`tel:${config.contactPhone.replace(/\s/g, '')}`}>{config.contactPhone}</a></li>}
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold text-ink-900">{t.legal}</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            <li><a className="hover:text-primary" href="/aviso-legal">{t.legalLinks.notice}</a></li>
            <li><a className="hover:text-primary" href="/privacidad">{t.legalLinks.privacy}</a></li>
            <li><a className="hover:text-primary" href="/cookies">{t.legalLinks.cookies}</a></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold text-ink-900">{t.language}</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-500">
            {languages.map((l) => (
              <li key={l.code}>
                <a className={`hover:text-primary ${locale === l.locale ? 'font-semibold text-ink-900' : ''}`} href={langHref(l.code)} hrefLang={l.code === 'mx' ? 'es-MX' : l.code}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t border-line px-4 py-6 text-xs text-ink-500 md:px-8">{t.copyright}</div>
    </footer>
  )
}
