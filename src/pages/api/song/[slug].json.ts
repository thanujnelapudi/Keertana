import { songs, detectSongLanguage } from '../../../lib/songs';
import { getRomanReading } from '../../../lib/roman-reading';
export function getStaticPaths() {
  return songs.map(song => ({ params: { slug: song.slug }, props: { song } }));
}
export function GET({ props }) {
  const { langCode, lyricsLang } = detectSongLanguage(props.song);
  return new Response(JSON.stringify({ ...props.song, langCode, lyricsLang, romanReading: getRomanReading(props.song.lyrics) }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
