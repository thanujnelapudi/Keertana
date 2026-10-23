# Optional GA4 usage measurement

Prepared 23 October 2026. Vercel Hobby cannot display custom events; existing Vercel page views remain separate. No paid plan is needed for standard GA4. No new dependency or backend was added.

## Activation — owner action required

1. Complete the Google Analytics setup opened in the browser. The owner must accept Google's terms personally. Use Keertana as the account/property name, India reporting timezone and INR. Enter organization details honestly; do not invent a legal entity.
2. Leave optional account data-sharing options off. Do not connect Google Ads, enable Google signals, advertising personalization or user-provided data collection.
3. Create a Web stream for `https://keertana.vercel.app`, named Keertana Website.
4. **Turn Enhanced Measurement OFF**, including automatic site search, form interactions and history-based pageviews. This integration measures only the explicit events below; automatic measurement could add query/form information and duplicate pageviews. Check any stream-level “Create event” or tag rules for additional collection before enabling.
5. Choose the shortest available event/user-data retention (normally two months), confirm the settings and note the actual retention. Data retention settings do not delete all aggregated reports on that schedule.
6. Copy the public Measurement ID (`G-...`), not an API secret. Set `PUBLIC_GA_MEASUREMENT_ID` in Vercel's Production environment and rebuild/deploy. Blank or invalid IDs render no GA tag, prompt or preferences button. The ID is public build-time configuration. Do not put any account credential in it.
7. Verify one consented session in Realtime/DebugView or network tools, then check normal event reporting later. Never label integration complete until real delivery is confirmed. No historical events can be recovered.

## Events

| Event | Allowed custom fields | Meaning |
|---|---|---|
| `song_search_results` | `surface`: home/dialog; `result_range`: none/1_to_4/5_plus | Displayed suggestions after 1.2 seconds without another edit, or immediately before selecting a suggestion. Counts describe the capped suggestion list, not total matching catalog records. |
| `song_search_select` | `surface`: home/dialog | A result link was activated, including existing keyboard activation. Not proof the destination loaded. |
| `collection_open` | `collection`: public slug | A collection card was activated. |
| `collection_song_select` | `collection`: public slug | A song link was activated from a collection page, including related song links there. |

No raw query, title, lyric, contributor field or private set name is sent. The adapter ignores arbitrary event payload keys. There is a 40-custom-event limit per page load. Edits cancel pending search measurements; no pre-consent events are buffered or replayed. GA page locations omit query/hash and referrers contain origin only. There is no GA tag on `/setlists/` or `/contribute/` routes even after permission. Cookie-free Vercel statistics continue as before.

## Consent and limitations

Google's script is not requested before opt-in. A local preference works even if storage is unavailable, but then lasts only for the current page. Footer preferences allow withdrawal; the integration disables GA, clears accessible `_ga`/`_ga_*` cookies and reloads to stop the loaded tag. Other-tab preference changes are respected. There is no promise of legal compliance from a custom banner; owner policy review remains necessary.

Declined, blocked, offline and non-JavaScript sessions are absent from GA4. Compare trends rather than claiming all visitors are measured. Two search events do not establish a unique-user conversion rate; refine reporting using GA's session/event semantics. Do not use page views alone to infer satisfaction. No cost-incurring product, legal agreement or account was accepted automatically.

Sources: [Google basic consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode), [manual page views](https://developers.google.com/analytics/devguides/collection/ga4/views), [privacy controls](https://developers.google.com/tag-platform/security/guides/privacy).
