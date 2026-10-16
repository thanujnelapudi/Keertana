# Public song comments: setup and activation

16 October 2026. The owner approved Supabase storage/moderation and Cloudflare Turnstile. The implementation is prepared, but no accounts, database, function deployment, or real spam-check widget have been created or connected. Default site builds keep public comments off and retain a useful song-specific correction/reference link. Do not describe the backend as live until the steps and provider checks below pass.

## 1. Accounts and project

Create a Supabase project and a Cloudflare Turnstile widget using your Keertana account details. You must review their account/plan terms yourself. No paid plan is required by this code, and no cost or quota guarantee is made. Review current provider pricing before activation. Keep all secrets out of chat, GitHub, and browser-visible configuration.

For the Turnstile widget, allow `keertana.vercel.app`. Add a custom domain when one is chosen. Add localhost only when doing local provider tests, or use Cloudflare's documented test keys in an isolated test environment. Do not deploy test keys to production.

## 2. Database

In the Supabase SQL Editor, run `supabase/migrations/202610160001_song_comments.sql` once. It creates a private comment table, approval timestamp trigger, fixed pending-only submission RPC, and approved-only read RPC. It grants neither anonymous nor authenticated browser roles direct access. Keep the private schema out of the project's exposed API schemas.

Run `supabase/tests/song_comments.sql` in the same SQL Editor. It checks effective role access, RLS, pending/rejected isolation, approval, retry idempotency, cursor pagination, and admission limits, then rolls back its fixture data. Do not enable comments if it fails. These SQL/provider tests have not been run against a real Supabase project yet.

## 3. Function secrets and deployment

In Supabase Edge Function secrets, configure:

| Server-only setting | Value |
| --- | --- |
| `TURNSTILE_SECRET_KEY` | The real widget secret from Cloudflare |
| `KEERTANA_SITE_URL` | `https://keertana.vercel.app` (used for the known-song catalog) |
| `COMMENTS_ALLOWED_ORIGINS` | `https://keertana.vercel.app`; optional additional exact origins separated by commas for deliberate testing |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are read only inside the function from Supabase's supplied environment. Never copy the service-role key to Vercel public variables or client code. The function calls only fixed Supabase RPCs and the fixed Cloudflare verification URL; visitor reference links are not fetched.

Use the official Supabase CLI from this repository after signing in and selecting your project:

```powershell
npx supabase login
npx supabase functions deploy song-comments --project-ref YOUR_PROJECT_REF
```

The repo's `supabase/config.toml` deliberately disables the platform JWT requirement for this one public endpoint. Visitors do not log in. The handler instead enforces the exact origin, validates field limits and known catalog membership, verifies the single-use Turnstile token's success/action/hostname server-side, and stores a pending comment through restricted server-side RPCs. Do not disable these checks to fix configuration errors.

The function verifies song slugs against the site's existing `/api/search-index.json`, caching identifiers for five minutes. If the catalog or providers are unavailable it returns an error, never a fabricated receipt. After publishing a new song, allow that cache to refresh before testing its comments.

## 4. Provider checks before enabling the website

Use an isolated preview/test configuration first. Do not submit real personal information in test comments.

1. A known song returns an empty approved list before any comments exist. An unknown song is rejected.
2. Missing, invalid, expired, replayed, wrong-hostname, and wrong-action verification tokens must not insert a comment.
3. A valid submission returns HTTP 202 with `status: pending`. It appears in the private table with status `pending` and does not appear in public reads.
4. Approve it in the dashboard: it appears once. Reject it: it disappears. A pending/rejected row and its moderation note must never be obtainable by public reads or direct anonymous REST/RPC calls.
5. Retrying an identical request ID and body does not insert another row. A changed payload using the same ID is rejected. A retry after an uncertain network response needs a fresh Turnstile token.
6. Read more than ten approved comments and verify pagination does not repeat or skip entries.
7. Test mobile keyboard/form access, a failed submission with draft preservation, provider outages, safe rendering of `<script>` as text, and rejection of non-HTTPS reference links.

The database has conservative global limits of 100 accepted comments/hour and 20/song/hour, enforced inside one transaction. These are small-site admission caps, not complete denial-of-service protection or a per-person quota. They store no IP address. Review these limits and provider usage as traffic grows. Supabase/Cloudflare may process technical request information under their own policies.

## 5. Enable in Vercel

Set these build-time variables after the provider tests pass:

