import catalog from '../data/songs.json' with { type: 'json' };
import { scoreSongThemes } from './song-themes.ts';
const curatedCollections = [
  {
    slug: 'christmas', title: 'Christmas Songs', nativeTitle: 'క్రిస్మస్ పాటలు',
    theme: 'christmas', occasion: 'Celebrate His birth', summary: 'Songs of joy for the birth of Jesus.',
    description: 'Telugu Christian Christmas songs for celebrating the birth of Jesus, with lyrics for reading, singing, and preparing a worship set.',
    intro: 'A selection from Keertana’s existing library about the birth of Jesus and the joy of Christmas. Start with an individual song, then add the ones you need to your own setlist.',
    guidance: 'For a Christmas gathering, choose songs that suit your congregation and the time available. Open each song to read its verses before arranging your set.',
    songs: ['christmas-antene', 'christmas-aanandam-vachchenu', 'christmas-aanandam', 'christmas-kaalam', 'christmas-panduga', 'christmas-vachchindayyaa', 'christmas-shubha-dinam', 'kreesthu-puttenu', 'kreesthu-puttenu-hallelooyaa', 'kreesthesu-puttenu'],
  },
  {
    slug: 'praise-and-worship', title: 'Praise & Worship Songs', nativeTitle: 'స్తుతి ఆరాధన పాటలు',
    theme: 'praise', occasion: 'Lift your praise', summary: 'Adoration for personal and gathered worship.',
    description: 'Telugu praise and worship song lyrics for prayer, personal devotion, and congregational singing. Explore songs and arrange your own worship set.',
    intro: 'These songs center on praise and adoration. This is a starting selection, not a prescribed service order: read the words and choose what fits your gathering.',
    guidance: 'Pair a familiar song with one your group is learning. Use the reader’s text-size controls during practice and keep the song order in a setlist.',
    songs: ['aaraadhana-adhika-sthothramu', 'aaraadhana-sthuthi-aaraadhana', 'aaraadhana-yesu-neeke', 'aaraadhanaku-yogyudaa', 'aaraadhanaa-aaraadhanaa-aathmatho', 'aaraadhanaa-neeke-aaraadhanaa', 'aaraadhincheda', 'ee-sthuthi-neeke', 'nenemainaa-prabhuvaa', 'neethi-sooryudaa-yesu'],
  },
  {
    slug: 'thanksgiving', title: 'Thanksgiving Songs', nativeTitle: 'కృతజ్ఞత పాటలు',
    theme: 'thanksgiving', occasion: 'Remember His goodness', summary: 'Give thanks for God’s care and faithfulness.',
    description: 'Christian songs of gratitude in Telugu and English. Read thanksgiving lyrics, find a Roman reading aid where available, and prepare your own song set.',
    intro: 'Songs for giving thanks and remembering God’s care. Telugu and English songs are shown together so you can choose the language your group sings.',
    guidance: 'Read the complete song before adding it to a thanksgiving service or personal prayer set. Browse the pages, choose words your group knows, and arrange a few songs in your own order.',
    songs: ['kruthagnathatho-sthuthi-paadeda', 'enni-tharamulu-sthuthiyinchinaa', 'neeke-sthothramulu', 'give-thanks', 'thank-you', 'thank-you-lord', 'thank-you-o-my-father'],
  },
  {
    slug: 'good-friday', title: 'Good Friday Songs', nativeTitle: 'సిలువ పాటలు',
    theme: 'cross', occasion: 'Reflect on the cross', summary: 'Remember the love and sacrifice of Jesus.',
    description: 'Good Friday and cross-centered Christian song lyrics in Telugu and English. Read songs about Calvary, Christ’s sacrifice, and redeeming love.',
    intro: 'Pause with songs about the cross, Calvary, and the love of Jesus. These Telugu and English selections from Keertana’s library can support Good Friday worship or quiet reflection throughout the year.',
    guidance: 'Leave room for reflection between songs. Read the full words first, then choose a sequence that fits your gathering’s reading, prayer, and time of remembrance.',
    songs: ['ayyaa-naa-kosam-kalvarilo', 'kaluvari-giri-siluvalo', 'kalvari-premanu', 'kalvarilona-chesina-yaagam', 'at-the-cross', 'lead-me-to-the-cross', 'old-rugged-cross'],
  },
  {
    slug: 'prayer', title: 'Prayer Songs', nativeTitle: 'ప్రార్థన పాటలు',
    theme: 'prayer', occasion: 'Draw near in prayer', summary: 'Words of surrender, guidance, and dependence.',
    description: 'Christian prayer and surrender song lyrics in Telugu and English. Find words for personal devotion, prayer meetings, and seeking God’s guidance.',
    intro: 'Songs for bringing our needs to God, asking for His guidance, and surrendering our lives to Him. Explore these Telugu and English selections for personal prayer or a gathering with others.',
    guidance: 'Choose words your group can pray together. A familiar refrain can make space for shared prayer; use a quieter song when you want time for personal reflection.',
    songs: ['annitikannaa-praarthana-minna', 'idiyenayya-maa-praarthana', 'nadipinchu-naa-naavaa', 'all-to-jesus', 'i-need-thee-every-hour', 'lord-i-need-you', 'what-a-friend'],
  },
  {
    slug: 'hope-and-encouragement', title: 'Hope & Encouragement', nativeTitle: 'నిరీక్షణ పాటలు',
    theme: 'hope', occasion: 'Rest in His faithfulness', summary: 'Find courage in God’s presence and promises.',
    description: 'Christian songs of hope and encouragement in Telugu and English. Read lyrics about God’s faithfulness, refuge, and strength through difficult times.',
    intro: 'When the way ahead feels uncertain, these songs turn our attention to God’s presence and faithfulness. Find Telugu and English words of refuge, courage, and hope from the existing Keertana library.',
    guidance: 'Start with a song your group knows and let its words guide the next choice. These selections also work for personal devotion; there is no required order or complete service plan.',
    songs: ['aashraya-durgamaa-naa-yesayyaa', 'aashrayamaa-aadhaaramaa', 'odiponivvadu', 'devude-naakaashrayambu', 'nenu-odiponayaa', 'great-is-thy-faithfulness', 'living-hope'],
  },
  {
    slug: 'holy-spirit', title: 'Holy Spirit Songs', nativeTitle: 'పరిశుద్ధాత్మ పాటలు', theme: 'prayer', occasion: 'Seek His presence', summary: 'Songs asking for the Spirit’s presence and guidance.',
    description: 'Telugu Christian song lyrics about the Holy Spirit, His presence, guidance, and the life of prayer.',
    intro: 'Explore Telugu songs that turn our attention to the Holy Spirit. Read their words as you prepare for prayer, personal devotion, or worship with your congregation.',
    guidance: 'Choose songs that fit your gathering and read the complete lyrics first. Arrange a few familiar songs in a setlist rather than treating this directory as a required service order.', songs: [],
  },
  {
    slug: 'easter', title: 'Easter & Resurrection', nativeTitle: 'పునరుత్థాన పాటలు', theme: 'hope', occasion: 'Celebrate the risen Lord', summary: 'The resurrection of Jesus and victory over death.',
    description: 'Telugu Christian Easter and resurrection song lyrics celebrating the risen Jesus and victory over death.',
    intro: 'Find Telugu songs about the resurrection, the risen Lord, and victory over death. This collection brings together words for Easter worship and remembrance throughout the year.',
    guidance: 'Read each song in full to choose the words that fit your Easter gathering. Use the reading controls for practice and add selected songs to your own worship setlist.', songs: [],
  },
  {
    slug: 'second-coming', title: 'The Coming of Jesus', nativeTitle: 'యేసు రాకడ పాటలు', theme: 'christmas', occasion: 'Look forward in hope', summary: 'Songs of readiness and hope for His return.',
    description: 'Telugu Christian song lyrics about the coming of Jesus, readiness, and hope for His return.',
    intro: 'These Telugu songs look forward to the coming of Jesus and call us to live in readiness and hope. Explore the complete words before choosing songs for your gathering.',
    guidance: 'Choose a song whose words your congregation understands and sings comfortably. Keep your selected order in a personal setlist and read through the verses before practice.', songs: [],
  },
  {
    slug: 'grace-and-salvation', title: 'Grace & Salvation', nativeTitle: 'కృప రక్షణ పాటలు', theme: 'cross', occasion: 'Remember His saving grace', summary: 'God’s grace, mercy, forgiveness, and salvation.',
    description: 'Telugu Christian song lyrics about grace, mercy, forgiveness, and salvation through Jesus.',
    intro: 'Explore songs that speak of God’s grace, mercy, forgiveness, and salvation. Read the complete Telugu lyrics and choose the words that fit your devotion or gathering.',
    guidance: 'Songs in this collection express different aspects of grace and salvation. Read the verses first, then choose a familiar selection or arrange a few in your own worship setlist.', songs: [],
  },
  {
    slug: 'love-of-god', title: 'The Love of God', nativeTitle: 'దేవుని ప్రేమ పాటలు', theme: 'hope', occasion: 'Rest in His love', summary: 'Songs of love, closeness, and friendship with God.',
    description: 'Telugu Christian song lyrics about God’s love, closeness, and friendship, for worship and personal devotion.',
    intro: 'These Telugu songs reflect on love, closeness, and friendship with God. Explore their words for personal devotion, quiet reflection, or worship with your congregation.',
    guidance: 'Read each song in full and choose lyrics that fit your gathering. You can combine a familiar song of love with another theme in a personal worship setlist.', songs: [],
  },
  {
    slug: 'heaven-and-eternal-life', title: 'Heaven & Eternal Life', nativeTitle: 'పరలోక నిత్యజీవ పాటలు', theme: 'hope', occasion: 'Look toward eternity', summary: 'Songs of heaven, Zion, and eternal life.',
    description: 'Telugu Christian lyrics reflecting on heaven, Zion, and eternal life with God.',
    intro: 'Explore Telugu songs that reflect on heaven, Zion, and the hope of eternal life. Read the complete lyrics and choose words for devotion, remembrance, or worship together.',
    guidance: 'These songs approach eternity from different perspectives. Read the verses before selecting a song for remembrance, reflection, or congregational worship.', songs: [],
  },
  {
    slug: 'word-of-god', title: 'The Word of God', nativeTitle: 'దేవుని వాక్య పాటలు', theme: 'prayer', occasion: 'Listen and respond', summary: 'Songs about Scripture and listening to God’s word.',
    description: 'Telugu Christian song lyrics about the Bible, Scripture, and listening to God’s word.',
    intro: 'Find Telugu songs that speak about Scripture and responding to God’s word. Explore their lyrics for devotion, a Bible gathering, or worship alongside a reading.',
    guidance: 'Read the song and the Scripture selected for your gathering separately. Choose words that complement the reading without assuming that every lyric is a direct Bible quotation.', songs: [],
  },
  {
    slug: 'church-and-service', title: 'Church & Service', nativeTitle: 'సంఘ సేవ పాటలు', theme: 'praise', occasion: 'Gather and serve', summary: 'Songs of Christian community, service, and the gospel.',
    description: 'Telugu Christian song lyrics about the church, service, community, and sharing the gospel.',
    intro: 'These Telugu songs speak of Christian community, service, and sharing the gospel. Read their complete words before choosing a song for your congregation or gathering.',
    guidance: 'Choose a song that suits the purpose of your gathering and the people singing it. Add a small selection to your own setlist rather than using the entire directory as a service order.', songs: [],
  },
  {
    slug: 'family-and-blessing', title: 'Family & Blessing', nativeTitle: 'కుటుంబ ఆశీర్వాద పాటలు', theme: 'thanksgiving', occasion: 'Pray for your family', summary: 'Songs for family prayer, blessing, and marriage.',
    description: 'Telugu Christian song lyrics for family prayer, blessing, and marriage gatherings.',
    intro: 'Explore Telugu songs about family, blessing, and marriage. Read the words in full to find songs that fit the people and occasion you are preparing to gather for.',
    guidance: 'A family prayer song and a marriage song serve different moments. Read each song before selecting it and choose only the words that suit your gathering.', songs: [],
  },
  {
    slug: 'faith-and-devotion', title: 'Faith & Devotion', nativeTitle: 'విశ్వాస భక్తి పాటలు', theme: 'praise', occasion: 'Walk with God each day', summary: 'A wider library for everyday faith and devotion.',
    description: 'Telugu Christian lyrics for everyday faith, devotion, discipleship, and reflection. Browse songs beyond a single worship occasion.',
    intro: 'A broad home for Telugu songs of faith, devotion, discipleship, and reflection that do not fit one clear occasion. Explore their full words and find the songs that speak to your gathering.',
    guidance: 'This is a broad devotional directory, rather than a list for one service or festival. Use the song title and complete lyrics to choose what fits your prayer, reading, or gathering.', songs: [],
  },
];

