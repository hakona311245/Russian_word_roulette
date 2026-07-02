import { useEffect, useState } from "react";
import type { LanguageCode, Sentence } from "../types";
import { PaperButton } from "./PaperButton";
import { PaperPanel } from "./PaperPanel";

const languageDisplayLabels: Record<LanguageCode, string> = {
  vi: "Vietnamese",
  en: "English",
  ru: "Russian",
};

function vietnameseTextClass(language: LanguageCode) {
  return language === "vi" ? "lang-vi" : "";
}

type PracticeCardProps = {
  isLoading: boolean;
  onNext: () => void;
  remainingInPass: number;
  sentence: Sentence | null;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
};

type TargetTicketCardProps = {
  isRevealed: boolean;
  targetLabel: string;
  targetSentence: string;
  targetSentenceClass: string;
};

function TargetTicketCard({
  isRevealed,
  targetLabel,
  targetSentence,
  targetSentenceClass,
}: TargetTicketCardProps) {
  const ticketStateClass = isRevealed
    ? "target-ticket--revealed"
    : "target-ticket--hidden";

  return (
    <aside className={`target-ticket ${ticketStateClass}`} aria-live="polite">
      <div className="target-ticket__surface">
        <span className="section-label">{targetLabel}</span>
        {isRevealed ? (
          <p className={`target-sentence ${targetSentenceClass}`}>
            {targetSentence}
          </p>
        ) : (
          <p className="target-sentence target-sentence--hidden">
            Write your attempt first, then reveal the reference.
          </p>
        )}
        <div className="ornamental-divider ornamental-divider--target" aria-hidden="true" />

        <p className="study-note">
          Take your time. Look up words. Study the structure. Real learning
          happens in the struggle.
        </p>
      </div>
    </aside>
  );
}

export function PracticeCard({
  isLoading,
  onNext,
  remainingInPass,
  sentence,
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
  const sourceLabel = `Source (${languageDisplayLabels[sourceLanguage]})`;
  const targetLabel = `Target (${languageDisplayLabels[targetLanguage]})`;
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
      <div className="practice-card__grid">
        <section className="source-column" aria-label="Source sentence">
          <span className="section-label">{sourceLabel}</span>
          <blockquote className={sourceSentenceClass}>{sourceSentence}</blockquote>
          <div className="ornamental-divider" aria-hidden="true" />

          <label className="answer-field">
            <span>Your translation</span>
            <textarea
              className={answerClass}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Type your translation here..."
            />
          </label>

          <div className="practice-card__actions">
            <p>
              {isRevealed
                ? remainingInPass === 0
                  ? "Next reshuffles this deck."
                  : `${remainingInPass} remaining after this card.`
                : "Type your translation, then reveal the reference."}
            </p>
            <div className="practice-card__action-buttons">
              {isRevealed ? (
                <>
                  <PaperButton
                    variant="secondary"
                    onClick={() => setIsRevealed(false)}
                  >
                    Hide
                  </PaperButton>
                  <PaperButton onClick={handleNext}>Next -&gt;</PaperButton>
                </>
              ) : (
                <PaperButton onClick={() => setIsRevealed(true)}>
                  Reveal
                </PaperButton>
              )}
            </div>
          </div>
        </section>

        <TargetTicketCard
          isRevealed={isRevealed}
          targetLabel={targetLabel}
          targetSentence={targetSentence}
          targetSentenceClass={targetSentenceClass}
        />
      </div>
    </PaperPanel>
  );
}
