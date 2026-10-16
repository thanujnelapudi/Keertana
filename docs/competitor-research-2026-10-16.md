# Keertana: competitor research and search-growth roadmap

**Research date:** 16 October 2026, India time.  
**Sites:** christiantelugulyrics.com, christianlyricz.com, waytochurch.com, telugugospellyrics.com.  
**Status:** Research and recommendations only. No application, song catalog, deployment, or Search Console settings changed for this study.

## 1. Decision summary

Keertana should improve the completeness and discoverability of its song pages while preserving its focused worship experience. The strongest recurring patterns in the inspected competitors are:

1. Native and Roman titles and, on many sampled pages, complete Roman-script lyrics.
2. Crawlable song directories and curated paths by worship purpose or occasion.
3. Song-specific details, source references, and correction/contribution routes.
4. Connections between song pages, collections, and related songs.

These are useful product patterns, **not proof of the causes of a competitor's rankings**. We do not have their Search Console, analytics, backlinks, conversion data, or verified editorial histories. Appearing in some search results does not establish superiority across every query.

**Recommended first upgrade:** a reviewed discovery-and-reading pilot on ten existing, demand-led Telugu songs. Add curated Roman titles/aliases; offer complete, human-reviewed Roman Telugu where material is available; keep one canonical song URL; and test native/Roman search, reading, copying, printing, and setlists together. Follow with three useful public worship/occasion collections and modest related-song links.

Do not rebuild Keertana, change frameworks, create an artists directory, reinstate lyric-body search, import competitor lyrics, generate thousands of thin pages, or publish unverified credits. The owner has explicitly retired artist pages and previously requested title-only search.

## 2. Scope, method, and confidence

This is a representative audit of the major public templates and journeys, not a claim to have read every page in catalogs containing thousands of records. The study covered homepages, song samples, language/alphabet directories, categories, native/Roman searches, requests/contributions, trust pages, and crawl files where accessible. Three sites were researched independently in parallel; their findings were reconciled against Keertana's current code and additional live HTML checks.

Evidence labels used below:

- **Observed:** present in the inspected public HTML, source metadata, response, or page text.
- **Cached:** available through a search/crawl snapshot; not sufficient to establish today's rendered interface.
- **Inference:** a plausible implication of observations, not a measured outcome.
- **Unverified:** not tested or access was unavailable.

Live public HTTP checks were used to inspect response status, titles, descriptions, canonicals, robots directives, headings, schema types, navigation, and script references. No forms were submitted, no comments posted, no accounts created, and no full-catalog crawl performed. No competitor dashboard was accessed.

**Limits:** this study did not run controlled Lighthouse tests, obtain Chrome UX Report field data, exhaustively test screen readers/contrast/keyboard access, visually validate every mobile template, or exercise all advertised buttons. A viewport declaration or responsive stylesheet indicates design intent; it does not prove a good mobile experience. HTML size and script presence are diagnostic clues, not speed scores. Search results vary by location, device, time, and personalization.

Search extracts sometimes differed materially from live HTML. One old Telugu Gospel Lyrics extract included unrelated outbound links that were absent from the live sampled HTML. An older Christian Telugu Lyrics contact extract differed from its live contact page. Neither is presented as a current site defect. ChristianLyricz restricts automated OpenAI access; further fetching stopped once this was established, and its legacy snapshots are explicitly separated from current metadata.

## 3. Keertana baseline: preserve what already works

The existing codebase is a static Astro site with 1,307 catalog records. Song pages are generated at `/song/{slug}/`; browsing is separated by language, letter, and pagination. Its title search already supports native and Roman spellings and deliberately excludes lyric-body search. The reader includes size controls, save, copy, share, and printing. Saved/recent songs and named, ordered setlists live in browser storage. Shared setlists use snapshot links; the workspace is noindex.

Keertana already supplies song-specific metadata, canonical URLs, MusicComposition and BreadcrumbList structured data, a sitemap, a real public email contribution workflow, and mobile styling. Two Search Console priority songs now have curated native/Roman titles and subtitles. Legacy single-song `/songs/` links have permanent redirects, including the confirmed spelling alias for Athyunnatha Simhasanamupai. Those are completed changes, not new recommendations.

Source files reviewed include `src/pages/song/[slug].astro`, `src/pages/[lang]/index.astro`, `src/pages/index.astro`, `src/lib/song-seo.ts`, `src/lib/search-index.ts`, `public/title-search.js`, `src/components/ContributionForm.astro`, `src/styles/print.css`, and `vercel.json`.

