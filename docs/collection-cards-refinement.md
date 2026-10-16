# Collection cards — 16 October 2026

The homepage now gives worship collections a dedicated section directly after the song search. Six complete clickable cards replace reliance on a small text shortcut. Cards share the existing cream/terracotta design language, with original decorative SVG illustrations, distinct theme colours, native titles, short descriptions, real song counts, and visible keyboard focus. The same component appears on the collections index. Phones use compact horizontal cards; tablet layouts use two columns and desktop layouts use three.

Three additional collections—Good Friday, Prayer, and Hope & Encouragement—join Christmas, Praise & Worship, and Thanksgiving. Membership was selected from the existing Keertana catalog and checked against the title and opening verses. There are 48 distinct existing songs across the six selections. New collections automatically receive their own static page, sitemap entry, related reader links, and collection return links through the established architecture. No song records, slugs, original lyrics, or transliteration rules changed in this refinement.

The mobile review also exposed that collection detail pages depended on row layout rules defined only in alphabet-browsing pages. Collection-scoped row styles now give every song its own spacious link, separate native/Roman/language labels, dividers, and focus feedback. The existing main browse layout is unaffected.

## Research and content boundaries

Reviewed public home/category pages from the four previously requested sites. WaytoChurch’s category directory provides worship occasions such as Good Friday, prayer-adjacent themes, hope, praise, and thanksgiving. Telugu Gospel Lyrics promotes visible category destinations; Christian Telugu Lyrics has separate language and children’s destinations. ChristianLyricz did not return readable page text in this pass; its earlier automated-access restriction was respected. This is a targeted category review, not an exhaustive crawl or a complete comparison of every song.

- https://waytochurch.com/lyrics/category
- https://telugugospellyrics.com/
- https://christiantelugulyrics.com/
- https://christiantelugulyrics.com/kids-songs/
- https://christianlyricz.com/

No competitor lyrics, recordings, artwork, or full catalogs were scraped or republished. Public access and a site's lack of ownership do not establish an open licence for the underlying lyrics. Future imports require supplied permission, a suitable licence, or a confirmed public-domain source. Source names, URLs, category concepts, and song-gap research can be recorded without bulk copying lyric texts.

## Files

- `src/components/CollectionArt.astro`: original decorative theme illustrations.
- `src/components/CollectionCards.astro`: shared accessible card markup.
- `src/lib/worship-collections.ts`: presentation fields and three additional curated selections.
- `src/pages/index.astro`: prominent collection section and shortcut.
- `src/pages/collections/index.astro`: shared card display and updated description.
- `src/pages/collections/[collection].astro`: themed header and styled onward destinations.
- `src/styles/collections.css`: desktop/tablet/phone and light/dark styling.
- `public/sw.js`: cache version for returning visitors.
- `scripts/audit-roman-collections.mjs`: homepage/index discovery-link checks in addition to reader, API, sitemap, and reciprocal-link checks.

Existing local edits to `src/data/songs.json` remain untouched and outside the implementation commit.

## Validation

- Production build, including Pagefind, completed successfully.
- All 38 regression tests passed.
- Song SEO and legacy-route audits passed for all 1,307 songs.
- Roman/collection audit passed for 1,195 reading aids and all six collection routes, including homepage discovery and reciprocal song links.
- Browser review covered desktop, 768px tablet, 390px and 320px phones, both themes, card navigation, and the corrected collection song-row layout. Phone checks found no horizontal overflow.
- Native/Roman lyric generation was not changed in this release. Human pronunciation review remains outstanding; category research did not include a complete catalog crawl or prove redistribution rights.