const teluguSongs = catalog.filter(song => /^[\u0c00-\u0c7f]/.test(song.title));
const membership = new Map(curatedCollections.map(collection => [collection.slug, new Set<string>(collection.songs)]));
export const collectionDecisions = teluguSongs.map(song => {
  const seeded = curatedCollections.filter(collection => collection.songs.includes(song.slug)).map(collection => collection.slug);
  const matches = scoreSongThemes(song).slice(0, 2);
  const assigned = [...new Set([...seeded, ...matches.map(match => match.slug)])];
  if (!assigned.length) assigned.push('faith-and-devotion');
  assigned.forEach(slug => membership.get(slug)!.add(song.slug));
  return { slug: song.slug, title: song.title, collections: assigned, seeded, matches, broadFallback: !seeded.length && !matches.length };
});
const titles = new Map(catalog.map(song => [song.slug, song.title]));
export const worshipCollections = curatedCollections.map(collection => ({ ...collection, songs: [...membership.get(collection.slug)!].sort((a,b) => titles.get(a)!.localeCompare(titles.get(b)!, 'te')) }));
export const featuredWorshipCollections = worshipCollections.slice(0, 6);
export const COLLECTION_PAGE_SIZE = 36;
export function collectionPageUrl(slug: string, page = 1) { return page === 1 ? `/collections/${slug}/` : `/collections/${slug}/page/${page}/`; }
const bySong = new Map<string, typeof worshipCollections>();
for (const collection of worshipCollections) for (const slug of collection.songs) {
  const groups = bySong.get(slug) || []; groups.push(collection); bySong.set(slug, groups);
}

export function collectionsForSong(slug: string) { return bySong.get(slug) || []; }
export function relatedSongSlugs(slug: string, limit = 4) {
  const groups = collectionsForSong(slug).filter(group => group.slug !== 'faith-and-devotion');
  if (!groups.length) groups.push(...collectionsForSong(slug));
  const neighbours: string[] = [];
  for (let distance = 1; distance <= limit; distance++) for (const group of groups) {
    const index = group.songs.indexOf(slug);
    for (const next of [index + distance, index - distance]) if (next >= 0 && next < group.songs.length) neighbours.push(group.songs[next]);
  }
  return [...new Set(neighbours)].filter(s => s !== slug).slice(0, limit);
}
