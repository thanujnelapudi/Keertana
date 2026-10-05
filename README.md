# Keertana

A multilingual Christian worship-song and hymn library in Telugu, Hindi and English, built with Astro and Tailwind CSS. The project contains 1,307 songs with title/transliteration search, browser-local saved/recent songs, reading controls and responsive light/dark themes.

Song credit and applicable rights belong to the respective creators and rights holders. Keertana does not claim copyright ownership of the displayed songs or lyrics.

## Local development

Install dependencies with `npm ci`, then run `npm run dev -- --host 127.0.0.1` and open http://127.0.0.1:4321/.

## Production build

Run `npm run build`. This generates the Astro site and Pagefind index in `dist/`. Use `npm run preview` to review the generated site.

## Checks

Run `node --test tests/*.test.mjs` for the existing functional checks. After building, run `node scripts/audit-song-seo.mjs dist` to verify every song has a generated page, metadata, canonical URL, sitemap entry, incoming link and catalog-matching structured data.

## Vercel

Import this GitHub repository into the intended Vercel project. Use the Astro preset, install command `npm ci`, build command `npm run build`, and output directory `dist`.

Set `SITE_URL` to the final primary HTTPS address before the production build. It currently defaults to https://keertana.vercel.app. Check the existing Vercel project and address assignment before replacing a live site. Deploy a preview first, verify it, and preserve old URLs with redirects where needed.

## Current contribution status

Submit, Report and Join forms validate details locally. They do not send or store submissions; no receiver or CMS is connected. Saved/recent songs and reading preferences are local to the browser. See the policy pages and `docs/` for current behavior and implementation notes.
