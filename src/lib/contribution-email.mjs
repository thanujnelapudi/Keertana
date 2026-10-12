export const CONTACT_EMAIL = 'keertanasongs@gmail.com';
const fields = {
  submit: { title: 'Song title', language: 'Language', lyrics: 'Lyrics', transliteration: 'Roman title', alternateTitle: 'Alternate title', author: 'Author / Composer', source: 'Source / Reference', category: 'Category', notes: 'Notes', name: 'Contributor name', email: 'Contributor email', acknowledgement: 'Acknowledgement' },
  report: { songTitle: 'Song title', song: 'Song identifier', language: 'Language', issue: 'Issue type', description: 'Description', correction: 'Suggested correction', name: 'Contributor name', email: 'Contributor email' },
  join: { name: 'Name', email: 'Email', interests: 'Interests', skills: 'Skills / Experience', motivation: 'Motivation', portfolio: 'Portfolio / Website' },
};
export function prepareContributionEmail(kind, values, origin) {
  if (!fields[kind]) throw new Error('Unknown contribution type');
  const heading = { submit: 'Song contribution', report: 'Song correction / content report', join: 'Join the team' }[kind];
  const subject = `Keertana — ${heading}`;
  const parts = [heading];
  for (const [key, label] of Object.entries(fields[kind])) {
    const value = Array.isArray(values[key]) ? values[key].join(', ') : typeof values[key] === 'string' ? values[key].trim() : '';
    if (value) parts.push(`${label}:\n${value}`);
  }
  if (kind === 'report' && /^[a-z0-9][a-z0-9-]*$/.test(values.song || '')) {
    const site = new URL(origin);
    if (!['http:', 'https:'].includes(site.protocol)) throw new Error('Invalid site address');
    parts.push(`Song link:\n${site.origin}/song/${values.song}/`);
  }
  const body = parts.join('\n\n');
  const base = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
  const full = `${base}&body=${encodeURIComponent(body)}`;
  // Email applications differ in the size of URI they accept. Preserve the full
  // draft for copying instead of truncating long lyrics or risking a failed link.
  const requiresCopy = full.length > 1800;
  return { subject, body, href: requiresCopy ? base : full, requiresCopy };
}
