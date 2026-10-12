# Email contributions — 12 October 2026

Contact, Report an Error, Submit a Song and Join the Team now use the owner-provided public inbox `keertanasongs@gmail.com`. Existing form validation, language support and design are preserved. No CMS, server-side receiver or new dependency was added.

## Flow

1. The visitor fills the existing form and selects Prepare email.
2. Validation identifies missing or invalid details and focuses the first error.
3. Valid details produce a prepared message, email-app link and Copy email text button. Reports include the selected song's title, language, identifier and URL.
4. The visitor reviews and sends through their email application. Nothing is sent automatically and no delivery or receipt is claimed by the site.

Drafts are not persisted by Keertana. Editing the form hides and clears a previously prepared draft to prevent sending stale information. Messages above a conservative mailto length threshold use a subject-only link and retain the complete text for copying; long lyrics are never truncated. If clipboard access fails, the visitor can select and copy the read-only prepared message manually. If no mail handler is configured, the displayed recipient and text allow sending through webmail. No email-client launch or inbox delivery was tested; those are external to the site.

## Files

- `src/lib/contribution-email.mjs`: recipient, whitelisted fields, Unicode-safe mailto encoding and long-message fallback.
- `src/components/ContributionForm.astro`: Prepare email, validation, review panel, explicit email handoff, copy fallback and stale-draft invalidation.
- `src/styles/contribution.css`: responsive review panel and readable message field.
- `src/pages/contact.astro`, `src/pages/contribute/index.astro`, `src/pages/about.astro`, `src/pages/terms.astro`, `src/pages/copyright.astro`, `src/pages/privacy.astro`: accurate contact, contribution and data-handling copy.
- `src/layouts/Information.astro`: policy date updated.
- `tests/contribution-email.test.mjs`: multilingual context, encoding, unmodified values, field whitelist, full long lyrics and team interests.
- `README.md`: current email-based workflow.

## Validation

All 22 tests passed, including the 19 existing checks. Astro generated 1,561 pages successfully. Browser checks verified report validation, selected song context, multilingual text, prepared recipient/link, stale-draft invalidation, long-song fallback and successful copying. At 390px the prepared report had no document horizontal overflow. No test email was sent. The temporary preview server was stopped after testing, as requested for local servers.

The previous CMS/receiver placeholder remains unused as a future integration boundary. Email submissions require manual inbox review and do not automatically publish songs. The existing analytics only records page views; no form-field or email events were added.
