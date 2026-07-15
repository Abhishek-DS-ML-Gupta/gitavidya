export interface Chapter {
  chapter_number: number;
  verses_count: number;
  name: string;
  translation: string;
  transliteration: string;
  meaning: { en: string; hi: string };
  summary: { en: string; hi: string };
}

export interface Shloka {
  _id: string;
  chapter: number;
  verse: number;
  slok: string;
  transliteration: string;
  tej?: Commentator;
  siva?: Commentator;
  purohit?: Commentator;
  chinmay?: Commentator;
  san?: Commentator;
  adi?: Commentator;
  gambir?: Commentator;
  madhav?: Commentator;
  anand?: Commentator;
  rams?: Commentator;
  raman?: Commentator;
  abhinav?: Commentator;
  sankar?: Commentator;
  jaya?: Commentator;
  vallabh?: Commentator;
  ms?: Commentator;
  srid?: Commentator;
  dhan?: Commentator;
  venkat?: Commentator;
  puru?: Commentator;
  neel?: Commentator;
  prabhu?: Commentator;
}

export interface Commentator {
  author: string;
  et?: string;
  ec?: string;
  ht?: string;
  hc?: string;
  sc?: string;
}

export type ExplanationStyle =
  | "beginner"
  | "student"
  | "story"
  | "practical"
  | "detailed"
  | "short";

export interface SearchResult {
  type: "chapter" | "shloka";
  data: Chapter | Shloka;
  score: number;
}
