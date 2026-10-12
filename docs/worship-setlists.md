# Worship setlists

The static `/setlists/` page uses the existing colors, typography, header, and footer. Access it from the header, local library, or the song reader’s “Add to a worship setlist” link.

Create named lists; search titles with the shared native/Roman title matcher or pick Saved Songs; add without duplicates; reorder using accessible up/down buttons; remove, rename, and delete with confirmation. Read all songs in order or print the prepared lyrics. Printing loads only selected song JSON files, keeping the initial page compact. Each song starts a fresh printed page after the first. Credit notices retain the existing rights language.

Storage uses a separate versioned `keertana-setlists-v1` key; existing saved/recent songs are untouched. Mutations reread storage and report failed writes. Other tabs synchronize through storage events. Invalid JSON/unsupported formats block writes rather than overwriting records. Lists are limited to 100 lists / 100 songs each. Removed catalog songs remain visible as unavailable; printing reports the missing song instead of silently omitting it.

Lists belong to one browser origin; localhost and production do not share lists. No accounts, cross-device syncing, server writes, or shared links. Download backup exports JSON for safekeeping; automatic backup import is not included in this release. Browser storage clearing removes local lists.

Files: `public/setlists.js`, `src/pages/setlists.astro`, `src/scripts/setlist-workspace.js`, `src/styles/setlists.css`, `src/pages/api/song/[slug].json.ts`, and `tests/setlists.test.mjs`. Existing Base, LocalLibrary, reader, sitemap configuration, and service worker gain access links / private-workspace exclusion / cache version update.

Validation: production build + Pagefind; song SEO audit (1,307 songs, zero failures); storage tests; browser create/search/add/reorder/read/reload flow; desktop and 390px mobile visual review. Physical printing and printer-specific pagination have not been verified.
