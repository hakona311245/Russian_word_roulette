import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, createTimeline } from "animejs";
import type { LanguageCode, Sentence } from "../types";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import {
  languageDisplayLabels,
  sourceSentenceClassName,
  vietnameseTextClass,
} from "../lib/languageDisplay";
import { HandwrittenSourceSentence } from "./HandwrittenSourceSentence";
import { PaperButton } from "./PaperButton";
import { PaperPanel } from "./PaperPanel";

type SpeakingPracticeCardProps = {
  isLoading: boolean;
  onNext: () => void;
  remainingInPass: number;
  sentence: Sentence | null;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
};

export function SpeakingPracticeCard({
  isLoading,
  onNext,
  remainingInPass,
  sentence,
  sourceLanguage,
  targetLanguage,
}: SpeakingPracticeCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const sourceSentenceRef = useRef<HTMLQuoteElement | null>(null);
  const sourceDividerRef = useRef<HTMLDivElement | null>(null);
  const targetPanelRef = useRef<HTMLDivElement | null>(null);
  const targetSentenceRef = useRef<HTMLParagraphElement | null>(null);
  const hasAnimatedSourceRef = useRef(false);
  const revealTimelineRef = useRef<ReturnType<typeof createTimeline> | null>(
    null,
  );

  useLayoutEffect(() => {
    setIsRevealed(false);
  }, [sentence?.id, sourceLanguage, targetLanguage]);

  useEffect(() => {
    if (!hasAnimatedSourceRef.current) {
      hasAnimatedSourceRef.current = true;
      return;
    }

    if (prefersReducedMotion || !sourceSentenceRef.current) {
      return;
    }

    const sourceAnimation = animate(sourceSentenceRef.current, {
      opacity: [0, 1],
      translateY: [7, 0],
      filter: ["blur(1.5px)", "blur(0px)"],
      duration: 460,
      ease: "outCubic",
    });
    const dividerAnimation = sourceDividerRef.current
      ? animate(sourceDividerRef.current, {
          opacity: [0.35, 1],
          scaleX: [0.96, 1],
          duration: 420,
          ease: "outSine",
        })
      : null;

    return () => {
      sourceAnimation.cancel();
      dividerAnimation?.cancel();
    };
  }, [sentence?.id, sourceLanguage, targetLanguage, prefersReducedMotion]);

  useLayoutEffect(() => {
    revealTimelineRef.current?.cancel();
    revealTimelineRef.current = null;

    const targetPanel = targetPanelRef.current;
    const targetSentenceElement = targetSentenceRef.current;

    if (!targetPanel) {
      return;
    }

    targetPanel.style.opacity = "";
    targetPanel.style.transform = "";

    if (targetSentenceElement) {
      targetSentenceElement.style.opacity = "";
      targetSentenceElement.style.transform = "";
      targetSentenceElement.style.filter = "";
    }

    if (!isRevealed || prefersReducedMotion || !targetSentenceElement) {
      return;
    }

    targetPanel.style.opacity = "0.92";
    targetPanel.style.transform = "translateY(5px)";
    targetSentenceElement.style.opacity = "0";
    targetSentenceElement.style.transform = "translateY(8px)";
    targetSentenceElement.style.filter = "blur(1.5px)";

    const revealTimeline = createTimeline({
      defaults: { ease: "outCubic" },
    })
      .add(
        targetPanel,
        {
          opacity: 1,
          translateY: 0,
          duration: 280,
        },
        0,
      )
      .add(
        targetSentenceElement,
        {
          opacity: 1,
          translateY: 0,
          filter: "blur(0px)",
          duration: 390,
        },
        40,
      );

    revealTimelineRef.current = revealTimeline;

    return () => {
      revealTimeline.cancel();
      if (revealTimelineRef.current === revealTimeline) {
        revealTimelineRef.current = null;
      }
    };
  }, [isRevealed, prefersReducedMotion, sentence?.id, targetLanguage]);

  if (isLoading) {
    return (
      <PaperPanel className="practice-card speaking-practice-card practice-card--empty">
        <p className="status-line">Preparing the deck...</p>
      </PaperPanel>
    );
  }

  if (!sentence) {
    return (
      <PaperPanel className="practice-card speaking-practice-card practice-card--empty">
        <p className="status-line">No sentences match the selected filters.</p>
      </PaperPanel>
    );
  }

  const sourceSentence = sentence[sourceLanguage];
  const targetSentence = sentence[targetLanguage];
  const sourceLabel = `Source (${languageDisplayLabels[sourceLanguage]})`;
  const targetLabel = `Reference (${languageDisplayLabels[targetLanguage]})`;
  const sourceSentenceClass = sourceSentenceClassName(
    sourceLanguage,
    sourceSentence,
    "speaking-source-panel__sentence",
  );
  const targetSentenceClass = vietnameseTextClass(targetLanguage);

  return (
    <PaperPanel className="practice-card speaking-practice-card">
      <div className="speaking-practice-card__stack">
        <section className="speaking-source-panel" aria-label="Source sentence">
          <div className="speaking-source-panel__header">
            <span className="section-label">{sourceLabel}</span>
            <p className="speaking-source-panel__prompt">
              Say the translation out loud, then reveal the reference.
            </p>
          </div>

          <HandwrittenSourceSentence
            className={sourceSentenceClass}
            language={sourceLanguage}
            reducedMotion={prefersReducedMotion}
            ref={sourceSentenceRef}
            sentenceId={sentence.id}
            text={sourceSentence}
          />
          <div
            className="ornamental-divider"
            aria-hidden="true"
            ref={sourceDividerRef}
          />
        </section>

        <div className="speaking-practice-card__actions">
          <p>
            {isRevealed
              ? remainingInPass === 0
                ? "Next reshuffles this deck."
                : `${remainingInPass} remaining after this card.`
              : "Speak first. Reveal when you are ready to compare."}
          </p>
          <div className="speaking-practice-card__action-buttons">
            {isRevealed ? (
              <>
                <PaperButton
                  variant="secondary"
                  onClick={() => setIsRevealed(false)}
                >
                  Again
                </PaperButton>
                <PaperButton onClick={onNext}>Next card</PaperButton>
              </>
            ) : (
              <PaperButton onClick={() => setIsRevealed(true)}>
                Reveal
              </PaperButton>
            )}
          </div>
        </div>

        <section
          aria-label="Reference answer"
          aria-live="polite"
          className={`speaking-target-panel ${
            isRevealed
              ? "speaking-target-panel--revealed"
              : "speaking-target-panel--hidden"
          }`}
        >
          <div className="speaking-target-panel__surface" ref={targetPanelRef}>
            <span className="section-label">{targetLabel}</span>
            {isRevealed ? (
              <p
                className={`speaking-target-panel__sentence ${targetSentenceClass}`}
                ref={targetSentenceRef}
              >
                {targetSentence}
              </p>
            ) : (
              <p className="speaking-target-panel__prompt">
                Reference hidden until reveal.
              </p>
            )}
          </div>
        </section>
      </div>
    </PaperPanel>
  );
}
