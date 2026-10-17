# Roman reading and worship collections — 16 October 2026

Historical delivery notes. The current reading rules, coverage exceptions, 16 collections, and comment preview are documented in [the 17 October update](reading-collections-comments-demo.md).

## Delivered

- Automatic Roman reading aids for all 1,195 records containing Telugu/Hindi script in the current 1,307-song catalog. Original English lyrics remain unchanged without a redundant script toggle.
- Original lyrics remain the default. Script controls expose one reading panel at a time, announce changes, retain verse spacing, and make Copy use the selected text. Print uses the visible panel. Without JavaScript, original lyrics and a clearly labelled Roman fallback remain available.
- Roman text is generated from the existing project catalog using the established transliteration helpers, with reader-only handling of Telugu nasal context, supplementary vowel marks and native numerals. Existing search transliteration behavior is preserved. Unsupported native characters suppress a partial generated view instead of claiming completion.
- Every Roman panel says it is automatic transliteration, not an English translation or verified pronunciation, and links to the existing song-specific correction flow. Generated text is never written over the catalog.
- Ten priority title aliases now feed reader subtitles/metadata and the title-only search index. No additional song URL or duplicate page is created for Roman spellings.
- Public collections at `/collections/`: Christmas (10), Praise & Worship (10), Thanksgiving (7). These are 27 manually selected existing catalog entries, with original editorial introductions and preparation guidance. They have canonical URLs, structured collection/breadcrumb/list data, crawlable song links and sitemap entries. Personal setlists remain private/noindex workspaces.
- Collection-member readers link back to the relevant collection and up to four other songs from it. Related-song associations are based on actual collection membership, not invented credits or unverified song versions.
- Native and Roman title labels on collection entries and related links. Footer and homepage access links reuse the existing visual system.
- Setlist and shared-setlist readers/printers can choose original or Roman text where available. Existing Latin-script songs retain original lyrics in mixed sets. Selection is local to the current view; snapshot sharing still contains only the list name and ordered song slugs.
- About text and service-worker cache version updated. No new dependencies, accounts, database, third-party translation service, or artists directory.

## Content boundaries

No competitor lyrics were copied and no missing song records were invented or imported. Adding the two previously missing songs still needs owner-provided material or a confirmed licensed/public-domain source. The original `src/data/songs.json` local edits were preserved and excluded from the implementation commit. Automatic reading text requires human pronunciation review; the feature does not claim a complete professional transliteration or a semantic English translation.

## Validation

- 38 regression tests, including Roman/original switching and Copy, verse spacing, mixed Latin text, native digits, nasal context, malformed/unsupported input, valid collection memberships, and existing contribution/library/search/song-entry/setlist behavior.
- Production build with Pagefind.
- `node scripts/audit-song-seo.mjs`: all 1,307 original song pages, canonical URLs, schema, incoming links and sitemap entries.
- `node scripts/audit-legacy-routes.mjs`: all 1,307 legacy fallbacks and spelling/language redirect contracts.
- `node scripts/audit-roman-collections.mjs`: all generated Roman panels and API text, original-lyrics equality, three collection sitemap entries and reciprocal song links.
- Browser: native/Roman toggle, copy feedback (payload choice also unit-tested), collection navigation, mixed Telugu/English setlist reading, 390px reader and 320px collection layout, light/dark styling.
- Print stylesheet visually reviewed using a temporary static preview after Pagefind completed; the temporary page was removed. Physical printer pagination and full assistive-technology testing remain unverified.

## Maintenance

Collection membership lives in `src/lib/worship-collections.ts`. Only add a slug after checking its actual song and theme; a missing slug fails the build. Keep collections useful rather than multiplying empty archives. The Roman-reading audit must be rerun after catalog changes.

Priority title aliases live in `src/lib/song-seo.ts`. They are display/search spellings, not song-writing credits. Newly entered native-script songs receive an automatic reading aid on their next build; owners can preview the generated song page before publishing. A future reviewed-text override can be added separately when human-corrected material is available.

## Files affected

- `src/lib/roman-reading.ts`, `src/lib/worship-collections.ts`, `src/lib/song-seo.ts`, `src/lib/search-index.ts`
- `src/pages/song/[slug].astro`, `src/pages/api/song/[slug].json.ts`, `src/pages/collections/index.astro`, `src/pages/collections/[collection].astro`
- `src/pages/index.astro`, `src/pages/setlists.astro`, `src/pages/about.astro`, `src/layouts/Base.astro`, `src/components/SongRow.astro`
- `src/scripts/setlist-workspace.js`, `src/styles/collections.css`, `src/styles/print.css`, `src/styles/setlists.css`, `public/sw.js`
- `tests/roman-reading.test.mjs`, `tests/worship-collections.test.mjs`, `tests/reader-controls.test.mjs`, `scripts/audit-roman-collections.mjs`

The competitor research report is retained separately as the decision record. These changes improve reading and discovery; they do not guarantee Google rankings or immediate indexing.
