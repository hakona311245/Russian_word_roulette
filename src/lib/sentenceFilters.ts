import type { Sentence, SentenceFilters } from "../types";

export function filterSentences(
  sentences: Sentence[],
  filters: SentenceFilters,
): Sentence[] {
  return sentences.filter((sentence) => {
    const matchesTopic =
      filters.topic === "all" || sentence.topic === filters.topic;
    const matchesLevel =
      filters.level === "all" || sentence.level === filters.level;

    return matchesTopic && matchesLevel;
  });
}

export function uniqueOptions<T extends string>(
  items: Sentence[],
  key: "topic" | "level",
): T[] {
  return Array.from(new Set(items.map((item) => item[key]))) as T[];
}
