# Moderated song comments — proposal for owner approval

16 October 2026. The owner selected public comments with moderation and approved the Supabase + Turnstile setup. The implementation is prepared with activation instructions in `docs/song-comments-setup.md`. No public comments service, database, or account has been connected yet.

## What visitors would see

A small “Song discussion” section below the lyrics and reader actions, outside the printed lyrics. It shows approved comments and a “Leave a comment” form. Visitors can suggest pronunciation corrections, ask about a song, or supply a reference/recording link. It is not a place for bulk pasted lyrics.

The initial form asks for a display name, a short comment (up to 2,000 characters), and an optional HTTPS reference link. No visitor account or email is required. Comments appear publicly only after owner approval. Success says “Submitted for review”; it never claims immediate publication. Empty, loading, unavailable, validation, and retry states must be distinct. A failed submission retains the visitor's text.

Links stay plain text until approved and are rendered without HTML using safe DOM methods. Approved links use `rel="ugc nofollow noopener noreferrer"`. Names, dates, links, and text remain readable in both themes and on small screens. Lyrics, reading controls, setlists, and search work even if discussion is unavailable.

## Recommended initial setup

Use a Supabase project for the comment store and a small server-side function for reading/submitting comments, plus Cloudflare Turnstile for spam protection. Keep Astro song pages static. Do not convert the whole site to server rendering or create a second user-account system.

The owner initially approves/rejects comments inside the secured Supabase dashboard. A custom administration page can be considered later; it is not needed for the first version.

Proposed flow:

1. The browser fetches approved comments for a known song slug. Responses contain only the public fields.
2. A submission is checked server-side for song membership, field lengths, URL scheme, Turnstile validity, origin, and submission rate. Browser-only validation is insufficient.
3. Every accepted submission is stored as `pending`. Visitors cannot choose or change its status.
4. The owner reviews pending entries in the dashboard, then sets `approved` or `rejected`.
5. Public reads return only approved entries, in a paginated list. Pending/rejected text and moderation details stay private.

Database grants/RLS must deny browser writes and prevent access to unapproved rows. The function's privileged credential stays server-side. The spam-protection secret also stays server-side. The only browser configuration is the public function address and Turnstile site key. Any rate-limit identifiers need a bounded retention period; raw IP addresses should not be added to comment records.

The site privacy wording needs updating to name these services and explain that the chosen display name, approved comment, and approved reference link become public. No account, paid plan, provider permissions, or external credentials should be invented or enabled silently.

## Why not a GitHub comment widget

Giscus and Utterances are simpler embeds, but visitors need GitHub authorization to post. That is a poor fit for Keertana's general worship audience. Giscus documents moderation on GitHub, but does not provide the proposed pending-before-public workflow out of the box. No widget should be installed just to make a comment box appear functional.

## Files and services likely affected

- New `src/components/SongComments.astro`, `src/scripts/song-comments.js`, `src/styles/song-comments.css`.
- `src/pages/song/[slug].astro`: include the discussion section; keep it outside lyric copy/print payloads.
- `src/styles/print.css`: omit discussion from print.
- `src/pages/privacy.astro`: actual service/publication details after configuration is confirmed.
- New server-side function, reproducible database migration/access policies, and setup documentation.
- Tests for pending isolation, server-side validation, rate limiting, safe text/link rendering, approval/rejection, pagination, and offline/failure behavior. Run real provider permission tests before enabling public submission.

This is a medium-complexity architectural addition: it introduces an online store, server-side validation, and an owner moderation responsibility. The owner approved this service choice and requested prepared code/instructions because the accounts do not exist yet. Account setup and provider checks remain required before activation. The song catalog and static song-page architecture are preserved.

## Transliteration status

The owner's approved wording change uses “Transliteration”, not “Roman” or “English”, for reader controls. The prominent pronunciation warning is removed; a neutral “Generated from the original lyrics” source note remains. This is a label change, not a claim that pronunciation has been corrected or reviewed. No competitor lyrics were copied, and no verified/transcribed lyric records were created.

A later reviewed-text feature should store approved per-song transliterations separately, with their source, permission basis, review date, and a fingerprint of the original lyrics so changed originals trigger another review. Labels must distinguish reviewed text from a generated fallback. It should not silently replace the original song lyrics or create duplicate indexed pages.

## Primary documentation checked

- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://giscus.app/
- https://utteranc.es/

An attempted check of Cusdis returned an unavailable response; it is not recommended here on unverified assumptions.
