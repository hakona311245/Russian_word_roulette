export type LanguageCode = "vi" | "en" | "ru";

export type Level = "A1" | "A2" | "B1";

export type Topic =
  | "daily-life"
  | "travel"
  | "work"
  | "study"
  | "culture";

export type Sentence = {
  id: string;
  topic: Topic;
  level: Level;
  vi: string;
  en: string;
  ru: string;
};

export type SentenceFilters = {
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  topic: Topic | "all";
  level: Level | "all";
};
