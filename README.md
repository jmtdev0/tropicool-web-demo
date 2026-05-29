# Tropicool Website Demo

> **Demo no oficial.** Este repositorio contiene una propuesta pública, experimental y no comercial para explorar una posible actualización de la web de Tropicool. No está afiliado, aprobado ni encargado por Tropicool.

This is a standalone Astro/Svelte prototype for a refreshed Tropicool home page: bilingual ES/EN content, structured menu explorer, strong reservation CTAs, lightweight motion and responsive accessibility-minded UI.

## Live Demo

- Netlify: https://tropicool-web-demo.netlify.app
- GitHub: https://github.com/jmtdev0/tropicool-web-demo

## Important Notice

- Tropicool, its brand, public menu content, public contact details and visual assets belong to their respective owners.
- The prototype is published only as a design/implementation demo and should not be treated as the official Tropicool website.
- Public images are mirrored locally from the existing public website for demo context. A production version should use assets explicitly authorized by Tropicool.
- If Tropicool or a rights holder wants anything removed or changed, the demo should be updated immediately.

## Stack

- Astro
- Svelte islands
- Tailwind CSS
- GSAP, scoped and disabled when `prefers-reduced-motion` is enabled
- Local structured menu data generated from public menu pages

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The static output is generated in `dist/`.

## Netlify

The project is ready for Netlify continuous deployment:

- Build command: `npm run build`
- Publish directory: `dist`

The demo intentionally sends `noindex, nofollow` signals so the public preview can be shared without trying to replace or outrank the official Tropicool site.
