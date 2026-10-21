export const config = {
  demoUrl: '#contacto',
  trialUrl: '#contacto',
  whatsappNumber: '',
  contactEmail: '',
  contactPhone: '',
}

export function whatsappHref(message) {
  if (!config.whatsappNumber) return config.demoUrl
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`
}
