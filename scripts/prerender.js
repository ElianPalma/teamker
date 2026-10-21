// Genera el HTML ya renderizado de cada idioma (/, /mx/, /en/, /pt/) con sus etiquetas SEO,
// datos estructurados (JSON-LD), sitemap.xml, robots.txt y llms.txt.
// Se ejecuta solo dentro de `npm run build`.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')
const SITE = (process.env.SITE_URL || 'https://teamker.netlify.app').replace(/\/+$/, '')

const { render, copies, languages, tiers } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)

const pages = languages.map((l) => ({
  ...l,
  path: l.code === 'es' ? '/' : `/${l.code}/`,
  hreflang: copies[l.locale].meta.lang,
}))
const ogLocale = { 'es-ES': 'es_ES', 'es-MX': 'es_MX', en: 'en_GB', pt: 'pt_PT' }

const template = readFileSync(join(dist, 'index.html'), 'utf8')
const assets = readdirSync(join(dist, 'assets'))
const fontPreloads = assets
  .filter((f) => /^cabin-latin-(400|700)-normal-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const hasPlaceholder = (s) => /\[[^\]]+\]/.test(s)
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`)
  if (!re.test(html)) throw new Error(`Falta <meta ${attr}="${key}"> en index.html`)
  return html.replace(re, `$1${esc(value)}$2`)
}

function structuredData(page, copy) {
  const url = SITE + page.path
  const prices = tiers.map((t) => t.pricePerUser)
  const faq = (copy.faq?.items || []).filter((i) => !hasPlaceholder(i.q) && !hasPlaceholder(i.a))
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${SITE}/#organization`,
      name: 'AIT',
      brand: { '@type': 'Brand', name: 'Teamkers' },
      url: SITE + '/',
      logo: `${SITE}/favicon.png`,
      address: { '@type': 'PostalAddress', addressLocality: 'Torrelavega', addressRegion: 'Cantabria', addressCountry: 'ES' },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      name: 'Teamkers',
      url: SITE + '/',
      publisher: { '@id': `${SITE}/#organization` },
      inLanguage: pages.map((p) => p.hreflang),
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: copy.meta.title,
      description: copy.meta.description,
      inLanguage: page.hreflang,
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': `${SITE}/#software` },
      primaryImageOfPage: `${SITE}/og.jpg`,
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE}/#software`,
      name: 'Teamkers',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'HR software',
      operatingSystem: 'Web',
      description: copy.meta.description,
      url: SITE + '/',
      image: `${SITE}/og.jpg`,
      publisher: { '@id': `${SITE}/#organization` },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'EUR',
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: tiers.length,
      },
    },
  ]
  if (faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      inLanguage: page.hreflang,
      mainEntity: faq.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

for (const page of pages) {
  const copy = copies[page.locale]
  const url = SITE + page.path
  let html = template
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${page.hreflang}">`)
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(copy.meta.title)}</title>`)
  html = setMeta(html, 'name', 'description', copy.meta.description)
  html = setMeta(html, 'property', 'og:title', copy.meta.title)
  html = setMeta(html, 'property', 'og:description', copy.meta.description)
  html = setMeta(html, 'property', 'og:image', `${SITE}/og.jpg`)
  const head = [
    `<link rel="canonical" href="${url}" />`,
    ...pages.map((p) => `<link rel="alternate" hreflang="${p.hreflang}" href="${SITE + p.path}" />`),
    `<link rel="alternate" hreflang="x-default" href="${SITE}/" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="${ogLocale[page.locale]}" />`,
    ...pages.filter((p) => p !== page).map((p) => `<meta property="og:locale:alternate" content="${ogLocale[p.locale]}" />`),
    ...fontPreloads,
    jsonLd(structuredData(page, copy)),
  ].join('\n    ')
  if (!html.includes('<!--seo-->')) throw new Error('Falta <!--seo--> en index.html')
  html = html.replace('<!--seo-->', head)
  const body = render(page.locale)
  html = html.replace('<div id="root"></div>', `<div id="root" data-locale="${page.locale}">${body}</div>`)
  const outDir = join(dist, page.path)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
  console.log(`prerender ${page.path} (${page.hreflang})`)
}

// sitemap.xml con las versiones de idioma enlazadas entre sí
const alternates = pages.map((p) => `    <xhtml:link rel="alternate" hreflang="${p.hreflang}" href="${SITE + p.path}"/>`).join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .map(
    (p) => `  <url>
    <loc>${SITE + p.path}</loc>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>
  </url>`,
  )
  .join('\n')}
</urlset>
`
writeFileSync(join(dist, 'sitemap.xml'), sitemap)
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)

// llms.txt: resumen en texto plano para asistentes de IA (GEO)
const es = copies['es-ES']
const money = (n) => `${String(n).replace('.', ',')} €`
const faqText = es.faq.items
  .filter((i) => !hasPlaceholder(i.q) && !hasPlaceholder(i.a))
  .map((i) => `### ${i.q}\n${i.a}`)
  .join('\n\n')
const tierText = tiers
  .map((t) => `- De ${t.min} a ${t.max} personas: ${money(t.pricePerUser)} por persona al mes${t.setup ? `, alta de ${money(t.setup)}` : ', sin coste de alta'}`)
  .join('\n')
const llms = `# Teamkers

> ${es.meta.description}

Teamkers es un producto de AIT (Torrelavega, Cantabria, España).

## Idiomas
${pages.map((p) => `- [${p.label}](${SITE + p.path})`).join('\n')}

## Precios
${tierText}

## Preguntas frecuentes

${faqText}
`
writeFileSync(join(dist, 'llms.txt'), llms)

rmSync(ssrDir, { recursive: true, force: true })
console.log(`SEO listo para ${SITE}`)
