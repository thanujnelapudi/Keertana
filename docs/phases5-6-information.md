# Keertana — Phases 5 and 6 report

Implemented on 4 October 2026. This is a local implementation, not a public deployment or legal compliance certification.

## Pages and content

- **Updated `/about/`:** purpose, why the library exists, mission, future direction, actual browse/search/reader/saved behavior, realistic offline access, attribution limitations, improvement standards, and links to the existing contribution flows.
- **Created `/privacy/`:** actual form fields and handling, local title search, copy/share behavior, cookies versus local storage and Cache Storage, services, retention, choices, security, changes, and pending privacy contact.
- **Created `/terms/`:** respectful use, responsible contributions, content/permissions, corrections, availability and accuracy, changes, and unresolved operator/legal decisions.
- **Created `/copyright/`:** individual song permissions, missing attribution, contributor responsibilities, a copyright concern preparation route, and review/removal expectations without invented licenses or formal legal procedures.

The three policies have an explicit owner/legal-review draft notice and the implementation date. Storage information is part of Privacy rather than a separate page. Related-page navigation connects About, Privacy, Terms, Copyright, and Contact. Longer policy pages have accessible contents links.

The owner supplied **Keertana** as the project/organization name and **India** as the country/jurisdiction context. No registered company, trust, church, NGO, legal entity, address, or email has been invented.

## Actual audit findings

### Attribution

All 1,307 current song records contain only `slug`, `title`, and `lyrics`. Language is inferred by the existing language helper. There are no stored author, composer, source, contributor, license, or copyright-status fields to display.

Reader language behavior remains unchanged. No empty attribution panel or invented credits were added. Known author/composer and source information can be prepared through existing optional contribution fields, but the form does not publish it. Contributor identity is not treated as authorship.

Removed outdated About claims about lyrics search, every song being available offline after one visit, and blanket personal/congregational permission to use all lyrics. There is no fictional founder, origin story, registered operator, dedicated review team, or exaggerated library claim.

### Cookies

No application cookie-setting code, cookie-based authentication, analytics, or advertising integration was found. A request to the running local Privacy page returned HTTP 200 with no `Set-Cookie` header. This does not audit cookies from a production host, dashboard settings, browser extensions, or every third-party response.

**No cookie banner was implemented.** No app-configured non-essential cookie or tracking integration was found, and browser storage alone was not used as a reason to add a banner. Production settings and jurisdiction-specific requirements still need owner/legal review.

### Local and browser storage

| Storage | Purpose | Retention/current behavior |
| --- | --- | --- |
| `keertana-library-v1` in localStorage | Versioned saved-song and recent-song slug arrays | Saved entries persist until removed/cleared. Recent entries are deduplicated, newest first, maximum eight. No lyrics, contributor names, or email are stored here. |
| `keertana-theme` in localStorage | Light/dark preference | No app expiry; persists until replaced or cleared. |
| `keertana-font-size` in localStorage | Reader size preference | No app expiry; reader controls support 16–40px. |
| Service worker Cache Storage | Home/offline pages, search index, visited same-origin GET pages/assets | Updated by the existing cache strategy; old cache versions are removed on activation. Browser/site-data clearing removes cached resources. Offline availability depends on previously cached content. |
| Current form fields | Local preparation and validation | No app persistence. Browsers can independently autofill or restore values. Navigating away can discard drafts. |

No app use of sessionStorage or IndexedDB was found. Saved/recent data is specific to the browser profile and site origin and is not synchronized through an account. Clearing site data also removes preferences and offline resources.

### Services and requests

