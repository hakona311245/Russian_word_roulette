import { useRef } from "react";
import { animate } from "animejs";
import type {
  LanguageCode,
  Level,
  SentenceFilters,
  Topic,
} from "../types";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const controlRefs = useRef<
    Record<keyof SentenceFilters, HTMLLabelElement | null>
  >({
    level: null,
    sourceLanguage: null,
    targetLanguage: null,
    topic: null,
  });

  function animateChangedControl(key: keyof SentenceFilters) {
    const control = controlRefs.current[key];

    if (prefersReducedMotion || !control) {
      return;
    }

    animate(control, {
      opacity: [0.72, 1],
      translateY: [3, 0],
      duration: 430,
      ease: "outSine",
    });
  }

  function updateFilter<Key extends keyof SentenceFilters>(
    key: Key,
    value: SentenceFilters[Key],
  ) {
    onChange({ ...filters, [key]: value });
    animateChangedControl(key);
  }

  return (
    <PaperPanel className="filter-bar" aria-label="Practice filters">
      <label
        className="filter-bar__control"
        ref={(node) => {
          controlRefs.current.sourceLanguage = node;
        }}
      >
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

      <label
        className="filter-bar__control"
        ref={(node) => {
          controlRefs.current.targetLanguage = node;
        }}
      >
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

      <label
        className="filter-bar__control"
        ref={(node) => {
          controlRefs.current.topic = node;
        }}
      >
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

      <label
        className="filter-bar__control"
        ref={(node) => {
          controlRefs.current.level = node;
        }}
      >
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