```text
PUBLIC_COMMENTS_ENABLED=true
PUBLIC_COMMENTS_ENDPOINT=https://YOUR_PROJECT_REF.supabase.co/functions/v1/song-comments
PUBLIC_TURNSTILE_SITE_KEY=YOUR_PUBLIC_WIDGET_SITE_KEY
```

The widget site key and function address are public. The Turnstile secret and Supabase service-role key must never use the `PUBLIC_` prefix. For local testing, copy `.env.example` to an ignored `.env` and configure only the public values there. Vercel needs a rebuild/redeployment after changing these variables.

To deactivate, set `PUBLIC_COMMENTS_ENABLED=false` and redeploy. Disable the function as well if submissions should stop immediately; existing cached pages can otherwise still call it. No lyric, saved library, or setlist data is stored in the comments database.

## 6. Daily moderation

In the Supabase Table Editor select schema `keertana_private`, table `song_comments`, and filter `status = pending`. If the Table Editor cannot show private schemas, use the SQL Editor to view pending rows. Review the song identifier, display name, short comment, and reference link. Do not approve spam, impersonation, personal details, abusive content, unsafe links, or copied full lyrics.

Set `status` to `approved` or `rejected`. Approval timestamps are handled automatically; do not edit IDs or request IDs. `moderation_note` is private and can explain a decision. The first version has no custom admin page, email notification service, public uploads, or reply threads.

Drafts stay in the current browser form and are not saved across navigation. The website collects no commenter email. Rejected comments are not automatically purged; establish an owner deletion schedule before enabling the feature. No automatic deletion policy or moderation response time is promised.

## Validation status and remaining activation work

Local automated tests cover handler validation and failure responses, CAPTCHA result enforcement, approved-field serialization, safe rendering, lazy loading, form validation, pending-only success feedback, and failed-draft preservation. The migration and SQL checks also passed in an isolated PGlite PostgreSQL engine, including actual anonymous/authenticated permission denials. This is not a Supabase deployment test. Real provider row isolation, runtime deployment, widget delivery, real browser submission and dashboard moderation remain unverified until the owner finishes setup. The site intentionally cannot accept public comments in its default configuration.

To repeat the optional isolated database check without changing application dependencies:

```powershell
npm install --prefix .comments-check --no-save --no-package-lock --ignore-scripts --no-audit --no-fund @electric-sql/pglite@0.5.10
node scripts/test-comments-database.mjs
```

The `.comments-check` folder is ignored by Git. PGlite is only a local test tool; neither it nor any database server is added to the deployed site bundle.

## Files prepared

- Reader wording and API label: `src/lib/roman-reading.ts`, `src/pages/song/[slug].astro`, `src/pages/setlists.astro`, `src/scripts/setlist-workspace.js`, `src/pages/about.astro`.
- Comments interface: `src/components/SongComments.astro`, `src/scripts/song-comments.js`, `src/styles/song-comments.css`.
- Server and database: `supabase/functions/song-comments/handler.mjs`, `supabase/functions/song-comments/index.ts`, `supabase/config.toml`, `supabase/migrations/202610160001_song_comments.sql`, `supabase/tests/song_comments.sql`.
- Configuration and disclosure: `.env.example`, `.gitignore`, `src/pages/privacy.astro`, `src/styles/print.css`, `public/sw.js`.
- Checks: `tests/song-comments.test.mjs`, `tests/song-comments-ui.test.mjs`, `tests/roman-reading.test.mjs`, `scripts/test-comments-database.mjs`, `scripts/audit-song-comments.mjs`, `scripts/audit-roman-collections.mjs`.

Current local validation: 53 regression tests passed; local PostgreSQL migration/access/moderation checks passed; enabled discussion layout and unavailable-verification feedback reviewed in an isolated read-only fixture at desktop, 390px and 320px widths. The fixture contains a clearly labelled example comment and blocks external verification; it is not a live provider or posting test. Comments are omitted from print and their text is excluded from the song search index. Generated original lyrics, catalog contents, song slugs, and transliteration rules were not replaced. User-local catalog formatting edits remain outside the implementation commit.

Primary references: [Supabase function deployment](https://supabase.com/docs/guides/functions/deploy), [function environment](https://supabase.com/docs/guides/functions/secrets), [database access](https://supabase.com/docs/guides/database/postgres/row-level-security), [Turnstile server verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [Turnstile widget](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/).
