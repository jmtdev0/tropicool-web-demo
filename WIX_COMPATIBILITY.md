# Tropicool Prototype: Wix Compatibility Notes

This prototype is built as a standalone Astro/Svelte site, but the visual system is intentionally portable.

## Tokens

- Background: `#041607`, `#06240d`, `#0b3517`
- Brand pink: `#ef8fba`
- Accent lime: `#caff69`
- Accent cyan: `#61ecf4`
- Cream text: `#fff9df`
- Borders: `rgba(255, 249, 223, 0.16)`

## Portable Sections

1. Hero: image background, wordmark, three CTAs.
2. Brand intro: plant-based story and stats.
3. Featured dishes: repeated cards.
4. Full menu explorer: data-driven cards with search/filter.
5. Reservation/order/location CTA block.
6. Gallery grid.
7. Contact/footer.

## Wix Translation

- Static sections can be rebuilt manually in Wix Editor using the same tokens.
- The menu explorer can become a custom element if Tropicool wants search/filter inside Wix.
- GSAP should stay scoped to hero/reveal animations and respect `prefers-reduced-motion`.
- Instagram assets should only be imported after Tropicool confirms usage rights or provides originals.
