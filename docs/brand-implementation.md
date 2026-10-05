# Approved Keertana brand

Applied the approved K/cross/songbook logo across the shared header and footer, favicon, Apple touch icon, installed-app icons and default social sharing image. Existing accessible home links remain in place. Dark mode presents a cream monochrome logo for contrast.

## Files

- `src/components/BrandLogo.astro`: shared approved logo, fixed 170×44px frame, dark-theme presentation.
- `src/layouts/Base.astro`: header/footer component references, PNG favicon, Apple touch icon and social image.
- `public/manifest.webmanifest`: PNG app icons at 192px and 512px, including maskable versions with additional safe padding.
- `public/sw.js`: brand cache version and logo/favicon precaching; existing caching behavior retained.
- `public/brand/keertana-icon.png`: square symbol generated from the approved logo with the built-in image tool. Prompt: preserve the approved K/cross/flowing-page symbol, omit the wordmark, center on warm cream with safe margins.
- `public/brand/favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-192.png`, `icon-maskable-512.png`: delivery sizes of the icon.
- `public/favicon.svg` and the four existing SVG files in `public/icons/`: compatibility wrappers containing the approved PNG icons, so older URLs also show the current brand. These are raster-backed SVGs, not vector tracings.
- `public/brand/preview.html`: preview references updated to the approved logo and symbol.

The original approved transparent PNG `public/brand/keertana-logo-concept-v2.png` is preserved. Earlier concept SVGs remain as unused review assets.

## Validation

Production Astro build passed, generating 1,561 pages. Browser confirmed header and footer images loaded, accessible home links, the new favicon declaration, and dark-mode contrast. At 320px the page had no horizontal overflow and branding did not crowd the controls. Header height remained 60.8px; desktop footer height remained 310.3px with a 44px brand link. No data, song reader, search or contribution logic changed. No new dependencies were introduced.

The background development server remains at http://127.0.0.1:4321/.
