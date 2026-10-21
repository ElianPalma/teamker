import { useCopy } from '../copyContext.js'
import { config, whatsappHref } from '../config.js'
import { WhatsAppIcon } from './ui.jsx'

export default function WhatsAppFab() {
  const t = useCopy().whatsapp
  return (
    <a
      href={whatsappHref(t.message)}
      target={config.whatsappNumber ? '_blank' : undefined}
      rel="noreferrer"
      aria-label={t.label}
      title={t.label}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_14px_30px_-8px_rgba(37,211,102,0.7)] transition-colors duration-150 hover:bg-[#1fb857]"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}
