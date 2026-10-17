# Reading, collections, and comment-interest preview — 17 October 2026

## Scope

Existing static Astro site preserved. No catalog records or source lyrics imported, edited, or deleted. No new runtime dependency, paid service, account, or active public-comment submission added. The prepared moderated-comments backend remains disabled.

## Reading improvements

Reader transliteration now has its own rules, separate from the forgiving title-search and slug conventions. Existing song URLs, search aliases, original lyrics, copy controls, and print flow remain compatible.

Telugu fixes distinguish the common e/o reading of ఏ/ఓ from ee/oo for ఈ/ఊ, preserve consonant doubling and conjuncts, use context-sensitive nasal spelling, and handle dependent vowels, digits, and an existing split-o spelling in the reading only. For example, యేసు దేవా నీతో దీవించావే becomes `yesu devaa neetho deevinchaave`. Hindi handles nukta letters, common schwa deletion patterns, and a small explicit devotional vocabulary.

These are consistent ASCII reading aids, not English translations, scholarly reversible transliteration, or a human pronunciation certification. Dialect, singing, names, and malformed source text can still need corrections. Unicode character structure informs the rules; it does not verify sung pronunciation. References: [Unicode Telugu and Devanagari](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-12/), [Library of Congress Hindi table](https://www.loc.gov/catdir/cpso/romanization/hindi.pdf).

The catalog audit checks all 1,307 records. Of 1,195 records containing native-script lyrics, 1,193 receive complete readings. Two Hindi records (`chattaan`, `thu-meraa-bal`) contain malformed source vowel sequences; the incomplete reading option is withheld while their original lyrics stay available. Do not invent the missing source consonant. All 1,168 Telugu songs receive readings. No numeric pronunciation-accuracy claim is made.

Run `node scripts/audit-catalog-quality.mjs` after catalog/rule changes. It checks line preservation, unsupported letters, collection coverage, and regenerates `docs/catalog-quality-report.json`. That report contains membership decisions and short matching evidence, not copied lyric bodies. If the two source issues are corrected, update the expected exception list in the audit.

## Complete Telugu collection coverage

All 1,168 Telugu songs now belong to at least one of 16 collections. The original 48 manually selected memberships are preserved, including the existing English songs. New assignments are rules-based suggestions derived from title, opening stanza, and supporting verses. They are not claimed to have been individually reviewed by a person.

Title and opening-stanza evidence outweigh later verses; an incidental word in a later verse alone cannot assign a festival. Up to two strongest themes are used alongside existing selections. The 370 songs without a clear specific theme use a broad Faith & Devotion collection, rather than being forced into an unsuitable festival. Memberships overlap; collection counts must not be summed as unique songs.

The homepage keeps six prominent cards and links to all collections. The directory shows all 16. Each collection uses 36 songs per page, crawlable previous/next links, distinct titles, self-canonical URLs, and sitemap inclusion. Readers link back to their collections. Related links use nearby collection members instead of showing the same first few songs everywhere.

Counts: Praise & Worship 305; Grace & Salvation 216; Love of God 225; Hope & Encouragement 116; Prayer 65; Christmas 47; Heaven & Eternal Life 37; Good Friday 34; Thanksgiving 27; Church & Service 21; Holy Spirit 11; Word of God 11; Family & Blessing 10; Easter 6; Coming of Jesus 5; Faith & Devotion 370.

## Inactive comments demo and measurement

Reader → **Preview song comments** → `/comments-demo/` → **Yes, I’d use song comments** → `/comments-demo/interest/`.

The preview is explicitly inactive, with disabled display-only fields, no form submission, no public posts, and no signup. Existing correction emails still work. Both demo pages are `noindex` and excluded from the sitemap. No Supabase/Turnstile requests occur while comments are disabled. Privacy wording discloses the ordinary page-view measurement.

### Where to see interest

1. Deploy this revision with the existing Vercel Web Analytics integration enabled.
2. Open Vercel → Keertana → Analytics → Production → Pages. Use the same date range when comparing the two paths.
3. Look for `/comments-demo/` (preview visits) and `/comments-demo/interest/` (explicit-interest visits). Vercel may display these without the final slash.
4. Prefer **Visitors** over raw page views. Preview visitors suggest curiosity; confirmation-page visitors suggest stronger demand. Compare these with overall song readership over several weeks before adding a backend.

This uses normal page views because [Vercel custom events require Pro or Enterprise](https://vercel.com/docs/analytics/custom-events). There is no custom-event call or paid-plan dependency. Ad blockers, reloads, shared confirmation links, daily visitor counting, date boundaries, and people visiting multiple songs limit the precision: the two counts are directional signals, not a user-level conversion funnel, proof that commenting works, or successful comment submissions. It does not send immediate email/push notifications or collect typed comment content.

[Google Search Console performance](https://support.google.com/webmasters/answer/7576553?hl=en) measures search visibility and clicks from Google; it cannot show these on-site button clicks. No production experiment clicks should be made during QA because they could inflate the counts. Local preview builds do not send production analytics.

Future activation still requires separately configuring and testing the approved moderated-comments services; see `docs/song-comments-setup.md`. Do not change `PUBLIC_COMMENTS_ENABLED=false` just to run this demo.
