// Shared by the homepage and header search; titles only.
export function normalizeTitle(text) {
  return text.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f\u200b-\u200d]/g, '').replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ').trim();
}

export function phonetic(text) {
  return normalizeTitle(text).replace(/ksh/g, 'ks').replace(/sh/g, 's')
    .replace(/ch/g, 'c').replace(/([ptdbgkj])h/g, '$1')
    .replace(/ny|ng/g, 'n').replace(/w/g, 'v')
    .replace(/[aeiou]/g, '').replace(/[^a-z0-9]/g, '').replace(/(.)\1+/g, '$1');
}

export function searchTitles(index, query, limit = 8) {
  const q = normalizeTitle(query);
  if (!q) return [];
  const tokens = q.split(' ');
  const romanQuery = /^[a-z0-9 ]+$/.test(q);
  const scored = index.map(item => {
    const forms = [item.t, ...(item.r || [item.s.replace(/-/g, ' ')])].map(normalizeTitle);
    let score = 0;
    for (const [formIndex, form] of forms.entries()) {
      const before = score;
      if (form === q) score = Math.max(score, 1000);
      else if (form.startsWith(q)) score = Math.max(score, 800);
      else if (form.includes(q)) score = Math.max(score, 700);
      else if (tokens.every(token => form.split(' ').some(word => word.startsWith(token)))) score = Math.max(score, 600);
      // Match each word independently, preserving boundaries so vowels cannot
      // accidentally join unrelated words into a match.
      else if (romanQuery && item.g !== 'english') {
        const words = form.split(' ').map(phonetic).filter(Boolean);
        const keys = tokens.map(phonetic);
        if (keys.every(key => key.length >= 2 && words.includes(key))) score = Math.max(score, 500);
        else if (keys.every(key => key.length >= 2 && words.some(word => word.startsWith(key)))) score = Math.max(score, 400);
      }
      // Prefer the displayed title over extra words in a legacy slug.
      if (formIndex > 1 && score > before) score = Math.max(before, score - 50);
    }
    return { item, score };
  }).filter(match => match.score > 0);
  scored.sort((a, b) => b.score - a.score || a.item.t.length - b.item.t.length || a.item.s.localeCompare(b.item.s));
  return scored.slice(0, limit).map(match => match.item);
}
