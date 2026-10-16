export const worshipCollections = [
  {
    slug: 'christmas', title: 'Christmas Songs', nativeTitle: 'క్రిస్మస్ పాటలు',
    description: 'Telugu Christian Christmas songs for celebrating the birth of Jesus, with lyrics for reading, singing, and preparing a worship set.',
    intro: 'A selection from Keertana’s existing library about the birth of Jesus and the joy of Christmas. Start with an individual song, then add the ones you need to your own setlist.',
    guidance: 'For a Christmas gathering, choose songs that suit your congregation and the time available. Open each song to read its verses before arranging your set.',
    songs: ['christmas-antene', 'christmas-aanandam-vachchenu', 'christmas-aanandam', 'christmas-kaalam', 'christmas-panduga', 'christmas-vachchindayyaa', 'christmas-shubha-dinam', 'kreesthu-puttenu', 'kreesthu-puttenu-hallelooyaa', 'kreesthesu-puttenu'],
  },
  {
    slug: 'praise-and-worship', title: 'Praise & Worship Songs', nativeTitle: 'స్తుతి ఆరాధన పాటలు',
    description: 'Telugu praise and worship song lyrics for prayer, personal devotion, and congregational singing. Explore songs and arrange your own worship set.',
    intro: 'These songs center on praise and adoration. This is a starting selection, not a prescribed service order: read the words and choose what fits your gathering.',
    guidance: 'Pair a familiar song with one your group is learning. Use the reader’s text-size controls during practice and keep the song order in a setlist.',
    songs: ['aaraadhana-adhika-sthothramu', 'aaraadhana-sthuthi-aaraadhana', 'aaraadhana-yesu-neeke', 'aaraadhanaku-yogyudaa', 'aaraadhanaa-aaraadhanaa-aathmatho', 'aaraadhanaa-neeke-aaraadhanaa', 'aaraadhincheda', 'ee-sthuthi-neeke', 'nenemainaa-prabhuvaa', 'neethi-sooryudaa-yesu'],
  },
  {
    slug: 'thanksgiving', title: 'Thanksgiving Songs', nativeTitle: 'కృతజ్ఞత పాటలు',
    description: 'Christian songs of gratitude in Telugu and English. Read thanksgiving lyrics, find a Roman reading aid where available, and prepare your own song set.',
    intro: 'A small selection for giving thanks and remembering God’s care. Telugu and English songs are shown together so you can choose the language your group sings.',
    guidance: 'Read the complete song before adding it to a thanksgiving service or personal prayer set. The collection stays short so finding a suitable song stays simple.',
    songs: ['kruthagnathatho-sthuthi-paadeda', 'enni-tharamulu-sthuthiyinchinaa', 'neeke-sthothramulu', 'give-thanks', 'thank-you', 'thank-you-lord', 'thank-you-o-my-father'],
  },
];

export function collectionsForSong(slug: string) { return worshipCollections.filter(c => c.songs.includes(slug)); }
export function relatedSongSlugs(slug: string, limit = 4) {
  return [...new Set(collectionsForSong(slug).flatMap(c => c.songs))].filter(s => s !== slug).slice(0, limit);
}
