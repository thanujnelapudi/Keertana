interface ThemeSong { slug: string; title: string; lyrics: string; }
// Signals describe the song's words, never an inferred artist or denomination.
// Matching one incidental word in a later verse is deliberately insufficient.
const rules = [
  { slug: 'christmas', minimum: 3, signals: [/క్రిస్మస్|christmas/i, /బేత్లెహే|బేత్లెహె|బేతలహే/, /(యేసు|యేసయ్య|యేసయ్యా)\s*(పుట్ట|జన్మ|జనన)/, /క్రీస్తు\s*(పుట్ట|జన్మ|జనన)/, /రక్షకుడు\s*(పుట్ట|జన్మ)/, /కన్య\s*మరియ|పశువుల\s*పాక|దూతల\s*గాన/, /అందాల\s*తార|తూర్పు\s*దిక్కు\s*చుక్క|దావీదు\s*వంశ/] },
  { slug: 'good-friday', minimum: 4, signals: [/సిలువ|సిల్వ/, /కల్వరి|కలువరి/, /గొల్గొత|గొల్గొథ/, /గెత్సెమ|గెత్సేమ/, /ముళ్ళ\s*కిరీట|ముండ్ల\s*కిరీట/, /శ్రమలను|సిలువ\s*త్యాగ/] },
  { slug: 'thanksgiving', minimum: 3, signals: [/కృతజ్ఞ|క్రుతజ్ఞ/, /ధన్యవాద/, /చేసిన\s*మేలు|చేసితివి\s*మేలు|మేలులెన్నో|మేలులను|నీ\s*మేలు/, /కాపాడినావు|మరువలేనయ్యా/, /thank\s*(you|s|ful)/i] },
  { slug: 'prayer', minimum: 3, signals: [/ప్రార్థ|ప్రార్ధ/, /విన్నప|విజ్ఞాప/, /వేడుకొ|వేడెద/, /ఆలకించ|ఆలకింప/, /నడిపించ|దయచూప|కనికరించ/, /నింపుము|నింపయ్యా|వినుము|చూడుము|కాచుము|నిలుపుము|దయచేయు|కరుణించు|పంపుము|రావయ్యా/] },
  { slug: 'hope-and-encouragement', minimum: 3, signals: [/నిరీక్షణ|నిరీక్షించ/, /ఆశ్రయ|ఆధార|ఆదరణ/, /ఓడిపో|ధైర్య/, /భయపడ|కృంగిపో|కృంగిన|ఊరుకో|ఆపత్కాల/, /తోడుగా|తోడుండ|తోడున్న|అండగా|సహాయ|ఒంటరి/, /నమ్ముకొ|విశ్వాస/, /అన్నీ?\s*సాధ్యమే|జయము|జయం/] },
  { slug: 'praise-and-worship', minimum: 3, signals: [/ఆరాధ/, /స్తుతి|స్తుతిం/, /స్తోత్ర|స్తోత్త్ర/, /వందన|అంజలి/, /మహిమ|కొనియాడ|పూజించ|భజన/, /హల్లెలూయ|హల్లెలూయా/, /యేసు\s*నామ|ప్రభు\s*నామ|నీ\s*నామ/, /అద్భుతకరుడా|ఆశ్చర్యకరుడ|అద్వితీయ|ఆలోచనకర్త|మహోన్నత|సర్వోన్నత|రాజుల\s*రాజు|ప్రభువుల\s*ప్రభు/] },
  { slug: 'holy-spirit', minimum: 3, signals: [/పరిశుద్ధా?త్మ|పరిశుద్ధ\s*ఆత్మ/, /ఆత్మ\s*దేవా|ఆత్మ\s*వర్ష|ఆత్మాభిషేక/, /ఆత్మతో\s*నింపు|ఆత్మను\s*కుమ్మరించ/] },
  { slug: 'easter', minimum: 3, signals: [/ఈస్టర్|easter/i, /పునరుత్థా|పునరుత్ధా/, /మృత్యుంజయ/, /మరణమును?\s*గెలి|మరణం\s*గెలి|మరణము\s*గెలి/, /సమాధి\s*గెలి|సమాధి\s*నుండి|తిరిగి\s*లేచె/] },
  { slug: 'second-coming', minimum: 3, signals: [/రాకడ/, /రెండవ\s*రాక|మరల\s*రానై|అంత్య\s*దిన|నేడో\s*రేపో/, /యేసు\s*వచ్చుచు|ప్రభువు\s*వచ్చుచు|రానున్నాడు/, /మేఘముల\s*మీద|మేఘముపై/, /పెండ్లి\s*కుమారుడు|పెండ్లికుమారుని/, /బూర\s*ధ్వని|కడ\s*బూర/] },
  { slug: 'grace-and-salvation', minimum: 3, signals: [/కృప|క్రుప/, /కరుణ|దయామయ/, /రక్షణ|రక్షక|రక్షించ/, /విమోచ|విముక్తి|పాపక్షమా/, /రక్తము|రక్తం|రక్తమే/] },
  { slug: 'love-of-god', minimum: 3, signals: [/ప్రేమ/, /ప్రియుడ|ప్రియమైన|ప్రేమమయ|నేస్తమా/, /స్నేహిత|స్నేహము|స్నేహం/, /ప్రేమించ|ప్రేమింతు|ప్రేమతో/] },
  { slug: 'heaven-and-eternal-life', minimum: 3, signals: [/పరలోక/, /సీయోన|యెరూషలే/, /నిత్య\s*జీవ|నిత్యజీవ|నిత్యరాజ్య/] },
  { slug: 'word-of-god', minimum: 3, signals: [/వాక్యము|వాక్యం|వాక్యమే|వాక్యమా/, /బైబిలు|బైబిల్|పవిత్ర\s*గ్రంథ/, /దేవుని\s*మాట|వాక్యాన్ని|వాక్యమును/] },
  { slug: 'church-and-service', minimum: 3, signals: [/సంఘమా|సంఘము|సంఘమున/, /సువార్త/, /సేవక|సేవయే|కోతకు\s*సమయం|ఆత్మల\s*రక్షణ/] },
  { slug: 'family-and-blessing', minimum: 3, signals: [/కుటుంబ/, /కళ్యాణ|కల్యాణ|వివాహ|పరిణయ|దాంపత్య/, /అమ్మ\s*కోసం|దీవించు\s*మా\s*ఇంటి/] },
];
export function scoreSongThemes(song: ThemeSong) {
  const title = song.title.normalize('NFC').replace(/[\u200c\u200d]/g, '').replace(/\s+/g, ' ');
  const body = song.lyrics.normalize('NFC').replace(/[\u200c\u200d]/g, '').replace(/\s+/g, ' ');
  const opening = song.lyrics.split(/\n\s*\n/)[0].normalize('NFC').replace(/[\u200c\u200d]/g, '').replace(/\s+/g, ' ').slice(0, 450);
  return rules.map(rule => {
    const evidence = rule.signals.flatMap(signal => signal.test(title) ? [{ match: title.match(signal)![0], location: 'title', points: 8 }] : signal.test(opening) ? [{ match: opening.match(signal)![0], location: 'opening', points: 3 }] : signal.test(body) ? [{ match: body.match(signal)![0], location: 'verse', points: 1 }] : []);
    return { slug: rule.slug, score: evidence.reduce((sum, item) => sum + item.points, 0), minimum: rule.minimum, evidence };
  }).filter(result => result.score >= result.minimum && result.evidence.some(item => item.location !== 'verse')).sort((a,b) => b.score - a.score);
}
export function suggestSongCollections(song: ThemeSong) { return scoreSongThemes(song).slice(0, 2).map(result => result.slug); }
