# Keertana

A multilingual Christian worship-song and hymn library in Telugu, Hindi and English, built with Astro and Tailwind CSS. The project contains 1,307 songs with title/transliteration search, browser-local saved/recent songs, reading controls and responsive light/dark themes.

Song credit and applicable rights belong to the respective creators and rights holders. Keertana does not claim copyright ownership of the displayed songs or lyrics.

## Local development

Use Node.js 22.18 or newer (Node 24 is recommended). The project uses Astro 7.

Install dependencies with `npm ci`, then run `npm run dev -- --host 127.0.0.1` and open http://127.0.0.1:4321/.

## Add a song locally

Run `npm run song-entry` and open the local address printed in the terminal. Enter a title and lyrics, leave the slug blank to generate one or enter your own, then select Preview and check. Review the Roman spelling and verse spacing. Matching slugs, titles and lyrics prevent accidental duplicates. When ready, select Add song to local catalog.

The tool appends the entry to `src/data/songs.json` and creates an original-catalog backup in `.song-backups/`. It runs only on 127.0.0.1, outside the deployed site. Anyone using your Windows session can access it while running; it is not a public authenticated admin panel. Stop it with Ctrl+C. It does not push or deploy changes.

After adding, run `npm run build` and `node scripts/audit-song-seo.mjs dist`, review the song, then commit and push when ready. The normal static build creates its song page and updates collections, search and the sitemap. Restore from a catalog backup only after stopping the tool and preserving any newer changes.

## Print lyrics

Each song has a Print button that opens the browser print dialog. The print layout retains the title, lyrics, verse spacing and a credit notice, with navigation and actions hidden. Use the dialog's Save as PDF option if desired. Printed browser headers/footers, paper size and margins are controlled by the visitor's print settings.

## Production build

Run `npm run build`. This generates the Astro site and Pagefind index in `dist/`. Use `npm run preview` to review the generated site.

## Checks

Run `node --test tests/*.test.mjs` for the existing functional checks. After building, run `node scripts/audit-song-seo.mjs dist` to verify every song has a generated page, metadata, canonical URL, sitemap entry, incoming link and catalog-matching structured data.

## Vercel

Import this GitHub repository into the intended Vercel project. Use the Astro preset, install command `npm ci`, build command `npm run build`, and output directory `dist`.

Set `SITE_URL` to the final primary HTTPS address before the production build. It currently defaults to https://keertana.vercel.app. Check the existing Vercel project and address assignment before replacing a live site. Deploy a preview first, verify it, and preserve old URLs with redirects where needed.

## Current contribution status

Submit, Report and Join forms validate details locally and prepare email drafts to keertanasongs@gmail.com. Visitors review and send through their email app. Long messages can be copied into webmail; the site never claims automatic sending or receipt. No CMS or site-side submission database is connected. Saved/recent songs and reading preferences are local to the browser. See the policy pages and `docs/` for current behavior and implementation notes.