The main editorial gap is that catalog records chiefly contain slug, title, and lyrics. Full visible Roman lyrics, reviewed source details, and editorial theme collections are not yet a consistent part of the catalog. Hidden Roman text used by Pagefind is not a replacement for a usable Roman reading view.

**Historical planning baseline, not a new measurement:** the dashboards reviewed on 15 October showed 70 Google clicks, approximately 3,910 impressions, and 1.8% CTR over the displayed 28-day period; Vercel showed 116 visitors over 30 days, 89% mobile and 84% Android. These periods and metrics differ. They justify prioritizing mobile reading and existing song demand, but cannot demonstrate the effects of changes deployed that same day.

Live reference: [Keertana priority song](https://keertana.vercel.app/song/neethi-sooryudaa-yesu/). Existing recovery work: [search recovery notes](search-recovery-2026-10-15.md).

## 4. Christian Telugu Lyrics — christiantelugulyrics.com

### Purpose, browsing, and discovery

The homepage presents a worship-oriented mission and direct access to Telugu, English, Hindi, and children's songs. Requests and original-lyrics contributions are prominent. It is a multilingual resource with community participation, rather than only an alphabetical database. Keertana already serves a similar purpose; its concise search-first hero should remain. The competitor's repeated mission/footer copy is not a reason to make Keertana's homepage longer. [Homepage](https://christiantelugulyrics.com/)

The Telugu directory provides native-letter groupings and crawlable song links. The inspected raw directory contained 713 links and 31 H1 elements, illustrating a very long index with many top-level headings. The worship archive supplies another route to song articles, with pagination. Keertana can learn from multiple useful entry paths while retaining its existing paginated lists and clearer heading hierarchy. Multiple H1s or long directories alone do not establish a search penalty. [Telugu directory](https://christiantelugulyrics.com/telugu-songs/), [worship archive](https://christiantelugulyrics.com/worship-songs/)

The language and children's directories broaden intent coverage. Relevant occasion/theme groupings include Christmas, communion, marriage, prayer, praise, thanksgiving, and comfort. Their value is a useful selection for an actual worship task, not the mere existence of another indexed URL. [English directory](https://christiantelugulyrics.com/english-songs/), [children's directory](https://christiantelugulyrics.com/kids-songs/)

### Song pages and reader experience

Three samples exposed Telugu and Roman-script lyrics in original HTML. The Nenemainaa page has a fuller native/Roman title and both scripts, making it a useful comparator to Keertana's existing `nenemainaa-prabhuvaa` record. The competitor labels transliteration as English lyrics; Keertana should use the more accurate label **Roman Telugu** or **Telugu transliteration**. [Nenemainaa Prabhuvaa](https://christiantelugulyrics.com/nenemainaa-prabhuvaa-ninne-sthuthisthaanu/)

The Deevinchave sample includes visible lyricist names, categories, dates, and article navigation, alongside verse formatting and Roman text. Its raw sample did not expose dedicated font-size or print controls. This is a sample observation, not a claim that such tools never exist anywhere on the site. Keertana already has focused reader tools worth preserving. [Deevinchave](https://christiantelugulyrics.com/deevinchave-samruddiga-song-lyrics/)

The Neethisuryuda Neethimanthuda page is a different title from Keertana's Neethi Sooryudaa Yesu. Similar Roman words do not establish the same composition or version; never use that similarity alone to merge records, copy metadata, or redirect a missing song. [Neethisuryuda Neethimanthuda](https://christiantelugulyrics.com/neethisuryuda-neethimanthuda-song-lyrics/)

### Search, SEO, and crawl controls

Public native and Roman GET searches returned matching song articles, sometimes alongside additional songs or the Telugu directory. Search pages used follow/noindex. Broad matching may include article content; the exact algorithm was not established. Keertana should improve aliases within its existing title-only requirement rather than imitate broad lyric matching. [Roman search](https://christiantelugulyrics.com/?s=neethi+suryuda), [joined spelling](https://christiantelugulyrics.com/?s=neethisuryuda)

Sample song pages self-canonicalize and allow indexing. Their schema includes BlogPosting, BreadcrumbList, and supporting website/person entities. Native and Roman wording varies between titles. Some descriptions draw largely from opening lyrics. Telugu samples declare en-US in HTML/schema despite their main text, so copying the competitor's graph would not improve Keertana's language accuracy. Structured-data presence is not a ranking score. [Deevinchave](https://christiantelugulyrics.com/deevinchave-samruddiga-song-lyrics/), [Neethisuryuda](https://christiantelugulyrics.com/neethisuryuda-neethimanthuda-song-lyrics/)

Robots permits normal public crawling while excluding the WordPress admin area. The sitemap index advertised 20 child maps: four post, one page, one category, and fourteen tag maps. Those are sitemap files, not indexed-page counts. Recent lastmod entries show declared updates, not independently verified content reviews. Numerous phrase-tag archives are a reason to consider duplication risk before adopting a similar taxonomy. [Robots](https://christiantelugulyrics.com/robots.txt), [sitemap index](https://christiantelugulyrics.com/sitemap_index.xml)

### Trust, contributions, and maintenance

The about page identifies a maintainer and explains the mission. Current contact HTML supplies a real contact address. Requests and original-lyrics submissions have distinct entry points; forms/comments were inspected without sending anything. Delivery, response times, moderation, and spam handling remain unverified. [About](https://christiantelugulyrics.com/about-christian-telugu-lyrics/), [contact](https://christiantelugulyrics.com/contact-us/), [request](https://christiantelugulyrics.com/song-request/), [submission](https://christiantelugulyrics.com/post-own-lyrics/)

Public HTML reveals WordPress/theme/SEO-plugin and form assets, plus analytics, advertising, and custom-search scripts. This adds potential browser work but does not prove poor field performance. Viewport metadata and a skip link were observed; actual touch, contrast, screen-reader, and print outcomes were not measured. [Homepage](https://christiantelugulyrics.com/), [privacy](https://christiantelugulyrics.com/privacy-policy/)

**Adapt:** reviewed Roman content, useful theme browsing, honest optional provenance. **Avoid:** copying its plugin stack, huge phrase-tag network, long boilerplate, or language-label inconsistencies.

## 5. ChristianLyricz — christianlyricz.com

### Access limitation and current implementation

This site's current robots file explicitly restricts OpenAI crawlers while allowing Google/Bing. Further direct inspection stopped after that restriction was established. Accordingly, this report does not score its current mobile layout or search interactions from older cached pages. Automated access restrictions are not proof of a Google indexing problem. [Robots](https://christianlyricz.com/robots.txt)

Bounded public HTML observations obtained before that restriction was established show a newer JavaScript application: descriptive homepage metadata, canonical/social fields, website structured data, viewport, manifest/icons, and a Supabase preconnection. An initial app root and bundle references do not establish the complete backend, authentication design, or rendering behavior of every route. Chords, video, PPT, and verse features are advertised; not all were verified live. [Homepage](https://christianlyricz.com/)

The checked Sugunaala and Nee Krupa URLs already provide song-specific native/Roman titles and self-canonicals in initial HTML. Therefore, the homepage shell must not be generalized into a claim that the site's song metadata is absent until JavaScript runs. [Sugunaala](https://christianlyricz.com/2015/02/01/sugunaala-sampannudaa/), [Nee Krupa](https://christianlyricz.com/2019/01/28/nee-krupa-chaalunayaa/)

### Useful patterns visible in legacy snapshots

The cached Sugunaala page includes native/Roman text, a site-claimed ministry credit, media, WhatsApp sharing, category/tag links, and adjacent/recent articles. This suggests a broad discovery-and-reading model; neither its old interface nor its credit has been independently validated as current and correct. It is a reference for the missing-song investigation, not permission to import the lyrics. [Sugunaala snapshot](https://christianlyricz.com/2015/02/01/sugunaala-sampannudaa/)

The Nee Krupa snapshot exposes native/Roman and line-by-line controls, font-size options, and contextual verses. These are potentially useful reading patterns, but their current behavior and editorial accuracy remain untested. [Nee Krupa snapshot](https://christianlyricz.com/2019/01/28/nee-krupa-chaalunayaa/)

The cached Hindi directory supplies Devanagari and Roman alphabet lists leading to song pages. This illustrates alternative discovery labels without creating a separate page for each spelling. The English sample has an author credit and media/PPT labels, but the presence of a label is not proof of a working download or permission. “This Is Amazing Grace” must also remain distinct from “Amazing Grace.” [Hindi directory](https://christianlyricz.com/hindi-songs/), [This Is Amazing Grace](https://christianlyricz.com/2023/03/09/this-is-amazing-grace/)

Cached request/submission pages show separate request and lyrics-intake forms. Keertana already has reviewed email drafts, so these observations do not justify introducing accounts, a CMS, or public comments immediately. [Requests](https://christianlyricz.com/song-request/), [post lyrics](https://christianlyricz.com/post-lyrics/)

The inspected sitemap mixes dated song URLs, newer song routes, and collections. Its metadata does not prove editorial freshness or unique indexed totals. Retaining old URLs appears important during evolution, but its migration history is unknown. [Sitemap](https://christianlyricz.com/sitemap.xml)

**Adapt:** consistent native/Roman discovery and a reviewed reading-mode pilot. **Avoid:** conclusions about today's UI from cached layouts, wholesale feature copying, or an architecture change to imitate the newer app.

## 6. Waytochurch — waytochurch.com

### Discovery and catalog breadth

The homepage links new songs, language indexes, seasonal selections, and other religious resources. Many listings combine native/Roman names. This gives readers several paths into songs. Its broader Bible/media scope is not a reason for Keertana to lose its focused purpose. Public claims of being the largest collection were not independently established. [Homepage](https://waytochurch.com/)

The category directory offers worship contexts including communion, Easter, Good Friday, marriage, offering, Christmas, and thanksgiving. These are useful examples of intent-led navigation. Keertana should curate a small number of helpful groups rather than reproduce every category. [Categories](https://waytochurch.com/lyrics/category), [Telugu Praise Worship](https://waytochurch.com/lyrics/category/Telugu-Praise%20Worship-songs-Lyrics)

Its declared sitemap contains 30,380 URL entries, with 30,376 song paths. These are advertised URLs, not verified unique songs, indexed pages, traffic, or accuracy. The scale indicates a coverage gap to investigate query by query, not a target to fill automatically. Robots points to the working `/home/sitemap`; a 404 at the conventional `/sitemap.xml` is not itself a defect. [Robots](https://waytochurch.com/robots.txt), [declared sitemap](https://waytochurch.com/home/sitemap)

### Reader and song details

Samples use a native H1 and Roman H2; available native/Roman lyrics are delivered in HTML. Reader actions include print/PDF, sharing, language tabs, and correction/comment inputs. In the inspected source, both print/PDF and download use the browser print action, rather than demonstrating a separately generated PDF file. Keertana already covers printing and sharing, with the additional context of setlists. [Sugunaala](https://waytochurch.com/lyrics/song/303/sugunaala-sampannudaa)

Sample pages display language, attributed creators/album information, dates, counters, and sometimes video. These are the site's assertions; counters are not independent analytics and credits need primary verification. An observed newer page promises Telugu/English in its description but did not expose the complete Roman lyrics found on other samples. Keertana should describe only the content actually supplied. [Lekkimpa Sakyamu Kaavu Devaa](https://waytochurch.com/lyrics/song/27987/Lekkimpa-sakyamu-kaavu-devaa), [Jeevinchuvaadavu](https://waytochurch.com/lyrics/song/30408/Jeevinchuvaadavu-dheevinchu-vaadavu)

### Search and canonical identity

The sampled title queries behave differently: `neethi suryuda` returned two results without target record 13395, whereas `neethi sooryudaa` and the native query returned six including it. The broader result set includes lyric-only phrase matches. This is direct evidence for preserving spelling aliases and precise title ranking in Keertana; it does not justify reinstating lyric search. [Short spelling](https://waytochurch.com/lyrics/song?qlanguage=Telugu&songtitle=neethi%20suryuda), [long spelling](https://waytochurch.com/lyrics/song?qlanguage=Telugu&songtitle=neethi%20sooryudaa), [target song](https://waytochurch.com/lyrics/song/13395/neethi-sooryudaa-yesu)

Two Sugunaala records return 200 and self-canonicalize separately. They look like competing duplicates or versions, but full equivalence was not established. The safe lesson is to keep alternate spellings on one canonical record unless there is a real version difference. [Record 303](https://waytochurch.com/lyrics/song/303/sugunaala-sampannudaa), [record 5736](https://waytochurch.com/lyrics/song/5736/sugunaala-smpannudaa-sthuthigaanaalavaarasudaa)

Homepage SearchAction advertises the plural `/lyrics/songs?...` route, which returned 404 in the sample, while singular `/lyrics/song?...` works. Structured metadata should reference actual functioning destinations. [Advertised route](https://waytochurch.com/lyrics/songs?songtitle=sugunala), [working search](https://waytochurch.com/lyrics/song?qlanguage=Telugu&songtitle=sugunala)

### Technical and operational cautions

Song samples include Article, breadcrumbs, website metadata, and video schema where relevant. Observed weaknesses include an empty author on one record and Article mainEntityOfPage pointing to the homepage. Some sampled songs of different publication years shared the same current-midnight modification value; that suggests generated freshness but does not prove the actual review history. Keertana should use genuine review dates and song-specific identifiers. [Neethi song](https://waytochurch.com/lyrics/song/13395/neethi-sooryudaa-yesu), [Lekkimpa](https://waytochurch.com/lyrics/song/27987/Lekkimpa-sakyamu-kaavu-devaa)

One letter index contains approximately 1,542 song anchors and about 270 KB of uncompressed HTML, including repeated native/Roman link sets. Samples load two jQuery versions and supporting plugins. Telugu pages declare English in their inspected HTML. Viewport and responsive CSS exist, but real mobile usability and Core Web Vitals were not tested. These are reasons to preserve Keertana's paginated, language-aware static approach, not evidence of a measured competitor speed failure. [Letter index](https://waytochurch.com/lyrics/list/telugu-%E0%B0%A8), [stylesheet](https://waytochurch.com/style.css)

The upload/contact pages explain contribution options and offer forms. Their receipt, moderation, authentication requirements, and delivery were not exercised. [Upload](https://waytochurch.com/home/upload), [contact](https://waytochurch.com/home/Contact/Feedback)

**Adapt:** native/Roman visibility, worship-context hubs, stable identity. **Avoid:** duplicate versions without explanation, broad irrelevant search results, generated freshness, large plugin stacks, or copying its broader site scope.

## 7. Telugu Gospel Lyrics — telugugospellyrics.com

### Search-first homepage and intent paths

The homepage prioritizes search, alphabet browsing, popular songs, categories, recent songs, and requests. It advertises 1,650 songs and 134 categories; these are displayed counts, not verified indexed totals. The Telugu letters and Roman alphabet serve different discovery habits. Pagination links expose further songs without requiring client-side interaction. The site's broad collection paths are worth studying, while Keertana can retain a quieter presentation. [Homepage](https://telugugospellyrics.com/)

Actual navigation points to `/allcategories/`, not the guessed `/categories/` path. The former returned a category directory; the latter's 404 is not evidence of broken navigation. The popular page returned an indexable landing page, and internal search pages were follow/noindex. Both the tested Roman `deevinchave` and native `దీవించావే` searches returned the corresponding song. This verifies those two inputs, not universal transliteration or typo handling. [Categories](https://telugugospellyrics.com/allcategories/), [popular](https://telugugospellyrics.com/popular/), [Roman search](https://telugugospellyrics.com/?s=deevinchave)

### Richer page context, with restraint needed

The inspected newer Neeve page has a bilingual H1, song summary, site-attributed performer/writer/music details, a video link, native/Roman sections, meaning, contextual verses, FAQs, and multiple related-song/category blocks. This offers more context than Keertana's minimal catalog. However, some explanatory text was repeated, and several similar related-song blocks compete for attention. It demonstrates a useful content model, not a requirement to make every lyric page equally long. [Neeve Advitheeyudaina Devudavu](https://telugugospellyrics.com/neeve-advitheeyudaina-devudavu-song-lyrics/)

The Aadhaaram page likewise exposes native/Roman content, a table of contents, and media context. Its title includes promotional wording such as a superlative and number marker; Keertana should use clear song identity instead. The raw current page was checked separately from its much older cached extract. [Aadhaaram](https://telugugospellyrics.com/aadhaaram-naaku-aadhaaram-song-lyrics/)

Deevinchave is a useful same-title comparison for Keertana: full Roman reading text, summary fields, and video context are visible. Activity/engagement counters are displayed, but their definitions and accuracy were not verified. They are not an independent measure of audience or proof that a feature is successful. [Deevinchave](https://telugugospellyrics.com/deevinchave-samruddhiga-song-lyrics/)

### Crawl, schema, and performance clues

Live HTML samples have self-canonicals, index/follow directives, social metadata, and viewport declarations. The homepage graph includes MusicGroup, WebSite, SearchAction, and CollectionPage; one older song sample includes Article/breadcrumb graphs while the newer sample's inspected JSON-LD exposed breadcrumbs. Markup varies by template. Its music-entity choice is not a model Keertana should copy automatically. [Homepage](https://telugugospellyrics.com/), [Aadhaaram](https://telugugospellyrics.com/aadhaaram-naaku-aadhaaram-song-lyrics/)

The robots file advertises a working sitemap index with nine post maps and additional page/category/news/video/local maps at inspection. This does not establish eligibility for every special search feature. Several entries have recent lastmod values, which remain publisher-supplied. [Robots](https://telugugospellyrics.com/robots.txt), [sitemap](https://telugugospellyrics.com/sitemap_index.xml)

Live samples load advertising, two Google tag resources, Google identity code, and site scripts. Their main HTML declares en-US, even on Telugu-heavy pages. One newer song response was approximately 183 KB of uncompressed HTML, versus approximately 38 KB for the sampled Keertana priority page. Those are different documents and exclude assets, compression, caching, and device conditions; **they are not a performance benchmark or evidence of ranking impact**. [Neeve sample](https://telugugospellyrics.com/neeve-advitheeyudaina-devudavu-song-lyrics/), [Keertana sample](https://keertana.vercel.app/song/neethi-sooryudaa-yesu/)

### Community, trust, and advertised features

The about page explains a ministry-oriented mission, preservation of older songs, and requests/corrections. The current request page contains a form; it was not submitted. Keertana's existing email intake can meet the immediate need without adding an account system. [About](https://telugugospellyrics.com/about-us/), [request](https://telugugospellyrics.com/song-request/), [contact](https://telugugospellyrics.com/contact-us/)

The homepage advertises print/PDF, chords, and generation tools. This study did not establish that every song supplies each feature or verify generated chord accuracy. Claims about permitted lyric use are the site's own statements, not evidence of permission for Keertana. [Homepage](https://telugugospellyrics.com/)

**Adapt:** search-first access, reviewed summaries, selective related links, and useful collections. **Avoid:** repeated filler, unsupported promotional claims, duplicated widgets, unverified counters, or automatically generated musical/theological claims.

## 8. A concrete editorial warning: conflicting credits

For the Deevinchave title, Christian Telugu Lyrics names **P Satish Kumar and Sunil** as lyricists; Telugu Gospel Lyrics names **Bro. Suhaas Prince**. This report does not decide which is correct. A version difference, data-entry mistake, or another explanation is possible. Neither claim should become a verified Keertana credit without checking an authoritative release or creator source. [First attribution](https://christiantelugulyrics.com/deevinchave-samruddiga-song-lyrics/), [second attribution](https://telugugospellyrics.com/deevinchave-samruddhiga-song-lyrics/)

A safer optional record should distinguish song title, spelling aliases, lyricist, composer, performer, original source URL/reference, reviewer, and review date. Unknown information should remain omitted. A Keertana editor credit must never imply authorship of the song. This is a proposed data improvement, not permission to import competitor content or revive the deferred artists-page idea.

## 9. Comparison matrix

“Sampled” means observed on inspected pages, not a guarantee across the site. “Cached” is historical evidence only. Reader controls were not exhaustively exercised.

| Capability | Christian Telugu Lyrics | ChristianLyricz | Waytochurch | Telugu Gospel Lyrics | Keertana today |
| --- | --- | --- | --- | --- | --- |
| Native/Roman song titles | Sampled | Current metadata + cached content | Sampled | Sampled | Native catalog; curated Roman display on two priority songs; broader Roman search aliases |
| Complete Roman-script reading | Three samples | Cached samples; current UI unverified | Several samples, inconsistent completeness | Sampled | Not a consistent visible reader feature |
| Worship/occasion collections | Observed | Cached navigation/current sitemap | Observed | Observed | No comparable curated theme hubs |
| Alphabet/language browsing | Observed | Cached directories | Observed | Observed | Existing paginated language/letter routes |
| Native/Roman site-search tests | Small sample succeeds, broad results | Current interaction unverified | Spelling-dependent results | Two equivalent searches succeed | Existing title-only matcher/tests |
| Verified song credits | Site assertions only | Site assertions only | Site assertions only | Site assertions only | No consistent verified credit fields |
| Correction/request intake | Forms/comments observed | Cached forms | Forms observed | Form observed | Reviewed email drafts already implemented |
| Print/share/reader utilities | Limited in sampled raw pages | Advertised/cached; current unverified | Exposed in samples | Advertised; full operation unverified | Already implemented, including ordered setlist reading/printing/sharing |
| Personal saved songs/setlists | Not established | Current experience unverified | Not established | Recent-view section observed | Existing browser-local library and shared setlist snapshots |
| Accurate language semantics | en-US in sampled Telugu source | Current full rendering unverified | en in Telugu sample | en-US in sampled source | Telugu reader declares te; text language set |
| Current performance superiority | Not established | Not established | Not established | Not established | No cross-site field comparison available |

The consistent content gap is **reviewed Roman reading plus intent-based discovery**. Keertana's utilities are an existing differentiator, not tasks to rebuild.

## 10. What Google's guidance changes about the recommendations

### Titles and Roman spellings

Google recommends descriptive, concise titles aligned with the language/script of the main page and may rewrite mismatched titles. Therefore, do not replace every Telugu title with Roman-only English text or assume a two-script title will always be displayed intact. Retain the native main title, add a reviewed Roman subtitle/alias where useful, and test a small batch before expanding. On-site Roman matching and Google's choice of title link are different systems. [Title-link guidance](https://developers.google.com/search/docs/appearance/title-link), [script-misalignment explanation](https://developers.google.com/search/blog/2022/06/title-script-misalignment)

### Crawlable links and meaningful collections

Use actual anchors with descriptive labels for related songs and collection entries. A user-specific local list or fragment share link is not a replacement for an editorial collection with a stable crawlable URL. Preserve language/letter pagination and the sitemap rather than making discovery depend on JavaScript search. [Google link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)

### Useful content over page length

Additional text should solve a reader's need: identify the song/version, explain the scripts supplied, provide confirmed source information, or explain a collection's selection. Do not create repetitive introductions, unsupported meanings, blanket FAQs, or automated pages merely to look larger. A useful concise lyric page can be preferable to a padded article. [People-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

### Schema is not a shortcut

MusicComposition can describe the song semantically, but Google's supported-feature gallery does not provide a dedicated MusicComposition lyric rich-result entitlement. Breadcrumbs are a supported feature. FAQ rich results are generally restricted to authoritative government/health sites; adding FAQ markup is not a realistic shortcut for Keertana. Do not promise stars, carousels, expanded FAQs, or top ranking merely because JSON-LD validates. [Supported feature gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery), [FAQ changes](https://developers.google.com/search/blog/2023/08/howto-faq-changes)

Roman Telugu is a transliteration, not a translation into English. Do not automatically give it English-language hreflang as though it were a separate translation. Review Keertana's existing language-hub hreflang relationships before extending them: the catalogs contain different songs, not necessarily translated equivalents. [Multilingual-site guidance](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)

## 11. Prioritized implementation roadmap

Complexity refers to technical effort; editorial review can exceed coding time. These are proposals requiring owner selection, not changes made by this report.

| Priority | Task and current behavior | Safest proposed improvement | Likely files/areas | Dependencies | Risk / complexity |
| --- | --- | --- | --- | --- | --- |
| P0 follow-through | Legacy migration was repaired; two requested songs still lack supplied lyrics | Retain live redirect checks; restore missing pages only after receiving appropriate lyrics/source material; artists remains retired | `vercel.json`, `src/data/songs.json`, entry tool, recovery audit | Owner-provided content; song identity confirmation | Low technical / small; wrong-song or content-source risk if guessed |
| P1 | Roman display titles are curated on only two priority pages | Select ten existing songs from impressions/query variants; add reviewed aliases and consistent visible Roman labels without changing slugs | `src/lib/song-seo.ts`, `src/lib/search-index.ts`, `public/title-search.js`, reader; optional metadata sidecar | Telugu review; query-to-song identity | Low–medium / small pilot, medium catalog effort |
| P1 pilot | Native lyrics have no consistent complete Roman reading view | Add optional reviewed Roman lyrics on the same canonical page; accessible script selection; preserve stanza breaks and copy/print behavior | Reader, optional song-details data, print CSS, reader tests, song-entry preview | Complete reviewed text; permission/source process; native/Roman alignment | Medium / medium; substantial editorial effort |
| P1/P2 | Browsing is mainly language/alphabet based | Publish three curated public hubs, e.g. Christmas, praise/worship, thanksgiving, only when each has a useful selection and rationale | New collection data/routes; navigation; sitemap; browse components | Human curation; avoid treating personal setlists as editorial pages | Low technical, medium editorial / medium |
| P1/P2 | Reader links back to language/letter, without a small contextual related set | Add three to five relevant crawlable links after lyrics; use actual collection membership or reviewed relationships | `src/pages/song/[slug].astro`, collection data | Collection metadata; correct language/version | Low / small–medium; irrelevant recommendations if automated blindly |
| P2, previously deferred | Minimal source/creator fields | Optional verified source/lyricist/composer/performer and genuine review date; omit unknowns | Proposed optional metadata; owner entry tool; reader/schema | Authoritative references; separate editor from creator | Medium accuracy risk / medium |
| P2 | Missing-song and correction demand arrives by email | Maintain a simple private review queue; prioritize repeated requests and actual query gaps; no public comments/backend needed initially | Maintenance workflow/docs; existing contribution forms | Someone reviewing inbox; deduplication | Low / small process change |
| P2 | Few public indicators of newly added/reviewed content | Add a modest recent additions/reviews section only after genuine dates exist | Metadata, homepage/browse | Real date tracking | Low / small; fabricated freshness must be avoided |
| P2 optional | No consistent approved video reference | Start with optional official-source links; consider click-to-load embeds only if users need them | Metadata, reader, privacy review | Verified official source; mobile budget | Medium / medium; third-party performance/privacy cost |
| P2 ongoing | Mobile-heavy audience, limited cross-site field evidence | Measure Keertana's own real users and run repeatable phone/keyboard/print checks on changed flows | Styles/reader/search; Vercel and PageSpeed review | Sufficient field sample; controlled test procedure | Low / small recurring work |
| P3/future | Chords, PPT, line-by-line study modes | Consider only demonstrated demand; musician-reviewed chords and deliberate export workflow | Future reader/export modules | Musical/editorial review; maintenance capacity | Medium–high / medium–large |

### First upgrade acceptance criteria

Before implementing, choose ten songs with demonstrated query demand and available reviewed content. Nenemaina Prabhuva, Neethi Suryuda Yesu, and Deevinchaave are candidates, not an automatic final list.

- Existing slugs, native lyrics, canonicals, and library keys remain stable.
- Roman title variants resolve to the correct song in title-only search; exact titles rank ahead of loose matches.
- A visible Roman-reading option appears only where complete reviewed text exists. No empty or machine-verified claim.
- Controls have clear labels, keyboard focus, and touch targets; check 320px and a typical Android viewport, light/dark themes, and zoom.
- Copy and print use the selected script deliberately. Setlist reading/printing behavior is specified and tested; native remains available.
- Required text and song links are available in generated HTML; no new duplicate URL per spelling.
- Loading/error/empty states remain clear; no extra library or server is required without a concrete need.
- Build, SEO/redirect audits, search tests, and reader regression checks pass.

## 12. Measurement plan

Use Keertana's own Search Console and analytics, not competitors' visible counters, to judge success.

| Question | Evidence to collect | Decision rule |
| --- | --- | --- |
| Are the intended songs discoverable? | Indexability/canonical inspection, sitemap presence, per-page impressions | Resolve technical failures before changing copy; an indexed page is not a ranking guarantee |
| Do Roman queries reach the right pages? | A fixed native/Roman test set plus Search Console query/page pairs | Correct identity and stable matching are required; compare exposure and clicks per target song |
| Do title changes help? | Same songs, comparable date windows, query mix, impressions/clicks/CTR/position | Do not attribute aggregate CTR changes to titles without considering position and query mix |
| Do hubs create useful discovery? | Hub entry traffic and subsequent song-page visits; user feedback | Expand only collections that are useful and maintainable; avoid thin-page multiplication |
| Is mobile reading good? | Repeatable narrow-phone/zoom tests and available field/lab diagnostics | Fix actual overflow, focus, or layout instability; no invented competitor speed comparison |
| Are contributions productive? | Reviewed emails and accepted corrections/new songs | A visit to Report is not a submitted correction; form opening alone is not success |

Keep a dated change log and baseline. Recheck after recrawling; use an initial comparable 28-day window when available and longer windows if samples remain small. No promise of a particular traffic percentage, position, index count, or time-to-rank is justified.

## 13. Guardrails and unresolved work

- No app implementation is included in this research task.
- Artist pages remain out of scope by owner decision.
- Lyric-body search remains out of scope by owner decision.
- Existing reader, saved songs, setlists, print, branding, and static architecture should be reused.
- Do not import lyrics, copy competitor copy/design, invent credits, infer permissions from a disclaimer, or label generated output verified.
- Do not infer backlinks, domain authority, traffic, engagement, or ranking causation from a site's age claims, sitemap size, or counters.
- Complete live mobile/accessibility/performance comparisons remain a separate test exercise; ChristianLyricz current UI access was restricted.
- The two missing-song pages still need owner-supplied lyrics or suitable source material; external references establish possible identity, not an automatic restoration.

**Recommendation for approval:** implement the ten-song reviewed Roman discovery/reading pilot first. Then build three curated collection pages and a small related-song section. Preserve Keertana's calm reading experience throughout.
