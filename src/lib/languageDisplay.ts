import type { LanguageCode } from "../types";

export const languageDisplayLabels: Record<LanguageCode, string> = {
  vi: "Vietnamese",
  en: "English",
  ru: "Russian",
};

export function vietnameseTextClass(language: LanguageCode) {
  return language === "vi" ? "lang-vi" : "";
}

export function sourceSentenceClassName(
  language: LanguageCode,
  sentence: string,
  extraClassName = "",
) {
  return [
    "source-sentence",
    extraClassName,
    sentence.length > 70 ? "source-sentence--long" : "",
    vietnameseTextClass(language),
  ]
    .filter(Boolean)
    .join(" ");
}
