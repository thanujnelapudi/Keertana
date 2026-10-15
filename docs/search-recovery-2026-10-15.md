# Search recovery — 15 October 2026

## Completed locally

- Vercel permanent HTTP 301 migration from single-segment `/songs/:slug` URLs to `/song/:slug/`. Language landing pages are handled first and retain their language destination. Nested language/letter and pagination routes remain unchanged.
- Explicit spelling alias: `/songs/athyunnatha-simhasanamupai` → `/song/athyunnatha-simhaasanamupai/`.
- Astro static fallback redirects for all catalog song slugs and the spelling alias, so the old URLs also work on a plain static preview. Vercel supplies HTTP status redirects; static fallback HTML uses meta refresh.
- Curated Roman aliases for Neethi Suryuda Yesu and Nenemaina Prabhuva in page titles, descriptions, visible subtitles, and MusicComposition alternateName. All song lyrics and native titles remain unchanged. English How Great Is Our God remains accurately labeled English.
- Header logo scales below 380px to make room for Setlists, Search, and Theme controls. Footer logo remains unchanged. Browser reviewed the reader at 320px with no horizontal overflow.
- Service worker cache version advanced for returning visitors.

## Search Console 404 inventory

Eight reported URLs have a catalog destination: `naaku-nee-krupa-chaalunu`, `praaneshwara`, `enni-tharamulu-sthuthiyinchinaa`, `athyunnatha-simhasanamupai` (explicit alias), `naaku-jeevamai-unna`, `kavulakainaa-saadhyamaa`, `prathigaa-yesu-yesu`, and `kalalaa-unnadi`.

Four reported URLs remain without a verified destination:

- `/songs/sugunala-sampannuda`
- `/songs/sugunala-sampannuda/`
- `/songs/nee-krupa-odiponivvadhu/`
- `/artists`

The generic prefix migration does not restore missing songs: absent destinations still return 404. Do not redirect these to unrelated songs or the homepage. Restore approved song content or establish a verified equivalent before adding specific redirects. Do not claim that the entire 404 report has been fixed.

## Validation

31 regression tests; production build and Pagefind; `node scripts/audit-song-seo.mjs` verifies all 1,307 song pages; `node scripts/audit-legacy-routes.mjs` verifies all 1,307 fallback redirects, the spelling alias, language destinations, and exclusion of old paths from the sitemap. Local browser followed an old URL into the correct updated reader. Physical print layout was not changed.

## Follow-up after deployment

Check HTTP status and Location for slash/no-slash old song URLs, the spelling alias, language pages, and the current destinations. Verify the two new search titles in public HTML. Search Console reports are delayed; the old counts will not disappear immediately. Revisit the 28-day query/page report after recrawling, comparing identical periods. Track priority query clicks, impressions, CTR, and position separately; a change in aggregate CTR alone does not prove improvement. Recheck sitemap processing and the crawled/discovered exclusions. No ranking or indexing guarantee is implied.

## Files

`vercel.json`, `src/pages/songs/[lang]/index.astro`, `src/lib/song-seo.ts`, `src/pages/song/[slug].astro`, `src/components/BrandLogo.astro`, `public/sw.js`, `tests/song-seo.test.mjs`, and `scripts/audit-legacy-routes.mjs`.

The user's existing `src/data/songs.json` edits are preserved and excluded from this change.
