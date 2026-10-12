# Dependency review, local song entry and printing — 12 October 2026

## Dependency fixes

The initial audit reported five affected packages: Astro (critical aggregate), sharp, http-cache-semantics and source-map-js (high), and esbuild (low). The compatible audit fix updated http-cache-semantics and source-map-js. The owner explicitly approved upgrading Astro 5.18.2 to 7.3.8 because no patched Astro 5 release was available for the remaining advisories.

Astro's dependency update replaced the affected sharp/esbuild chain. The subsequent npm audit reported **zero known vulnerabilities**. This is an audit result, not a guarantee of absolute security. Several original advisories concerned SSR, image optimization or development features not used by the deployed static library; the framework and development dependencies were updated rather than leaving the flagged versions installed.

The static architecture, catalog schema and existing routes are preserved. Astro 7's CLI is now `node_modules/astro/bin/astro.mjs`; normal npm scripts remain the supported way to run commands. The full build succeeds in the default `dist` directory. An initial cross-drive temporary build failed because Astro 7 moves prerendered assets with rename; no framework patch was applied. Node 22.18 or newer is declared, and Node 24 is recommended for local use and Vercel. Confirm the hosting project uses a supported Node version.

The offline-cache version is advanced for this release so returning browsers refresh the upgraded site's assets. Saved songs and preferences in local storage are unaffected.

## Local song-entry tool

Run **`npm run song-entry`**. Open the `http://127.0.0.1:.../` address printed in that terminal. A free port is chosen to avoid conflicts with other development websites.

1. Enter the title and lyrics. Preserve blank lines between verses.
2. Leave the slug empty to generate a Roman slug using the existing transliteration helpers, or enter one explicitly.
3. Select Preview and check. Inspect the generated URL, Roman spelling and lyric spacing.
4. Matching slugs, normalized titles or normalized lyrics block an accidental duplicate. Existing entries are identified by title and URL.
5. Select Add song to local catalog only after review. An original-catalog backup is saved under `.song-backups/`; a complete new file is written and renamed into place. Existing entries are preserved and the new entry is appended.
6. Build, run the song SEO audit, review the generated page, then commit and push when ready. Adding locally does not publish or push automatically. Stop the tool with Ctrl+C.

The tool lives in `scripts/`, outside Astro's public pages and output. It is not a public admin panel and no login was added. It binds only to loopback and rejects unexpected Host/Origin headers and writes without its per-instance token. Anyone using the owner's unlocked Windows session can use it while running. Drafts are in the browser memory, not persisted. A catalog fingerprint rejects stale previews; an exclusive lock serializes additions. Files changed outside the tool are checked again before replacement. If an interrupted write leaves an entry-lock file, stop all entry-tool instances before investigating it; backups and temporary files are excluded from Git.

The preview is a readable text preview, not an audio recording. Sample previews were not added to the real catalog. All 1,307 original records remain unchanged.

## Print-friendly lyrics

Song readers now have a Print button wired to the browser's print dialog. Print CSS retains title, lyrics, blank lines and a small ownership/credit notice; it removes navigation, actions, hidden transliteration text, card decoration and background colours. Reading font preferences do not change the fixed printable size. Page margins, widows/orphans and title break rules are included. Visitors can choose Save as PDF in the dialog.

The same print rules were visually reviewed with representative Telugu, Hindi and English generated pages, using temporary screen-rendered copies with the print media rules active. Those copies are not source pages and are not committed. Actual printer output and PDF pagination were not tested; paper size, browser headers/footers and print settings can affect them.

## Validation

- 25 tests passed: all existing functionality plus slug generation, duplicates, preserved verse spacing, original backups, stale catalogs, same-origin/token guards and a complete addition to isolated temporary catalogs.
- Full `npm run build` passed with Astro and Pagefind; all 1,307 song pages passed the generated SEO audit.
- Browser checked duplicate rejection, multilingual preview and generated slug, mobile width, native/Roman search queries, language switching, reader size controls and report-email preparation after the upgrade.
- Local entry preview had no horizontal overflow at 390px. No real song was added and no email was sent during testing.
- Temporary entry/production-preview servers were stopped after checks.

## Changed files

`package.json`, `package-lock.json`, `.gitignore`, `README.md`, `public/sw.js`; new `scripts/song-entry/catalog.mjs`, `server.mjs`, `index.html`, `tests/song-entry.test.mjs`; `src/pages/song/[slug].astro` and new `src/styles/print.css`. Setlists, song collections, credits fields, public administration, accounts and CMS work remain outside this change.
