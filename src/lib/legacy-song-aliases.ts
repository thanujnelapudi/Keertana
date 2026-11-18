// Explicit spelling variants of existing songs. Never infer song identity from
// a fuzzy match or redirect an unavailable composition to unrelated lyrics.
export const LEGACY_SONG_ALIASES: Record<string, string> = {
  'edhigo-deva-naa-jeevitham': 'idigo-deva-naa-jeevitham',
  'athyunnatha-simhasanamupai': 'athyunnatha-simhaasanamupai',
  'naa-sthuthi-patruda': 'naa-sthuthi-paathrudaa',
  'aaradhana-stuthi-aaradhana': 'aaraadhana-sthuthi-aaraadhana',
  'preminchedan-aadhikamuga': 'preminchedan-adhikamugaa',
};
