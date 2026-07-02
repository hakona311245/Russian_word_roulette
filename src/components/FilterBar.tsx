import type {
  LanguageCode,
  Level,
  SentenceFilters,
  Topic,
} from "../types";
import { PaperPanel } from "./PaperPanel";

const languageLabels: Record<LanguageCode, string> = {
  vi: "Vietnamese",
  en: "English",
  ru: "Russian",
};

const topicLabels: Record<Topic, string> = {
  "daily-life": "Daily life",
  travel: "Travel",
  work: "Work",
  study: "Study",
  culture: "Culture",
};

const languages = Object.keys(languageLabels) as LanguageCode[];

type FilterBarProps = {
  filters: SentenceFilters;
  levels: Level[];
  onChange: (filters: SentenceFilters) => void;
  topics: Topic[];
};

export function FilterBar({
  filters,
  levels,
  onChange,
  topics,
}: FilterBarProps) {
  function updateFilter<Key extends keyof SentenceFilters>(
    key: Key,
    value: SentenceFilters[Key],
  ) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <PaperPanel className="filter-bar" aria-label="Practice filters">
      <label className="filter-bar__control">
        <span>Source</span>
        <select
          value={filters.sourceLanguage}
          onChange={(event) =>
            updateFilter("sourceLanguage", event.target.value as LanguageCode)
          }
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              {languageLabels[language]}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-bar__control">
        <span>Target</span>
        <select
          value={filters.targetLanguage}
          onChange={(event) =>
            updateFilter("targetLanguage", event.target.value as LanguageCode)
          }
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              {languageLabels[language]}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-bar__control">
        <span>Topic</span>
        <select
          value={filters.topic}
          onChange={(event) =>
            updateFilter("topic", event.target.value as Topic | "all")
          }
        >
          <option value="all">All topics</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topicLabels[topic]}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-bar__control">
        <span>Level</span>
        <select
          value={filters.level}
          onChange={(event) =>
            updateFilter("level", event.target.value as Level | "all")
          }
        >
          <option value="all">All levels</option>
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </label>
    </PaperPanel>
  );
}
