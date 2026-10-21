# Teamkers · landing

Landing de Teamkers hecha con Vite, React, Tailwind 4 y Motion. El build genera la carpeta `dist/` con una página ya renderizada por idioma (`/`, `/mx/`, `/en/`, `/pt/`), los archivos en `dist/assets/` y `sitemap.xml`, `robots.txt` y `llms.txt`. Para verla, usa `npm run preview` (abrir `dist/index.html` con doble clic ya no funciona).

## Arrancar

```bash
npm install
npm run dev
```

Build final y vista previa del build:

```bash
npm run build
npm run preview
```

En Netlify, `netlify.toml` ya indica el comando de build y la carpeta `dist`. Cuando la web pase al dominio definitivo, cambia `SITE_URL` en `netlify.toml` (lo usan la URL canónica, `hreflang`, el sitemap y los datos estructurados).

## Dónde se cambia cada cosa

| Qué | Dónde |
|---|---|
| Textos en español | `src/i18n/es.js` |
| Textos en inglés | `src/i18n/en.js` |
| Textos en portugués (Portugal) | `src/i18n/pt.js` |
| Tramos y precios de la calculadora | `src/pricing.js` |
| Enlaces de demo, prueba, WhatsApp, email y teléfono | `src/config.js` |
| Colores y tipografía | `src/index.css` (`@theme`) |
| SEO, datos estructurados, sitemap y `llms.txt` | `scripts/prerender.js` |
| Imagen al compartir en redes | `public/og.jpg` (1200×630) |

Los tres ficheros de idioma tienen las mismas claves; si se añade un texto en uno, hay que añadirlo en los otros dos.

## Idiomas

Cada idioma tiene su URL: `/` (España), `/mx/` (México, mismo texto que España), `/en/` y `/pt/`. Los enlaces antiguos con `?lang=` siguen funcionando. Ya no se cambia el idioma automáticamente según el navegador, para que Google indexe cada versión en su URL. Hay selector en la cabecera (ES · EN · PT) y en el pie.

## Pendiente antes de publicar

- Rellenar los huecos marcados como `[XX]` (cifras de AIT, cita y autor) en los tres ficheros de idioma. Se ven en la página con borde naranja discontinuo.
- Poner el número de WhatsApp, el email y el teléfono en `src/config.js`. Mientras estén vacíos, los botones llevan a la sección de contacto.
- Las dos capturas de la app (`src/assets/hero.webp` y `src/assets/screen-ausencias.webp`) están en español en todos los idiomas.
# teamker
