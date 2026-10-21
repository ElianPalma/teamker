# Teamkers · landing

Landing de Teamkers hecha con Vite, React, Tailwind 4 y Motion. El build genera un único `dist/index.html` autocontenido (imágenes y fuentes incluidas) que se abre directamente en el navegador o se sube tal cual a cualquier hosting.

## Arrancar

```bash
npm install
npm run dev
```

Build final:

```bash
npm run build
```

## Dónde se cambia cada cosa

| Qué | Dónde |
|---|---|
| Textos en español | `src/i18n/es.js` |
| Textos en inglés | `src/i18n/en.js` |
| Textos en portugués (Portugal) | `src/i18n/pt.js` |
| Tramos y precios de la calculadora | `src/pricing.js` |
| Enlaces de demo, prueba, WhatsApp, email y teléfono | `src/config.js` |
| Colores y tipografía | `src/index.css` (`@theme`) |

Los tres ficheros de idioma tienen las mismas claves; si se añade un texto en uno, hay que añadirlo en los otros dos.

## Idiomas

Se elige con `?lang=`: `es` (España), `mx` (México, mismo texto que España), `en` y `pt`. Sin parámetro, se usa el idioma del navegador y, si no es inglés ni portugués, español. Hay selector en la cabecera (ES · EN · PT) y en el pie.

## Pendiente antes de publicar

- Rellenar los huecos marcados como `[XX]` (cifras de AIT, cita y autor) en los tres ficheros de idioma. Se ven en la página con borde naranja discontinuo.
- Poner el número de WhatsApp, el email y el teléfono en `src/config.js`. Mientras estén vacíos, los botones llevan a la sección de contacto.
- Las dos capturas de la app (`src/assets/hero.webp` y `src/assets/screen-ausencias.webp`) están en español en todos los idiomas.
