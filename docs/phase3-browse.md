# Phase 3 — Songs and browse refinement

## Existing structure preserved

The homepage remains the main song library. `/songs/` redirects to it. Language collections, letter collections, paginated collections and legacy redirects retain their existing routes. The catalog contains 1,307 songs: Telugu 1,168, Hindi 27 and English 112. Records provide titles, slugs and lyrics; there is no category, composer or source metadata, so none was invented.

Title search retains the existing native-script, Roman/transliteration, slug alias and partial/reordered-word matching. Lyrics are not searched by the visible title-search interface. The search index, matcher and data schema were not changed.

## Changes

- A compact Songs heading, introduction and primary title search replace the oversized decorative homepage hero.
- Browse and Your Library shortcuts improve access without adding navigation items. The library shortcut is hidden when local library content is empty.
- A shared song row renders the title with its language, a quiet saved indicator and an arrow. Existing dynamic filters/load-more rows receive the same presentation.
- Row hover and keyboard focus preserve horizontal padding, preventing a shifting layout across All and alphabet selections.
- Long multilingual titles can wrap. Letter buttons and language controls have at least 44px targets; visible keyboard focus is retained.
- Homepage language tabs support arrow keys, Home and End, with a single active tab stop and a labelled results panel. Alphabet replacement restores focus to the selected letter.
- Result counts announce updates. The browse empty state offers a reset within the current language; existing search no-result, loading and failed-load messages remain available. Escape dismisses search.
- Existing saved/recent storage is reused through the same `readLibrary` helper. Browse indicators do not write storage. Library removal and cross-tab storage events refresh indicators.
- Header, footer, song reader, contribution forms, information pages and policy drafts are unchanged.

## Files

Created: `src/components/SongRow.astro`, `src/components/BrowseEnhancements.astro`, `src/styles/browse.css`.

Modified: `src/pages/index.astro`, `src/pages/[lang]/index.astro`, `src/pages/[lang]/[letter].astro`, `src/pages/[lang]/page/[page].astro`.

## Validation

- All 19 existing tests passed, covering contribution validation, saved/recent persistence, reader controls and title/transliteration search.
- Production Astro build passed: 1,561 pages. Existing Pagefind indexing passed for 1,307 song pages across three languages. Redirect documents produce the existing no-html warnings; Telugu stemming is unsupported by Pagefind, while the visible title matcher retains Roman matching.
- Browser verified Hindi Roman query `aaj ka din`, Telugu query `yesayya`, no-result feedback and Escape dismissal.
- Browser verified English saved marker for Amazing Grace, Hindi keyboard tab selection, Telugu letter selection (66 results), load-more (24 to 48), and reset to All (1,168).
- Desktop layout inspected at 1280px. Tablet 768px and mobile 390px produced no document horizontal overflow. Dynamic letter rows retained flex layout and consistent padding.
- The development server was restarted after it retained an old module transform. It remains available at http://127.0.0.1:4321/.

## Logo concept requested during this phase

Separate review assets were created in `public/brand`: `keertana-logo.svg`, `keertana-mark.svg` and `preview.html`. The symbol combines an open songbook with a small cross in the existing terracotta/cream palette. The wordmark uses a serif face and a Songs · Hymns · Worship descriptor. The mark was visually inspected at 64px and 32px. These assets have not replaced the live header, footer or favicon. SVG wordmark text uses system fonts and may vary slightly across devices; outlining it would be a later production-branding step if this direction is approved.

Phase 3 is ready for review. No further phase has been started.