- **Google Fonts:** Base requests Inter from `fonts.googleapis.com`/`fonts.gstatic.com`. Font delivery exposes the requester's IP address to the font service. This description was checked against [Google's own font privacy explanation](https://fonts.googleblog.com/2022/11/your-privacy-and-google-fonts.html). Telugu and Devanagari fonts are bundled and served with Keertana.
- **Hosting:** configuration defaults to `https://keertana.vercel.app`, with `SITE_URL` / `PUBLIC_SITE_URL` overrides. No active production account or dashboard settings were inspected. Privacy describes Vercel conditionally and links its [Privacy Notice](https://vercel.com/legal/privacy-notice); it does not assert that the local preview establishes production logging or retention practices.
- **Search:** the browser downloads the same-site title index and matches typed native/Roman terms locally. Typed terms are not sent as a search query to a remote service or retained as app search history.
- **Copy/share:** intentional clipboard writes and device-native sharing, with URL copy fallback. A user-chosen sharing destination has its own data practices.
- No configured analytics script, ad service, embedded media, external song API, form service, database, account system, payment system, or remote error-monitoring integration was found. Console logging is not a remote error-reporting provider.

### What forms actually do

Submit, Report, and Join validate details in the browser. The isolated adapter still returns `unavailable`; no endpoint was connected, no information was transmitted, and no server-side contribution retention period was invented. Drafts remain in the form when sending is unavailable. Contact now explicitly states that a public contact channel is pending.

Copyright concerns reuse Report with a **Copyright / content concern** issue type. `/contribute/report/?issue=copyright` preselects it and provides relevant guidance. The existing `song` query can be used alongside it to associate a known song. This is preparation only, not receipt of a notice or a legal takedown system. Contribution forms link to their Privacy explanation.

## Files

Created:

- `src/layouts/Information.astro`
- `src/styles/information.css`
- `src/pages/privacy.astro`
- `src/pages/terms.astro`
- `src/pages/copyright.astro`
- `docs/phases5-6-information.md`

Modified:

- `src/pages/about.astro`: informational content and shared editorial layout.
- `src/pages/contact.astro`: accurate pending-contact copy.
- `src/components/ContributionForm.astro`: copyright issue preset/help and Privacy link.
- `src/lib/contribution.mjs`: recognized copyright concern issue type.
- `tests/contribution.test.mjs`: validation coverage for that report type.

The shared Base, navbar, footer, browse page, song data, reader, search implementation, dependencies, storage schema, and service worker were not changed in these phases. Verification outputs include `.information-build.log`, `.information-pagefind.log`, `.about-information-preview.png`, and `.information-footer-preview.png`.

## Verification and footer consistency

- 19 automated tests passed, including existing search, reader, saved/recent behavior, and contribution validation.
- Astro built 1,561 pages successfully; Pagefind indexed 1,307 song pages in three languages successfully.
- All internal links and target fragments in the four information pages were checked against generated files: none broken.
- About and all three policies inspected on desktop and mobile, including 320px and 390px widths: no horizontal overflow observed. Semantic heading structure, keyboard navigation, visible focus, contents anchors, and the copyright report preset were checked.
- Copyright reports validate and retain entries while clearly stating that nothing has been sent or saved.
- The existing shared footer was preserved. At a 1280px viewport, the same 1120px inner width and approximately 310.3px height were measured across Home, the Hindi reader, About, Privacy, Terms, Copyright, and Contribute. At 390px, the four information pages had matching footer dimensions (approximately 384.8px outer width and 731.7px height). Mobile columns stack naturally; no fixed height clips content.
- The development server briefly hit Windows file-handle limits during the concurrent page build; subsequent browser route checks and the local HTTP 200 check succeeded. The existing server remains running in the background at `http://127.0.0.1:4321/`.

## Pending owner/legal review

1. Confirm the actual legal operator/entity, contact address, and a working privacy/copyright/general contact. All remain pending; no dedicated Keertana inbox was discovered.
2. Review the draft terms, limitation wording, content permissions, contributor acknowledgement, and copyright handling for India and the actual operator. No governing-law, arbitration, indemnity, rights waiver, or broad contribution license was invented.
3. Establish a real receiving and content-concern process before presenting the forms as accepting submissions or legal notices. Decide contribution permissions and handling before enabling the adapter.
4. Confirm production hosting, request logs, retention, cookies/protection, and any dashboard-enabled services. Revisit the Privacy description and consent decision if those practices change.
5. Supply verified song attribution/source/permission information where available; missing metadata must not be treated as a license.
6. The mission/vision wording is a restrained editorial proposal based on the requested project purpose, not a historical claim or promised roadmap.

Implementation stops after Phase 6. Nothing has been publicly deployed or started for a later phase.
