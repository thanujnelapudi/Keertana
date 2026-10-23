# Indexing redirect repairs — 22 October 2026

The current production song pages remain unchanged. Three legacy spelling variants were reaching nonexistent paths after the general `/songs/:slug` migration. Their existing native titles and catalog entries establish the following explicit mappings:

| Legacy spelling | Existing catalog slug |
|---|---|
| naa-sthuthi-patruda | naa-sthuthi-paathrudaa |
| aaradhana-stuthi-aaradhana | aaraadhana-sthuthi-aaraadhana |
| preminchedan-aadhikamuga | preminchedan-adhikamugaa |

Vercel redirects handle both slash variants of these spellings under `/songs/` and `/song/`, before the generic prefix migration. The source and destination differ only in established Roman spelling; no content was merged or fabricated. Local static preview fallback pages also cover the three legacy `/songs/` paths, using the shared `LEGACY_SONG_ALIASES` map alongside the existing Athyunnatha spelling alias.

`/songs` and `/songs/` now have explicit hosting-level HTTP 301 redirects to the home library. This matches the existing Astro redirect's destination while replacing its static HTTP-200/meta-refresh response on Vercel. The old search query variant reaches the same library; the library does not automatically execute its legacy `search` parameter.

No robots restrictions, noindex directives, song metadata, or catalog records were changed. Missing compositions and retired pages were not redirected to unrelated content. Returning a successful page and supplying a canonical/sitemap do not guarantee that Google will crawl or index it; Google must reprocess the repaired old URLs.

Files: `vercel.json`, `src/lib/legacy-song-aliases.ts`, `src/pages/songs/[lang]/index.astro`, and `scripts/audit-legacy-routes.mjs`.

Validation is limited to one production build and targeted checks of the new redirect rules and fallback pages. The full application test suite is not required for these explicit route aliases.
