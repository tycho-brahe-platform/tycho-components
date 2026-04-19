import SentenceStatus from './SentenceStatus';

export type Split = {
  v?: string;
  t?: string;
  idx: number;
};

export type Chunk = {
  i: number;
  f: number;
  l: number;
  t: string;
  coidx?: number[];
  ep?: boolean;
};

export type Token = {
  p: number;
  l: number;
  v: string;
  t?: string;
  idx?: number;
  ec?: boolean;
  bid?: string;
  mid?: string;
  cid?: string;
  eid?: string;
  split?: Split;
  splits?: Morpheme[];
  coidx?: number[];
  attributes?: Record<string, string>;
  tags?: string[];
  review?: boolean;
  edition?: Edition;
  format?: Format;
};

export type Morpheme = {
  v: string;
  t?: string;
  attributes?: Record<string, string>;
  fn?: boolean;
};

export type Struct = {
  uid: string;
  tokens: Token[];
  chunks: Chunk[];
  corpus: string;
  document: string;
  page: string;
  box?: string;
  status?: SentenceStatus;
  participant?: string;
  parsed?: string;
  psd?: string;
  conllu?: ConlluToken[];
  attributes?: Record<string, string>;
};

export type Edition = {
  id: string;
  o: string;
  ops: { [key: string]: string };
  pos?: number; // for segmented tokens
};

export type Format = {
  id: string;
  italic?: boolean;
  bold?: boolean;
  strikeThrough?: boolean;
  underline?: boolean;
  fontSize?: string;
  fontFamily?: string;
  spacing?: string;
  firstLetterSize?: string;
};

export type ConlluToken = {
  id: string;
  form: string;
  lemma: string;
  upos: string;
  xpos: string;
  feats: string;
  head: string;
  deprel: string;
  deps: string;
  misc: string;
};
