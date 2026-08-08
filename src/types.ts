export type Pos = 'zn' | 'ww' | 'bn' | 'bw' | 'vz' | 'vw' | 'tw' | 'tsw' | 'lw';
export type Reg = 'informeel' | 'formeel' | 'vulgair' | 'kooswoord' | 'kindertaal';
export type Sts = 'actief' | 'archaïsch' | 'verouderd';
export type Rel = 'synoniem' | 'antoniem' | 'verwant';

export interface MorphNoun {
  gnd: 'm' | 'v' | 'o';
  pl: string;
  dim: string;
}

export interface MorphVerb {
  conj: Record<string, string>;
  vt: string;
  vd: string;
  sterk: boolean;
}

export interface MorphAdj {
  vgr: string;
  ovt: string;
  verbuig: string;
}

export type Morph = MorphNoun | MorphVerb | MorphAdj;

export interface Def {
  sn: number;
  def: string;
  ex: string;
  src: string;
}

export interface Colloc {
  w: string;
  ex: string;
}

export interface XRef {
  id: string;
  src_id: string;
  tgt_id: string;
  rel: Rel;
  tgt_word?: string;
}

export interface Entry {
  id: string;
  word_lanes: string;
  lemma: string;
  ipa: string;
  broad_ipa: string;
  narrow_ipa: string;
  audio_url: string;
  word_nl: string;
  example_sentence: string;
  pos: Pos | null;
  tone: string;
  morph: Morph | null;
  defs: Def[];
  colloc: Colloc[];
  register: Reg;
  entry_status: Sts;
  etym: string;
  additional_metadata: string;
}

export const POS_L: Record<Pos, string> = {
  zn: 'Zelfst. naamwoord',
  ww: 'Werkwoord',
  bn: 'Bijv. naamwoord',
  bw: 'Bijwoord',
  vz: 'Voorzetsel',
  vw: 'Voegwoord',
  tw: 'Telwoord',
  tsw: 'Tussenwerpsel',
  lw: 'Lidwoord',
};

export const POS_SHORT: Record<Pos, string> = {
  zn: 'zn.',
  ww: 'ww.',
  bn: 'bn.',
  bw: 'bw.',
  vz: 'vz.',
  vw: 'vw.',
  tw: 'tw.',
  tsw: 'tsw.',
  lw: 'lw.',
};

export const REG_L: Record<Reg, string> = {
  informeel: 'Informeel',
  formeel: 'Formeel',
  vulgair: 'Vulgair',
  kooswoord: 'Kooswoord',
  kindertaal: 'Kindertaal',
};

export const STS_L: Record<Sts, string> = {
  actief: 'Actief',
  'archaïsch': 'Archaïsch',
  verouderd: 'Verouderd',
};

export const REL_L: Record<Rel, string> = {
  synoniem: 'Synoniem',
  antoniem: 'Antoniem',
  verwant: 'Verwant',
};

export function parseJ<T>(v: string | null | undefined, fb: T): T {
  if (!v) return fb;
  try { return JSON.parse(v) as T; }
  catch { return fb; }
}

export function parseEntry(raw: Record<string, unknown>): Entry {
  return {
    id: (raw.id as string) || '',
    word_lanes: (raw.word_lanes as string) || '',
    lemma: (raw.lemma as string) || '',
    ipa: (raw.ipa as string) || '',
    broad_ipa: (raw.broad_ipa as string) || '',
    narrow_ipa: (raw.narrow_ipa as string) || '',
    audio_url: (raw.audio_url as string) || '',
    word_nl: (raw.word_nl as string) || '',
    example_sentence: (raw.example_sentence as string) || '',
    pos: (raw.pos as Pos) || null,
    tone: (raw.tone as string) || '',
    morph: parseJ<Morph | null>(raw.morph as string, null),
    defs: parseJ<Def[]>(raw.defs as string, []),
    colloc: parseJ<Colloc[]>(raw.colloc as string, []),
    register: (raw.register as Reg) || 'informeel',
    entry_status: (raw.entry_status as Sts) || 'actief',
    etym: (raw.etym as string) || '',
    additional_metadata: (raw.additional_metadata as string) || '',
  };
}
