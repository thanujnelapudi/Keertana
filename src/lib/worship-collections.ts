export const worshipCollections = [
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
    intro: 'A small selection for giving thanks and remembering God’s care. Telugu and English songs are shown together so you can choose the language your group sings.',
    guidance: 'Read the complete song before adding it to a thanksgiving service or personal prayer set. The collection stays short so finding a suitable song stays simple.',
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
];

export function collectionsForSong(slug: string) { return worshipCollections.filter(c => c.songs.includes(slug)); }
export function relatedSongSlugs(slug: string, limit = 4) {
  return [...new Set(collectionsForSong(slug).flatMap(c => c.songs))].filter(s => s !== slug).slice(0, limit);
}
