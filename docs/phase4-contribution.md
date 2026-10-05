# Keertana — Phase 4 contribution report

## Delivered

- `/contribute/`: a restrained contribution hub with Submit a Song, Report an Error, and Join the Team.
- `/contribute/submit/`: required title, existing language values, multiline lyrics, and acknowledgement; optional Roman title, alternate title, author/composer, source, category, notes, name, and email.
- `/contribute/report/`: a song selector, issue type, required description, and optional correction/name/email. `?song=<existing-slug>` selects the song and associates its title and language with the prepared report. Invalid slugs show a clear fallback message.
- `/contribute/join/`: required name, email, and one or more interests; optional experience, motivation, and website.

The shared forms use associated labels/help/errors, visible focus, required indicators, live feedback, focus on the first invalid field, and a disabled/busy action while processing. Invalid email and website formats are rejected. Lyrics retain line breaks. Entries remain intact when sending is unavailable or fails.

## Submission handling and limitations

No real backend, form endpoint, or real contribution inbox existed. The former contact links used a placeholder email address. No endpoint, service, account system, or database was invented.

`src/lib/contribution.mjs` isolates the receiver integration. Its current `sendContribution` function returns `unavailable` and performs no network requests or persistence. The visible action is **Check details**, and both the initial notice and completion message explicitly say nothing has been sent or saved. Drafts exist only in the current form; navigating away can discard them.

A receipt-confirmed success branch is prepared for a future integration, but cannot be reached by the current adapter. It provides flow-specific thanks only when a receiver explicitly returns `received` with a nonempty receipt. Failure preserves the form.

Before enabling actual sending, choose and approve a real receiver, implement it at that boundary, and update the availability notices and action label to match the connected behavior. No further phase was started.

## Components and existing patterns

Reused `Base.astro`, the existing cream/brown/terracotta theme tokens, font stack, page container, navbar, and footer layout. Added a shared contribution layout, shared form, and shared labelled field component. No library was added.

Existing footer contribution links now lead to the new pages. A song page passes its slug to the existing footer report link. Contact links and the existing About submission link were wired to the new routes; their page designs were not rebuilt.

## Files created

- `src/pages/contribute/index.astro`
- `src/pages/contribute/submit.astro`
- `src/pages/contribute/report.astro`
- `src/pages/contribute/join.astro`
- `src/layouts/Contribution.astro`
- `src/components/ContributionForm.astro`
- `src/components/ContributionField.astro`
- `src/styles/contribution.css`
- `src/lib/contribution.mjs`
- `tests/contribution.test.mjs`
- `docs/phase4-contribution.md`

## Files modified

- `src/layouts/Base.astro`: contribution destinations and optional report slug context.
- `src/pages/song/[slug].astro`: pass the existing song slug to Base.
- `src/pages/contact.astro`: replace placeholder destinations with contribution pages.
- `src/pages/about.astro`: update only the existing Submit link destination.

Local verification outputs: `.contribution-build.log`, `.contribution-pagefind.log`, `.contribution-hub.png`. The existing background server logs were refreshed when the server restarted.

## Verification

- 18 automated tests passed: contribution validation/unavailable adapter and existing search, reader controls, and local library.
- Astro build passed: 1,558 pages.
- Existing Pagefind build passed: 1,307 song pages in three languages.
- All three forms inspected at desktop and mobile widths; the team form was additionally checked at 320px. No horizontal overflow was observed.
- Browser-tested required fields, email/URL errors, multiple interests, invalid song fallback, automatic Hindi song association, Telugu multiline text preservation, retained drafts, keyboard focus, and truthful unavailable completion.
- Server remains running in the background at `http://127.0.0.1:4321/`.

## Decisions to review

- Sending remains unavailable until a real receiver is selected.
- Optional transliteration describes the **title** in Roman characters, matching Keertana’s title-search purpose.
- Team experience and motivation are optional to keep joining approachable.
- Additional song metadata is collapsed initially; title/language/lyrics remain visible.
- The acknowledgement is a concise review statement, not a new legal policy. Its final wording can be reviewed with the later copyright phase.
