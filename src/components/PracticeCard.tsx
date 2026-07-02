import { useEffect, useState } from "react";
import type { LanguageCode, Sentence } from "../types";
import { PaperButton } from "./PaperButton";
import { PaperPanel } from "./PaperPanel";

const languageShortLabels: Record<LanguageCode, string> = {
  vi: "VI",
  en: "EN",
  ru: "RU",
};

function vietnameseTextClass(language: LanguageCode) {
  return language === "vi" ? "lang-vi" : "";
}

type PracticeCardProps = {
  deckSize: number;
  isLoading: boolean;
  onNext: () => void;
  remainingInPass: number;
  sentence: Sentence | null;
  shownCount: number;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
};

export function PracticeCard({
  deckSize,
  isLoading,
  onNext,
  remainingInPass,
  sentence,
  shownCount,
  sourceLanguage,
  targetLanguage,
}: PracticeCardProps) {
  const [answer, setAnswer] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    setAnswer("");
    setIsRevealed(false);
  }, [sentence?.id, sourceLanguage, targetLanguage]);

  function handleNext() {
    onNext();
  }

  if (isLoading) {
    return (
      <PaperPanel className="practice-card practice-card--empty">
        <p className="status-line">Preparing the deck...</p>
      </PaperPanel>
    );
  }

  if (!sentence) {
    return (
      <PaperPanel className="practice-card practice-card--empty">
        <p className="status-line">No sentences match the selected filters.</p>
      </PaperPanel>
    );
  }

  const sourceSentence = sentence[sourceLanguage];
  const targetSentence = sentence[targetLanguage];
  const progressLabel = `${Math.min(shownCount, deckSize)} / ${deckSize}`;
  const sourceSentenceClass = [
    "source-sentence",
    sourceSentence.length > 70 ? "source-sentence--long" : "",
    vietnameseTextClass(sourceLanguage),
  ]
    .filter(Boolean)
    .join(" ");
  const targetSentenceClass = vietnameseTextClass(targetLanguage);
  const answerClass = targetLanguage === "vi" ? "answer-field__textarea--vi" : "";

  return (
    <PaperPanel className="practice-card">
      <div className="practice-card__meta">
        <span>{languageShortLabels[sourceLanguage]}</span>
        <span>{sentence.topic.replace("-", " ")}</span>
        <span>{sentence.level}</span>
        <span>{progressLabel}</span>
      </div>

      <blockquote className={sourceSentenceClass}>{sourceSentence}</blockquote>

      <label className="answer-field">
        <span>Your translation</span>
        <textarea
          className={answerClass}
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Write your answer before revealing the reference translation."
        />
      </label>

      {isRevealed ? (
        <div className="reveal-panel" aria-live="polite">
          <span>{languageShortLabels[targetLanguage]} reference</span>
          <p className={targetSentenceClass}>{targetSentence}</p>
        </div>
      ) : null}

      <div className="practice-card__actions">
        <p>
          {remainingInPass === 0
            ? "Next reshuffles the filtered deck."
            : `${remainingInPass} left before reshuffle.`}
        </p>
        <div>
          <PaperButton
            variant="secondary"
            onClick={() => setIsRevealed((current) => !current)}
          >
            {isRevealed ? "Hide" : "Reveal"}
          </PaperButton>
          <PaperButton onClick={handleNext}>Next</PaperButton>
        </div>
      </div>
    </PaperPanel>
  );
}
