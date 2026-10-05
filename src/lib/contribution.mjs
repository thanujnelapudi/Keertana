// The integration boundary: connect a real receiver here before enabling sending.
// Never treat a prepared draft as a received contribution.
/**
 * A future receiver must confirm receipt before returning `received`.
 * @returns {Promise<{status: 'unavailable'} | {status: 'received', receipt: string}>}
 */
export async function sendContribution(_payload) {
  return { status: 'unavailable' };
}

export const ISSUE_TYPES = [
  'Typo / spelling', 'Incorrect lyrics', 'Missing lyrics', 'Incorrect language',
  'Translation / transliteration', 'Formatting issue', 'Copyright / content concern', 'Other',
];
export const INTERESTS = [
  'Lyrics / content', 'Proofreading', 'Telugu translation', 'Hindi translation',
  'English translation', 'Transliteration', 'Design', 'Development', 'Testing',
  'Research', 'Community', 'Other',
];

export function validateContribution(kind, values, { languages, songSlugs }) {
  const errors = {};
  const text = key => typeof values[key] === 'string' ? values[key].trim() : '';
  const requireText = (key, label) => { if (!text(key)) errors[key] = `Enter ${label}.`; };
  if (kind === 'submit') {
    requireText('title', 'the song title');
    requireText('lyrics', 'the lyrics');
    if (!languages.includes(text('language'))) errors.language = 'Choose a language.';
    if (values.acknowledgement !== 'yes') errors.acknowledgement = 'Please confirm the acknowledgement.';
  } else if (kind === 'report') {
    if (!songSlugs.includes(text('song'))) errors.song = 'Choose a song from Keertana.';
    if (!ISSUE_TYPES.includes(text('issue'))) errors.issue = 'Choose an issue type.';
    requireText('description', 'a description of the issue');
  } else if (kind === 'join') {
    requireText('name', 'your name');
    requireText('email', 'your email address');
    const interests = Array.isArray(values.interests) ? values.interests : [];
    if (!interests.length || interests.some(area => !INTERESTS.includes(area))) errors.interests = 'Choose at least one area of interest.';
    if (text('portfolio')) {
      try {
        const url = new URL(text('portfolio'));
        if (!['https:', 'http:'].includes(url.protocol)) throw new Error();
      } catch { errors.portfolio = 'Enter a full website link starting with https:// or http://.'; }
    }
  } else {
    throw new Error('Unknown contribution type');
  }
  if (text('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text('email'))) errors.email = 'Enter a valid email address.';
  return errors;
}
