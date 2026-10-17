// Reading conventions are deliberately separate from forgiving title search and
// slug generation. e/o represent ఏ/ఓ; ee/oo represent ఈ/ఊ, rather than merging them.
const teVowels: Record<string, string> = { అ:'a',ఆ:'aa',ఇ:'i',ఈ:'ee',ఉ:'u',ఊ:'oo',ఋ:'ru',ౠ:'roo',ఌ:'lu',ౡ:'loo',ఎ:'e',ఏ:'e',ఐ:'ai',ఒ:'o',ఓ:'o',ఔ:'au' };
const teSigns: Record<string, string> = { 'ా':'aa','ి':'i','ీ':'ee','ు':'u','ూ':'oo','ృ':'ru','ౄ':'roo','ౢ':'lu','ౣ':'loo','ె':'e','ే':'e','ై':'ai','ొ':'o','ో':'o','ౌ':'au' };
const teConsonants: Record<string, string> = { క:'k',ఖ:'kh',గ:'g',ఘ:'gh',ఙ:'ng',చ:'ch',ఛ:'chh',జ:'j',ఝ:'jh',ఞ:'ny',ట:'t',ఠ:'th',డ:'d',ఢ:'dh',ణ:'n',త:'th',థ:'th',ద:'d',ధ:'dh',న:'n',ప:'p',ఫ:'ph',బ:'b',భ:'bh',మ:'m',య:'y',ర:'r',ఱ:'r',ల:'l',ళ:'l',వ:'v',శ:'sh',ష:'sh',స:'s',హ:'h' };
const hiVowels: Record<string, string> = { अ:'a',आ:'aa',इ:'i',ई:'ee',उ:'u',ऊ:'oo',ऋ:'ri',ए:'e',ऐ:'ai',ओ:'o',औ:'au' };
const hiSigns: Record<string, string> = { 'ा':'aa','ि':'i','ी':'ee','ु':'u','ू':'oo','ृ':'ri','े':'e','ै':'ai','ो':'o','ौ':'au' };
const hiConsonants: Record<string, string> = { क:'k',ख:'kh',ग:'g',घ:'gh',ङ:'ng',च:'ch',छ:'chh',ज:'j',झ:'jh',ञ:'ny',ट:'t',ठ:'th',ड:'d',ढ:'dh',ण:'n',त:'t',थ:'th',द:'d',ध:'dh',न:'n',प:'p',फ:'ph',ब:'b',भ:'bh',म:'m',य:'y',र:'r',ल:'l',व:'v',श:'sh',ष:'sh',स:'s',ह:'h',ळ:'l' };
const hiNukta: Record<string, string> = { क:'q',ख:'kh',ग:'gh',ज:'z',ड:'r',ढ:'rh',फ:'f',य:'y' };
// A small, explicit vocabulary handles common devotional Hindi exceptions to
// mechanical schwa deletion. It is not a pronunciation-verified song corpus.
const hiWords: Record<string, string> = { परमेश्वर:'parmeshwar',पवित्र:'pavitra',यज्ञ:'yagya' };
const joins = /[\u200c\u200d]/g;
export const READING_RULES_VERSION = 'reading-2';

export function teluguReading(run: string) {
  // A legacy split-o spelling occurs in the existing catalog's Jehovah title.
  // Normalize the reading only; never rewrite the source lyrics or page slug.
  const chars = Array.from(run.normalize('NFC').replace(joins, '').replace(/ెూ/g, 'ో'));
  let result = '';
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (teConsonants[ch]) {
      result += teConsonants[ch];
      if (chars[i + 1] === '్') i++;
      else if (teSigns[chars[i + 1]]) result += teSigns[chars[++i]];
      else result += 'a';
    } else if (teVowels[ch]) result += teVowels[ch];
    else if (ch === 'ం') result += /[కఖగఘఙచఛజఝఞటఠడఢణతథదధన]/.test(chars[i + 1] || '') ? 'n' : 'm';
    else if (ch === 'ఁ') result += 'm';
    else if (ch === 'ః') result += 'h';
    else if (/[౦-౯]/.test(ch)) result += String(ch.charCodeAt(0) - 0x0c66);
    else result += ch; // Unknown signs remain detectable by the coverage audit.
  }
  return result;
}

export function hindiReading(run: string) {
  const normalized = run.normalize('NFC').replace(joins, '');
  if (hiWords[normalized]) return hiWords[normalized];
  const chars = Array.from(normalized.normalize('NFD'));
  const syllables: Array<{ consonant: string; vowel: string; inherent: boolean; dead: boolean; mark: string }> = [];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (hiConsonants[ch]) {
      let consonant = hiConsonants[ch];
      if (chars[i + 1] === '़') { consonant = hiNukta[ch] || consonant; i++; }
      let vowel = 'a', inherent = true, dead = false;
      if (chars[i + 1] === '्') { i++; vowel = ''; inherent = false; dead = true; }
      else if (hiSigns[chars[i + 1]]) { vowel = hiSigns[chars[++i]]; inherent = false; }
      syllables.push({ consonant, vowel, inherent, dead, mark: '' });
    } else if (hiVowels[ch]) syllables.push({ consonant: '', vowel: hiVowels[ch], inherent: false, dead: false, mark: '' });
    else {
      let mark = ch;
      if (ch === 'ं') mark = /[पफबभम]/.test(chars[i + 1] || '') ? 'm' : 'n';
      else if (ch === 'ँ') mark = 'n';
      else if (ch === 'ः') mark = 'h';
      else if (ch === '़') mark = '';
      else if (/[०-९]/.test(ch)) mark = String(ch.charCodeAt(0) - 0x0966);
      else if (/[।॥]/.test(ch)) mark = '|';
      syllables.push({ consonant: '', vowel: '', inherent: false, dead: false, mark });
    }
  }
  // Hindi drops many unwritten schwas; explicit long vowels are never removed.
  const last = syllables.length - 1;
  if (last > 0 && syllables[last].inherent && !(syllables[last - 1].dead && /^(r|y)$/.test(syllables[last].consonant))) syllables[last].vowel = '';
  for (let i = last - 1; i > 0; i--) {
    const here = syllables[i], previous = syllables[i - 1], next = syllables[i + 1];
    if (here.inherent && previous.vowel && next.consonant && next.vowel && !previous.mark && !next.mark) here.vowel = '';
  }
  return syllables.map(part => part.consonant + part.vowel + part.mark).join('');
}
