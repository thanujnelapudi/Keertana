# SEO, policies and hero — 5 October 2026

## Scope and decisions

Restored the welcoming homepage message and finalized the current-service policy wording. Contributions remain browser-only detail checks: no receiver, CMS, inbox or registered legal entity was invented. No song-content review was performed, per the owner's instruction. No public deployment, domain purchase or Search Console action was performed.

Keertana is described as a resource for finding lyrics, singing praise and worshipping God. Song credit and applicable rights belong to the respective creators and rights holders. Keertana does not claim copyright ownership of the displayed songs or lyrics. This statement is not a license or permission verification. Unknown contact details remain explicitly unavailable. Policies describe the current service, not a certification of legal compliance; provider-specific logging and retention still require confirmation when the local version is deployed.

## Changes

- `src/pages/index.astro`: restored Find your song or hymn and worship-focused introductory copy. Removed a SearchAction whose query URL was not implemented, and removed generic Organization markup. Corrected the displayed ItemList's item count to match its actual entries.
- `src/styles/browse.css`: restored a stronger homepage heading while retaining working browse styling and mobile wrapping.
- `src/layouts/Base.astro`: replaced the ambiguous copyright footer with an explicit statement that song rights belong to their respective owners.
- `src/layouts/Information.astro`: current-service status notice and 5 October update date replace repeated draft framing. Missing operator/contact facts remain disclosed.
- `src/pages/about.astro`, `copyright.astro`, `terms.astro`, `privacy.astro`: finalized editorial wording around worship purpose, ownership, current form limitations, service availability and unknown contact details. No new agreement, waiver, license or guaranteed response time was added.
- `src/pages/song/[slug].astro`: titles explicitly include song language and Christian Song Lyrics; descriptions use the actual song title, detected language and lyric excerpt. Song schema now includes a stable fragment identifier and lyric language. No author/composer metadata was invented.
- `scripts/audit-song-seo.mjs`: checks generated song-page existence, metadata, self-canonical routes, absence of noindex, sitemap membership, incoming HTML links and catalog-matching MusicComposition/BreadcrumbList data. Run against a completed build directory with Node.

## Verification

All 19 existing tests passed. Astro generated 1,561 pages successfully. The all-song SEO audit checked 1,307 songs with zero failures. These are local generated-site checks, not proof of Google indexing. The hero was visually inspected on desktop and at 320px; mobile document width equalled scroll width, with no horizontal overflow. The owner's running server was left intact; http://localhost:4321/ responded successfully while 127.0.0.1 did not.

The public https://keertana.vercel.app/ homepage currently displays Telugu Worship, ministries and a setlist builder. It differs from the local implementation. Its current sitemap and robots endpoints could not be verified with the web reader. Its indexed-page count, Search Console ownership and hosting settings were not accessible here.

## Recommended release and SEO sequence

1. Choose one permanent primary address. The existing Vercel address can be used; a custom domain is an optional branding/ownership decision, not a guarantee of better rankings. Decide before a major promotion if possible.
2. Identify the existing Vercel project before replacing anything. Preserve any useful existing URLs or map them to real replacements; use permanent redirects for changed URLs, not a blanket redirect to the homepage.
3. Build with the primary address in SITE_URL, using the existing complete build command (Astro plus Pagefind). Confirm canonical URLs, robots.txt and sitemap point to that address.
4. Deploy a preview and verify real HTTP responses, direct song links, redirects, logo/assets, mobile behavior and production caching. The development service worker behavior deserves a focused reliability pass independently of the earlier localhost/IPv6 address mismatch.
5. After the owner deploys, verify the final site in Google Search Console and submit /sitemap-index.xml. Inspect representative Telugu, Hindi and English song URLs and monitor indexing reasons for the whole collection.
6. Make every song crawlable; indexing and search positions remain Google's decisions. Target useful song-specific native/Roman lyric searches rather than expecting instant top placement for broad worship queries.
7. Add richer creator/source/date metadata only when supplied from reliable sources and visible on the page. The current records contain title, slug and lyrics only. Roman aliases and algorithmic transliterations are search aids, not verified author credits. Do not fabricate categories, credits, reviews or ratings to fill schema fields.

Reference guidance: Google Search Central sitemap overview, structured-data policies, Search Console guidance and site-move documentation; Indian Copyright Office handbook for the distinction between attribution and permission.
