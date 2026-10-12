import { songs, detectSongLanguage } from '../../../lib/songs';
export function getStaticPaths() {
  return songs.map(song => ({ params: { slug: song.slug }, props: { song } }));
}
export function GET({ props }) {
  const { langCode, lyricsLang } = detectSongLanguage(props.song);
  return new Response(JSON.stringify({ ...props.song, langCode, lyricsLang }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
